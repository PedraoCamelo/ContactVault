process.env.JWT_SECRET = 'test-secret';
process.env.API_KEY = 'test-api-key';
process.env.LOGGER = 'OFF';

const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongod;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri());
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const name in collections) {
    await collections[name].deleteMany();
  }
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});
