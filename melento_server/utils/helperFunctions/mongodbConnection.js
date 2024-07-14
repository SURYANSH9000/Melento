const { MongoClient } = require("mongodb");

const uri = "mongodb+srv://melento:Melento%40123@assessment.5rrj2ab.mongodb.net/?retryWrites=true&w=majority&appName=assessment";

let client;

async function mongodbConnection(collectionName) {
  if (!client) {
    client = new MongoClient(uri);
    await client.connect();
    console.log("Connected to MongoDB");
  }
  
  const db = client.db("assessment");
  console.log("Connected to assessment database");
  const collection = db.collection(collectionName);
  console.log("Connected to collection: " + collectionName);
  return collection;
}

module.exports = mongodbConnection;
