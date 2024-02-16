import { QueryInterface } from 'sequelize'
import { PoliciesTableAttributes, InsurancePolicyTableName } from '../policies-db';
import { addSequelizeColumns } from '../../utils/tools-database';
//Setup of database tables
type MigrationFun = (migrator: { context: QueryInterface }) => Promise<void>

export const up: MigrationFun = async ({ context: query }) => {
  await query.createTable(InsurancePolicyTableName, addSequelizeColumns(PoliciesTableAttributes))
}

export const down: MigrationFun = async ({ context: query }) => {
  const options = { cascade: true, force: true }
  await query.dropTable(InsurancePolicyTableName, options)
}