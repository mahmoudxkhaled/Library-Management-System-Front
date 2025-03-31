import { ApiError } from "./ApiError";

export interface ApiResult {
    message: string;
    isSuccess: boolean;
    data: any | null;
    code: number;
    totalCount: number;
    errorList: ApiError[] | null;
}
