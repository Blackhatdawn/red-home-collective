import { initializeApp, getApps } from 'firebase/app'
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, type User } from 'firebase/auth'
import { getFirestore, doc, getDoc, setDoc, deleteDoc, collection, getDocs } from 'firebase/firestore'
export type Role = 'user' | 'agent' | 'admin'
export function services() {
 const config = {apiKey:import.meta.env.VITE_FIREBASE_API_KEY, authDomain:import.meta.env.VITE_FIREBASE_AUTH_DOMAIN, projectId:import.meta.env.VITE_FIREBASE_PROJECT_ID, appId:import.meta.env.VITE_FIREBASE_APP_ID}
 if (!config.apiKey || !config.projectId || !config.authDomain || !config.appId) throw new Error('Account access is not available yet. Red Home’s Firebase project needs to be connected.')
 const app = getApps()[0] ?? initializeApp(config)
 return {auth:getAuth(app), db:getFirestore(app)}
}
export async function currentAccount() {
 const {auth,db}=services(); await auth.authStateReady(); const user=auth.currentUser
 if (!user) return null
 const token = await user.getIdToken(true); if (!token) return null
 const record=await getDoc(doc(db,'roles',user.uid)); const role=record.data()?.role
 if (role!=='user' && role!=='agent' && role!=='admin') throw new Error('Your account role could not be verified. Please contact Red Home.')
 return {user,role:role as Role}
}
export async function login(email:string,password:string) {await signInWithEmailAndPassword(services().auth,email,password); return currentAccount()}
export async function register(email:string,password:string) {
 const {auth,db}=services(); const result=await createUserWithEmailAndPassword(auth,email,password)
 await setDoc(doc(db,'roles',result.user.uid),{role:'user'}); return currentAccount()
}
export const logout=()=>signOut(services().auth)
export function subscribe(listener:(user:User|null)=>void) {try {return onAuthStateChanged(services().auth,listener)} catch {listener(null); return ()=>{}}}
export async function savedIds() {const account=await currentAccount(); if(!account)return []; return (await getDocs(collection(services().db,'saved',account.user.uid,'properties'))).docs.map(d=>d.id)}
export async function saveProperty(id:string,saved:boolean) {const account=await currentAccount(); if(!account)throw new Error('Please sign in to save a home.');const ref=doc(services().db,'saved',account.user.uid,'properties',id);if(saved) await setDoc(ref,{propertyId:id});else await deleteDoc(ref)}
