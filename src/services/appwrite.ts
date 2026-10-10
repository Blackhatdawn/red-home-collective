import {Client, Account, TablesDB, Storage, ID, Query, Permission, Role} from 'appwrite'

export const DATABASE_ID = '6ac98d8e0039b4e82213'
export const BUCKET_ID = 'documents'
export type Table = 'profiles' | 'properties' | 'deposits' | 'sales' | 'ledger_entries' | 'documents' | 'milestones' | 'audit_log'
export type Row = {$id: string; $createdAt: string; userId: string} & Record<string, unknown>

let services: {account: Account; db: TablesDB; storage: Storage} | null = null
// Lazy so SSR never touches the client and missing config fails closed with a readable message.
export function appwrite() {
  if (services) return services
  const endpoint = import.meta.env['VITE_APPWRITE_ENDPOINT'] as string | undefined
  const project = import.meta.env['VITE_APPWRITE_PROJECT_ID'] as string | undefined
  if (!endpoint || !project) throw new Error('Account access is not available yet: Red Home’s Appwrite project is not configured.')
  const client = new Client().setEndpoint(endpoint).setProject(project)
  services = {account: new Account(client), db: new TablesDB(client), storage: new Storage(client)}
  return services
}

export async function myUserId() { return (await appwrite().account.get()).$id }

/** Rows belonging to the signed-in user only. */
export async function listMine(table: Table) {
  const userId = await myUserId()
  const res = await appwrite().db.listRows({databaseId: DATABASE_ID, tableId: table, queries: [Query.equal('userId', userId), Query.orderDesc('$createdAt'), Query.limit(100)]})
  return res.rows as unknown as Row[]
}

/** All rows visible to the caller (admin dashboard). Appwrite permissions decide what is actually returned. */
export async function listAll(table: Table) {
  const res = await appwrite().db.listRows({databaseId: DATABASE_ID, tableId: table, queries: [Query.orderDesc('$createdAt'), Query.limit(100)]})
  return res.rows as unknown as Row[]
}

/** Admin-only: create a row for a user, readable by that user. */
export async function createForUser(table: Table, userId: string, data: Record<string, unknown>) {
  const row = await appwrite().db.createRow({databaseId: DATABASE_ID, tableId: table, rowId: ID.unique(), data: {...data, userId}, permissions: [Permission.read(Role.user(userId))]})
  return row as unknown as Row
}

export {ID, Query, Permission, Role}
