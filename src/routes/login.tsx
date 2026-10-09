import {createFileRoute} from '@tanstack/react-router'
import {AuthForm} from '@/components/red-home/auth-form'
import {metadata} from '@/lib/properties'
export const Route=createFileRoute('/login')({head:()=>metadata('Welcome home','Log in to your Red Home account to save properties and connect with owners.'),component:()=> <AuthForm/>})
