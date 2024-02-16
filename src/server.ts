import { buildApp } from "./api"
import { PolicyModule } from "./policies/service"
import { PORT } from "./settings"
import { UsersModule } from "./users/service"
import { connectToDB } from "./utils/tools-database"
import { config } from "./utils/tools-utils"

//Initialzing database, modules and application
const startServer = async () => {
    const database = connectToDB({ 
        host: config.stringOrError("DB_HOST"),
        port: config.intOrError("DB_PORT"),
        username: config.stringOrError("DB_USERNAME"),
        password: config.stringOrError("DB_PASSWORD"),
        database: config.stringOrError("DB_DATABASE"),
    })

    const usersModule = await UsersModule.loadModule(database)
    const policyModule = await PolicyModule.loadModule(database)

    const app = await buildApp(usersModule, policyModule)
    app.listen(PORT, () => console.log(`Server running on PORT ${PORT}...`))
}

startServer()