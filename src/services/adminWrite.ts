import {createForUser, type Table} from './appwrite'
import {logAudit} from './auditService'

/** Shared admin create path: row readable by the target user, plus an audit entry. */
export async function adminCreate(table: Table, userId: string, data: Record<string, unknown>) {
  const row = await createForUser(table, userId, data)
  await logAudit(`create_${table}`, userId, `${table}/${row.$id}`)
  return row
}
