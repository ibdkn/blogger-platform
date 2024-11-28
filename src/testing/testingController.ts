import {Request, Response} from "express";
import {testingService} from "./testing.service";

export const testingController = {
    async deleteAllData(req: Request, res: Response): Promise<void> {
        await testingService.deleteAllData();

        // Отправляем успешный ответ
        res.status(204).send();
    }
}