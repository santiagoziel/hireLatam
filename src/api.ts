import express from "express"
import cookieParser from "cookie-parser"
import apiErrorHandler from "./error/api-error-handler"
import { apiRoutes } from "./api-routes"
import { UsersModule } from "./users/service"
import { PolicyModule } from "./policies/service"

//sets middleware and asaings prefix to routes
export const buildApp = async (userModulde: UsersModule, policyModule: PolicyModule) => {
    const app = express()
    
    // MIDDLEWARE
    app.disable('x-powered-by')
    app.use(express.json())
    app.use(cookieParser())
    
    // Error handler middleware
    app.use(apiErrorHandler)
    
    app.use("/api", apiRoutes(userModulde, policyModule))

    return app
}