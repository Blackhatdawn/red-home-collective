import {listMine, listAll} from './appwrite'
import {adminCreate} from './adminWrite'
export const listMyMilestones = () => listMine('milestones')
export const listAllMilestones = () => listAll('milestones')
export const createMilestone = (userId: string, d: {title: string; dueDate: string; status: string}) => adminCreate('milestones', userId, d)
