import { ResultStatus } from "./resultCode";
import {HttpStatuses} from "../types/httpStatuses";

export const resultCodeToHttpException = (resultCode: ResultStatus): number => {
    switch (resultCode) {
        case ResultStatus.Success:
            return HttpStatuses.Success;
        case ResultStatus.NotFound:
            return HttpStatuses.NotFound;
        case ResultStatus.Forbidden:
            return HttpStatuses.Forbidden;
        case ResultStatus.Unauthorized:
            return HttpStatuses.Unauthorized;
        case ResultStatus.BadRequest:
            return HttpStatuses.BadRequest;
        default:
            return HttpStatuses.ServerError;
    }
};