import { QueryInterface, Sequelize } from "sequelize"
import {CreatePolicyInfo, CreateResult, DeleteResult, PolicyVerificationResult, ReadResult, UpdatePolicyInfo, UpdateResult} from "../api-models"
import { Umzug } from "umzug"
import path from "path"
import { buildMigrator } from "../utils/tools-database"
import * as policyDB from "./policies-db"

//Policy responsible class, all code that modifes policies must be found here
export class PolicyModule {
    private readonly migrator: Umzug<QueryInterface>

    constructor(private readonly database: Sequelize) {
        const migrationsPath: string = path.join(__dirname, "migrations").replace(/\\/g, "/")
        this.migrator = buildMigrator(database, migrationsPath)
    }

    static async loadModule(database: Sequelize): Promise<PolicyModule> {
        const service = new PolicyModule( database)
        await service.loadDatabaseModels()
        return service
    }

    async loadDatabaseModels(): Promise<void> {
        policyDB.configureSequelizeModel(this.database)
        await this.migrator.up()
    }

    async createPolicy(userId: string, info: CreatePolicyInfo): Promise<CreateResult> {
        try {
            const newPolicy = await policyDB.InsurancePolicy.create({...info, userId})
            return { status: "ok", policyId: newPolicy.policyId }
        } catch (error: any) {
            console.error("Error creating policy:", error)
            return { status: "error", reason: error.message}
        }
    }

    async readPolicy(policyId: string, userId: string): Promise<ReadResult> {
        try {
            const verificationResult = await this.verifyPolicyOwnership(policyId, userId)
            if (verificationResult.status === "error") return verificationResult
            const policy = verificationResult.policy
            return {status: "ok", policy}
        } catch (error: any) {
            console.error("Error reading policy:", error)
            return { status: "error", reason: error.message }
        }
    }

    async updatePolicy(policyId: string, userId: string, updateData: UpdatePolicyInfo): Promise<UpdateResult> {
        try {
            const verificationResult = await this.verifyPolicyOwnership(policyId, userId)
            if (verificationResult.status === "error") return verificationResult
            await verificationResult.policy.update(updateData)
            return { status: "ok" }
        } catch (error: any) {
            console.error("Error updating policy:", error)
            return { status: "error", reason: error.message }
        }
    }

    async deletePolicy(policyId: string, userId: string): Promise<DeleteResult> {
        try {
            const verificationResult = await this.verifyPolicyOwnership(policyId, userId)
            if (verificationResult.status === "error") return verificationResult
            await verificationResult.policy.destroy()
            return { status: "ok" }
        } catch (error: any) {
            console.error("Error deleting policy:", error)
            return { status: "error", reason: error.message }
        }
    }

    private async verifyPolicyOwnership(policyId: string, userId: string): Promise<PolicyVerificationResult> {
        try {
            const policy = await policyDB.InsurancePolicy.findByPk(policyId)
            if (!policy) return { status: "error", reason: "Policy not found" }
            else if (policy.userId !== userId) 
                return { status: "error", reason: "Policy not registered under provided user" }
            
            return { status: 'ok', policy }
        } catch (error: any) {
            console.error("Error verifying policy ownership:", error)
            return { status: "error", reason: error.message }
        }
    }
}

