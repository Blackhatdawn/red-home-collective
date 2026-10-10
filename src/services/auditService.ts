import {appwrite, DATABASE_ID, ID, listAll, myUserId} from './appwrite'

/** Append-only: this module intentionally exposes no update or delete. */
export async function logAudit(action: string, targetUserId: string, details: string) {
  const userId = await myUserId()
  await appwrite().db.createRow({databaseId: DATABASE_ID, tableId: 'audit_log', rowId: ID.unique(), data: {userId, action, targetUserId, details}})
}
export const listAudit = () => listAll('audit_log')
