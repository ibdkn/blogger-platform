import {Request, Response} from "express";
import {authService} from "./auth.service";

export const AuthController = {
    async login(req: Request, res: Response): Promise<void> {
        try {
            const { loginOrEmail, password } = req.body;
            const user = await authService.checkCredentials(loginOrEmail, password);

            if (user) {
                const accessToken = authService.generateJWT(user._id.toString());

                res.status(201).send(accessToken);
            }
        } catch (e: any) {
            if (e.status) {
                res.status(e.status).json({ errorsMessages: e.errorsMessages });
            } else {
                console.error('Error occurred while fetching posts:', e);
                res.status(500).json({ message: 'Internal server error' });
            }
        }
    },
    async me(req: Request, res: Response): Promise<void> {
        try {

        } catch (e: any) {

        }
    }
}