const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');

// Define schema before mocking
const tutorialSchema = mongoose.Schema(
  {
    title: String,
    description: String,
    published: Boolean
  },
  { timestamps: true }
);

tutorialSchema.method("toJSON", function() {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

// Mock the models/index.js before requiring setup
jest.mock('../app/models', () => {
  const mongoose = require('mongoose');
  
  // Return a getter that will access the model after setup
  return {
    get tutorials() {
      try {
        return mongoose.model('tutorial');
      } catch (e) {
        return null;
      }
    },
    mongoose: mongoose
  };
});

require('./setup');

// Create the Tutorial model after setup
let Tutorial;
try {
  Tutorial = mongoose.model('tutorial');
} catch (e) {
  Tutorial = mongoose.model("tutorial", tutorialSchema);
}

const app = express();

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Setup routes
require('../app/routes/turorial.routes')(app);

describe('Tutorial API Tests', () => {
  
  describe('POST /api/tutorials', () => {
    it('should create a new tutorial', async () => {
      const tutorialData = {
        title: 'Test Tutorial',
        description: 'This is a test tutorial',
        published: false
      };

      const response = await request(app)
        .post('/api/tutorials')
        .send(tutorialData)
        .expect(200);

      expect(response.body.title).toBe(tutorialData.title);
      expect(response.body.description).toBe(tutorialData.description);
      expect(response.body.published).toBe(false);
      expect(response.body.id).toBeDefined();
    });

    it('should return 400 if title is missing', async () => {
      const tutorialData = {
        description: 'Tutorial without title'
      };

      const response = await request(app)
        .post('/api/tutorials')
        .send(tutorialData)
        .expect(400);

      expect(response.body.message).toBe('Content can not be empty!');
    });

    it('should set published to false by default', async () => {
      const tutorialData = {
        title: 'Tutorial without published field',
        description: 'Test description'
      };

      const response = await request(app)
        .post('/api/tutorials')
        .send(tutorialData)
        .expect(200);

      expect(response.body.published).toBe(false);
    });
  });

  describe('GET /api/tutorials', () => {
    beforeEach(async () => {
      // Create some test tutorials
      await Tutorial.create([
        { title: 'Tutorial 1', description: 'Description 1', published: true },
        { title: 'Tutorial 2', description: 'Description 2', published: false },
        { title: 'Angular Tutorial', description: 'Learn Angular', published: true }
      ]);
    });

    it('should retrieve all tutorials', async () => {
      const response = await request(app)
        .get('/api/tutorials')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(3);
    });

    it('should filter tutorials by title', async () => {
      const response = await request(app)
        .get('/api/tutorials?title=Angular')
        .expect(200);

      expect(response.body.length).toBe(1);
      expect(response.body[0].title).toBe('Angular Tutorial');
    });

    it('should return empty array when no tutorials exist', async () => {
      // Clear all tutorials
      await Tutorial.deleteMany({});

      const response = await request(app)
        .get('/api/tutorials')
        .expect(200);

      expect(response.body).toEqual([]);
    });
  });

  describe('GET /api/tutorials/published', () => {
    beforeEach(async () => {
      await Tutorial.create([
        { title: 'Published Tutorial 1', description: 'Description 1', published: true },
        { title: 'Unpublished Tutorial', description: 'Description 2', published: false },
        { title: 'Published Tutorial 2', description: 'Description 3', published: true }
      ]);
    });

    it('should retrieve only published tutorials', async () => {
      const response = await request(app)
        .get('/api/tutorials/published')
        .expect(200);

      expect(response.body.length).toBe(2);
      response.body.forEach(tutorial => {
        expect(tutorial.published).toBe(true);
      });
    });

    it('should return empty array when no published tutorials exist', async () => {
      await Tutorial.deleteMany({});
      await Tutorial.create([
        { title: 'Unpublished', description: 'Test', published: false }
      ]);

      const response = await request(app)
        .get('/api/tutorials/published')
        .expect(200);

      expect(response.body).toEqual([]);
    });
  });

  describe('GET /api/tutorials/:id', () => {
    let tutorialId;

    beforeEach(async () => {
      const tutorial = await Tutorial.create({
        title: 'Single Tutorial',
        description: 'Test Description',
        published: true
      });
      tutorialId = tutorial._id.toString();
    });

    it('should retrieve a single tutorial by id', async () => {
      const response = await request(app)
        .get(`/api/tutorials/${tutorialId}`)
        .expect(200);

      expect(response.body.id).toBe(tutorialId);
      expect(response.body.title).toBe('Single Tutorial');
    });

    it('should return 404 for non-existent tutorial', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      
      const response = await request(app)
        .get(`/api/tutorials/${fakeId}`)
        .expect(404);

      expect(response.body.message).toContain('Not found Tutorial with id');
    });

    it('should return 500 for invalid id format', async () => {
      const response = await request(app)
        .get('/api/tutorials/invalid-id')
        .expect(500);

      expect(response.body.message).toContain('Error retrieving Tutorial');
    });
  });

  describe('PUT /api/tutorials/:id', () => {
    let tutorialId;

    beforeEach(async () => {
      const tutorial = await Tutorial.create({
        title: 'Original Title',
        description: 'Original Description',
        published: false
      });
      tutorialId = tutorial._id.toString();
    });

    it('should update a tutorial', async () => {
      const updateData = {
        title: 'Updated Title',
        description: 'Updated Description',
        published: true
      };

      const response = await request(app)
        .put(`/api/tutorials/${tutorialId}`)
        .send(updateData)
        .expect(200);

      expect(response.body.message).toBe('Tutorial was updated successfully.');

      // Verify the update
      const updatedTutorial = await Tutorial.findById(tutorialId);
      expect(updatedTutorial.title).toBe(updateData.title);
      expect(updatedTutorial.description).toBe(updateData.description);
      expect(updatedTutorial.published).toBe(true);
    });

    it('should return 404 for non-existent tutorial', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      
      const response = await request(app)
        .put(`/api/tutorials/${fakeId}`)
        .send({ title: 'Updated' })
        .expect(404);

      expect(response.body.message).toContain('Cannot update Tutorial');
    });

    it('should handle update with empty object', async () => {
      // Note: The API checks for !req.body, but an empty object {} is truthy
      // so it passes validation. This test reflects actual API behavior.
      const response = await request(app)
        .put(`/api/tutorials/${tutorialId}`)
        .send({})
        .expect(200);

      expect(response.body.message).toBe('Tutorial was updated successfully.');
    });
  });

  describe('DELETE /api/tutorials/:id', () => {
    let tutorialId;

    beforeEach(async () => {
      const tutorial = await Tutorial.create({
        title: 'Tutorial to Delete',
        description: 'Will be deleted',
        published: false
      });
      tutorialId = tutorial._id.toString();
    });

    it('should delete a tutorial', async () => {
      const response = await request(app)
        .delete(`/api/tutorials/${tutorialId}`)
        .expect(200);

      expect(response.body.message).toBe('Tutorial was deleted successfully!');

      // Verify deletion
      const deletedTutorial = await Tutorial.findById(tutorialId);
      expect(deletedTutorial).toBeNull();
    });

    it('should return 404 for non-existent tutorial', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      
      const response = await request(app)
        .delete(`/api/tutorials/${fakeId}`)
        .expect(404);

      expect(response.body.message).toContain('Cannot delete Tutorial');
    });

    it('should return 500 for invalid id format', async () => {
      const response = await request(app)
        .delete('/api/tutorials/invalid-id')
        .expect(500);

      expect(response.body.message).toContain('Could not delete Tutorial');
    });
  });

  describe('DELETE /api/tutorials', () => {
    beforeEach(async () => {
      await Tutorial.create([
        { title: 'Tutorial 1', description: 'Desc 1', published: true },
        { title: 'Tutorial 2', description: 'Desc 2', published: false },
        { title: 'Tutorial 3', description: 'Desc 3', published: true }
      ]);
    });

    it('should delete all tutorials', async () => {
      const response = await request(app)
        .delete('/api/tutorials')
        .expect(200);

      expect(response.body.message).toBe('3 Tutorials were deleted successfully!');

      // Verify all are deleted
      const count = await Tutorial.countDocuments();
      expect(count).toBe(0);
    });

    it('should return 0 deleted when no tutorials exist', async () => {
      await Tutorial.deleteMany({});

      const response = await request(app)
        .delete('/api/tutorials')
        .expect(200);

      expect(response.body.message).toBe('0 Tutorials were deleted successfully!');
    });
  });
});
