const database = require("../utils/database");
const renameKey = require("../utils/helperFunctions/rename");
const { encrypt, decrypt } = require('../utils/encrypt_decrypt');

async function getData(req, res) {
  const { collectionName } = req.params;

  try {
    const items = await database.findAll(collectionName);

    if (collectionName === 'user') {
      items.forEach((obj) => {
        renameKey.renameKey(obj, "_id", "id");
        if (obj.password && obj.password.length > 20) { 
          try {
            obj.password = decrypt(obj.password);
          } catch (err) {
            console.error(`Failed to decrypt password for user ${obj.id}: ${err}`);
          }
        }
      });
    } else {
      items.forEach((obj) => {
        renameKey.renameKey(obj, "_id", "id");
      });
    }

    res.send(items);
  } catch (error) {
    console.error(`Could not get data for ${collectionName}: ${error}`);
    res.status(500).send(error);
  }
}

async function getDataById(req, res) {
  const { collectionName, id } = req.params;
  const user = req.user;

  try {
    const item = await database.findById(collectionName, id);
    if (!item) {
      return res.status(404).send({ message: "Document not found" });
    }
    renameKey.renameKey(item, "_id", "id");

    if (collectionName === 'user' && item.password) {
      try {
        if (user.role === 'admin') {
          item.password = decrypt(item.password); 
        }
      } catch (err) {
        console.error(`Failed to decrypt password for user ${item.id}: ${err}`);
      }
    }
    res.send(item);
  } catch (error) {
    console.error(`Could not get document with ID ${id} from ${collectionName}: ${error}`);
    res.status(500).send(error);
  }
}

async function addData(req, res) {
  const { collectionName } = req.params;

  let document = req.body;
  renameKey.renameKey(document, "id", "_id");

  if (collectionName === 'user' && document.password) {
    document.password = encrypt(document.password);
  }

  try {
    const result = await database.insertOne(collectionName, document);
    const insertedDocument = { ...document, _id: result.insertedId };
    res.status(201).send(insertedDocument);
  } catch (error) {
    console.error(`Could not insert document into ${collectionName}: ${error}`);
    res.status(500).send(error);
  }
}

async function updateData(req, res) {
  const { collectionName } = req.params;

  const documentId = req.body.id;
  if (isNaN(documentId)) {
    console.error("Invalid ID format");
    return res.status(400).send("Invalid ID format");
  }

  const updatedDocument = { ...req.body };
  delete updatedDocument.id;

  if (collectionName === 'user' && updatedDocument.password) {
    updatedDocument.password = encrypt(updatedDocument.password);
  }

  try {
    const result = await database.updateOne(collectionName, documentId, updatedDocument);

    if (result.matchedCount === 0) {
      return res.status(404).send({ message: "Document not found" });
    }

    const updatedDoc = { ...updatedDocument, _id: documentId };
    res.status(200).send(updatedDoc);
  } catch (error) {
    console.error(`Could not update document in ${collectionName}: ${error}`);
    res.status500.send(error);
  }
}

module.exports = {
  getData,
  getDataById,
  addData,
  updateData,
};
