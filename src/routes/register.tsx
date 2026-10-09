import {createFileRoute} from '@tanstack/react-router'
import {AuthForm} from '@/components/red-home/auth-form'
import {metadata} from '@/lib/properties'
export const Route=createFileRoute('/register')({head:()=>metadata('Find your place','Create your Red Home account and begin your next chapter.'),component:()=> <AuthForm signup/>})
