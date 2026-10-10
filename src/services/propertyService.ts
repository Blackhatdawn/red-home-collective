import {listMine, listAll} from './appwrite'
export const listMyProperties = () => listMine('properties')
export const listAllProperties = () => listAll('properties')
