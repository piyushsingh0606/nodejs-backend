# Node.js Express & MongoDB: CRUD REST API with Testing

A complete Node.js REST API with Express and MongoDB, featuring comprehensive test coverage using Jest and MongoDB Memory Server.

## Features

- ✅ RESTful API with Express.js
- ✅ MongoDB database with Mongoose ODM
- ✅ CRUD operations for Tutorial resources
- ✅ Comprehensive test suite (19 tests, 78% coverage)
- ✅ In-memory database testing
- ✅ Request validation
- ✅ Error handling
- ✅ CORS enabled

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/tutorials` | Create a new tutorial |
| GET | `/api/tutorials` | Get all tutorials (with optional title filter) |
| GET | `/api/tutorials/published` | Get all published tutorials |
| GET | `/api/tutorials/:id` | Get tutorial by ID |
| PUT | `/api/tutorials/:id` | Update tutorial by ID |
| DELETE | `/api/tutorials/:id` | Delete tutorial by ID |
| DELETE | `/api/tutorials` | Delete all tutorials |

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

## Installation

1. Clone the repository
```bash
git clone <repository-url>
cd node-express-mongodb-master
```

2. Install dependencies
```bash
npm install
```

3. Configure MongoDB connection
Edit `app/config/db.config.js` to set your MongoDB connection URL:
```javascript
module.exports = {
  url: "mongodb://localhost:27017/bezkoder_db"
};
```

## Running the Application

Start the server:
```bash
node server.js
```

The server will run on `http://localhost:8080`

## Testing

This project includes a comprehensive test suite with 19 test cases.

### Run Tests
```bash
npm test
```

### Test Coverage
```bash
npm test -- --coverage
```

### Test Statistics
- **19 test cases** covering all API endpoints
- **87.23%** controller coverage
- **100%** route coverage
- **78.78%** overall coverage
- **Tests complete in < 3 seconds**

### Test Features
- ✅ **No external database required** - Uses MongoDB Memory Server
- ✅ **Isolated tests** - Each test runs independently with automatic cleanup
- ✅ **Comprehensive coverage** - Success cases, error cases, and edge cases
- ✅ **Fast execution** - In-memory database ensures quick test runs

### Test Endpoints Covered

#### POST /api/tutorials
- ✓ Create new tutorial with valid data
- ✓ Validation error when title is missing
- ✓ Default value for published field

#### GET /api/tutorials
- ✓ Retrieve all tutorials
- ✓ Filter tutorials by title query parameter
- ✓ Return empty array when no tutorials exist

#### GET /api/tutorials/published
- ✓ Retrieve only published tutorials
- ✓ Handle case when no published tutorials exist

#### GET /api/tutorials/:id
- ✓ Retrieve single tutorial by valid ID
- ✓ Return 404 for non-existent tutorial
- ✓ Return 500 for invalid ID format

#### PUT /api/tutorials/:id
- ✓ Update tutorial with valid data
- ✓ Return 404 when tutorial not found
- ✓ Handle update with empty object

#### DELETE /api/tutorials/:id
- ✓ Delete tutorial successfully
- ✓ Return 404 when tutorial not found
- ✓ Return 500 for invalid ID format

#### DELETE /api/tutorials
- ✓ Delete all tutorials
- ✓ Handle deletion when no tutorials exist

## Project Structure

```
node-express-mongodb-master/
├── app/
│   ├── config/
│   │   └── db.config.js          # Database configuration
│   ├── controllers/
│   │   └── tutorial.controller.js # Business logic
│   ├── models/
│   │   ├── index.js              # Database connection
│   │   └── tutorial.model.js     # Mongoose schema
│   └── routes/
│       └── turorial.routes.js    # API routes
├── test/
│   ├── setup.js                  # Test configuration
│   └── tutorial.test.js          # Test suite
├── jest.config.js                # Jest configuration
├── server.js                     # Application entry point
├── package.json                  # Dependencies
└── README.md                     # Documentation
```

## Dependencies

### Production
- `express` - Web framework
- `mongoose` - MongoDB ODM
- `cors` - Cross-origin resource sharing

### Development
- `jest` - Testing framework
- `supertest` - HTTP testing
- `mongodb-memory-server` - In-memory MongoDB for testing

## API Usage Examples

### Create a Tutorial
```bash
curl -X POST http://localhost:8080/api/tutorials \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Node.js Tutorial",
    "description": "Learn Node.js basics",
    "published": true
  }'
```

### Get All Tutorials
```bash
curl http://localhost:8080/api/tutorials
```

### Get Tutorial by ID
```bash
curl http://localhost:8080/api/tutorials/{id}
```

### Update a Tutorial
```bash
curl -X PUT http://localhost:8080/api/tutorials/{id} \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Title",
    "description": "Updated description",
    "published": true
  }'
```

### Delete a Tutorial
```bash
curl -X DELETE http://localhost:8080/api/tutorials/{id}
```

## Tutorial Model

```javascript
{
  title: String,        // Required
  description: String,
  published: Boolean,   // Default: false
  createdAt: Date,      // Auto-generated
  updatedAt: Date       // Auto-generated
}
```

## Environment Variables

You can configure the following environment variables:

- `PORT` - Server port (default: 8080)
- `MONGODB_URL` - MongoDB connection string

## Error Handling

The API returns appropriate HTTP status codes:

- `200` - Success
- `400` - Bad Request (validation error)
- `404` - Not Found
- `500` - Internal Server Error