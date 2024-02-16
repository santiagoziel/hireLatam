import { Response, Router } from "express"
import { Request } from "express-jwt"
import jwt from "jsonwebtoken"
import { RegisterResult } from "./api-models"
import { SECRET_KEY } from "./settings"
import { requestCatchError } from "./error/catch-error"
import { jwtMiddleware } from "./auth/jwt_middleware"
import {UsersModule} from "./users/service"
import { PolicyModule } from "./policies/service"


//Maps routes to Modules respective funtionality
export const apiRoutes = (userModulde: UsersModule, policyModule: PolicyModule) => {
    const router = Router() 
    router.post("/register", requestCatchError(async (request: Request, response: Response) => {
        const username: string = request.body.username
        const result = await userModulde.createUser(username)
        if (result.status == "ok") 
            response.status(200).json(signJWTAndSetCookie(result, response))
        else 
            response.status(401).json(result)
    }))

    router.post("/createPolicy", jwtMiddleware, requestCatchError(async (request: Request, response: Response) => {
        const userId: string = request.auth!.userId
        const info = request.body.info
        if (!info) setStatus({status:"error"}, response, 404)
        else {
            const result = await policyModule.createPolicy(userId, info)
            setStatus(result, response)
        }
    }))

    router.get("/readPolicy", jwtMiddleware, requestCatchError(async (request: Request, response: Response) => {
        const userId: string = request.auth!.userId
        const policyId = request.body.policyId
        if (!policyId) setStatus({status:"error"}, response, 404)
        else {
            const result = await policyModule.readPolicy(policyId, userId)
            setStatus(result, response)
        }
    }))

    router.post("/updatePolicy", jwtMiddleware, requestCatchError(async (request: Request, response: Response) => {
        const userId: string = request.auth!.userId
        const {policyId, updateData} = request.body
        if(!policyId || !updateData ) setStatus({status:"error"}, response, 404)
        else {
            const result = await policyModule.updatePolicy(policyId, userId, updateData)
            setStatus(result, response)
        }
    }))

    router.post("/deletePolicy", jwtMiddleware, requestCatchError(async (request: Request, response: Response) => {
        const userId: string = request.auth!.userId
        const policyId = request.body.policyId
        if (!policyId) setStatus({status:"error"}, response, 404)
        else {
            const result = await policyModule.deletePolicy(policyId, userId)
            setStatus(result, response)
        }
    }))

    return router
}



function signJWTAndSetCookie(result: RegisterResult, response: Response): RegisterResult {
    if (result.status != "ok") return result
    const payload = { userId: result.userId }
    const cookieToken = jwt.sign(payload, SECRET_KEY)
    response.cookie("access", cookieToken, { sameSite: "none", secure: true })
    return result;
}

function setStatus(result: {status: "ok" | "error"}, response: Response, code?: number){
    if (result.status == "ok") response.status(200).json(result)
    else response.status(code ?? 409).json(result)
}