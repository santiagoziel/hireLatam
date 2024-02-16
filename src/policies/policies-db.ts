import { DataTypes, Model, Sequelize } from "sequelize"

//Policy database schema
export class InsurancePolicy extends Model {
    declare policyId: string
    declare userId: string
    declare policyholderName: string
    declare policyType: string
    declare contactInformation: {
        phoneNumber?: string
        email?: string
    }
}

export const InsurancePolicyTableName = "policies"

export const PoliciesTableAttributes = {
    policyId: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    policyholderName: {
        type: DataTypes.STRING, 
        allowNull: false,
    },
    policyType: {
        type: DataTypes.STRING, 
        allowNull: false,
    },
    contactInformation: {
        type: DataTypes.JSON,
        allowNull: false,
    }
}

export const configureSequelizeModel = (sequelize: Sequelize): void => {
    InsurancePolicy.init(PoliciesTableAttributes, {
        sequelize, 
        modelName: 'Policy', 
        tableName: InsurancePolicyTableName
    })
}