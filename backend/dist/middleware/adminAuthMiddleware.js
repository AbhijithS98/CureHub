var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import jwt from "jsonwebtoken";
import expressAsyncHandler from "express-async-handler";
const protect = expressAsyncHandler((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let token;
    token = req.cookies.jwtAdmin;
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET_ADMIN);
            // req.admin = decoded;
            next();
        }
        catch (error) {
            res.status(401);
            throw new Error("Not Authorized ,invalid token");
        }
    }
    else {
        res.status(401);
        throw new Error("Not Authorized no token");
    }
}));
export { protect };
