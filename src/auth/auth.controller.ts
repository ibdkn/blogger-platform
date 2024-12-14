import {Request, Response} from "express";
import {authService} from "./auth.service";
import {accessTokenType} from "./auth.type";
import {DomainError} from "../common/types/error.types";

export const AuthController = {
    async login(req: Request, res: Response): Promise<void> {
        try {
            const { loginOrEmail, password } = req.body;
            const user = await authService.checkCredentials(loginOrEmail, password);

            if (user) {
                const accessToken: accessTokenType = authService.generateJWT(user._id.toString());

                res.status(200).send(accessToken);
            }
        } catch (e: any) {
            if (e instanceof DomainError) {
                res.status(e.status).json({ errorsMessages: e.errorMessages });
            } else {
                console.error('Error occurred while fetching posts:', e);
                res.status(500).json({message: 'Internal server error'});
            }
        }
    },
    async me(req: Request, res: Response): Promise<void> {
        try {
            const authHeader = req.headers.authorization;

            if (authHeader) {
                const token = authHeader.split(' ')[1];
                const user = await authService.getMe(token);
                res.status(201).send(user);
            } else {
                res.status(401).send({message: 'Unauthorized'});
            }
        } catch (e: any) {
            if (e instanceof DomainError) {
                res.status(e.status).json({ errorsMessages: e.errorMessages });
            } else {
                console.error('Error occurred while fetching posts:', e);
                res.status(500).json({message: 'Internal server error'});
            }
        }
    }
}