import {createContext,useContext,useEffect,useState,type ReactNode} from 'react'
import {useRouter} from '@tanstack/react-router'
import {useQueryClient} from '@tanstack/react-query'
import {subscribe,currentAccount,logout,type Role} from '@/lib/firebase'
const AuthContext=createContext<{role:Role|null;email:string|null;signOut:()=>Promise<void>}>({role:null,email:null,signOut:async()=>{}})
export const useAccount=()=>useContext(AuthContext)
export function AccountProvider({children}:{children:ReactNode}) {
 const [role,setRole]=useState<Role|null>(null);const [email,setEmail]=useState<string|null>(null);const router=useRouter();const queryClient=useQueryClient()
 useEffect(()=>subscribe(user=>{setEmail(user?.email??null);setRole(null);if(user)void currentAccount().then(a=>{setRole(a?.role??null);void router.invalidate()}).catch(()=>setRole(null));else void router.invalidate()}),[router])
 async function signOut(){await queryClient.cancelQueries();queryClient.clear();await logout();setRole(null);setEmail(null);await router.navigate({to:'/login',replace:true})}
 return <AuthContext.Provider value={{role,email,signOut}}>{children}</AuthContext.Provider>
}
