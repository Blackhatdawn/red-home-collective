import {appwrite, DATABASE_ID, ID, Query, listAll, type Row} from './appwrite'

export type UserRole = 'user' | 'agent' | 'admin'

/** Role comes from the profiles table. Signup never creates a profile, so no one can pick their own role. */
export async function currentAccount() {
  const {account, db} = appwrite()
  let user
  try { user = await account.get() } catch { return null }
  const res = await db.listRows({databaseId: DATABASE_ID, tableId: 'profiles', queries: [Query.equal('userId', user.$id), Query.limit(1)]})
  const role = res.rows[0]?.['role']
  return {user: {id: user.$id, email: user.email, name: user.name}, role: (role === 'agent' || role === 'admin' ? role : 'user') as UserRole}
}

export async function login(email: string, password: string) {
  await appwrite().account.createEmailPasswordSession({email, password})
  return currentAccount()
}

export async function register(email: string, password: string) {
  await appwrite().account.create({userId: ID.unique(), email, password})
  return login(email, password)
}

export async function logout() { try { await appwrite().account.deleteSession({sessionId: 'current'}) } catch { /* already signed out */ } }

export const listProfiles = (): Promise<Row[]> => listAll('profiles')
