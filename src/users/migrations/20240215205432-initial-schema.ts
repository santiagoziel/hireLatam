import { QueryInterface } from 'sequelize'
import { UserTableName, UserTableAttributes } from '../users-db';
import { addSequelizeColumns } from '../../utils/tools-database';
//Setup of database tables
type MigrationFun = (migrator: { context: QueryInterface }) => Promise<void>

export const up: MigrationFun = async ({ context: query }) => {
  await query.createTable(UserTableName, addSequelizeColumns(UserTableAttributes))
}

export const down: MigrationFun = async ({ context: query }) => {
  const options = { cascade: true, force: true }
  await query.dropTable(UserTableName, options)
}