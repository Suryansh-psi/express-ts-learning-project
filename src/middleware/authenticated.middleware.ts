import userModel from "@/resources/user/user.model";
import { verifyToken } from "@/utils/token";
import { Request, Response, NextFunction } from "express";
import Token from "@/utils/interfaces/token.interface";
import HttpException from "@/utils/exceptions/http.exception";
import jwt from 'jsonwebtoken';

const authenticated = async (
    req: Request,
    res: Response,
    next: NextFunction
) : Promise<Response | void> => {
    const bearer = req.headers.authorization;

    if(!bearer || !bearer.startsWith('Bearer ')) {
        return next(new HttpException(401, "Unauthorised"))
    }

    const accessToken = bearer.split('Bearer ')[1].trim();

    try {
        const payload : Token | jwt.JsonWebTokenError = await verifyToken(accessToken);

        if(payload instanceof jwt.JsonWebTokenError) {
            return next(new HttpException(401, "Unauthorised"))
        }

        const user = await userModel.findById(payload.id).select('-password').exec();

        if(!user) {
            return next(new HttpException(401, "Unauthorised"))
        }

        req.user = user;

        return next();
    } catch(err : any) {
        return next(new HttpException(401, "Unauthorised"))
    }
}

export default authenticated;