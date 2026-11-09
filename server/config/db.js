const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/lumos_db', {
      serverSelectionTimeoutMS: 5000,
    });

    console.log(`\n======================================================`);
    console.log(`.  MongoDB Connected Successfully!`);
    console.log(`   Host: ${conn.connection.host}`);
    console.log(`   Port: ${conn.connection.port || 27017}`);
    console.log(`   Database: ${conn.connection.name}`);
    console.log(`   Compass URI: ${process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/lumos_db'}`);
    console.log(`======================================================\n`);
    return conn;
  } catch (error) {
    console.error(`\n======================================================`);
    console.error(`.  MongoDB Connection Error: ${error.message}`);
    console.error(`.  Tips to resolve:`);
    console.error(`   1. Ensure local MongoDB service is running:`);
    console.error(`      brew services start mongodb-community`);
    console.error(`   2. If using MongoDB Atlas, check your MONGODB_URI in server/.env`);
    console.error(`   3. Verify MongoDB Compass can connect to: ${process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/lumos_db'}`);
    console.error(`======================================================\n`);
    return null;
  }
};

module.exports = connectDB;

