// import mongoose from 'mongoose';

// import { MongoMemoryServer } from "mongodb-memory-server";

// async function connect(){

//     //Creating the MongoDB instance
//     const mongod = await MongoMemoryServer.create();
//     const getURI = mongod.getUri();

//     mongoose.set('strictQuery', true);

//     const db = await mongoose.connect(getURI);
//     console.log("Database is connected");
//     return db;

// }

// export default connect;

import mongodb from "mongodb";

const { MongoClient } = mongodb;

async function connect() {
  const uri = "mongodb://127.0.0.1:27017/fake_so";
  const client = new MongoClient(uri, { useUnifiedTopology: true });

  try {
    await client.connect();
    console.log("Database is connected");
    return client.db();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

export default connect;
