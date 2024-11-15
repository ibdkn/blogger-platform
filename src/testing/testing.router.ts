import {Router} from "express";
import {testingController} from "./testingController";

export const testingRouter = Router();

testingRouter.delete('/', testingController.deleteAllData);