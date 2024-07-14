const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
  if (req.url === "/" || req.url.startsWith("/assessment")) {
    return next();
  }

  const token = req.header("authorization")?.replace("Bearer ", "");
  console.log("Token is the following:", token,"for the collection:", req.params.collectionName);
  if (!token) {
    return res.status(401).send("Access denied. No token provided.");
  }

  try {
    const decoded = jwt.verify(token, "your_jwt_secret");
    req.user = decoded;
    const allowedCollections = [
      "assessmentScore",
      "assessment",
      "attendence",
      "purchases",
    ];

    if (
      req.user.role === "faculty"  &&
      !allowedCollections.includes(req.params.collectionName)
    ) {
      return res.status(403).send("Access denied.");
    }

   
    next();
  } catch (err) {
    res.status(400).send("Invalid token.");
  }
}

module.exports = authMiddleware;
