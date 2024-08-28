const jwt = require('jsonwebtoken');
require('dotenv').config();

const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        console.error("No authorization header provided");
        return res.status(401).send({ msg: "Unauthorized" });
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
        console.error("No token provided");
        return res.status(401).send({ msg: "No token, authorization denied" });
    }
    try {
        const decoded = jwt.verify(token, "shahbaz");
        console.log('Decoded payload:', decoded);
        req.user = { userId: decoded.id, role :decoded.role }; 
        next();
    } catch (error) {
        console.error("Error in auth middleware:", error);
        return res.status(401).send({ msg: "Token is not valid" });
    }
};



module.exports = authMiddleware;
