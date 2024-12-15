import { ResultStatus } from "./resultCode";
import {HttpStatuses} from "../types/httpStatuses";

export const resultCodeToHttpException = (resultCode: ResultStatus): number => {
    switch (resultCode) {
        case ResultStatus.Success:
            return HttpStatuses.Success;
        case ResultStatus.Created:
            return HttpStatuses.Created;
        case ResultStatus.NoContent:
            return HttpStatuses.NoContent;
        case ResultStatus.BadRequest:
            return HttpStatuses.BadRequest;
        case ResultStatus.Unauthorized:
            return HttpStatuses.Unauthorized;
        case ResultStatus.Forbidden:
            return HttpStatuses.Forbidden;
        case ResultStatus.NotFound:
            return HttpStatuses.NotFound;
        case ResultStatus.InternalServerError:
            return HttpStatuses.InternalServerError;
        default:
            return HttpStatuses.InternalServerError;
    }
};