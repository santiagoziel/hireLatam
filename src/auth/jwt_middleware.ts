import { Request } from "express"
import { SECRET_KEY } from "../settings"

import { expressjwt } from "express-jwt"


const getToken = async (request: Request) => request.cookies.access

export const jwtMiddleware = expressjwt({
    secret: SECRET_KEY,
    algorithms: ["HS256"],
    credentialsRequired: true,
    getToken: getToken,
})
