import {Request, Response} from "express";
import {authService} from "./auth.service";

export const AuthController = {
    async login(req: Request, res: Response): Promise<void> {
        try {
            const { loginOrEmail, password } = req.body;

            await authService.login(loginOrEmail, password);

            res.status(204).send();
        } catch (e: any) {
            if (e.status) {
                res.status(e.status).json({ errorsMessages: e.errorsMessages });
            } else {
                console.error('Error occurred while fetching posts:', e);
                res.status(500).json({ message: 'Internal server error' });
            }
        }
    }
}