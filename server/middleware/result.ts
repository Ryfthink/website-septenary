import {Application, Request as Req, Response as Rsp} from "express";

// 接口响应体
class Result {
    success: boolean;
    error: any;
    data: any;

    constructor(success, data, error) {
        this.success = success;
        this.error = error;
        this.data = data;
    }
}


function success(data ?: object) {
    this.json(new Result(true, data, null))
}

function failed(error: string | Error) {
    this.json(new Result(false, null, {message: typeof error == 'string' ? error : error.message}));
}

export const initResultPlugin = function (app: Application) {
    app.use((req: Request, res: Response, next) => {
        res.success = success;
        res.failed = failed;
        next();
    });
};

export interface Request extends Req {

}

export interface Response extends Rsp {
    success(data?: object): void

    failed(message: string | Error): void
}