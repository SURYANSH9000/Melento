const express = require("express");
const genericController = require("./controller_new/genericController");
const database = require("./utils/database");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const authMiddleware = require("./middleware/authMiddleware");
const { encrypt, decrypt } = require('./utils/encrypt_decrypt');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); 
// Load environment variables
require('dotenv').config();
const port = process.env.PORT || 3000;
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());

app.get("/fUsers", async (req, res) => {
  try {
    const users = await database.findAll("user"); 
    res.status(200).json(users);
  } catch (error) {
    console.error(`Error fetching users: ${error}`);
    res.status(500).send("Internal server error");
  }
});


app.post("/register", async (req, res) => {
  try {
    let document = req.body;
    document._id = document.id;
    delete document.id;
    document.role = "trainee"; // Ensure role is set to 'trainee'
    document.password = encrypt(document.password); // Encrypt the password

    const result = await database.insertOne("user", document);
    const insertedDocument = { ...document, _id: result.insertedId };
    res.status(201).send(insertedDocument);
  } catch (error) {
    if (error.code === 11000) { // Duplicate key error
      console.error('Duplicate key error, generating a new ID');
      try {
        // Fetch all users to get existing IDs
        const users = await database.findAll("user");
        const newId = generateUniqueId(users); // Ensure unique ID generation
        let document = req.body; // Reassign document within this block
        document._id = newId;
        document.role = "trainee";
        
        const result = await database.insertOne("user", document);
        const insertedDocument = { ...document, _id: result.insertedId };
        res.status(201).send(insertedDocument);
      } catch (newError) {
        console.error(`Error inserting into user collection: ${newError}`);
        res.status(500).send("Internal server error");
      }
    } else {
      console.error(`Error inserting into user collection: ${error}`);
      res.status(500).send("Internal server error");
    }
  }
});

function generateUniqueId(users) {
  const existingIds = new Set(users.map((user) => parseInt(user._id, 10)).filter((id) => !isNaN(id)));
  let newId = existingIds.size > 0 ? Math.max(...existingIds) + 1 : 1;
  
  while (existingIds.has(newId)) {
    newId += 1;
  }
  
  return String(newId);
}


app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await database.findByEmail("user", email);
    // console.log('User:', user);
    console.log('Stored Password:', user.password); 
    console.log('Entered Password:', password);
    console.log('Password Length iiii:', user.password.length);
    if (user.password.length <= 20) {

      user.password = encrypt(user.password);
    }
    console.log('Encrypted Password', user.password);
    
    let pass = decrypt(user.password);
    console.log("Hi");
    console.log('Decrypted Password:', pass);
    console.log("Hi");
    if (user && password == decrypt(user.password)) {
      const token = jwt.sign({ id: user._id, role: user.role }, "your_jwt_secret", { expiresIn: "1h" });
      res.send({ token, role: user.role, userId: user._id,userName: user.fName,
        likedAssessment: user.likedAssessments});
    } else {
      console.log("Invalid email or password");
      res.status(401).send("Invalid email or password");
    }
  } catch (error) {
    res.status(500).send("Internal server error");
  }
});
// Routes using genericController with authentication
app.get("/:collectionName", authMiddleware, genericController.getData);
app.get("/:collectionName/:id", authMiddleware, genericController.getDataById);
app.post("/:collectionName", authMiddleware, genericController.addData);
app.put(
  "/:collectionName",
  express.json(),
  authMiddleware,
  genericController.updateData
);

const server = app.listen(port, () =>
  console.log(`Server listening on port ${port}`)
);
