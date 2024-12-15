import jwt from "jsonwebtoken";
import {SETTINGS} from "../../settings";
import {TokenPayload} from "../../auth/types/token.payload.type";

export const jwtService = {
    async createToken(userId: string): Promise<string> {
        return jwt.sign({userId}, SETTINGS.JWT_SECRET, {expiresIn: SETTINGS.AC_TIME});
    },
    async verifyToken(token: string): Promise<TokenPayload | null> {
        try {
            return jwt.verify(token, SETTINGS.JWT_SECRET) as TokenPayload;
        } catch (error) {
            console.error("Token verify some error", error);
            return null;
        }
    },
}