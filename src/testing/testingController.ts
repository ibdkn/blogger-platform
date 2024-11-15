import {Request, Response} from "express";
import {testingRepository} from "./testing.repository";

export const testingController = {
    deleteAllData(req: Request, res: Response): void {
        testingRepository.deleteAllData();

        // Отправляем успешный ответ
        res.status(204).send();
    }
}