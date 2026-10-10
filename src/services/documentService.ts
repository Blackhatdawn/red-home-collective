import {appwrite, DATABASE_ID, BUCKET_ID, ID, Permission, Role, listMine, listAll, myUserId} from './appwrite'

export async function uploadDocument(file: File) {
  const userId = await myUserId()
  const owner = [Permission.read(Role.user(userId)), Permission.update(Role.user(userId)), Permission.delete(Role.user(userId))]
  const stored = await appwrite().storage.createFile({bucketId: BUCKET_ID, fileId: ID.unique(), file, permissions: owner})
  return appwrite().db.createRow({databaseId: DATABASE_ID, tableId: 'documents', rowId: ID.unique(), data: {userId, fileId: stored.$id, name: file.name, status: 'pending'}, permissions: [Permission.read(Role.user(userId))]})
}
export const listMyDocuments = () => listMine('documents')
export const listAllDocuments = () => listAll('documents')
export const documentUrl = (fileId: string) => appwrite().storage.getFileView({bucketId: BUCKET_ID, fileId})
