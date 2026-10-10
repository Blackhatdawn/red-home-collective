import {listMine, listAll} from './appwrite'
import {adminCreate} from './adminWrite'
export const listMySales = () => listMine('sales')
export const listAllSales = () => listAll('sales')
export const createSale = (userId: string, d: {propertyId: string; price: number; status: string}) => adminCreate('sales', userId, d)
