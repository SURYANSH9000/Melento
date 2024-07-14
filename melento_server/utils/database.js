const mongodbConnection = require("./helperFunctions/mongodbConnection");

async function findAll(collectionName) {
  try {
    const coll = await mongodbConnection(collectionName);
    const items = await coll.find().toArray();
    return items;
  } catch (error) {
    console.error(`Error finding ${collectionName}:`, error);
    throw error;
  }
}

async function findById(collectionName, id) {
  try {
    const coll = await mongodbConnection(collectionName);
    const item = await coll.findOne({ _id: id });
    return item;
  } catch (error) {
    console.error(`Error finding document by ID in ${collectionName}:`, error);
    throw error;
  }
}

async function findByEmail(collectionName, email) {
  try {
    const coll = await mongodbConnection(collectionName);
    const item = await coll.findOne({ email });
    return item;
  } catch (error) {
    console.error(`Error finding document by email in ${collectionName}:`, error);
    throw error;
  }
}

async function insertOne(collectionName, document) {
  try {
    const coll = await mongodbConnection(collectionName);
    const result = await coll.insertOne(document);
    return result;
  } catch (error) {
    console.error(`Error inserting into ${collectionName}:`, error);
    throw error;
  }
}

async function updateOne(collectionName, documentId, updatedDocument) {
  try {
    const coll = await mongodbConnection(collectionName);
    const result = await coll.updateOne(
      { _id: documentId },
      { $set: updatedDocument }
    );
    return result;
  } catch (error) {
    console.error(`Error updating ${collectionName}:`, error);
    throw error;
  }
}

module.exports = {
  findAll,
  findById,
  findByEmail,
  insertOne,
  updateOne,
};
