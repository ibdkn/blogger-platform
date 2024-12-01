import {Request, Response} from "express";
import {testingService} from "./testing.service";

export const testingController = {
    async deleteAllData(req: Request, res: Response): Promise<void> {
        try {
            await testingService.deleteAllData();
            res.status(204).send();
        } catch (e) {
            console.error('Error occurred while fetching posts:', e);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}