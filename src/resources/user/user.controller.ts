import { Router, Request, Response, NextFunction } from "express";
import Controller from "@/utils/interfaces/controller.interface";
import HttpException from "@/utils/exceptions/http.exception";
import validateMiddleware from "@/middleware/validation.middleware";
import validate from "@/resources/user/user.validation";
import UserService from "./user.service";
import authenticated from "@/middleware/authenticated.middleware";

class UserController implements Controller {
    public path = "/users";
    public router = Router();
    private UserService = new UserService();

    constructor() {
        this.initialiseRouter();
    }

    private initialiseRouter = () : void => {
        this.router.post(
            `${this.path}/register`,
            validateMiddleware(validate.register),
            this.register
        );
        this.router.post(
            `${this.path}/login`,
            validateMiddleware(validate.login),
            this.login
        );
        this.router.get(
            `${this.path}`,
            authenticated,
            this.getUser
        );
    }

    private register = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) : Promise<Response | void> => {
        try {
            const {name, email, password} = req.body;
            const token = await this.UserService.register(
                name, email, password, 'user'
            );

            res.status(201).json({token});
        } catch(err : any) {
            next(new HttpException(400, err.message));
        }
    };

    private login = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) : Promise<Response | void> => {
        try {
            const {email, password} = req.body;

            const token = await this.UserService.login(email, password);

            res.status(200).json({token});
        } catch (err : any) {
            next(new HttpException(400, err.message));
        }
    };

    private getUser = (
        req: Request, 
        res: Response,
        next: NextFunction
    ) : Response | void => {
        if(!req.user) {
            return next(new HttpException(404, 'No logged in user'));
        }

        res.status(200).send({user: req.user})
    }
}

export default UserController;