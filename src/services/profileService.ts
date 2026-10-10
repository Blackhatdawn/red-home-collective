import {appwrite, ID, listAll, type Row} from './appwrite'

export type UserRole = 'user' | 'agent' | 'admin'

/** Role comes only from the signed-in user's Appwrite labels ("admin", "agent", or none = user). The client never writes a role. */
export async function currentAccount() {
  const {account} = appwrite()
  let user
  try { user = await account.get() } catch { return null }
  const labels = user.labels ?? []
  const role: UserRole = labels.includes('admin') ? 'admin' : labels.includes('agent') ? 'agent' : 'user'
  return {user: {id: user.$id, email: user.email, name: user.name}, role}
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
