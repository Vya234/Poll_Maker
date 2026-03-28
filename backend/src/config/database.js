const mongoose = require('mongoose');

async function connectDatabase() {
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is not defined');
  }
  await mongoose.connect(process.env.MONGO_URI);
}

module.exports = { connectDatabase };
