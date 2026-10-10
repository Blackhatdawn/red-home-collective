import {listMine, listAll} from './appwrite'
import {adminCreate} from './adminWrite'
/** Append-only: no update or delete is exposed. */
export const listMyLedger = () => listMine('ledger_entries')
export const listAllLedger = () => listAll('ledger_entries')
export const createLedgerEntry = (userId: string, d: {amount: number; type: string; description: string}) => adminCreate('ledger_entries', userId, d)
