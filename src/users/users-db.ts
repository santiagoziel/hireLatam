import { DataTypes, Model, Sequelize } from "sequelize"
//User database schema
export class User extends Model {
    declare userId: string
    declare username: string
}

export const UserTableName = "users"

export const UserTableAttributes = {
    userId: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    username: {
        type: DataTypes.STRING, 
        allowNull: false,
        unique: true
    }
}

export const configureSequelizeModel = (sequelize: Sequelize): void => {

    User.init(UserTableAttributes, {
        sequelize, 
        modelName: 'User', 
        tableName: UserTableName
    })
}