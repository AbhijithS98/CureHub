var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import jwt from 'jsonwebtoken';
import userRepository from '../repositories/userRepository.js';
const verifyUserToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    if (!token) {
        console.error("no token provided");
        res.status(401).json({ message: 'No token provided, authorization denied' });
        return;
    }
    try {
        const decoded = jwt.verify(token, process.env.USER_ACCESS_TOKEN_SECRET);
        const User = yield userRepository.findUserById(decoded.userId);
        console.log("user: ", User);
        if (User === null || User === void 0 ? void 0 : User.isBlocked) {
            console.error("User is blocked");
            res.status(403).json({ message: 'Your account has been blocked. Please contact support.' });
            return;
        }
        req.user = { Id: decoded.userId };
    }
    catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            console.error("Token expired");
            res.status(401).json({ message: 'Token expired' });
        }
        else {
            console.error("Invalid token");
            res.status(403).json({ message: 'Invalid token' });
        }
    }
    next();
});
export default verifyUserToken;
