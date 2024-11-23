import {Request, Response} from "express";
import {testingRepository} from "./testing.repository";

export const testingController = {
    async deleteAllData(req: Request, res: Response): Promise<void> {
        await testingRepository.deleteAllData();

        // Отправляем успешный ответ
        res.status(204).send();
    }
}