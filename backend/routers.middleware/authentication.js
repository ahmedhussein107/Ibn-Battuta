import jwt from "jsonwebtoken";
const secretKey = process.env.JWT_SECRET || "put a long string in the .env";

function isAuthenticated(req, res, next) {
  const token = req.cookies.jwt;
  if (!token) {
    return res.status(401).json({ message: "Not logged in" });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    req.user = decoded;
    next();
  });
}

function isAdmin(req, res, next) {
  if (req.user && req.user.role === "Admin") {
    next();
  } else {
    res.status(403).json({ message: "Forbidden, you are not an admin" });
  }
}

function isGovernor(req, res, next) {
  if (req.user && req.user.role === "Governor") {
    next();
  } else {
    res.status(403).json({ message: "Forbidden, you are not a governor" });
  }
}

function isSeller(req, res, next) {
  if (req.user && req.user.role === "Seller") {
    next();
  } else {
    res.status(403).json({ message: "Forbidden, you are not a seller" });
  }
}

function isTourGuide(req, res, next) {
  if (req.user && req.user.role === "TourGuide") {
    next();
  } else {
    res.status(403).json({ message: "Forbidden, you are not a tour guide" });
  }
}

function isAdvertiser(req, res, next) {
  if (req.user && req.user.role === "Advertiser") {
    next();
  } else {
    res.status(403).json({ message: "Forbidden, you are not an advertiser" });
  }
}
