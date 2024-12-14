import jwt from "jsonwebtoken";
import {SETTINGS} from "../../settings";
import {CustomJwtPayload} from "../../auth/auth.type";
import {ObjectId} from "mongodb";

export const jwtService = {
    async createToken(userId: string): Promise<string> {
        return jwt.sign({userId}, SETTINGS.JWT_SECRET, {expiresIn: SETTINGS.AC_TIME});
    },
    async verifyToken(token: string) {
        try {
            const result: CustomJwtPayload = jwt.verify(token, SETTINGS.JWT_SECRET) as CustomJwtPayload;
            return new ObjectId(result.userId)
        } catch (error) {
            console.error("Token verify some error", error);
            return null;
        }
    },
}