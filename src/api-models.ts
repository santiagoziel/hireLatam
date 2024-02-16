import { InsurancePolicy } from "./policies/policies-db"

//models that rperesent what eahc entpoint expectws and returns

export type RegisterResult
    = { status: "ok", userId: string }
    | { status: "username already exists" }
    | { status: "cannot connect to database" }

export type CreateResult
    = {status: "ok", policyId: string}
    | {status: "error", reason: string}

export type ReadResult
    = { status: "ok", policy: InsurancePolicy }
    | { status: "error", reason: string }

export type UpdateResult
    = { status: "ok" }
    | { status: "error", reason: string }

export type DeleteResult
    = { status: "ok" }
    | { status: "error", reason: string }


export type CreatePolicyInfo = {
        policyholderName: string
        policyType: string
        contactInformation?: {
            phoneNumber?: string
            email?: string
        }
    }

export type UpdatePolicyInfo = Partial<CreatePolicyInfo>

export type PolicyVerificationResult
    = { status: 'ok', policy: InsurancePolicy }
    | { status: 'error', reason: string }