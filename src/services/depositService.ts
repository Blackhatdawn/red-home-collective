import {listMine, listAll} from './appwrite'
import {adminCreate} from './adminWrite'
export const listMyDeposits = () => listMine('deposits')
export const listAllDeposits = () => listAll('deposits')
export const createDeposit = (userId: string, d: {amount: number; currency: string; status: string}) => adminCreate('deposits', userId, d)
