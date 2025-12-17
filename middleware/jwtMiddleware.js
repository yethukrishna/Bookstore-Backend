const jwt = require("jsonwebtoken");

const jwtMiddleware = (req, res, next) => {
  console.log("Inside Jwt Middleware");

  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(401).json("Token not provided");
  }

  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res.status(401).json("Invalid authorization header format");
  }

  const token = parts[1];
  console.log("TOKEN:", token);

  try {
    const jwtResponse = jwt.verify(token, process.env.secretKey);
    console.log("JWT RESPONSE:", jwtResponse);

    // FIXED: Store full payload instead of a string
    req.payload = jwtResponse;

    next();
  } catch (err) {
    console.log("JWT ERROR:", err);
    return res.status(401).json("invalid token");
  }
};

module.exports = jwtMiddleware;
