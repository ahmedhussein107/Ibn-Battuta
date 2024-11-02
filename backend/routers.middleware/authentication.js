import jwt from "jsonwebtoken";
const secretKey =
    process.env.JWT_SECRET || "any key to cipher the password and decipher ";

export function isAuthenticated(req, res, next) {
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
export function wsIsAuthenticate(ws, req, next) {
    console.log("i am in wsIsAuthenticate");
    const token = req.query.token;
    console.log("token is: ", token);

    if (!token) {
        ws.close();
        return;
    }

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            ws.close();
            return;
        }

        ws.user = decoded;
        console.log("user is: ", ws.user);
        next(ws, req);
    });
}

export function isAdmin(req, res, next) {
    if (req.user && req.user.role === "Admin") {
        next();
    } else {
        res.status(403).json({ message: "Forbidden, you are not an admin" });
    }
}

export function isGovernor(req, res, next) {
    if (req.user && req.user.role === "Governor") {
        next();
    } else {
        res.status(403).json({ message: "Forbidden, you are not a governor" });
    }
}

export function isSeller(req, res, next) {
    if (req.user && req.user.role === "Seller") {
        next();
    } else {
        res.status(403).json({ message: "Forbidden, you are not a seller" });
    }
}

export function isTourGuide(req, res, next) {
    if (req.user && req.user.role === "TourGuide") {
        next();
    } else {
        res.status(403).json({ message: "Forbidden, you are not a tour guide" });
    }
}

export function isAdvertiser(req, res, next) {
    if (req.user && req.user.role === "Advertiser") {
        next();
    } else {
        res.status(403).json({ message: "Forbidden, you are not an advertiser" });
    }
}
