import {createContext,useContext,useEffect,useState,useCallback,type ReactNode} from 'react'
import {useRouter} from '@tanstack/react-router'
import {useQueryClient} from '@tanstack/react-query'
import {currentAccount,logout,type UserRole} from '@/services/profileService'
type Ctx={role:UserRole|null;email:string|null;refresh:()=>Promise<void>;signOut:()=>Promise<void>}
const AuthContext=createContext<Ctx>({role:null,email:null,refresh:async()=>{},signOut:async()=>{}})
export const useAccount=()=>useContext(AuthContext)
export function AccountProvider({children}:{children:ReactNode}) {
 const [role,setRole]=useState<UserRole|null>(null);const [email,setEmail]=useState<string|null>(null);const router=useRouter();const queryClient=useQueryClient()
 const refresh=useCallback(async()=>{try{const a=await currentAccount();setRole(a?.role??null);setEmail(a?.user.email??null)}catch{setRole(null);setEmail(null)}},[])
 useEffect(()=>{void refresh()},[refresh])
 async function signOut(){await queryClient.cancelQueries();queryClient.clear();await logout();setRole(null);setEmail(null);await router.navigate({to:'/login',replace:true})}
 return <AuthContext.Provider value={{role,email,refresh,signOut}}>{children}</AuthContext.Provider>
}
