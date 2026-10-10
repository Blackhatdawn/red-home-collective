import {createFileRoute,redirect,Link} from '@tanstack/react-router'
import {useState,useEffect,useCallback} from 'react'
import {LayoutDashboard,House,Users,LogOut,ArrowUpRight,Settings,Wallet,Handshake,BookOpen,FileText,Flag,History,Loader2,AlertCircle,Inbox,Upload} from 'lucide-react'
import {currentAccount} from '@/services/profileService'
import {listProfiles} from '@/services/profileService'
import {listMyProperties} from '@/services/propertyService'
import {listMyDeposits,listAllDeposits,createDeposit} from '@/services/depositService'
import {listMySales,listAllSales,createSale} from '@/services/saleService'
import {listMyLedger,listAllLedger,createLedgerEntry} from '@/services/ledgerService'
import {listMyMilestones,listAllMilestones,createMilestone} from '@/services/milestoneService'
import {listMyDocuments,uploadDocument,documentUrl} from '@/services/documentService'
import {listAudit} from '@/services/auditService'
import type {Row} from '@/services/appwrite'
import {metadata} from '@/lib/properties'
import {Button} from '@/components/ui/button'
import {useAccount} from '@/components/red-home/auth-context'

export const Route=createFileRoute('/account/$role')({ssr:false,beforeLoad:async({params})=>{let account;try{account=await currentAccount()}catch{throw redirect({to:'/login'})}if(!account)throw redirect({to:'/login'});if(account.role!==params.role)throw redirect({to:'/account/$role',params:{role:account.role}});return {account}},head:({params})=>metadata(`${params.role==='admin'?'Administration':params.role==='agent'?'Agent workspace':'Your personal space'}`,'Manage your Red Home account, deposits, sales, documents and milestones.'),component:Account})

type Col={key:string;label:string;money?:boolean}
const fmt=(v:unknown,money?:boolean)=>v==null||v===''?'—':money&&typeof v==='number'?new Intl.NumberFormat('en-US',{style:'currency',currency:'EUR',maximumFractionDigits:0}).format(v):String(v)
const errText=(e:unknown)=>e instanceof Error?e.message:'Something went wrong.'

function useRows(load:()=>Promise<Row[]>){const [rows,setRows]=useState<Row[]|null>(null);const [error,setError]=useState('');const reload=useCallback(()=>{setError('');setRows(null);load().then(setRows).catch(e=>setError(errText(e)))},[load]);useEffect(reload,[reload]);return {rows,error,reload}}

function RowsTable({load,cols,empty,admin}:{load:()=>Promise<Row[]>;cols:Col[];empty:string;admin?:boolean}){const {rows,error,reload}=useRows(load);return <RowsView rows={rows} error={error} reload={reload} cols={admin?[{key:'userId',label:'User'},...cols]:cols} empty={empty}/>}
function RowsView({rows,error,reload,cols,empty}:{rows:Row[]|null;error:string;reload:()=>void;cols:Col[];empty:string}){
 if(error)return <div className="empty-state" role="alert"><AlertCircle/><h2>We couldn’t load this.</h2><p>{error}</p><Button variant="outline" onClick={reload}>Try again</Button></div>
 if(!rows)return <div className="empty-state" aria-busy="true"><Loader2 className="animate-spin"/><p>Loading…</p></div>
 if(!rows.length)return <div className="empty-state"><Inbox/><h2>Nothing here yet.</h2><p>{empty}</p></div>
 return <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr>{cols.map(c=><th key={c.key} className="text-left p-2 border-b">{c.label}</th>)}<th className="text-left p-2 border-b">Created</th></tr></thead><tbody>{rows.map(r=><tr key={r.$id}>{cols.map(c=><td key={c.key} className="p-2 border-b">{fmt(r[c.key],c.money)}</td>)}<td className="p-2 border-b">{new Date(r.$createdAt).toLocaleDateString()}</td></tr>)}</tbody></table></div>}

type Field={key:string;label:string;type?:'number'|'date'|'text';options?:string[]}
function AdminCreate({fields,submit,onDone,label}:{fields:Field[];submit:(userId:string,data:Record<string,string|number>)=>Promise<unknown>;onDone:()=>void;label:string}){const [v,setV]=useState<Record<string,string>>({});const [busy,setBusy]=useState(false);const [msg,setMsg]=useState('');const [err,setErr]=useState('')
 async function go(e:React.FormEvent){e.preventDefault();setBusy(true);setMsg('');setErr('');try{const data:Record<string,string|number>={};for(const f of fields)data[f.key]=f.type==='number'?Number(v[f.key]):(v[f.key]??f.options?.[0]??'');await submit(v['userId']??'',data);setMsg(`${label} created.`);setV({});onDone()}catch(e){setErr(errText(e))}finally{setBusy(false)}}
 return <form onSubmit={e=>void go(e)} className="account-settings grid gap-3 mb-6"><h3>New {label.toLowerCase()}</h3><label>User ID<input required value={v['userId']??''} onChange={e=>setV({...v,userId:e.target.value})} placeholder="Appwrite user ID"/></label>{fields.map(f=><label key={f.key}>{f.label}{f.options?<select value={v[f.key]??f.options[0]} onChange={e=>setV({...v,[f.key]:e.target.value})}>{f.options.map(o=><option key={o}>{o}</option>)}</select>:<input required type={f.type??'text'} step={f.type==='number'?'any':undefined} value={v[f.key]??''} onChange={e=>setV({...v,[f.key]:e.target.value})}/>}</label>)}{err&&<p className="form-error" role="alert">{err}</p>}{msg&&<p role="status">{msg}</p>}<Button type="submit" disabled={busy}>{busy?'Saving…':`Create ${label.toLowerCase()}`}</Button></form>}

function AdminSection({load,cols,fields,submit,label,empty}:{load:()=>Promise<Row[]>;cols:Col[];fields:Field[];submit:(u:string,d:Record<string,string|number>)=>Promise<unknown>;label:string;empty:string}){const {rows,error,reload}=useRows(load);return <><AdminCreate fields={fields} submit={submit} onDone={reload} label={label}/><RowsView rows={rows} error={error} reload={reload} cols={[{key:'userId',label:'User'},...cols]} empty={empty}/></>}

function Documents(){const {rows,error,reload}=useRows(listMyDocuments);const [busy,setBusy]=useState(false);const [err,setErr]=useState('')
 async function up(f:File|undefined){if(!f)return;setBusy(true);setErr('');try{await uploadDocument(f);reload()}catch(e){setErr(errText(e))}finally{setBusy(false)}}
 return <><label className="account-settings flex items-center gap-2 mb-4 cursor-pointer"><Upload/>{busy?'Uploading…':'Upload a document'}<input type="file" className="sr-only" disabled={busy} onChange={e=>{void up(e.target.files?.[0]);e.target.value=''}}/></label>{err&&<p className="form-error" role="alert">{err}</p>}<RowsView rows={rows} error={error} reload={reload} cols={[{key:'name',label:'Name'},{key:'status',label:'Status'}]} empty="Upload contracts, IDs or proofs of funds here."/>{rows?.length?<ul className="mt-3 text-sm">{rows.map(r=><li key={r.$id}><a className="underline" href={documentUrl(String(r['fileId']))} target="_blank" rel="noreferrer">Open {String(r['name']??r['fileId'])}</a></li>)}</ul>:null}</>}

const C={dep:[{key:'amount',label:'Amount',money:true},{key:'currency',label:'Currency'},{key:'status',label:'Status'}],sale:[{key:'propertyId',label:'Property'},{key:'price',label:'Price',money:true},{key:'status',label:'Status'}],led:[{key:'type',label:'Type'},{key:'amount',label:'Amount',money:true},{key:'description',label:'Description'}],mil:[{key:'title',label:'Milestone'},{key:'dueDate',label:'Due'},{key:'status',label:'Status'}],prop:[{key:'title',label:'Title'},{key:'location',label:'Location'},{key:'price',label:'Price',money:true},{key:'status',label:'Status'}]} satisfies Record<string,Col[]>

function Account(){const {account}=Route.useRouteContext();const {signOut}=useAccount();const [tab,setTab]=useState('Overview');const role=account.role;const admin=role==='admin'
 const tabs=admin?[{name:'Overview',icon:LayoutDashboard},{name:'Users',icon:Users},{name:'Deposits',icon:Wallet},{name:'Sales',icon:Handshake},{name:'Ledger',icon:BookOpen},{name:'Milestones',icon:Flag},{name:'Audit log',icon:History},{name:'Settings',icon:Settings}]:[{name:'Overview',icon:LayoutDashboard},{name:'My properties',icon:House},{name:'Deposits',icon:Wallet},{name:'Sales',icon:Handshake},{name:'Ledger',icon:BookOpen},{name:'Milestones',icon:Flag},{name:'Documents',icon:FileText},{name:'Settings',icon:Settings}]
 return <main className={`account-layout account-${role}`}><aside className="account-sidebar"><span className="eyebrow">{admin?'ADMINISTRATION':role==='agent'?'AGENT WORKSPACE':'YOUR PERSONAL SPACE'}</span><div className="account-person"><span>{account.user.email.slice(0,1).toUpperCase()}</span><div><strong>{role==='user'?'My Red Home':role==='agent'?'Agent account':'Admin account'}</strong><small>{account.user.email}</small></div></div><nav>{tabs.map(t=><Button key={t.name} variant="sidebar" className={tab===t.name?'active':''} onClick={()=>setTab(t.name)}><t.icon/>{t.name}</Button>)}</nav><Button variant="ghost" onClick={()=>void signOut()}><LogOut/> Sign out</Button></aside>
 <div className="account-main"><span className="eyebrow">RED HOME · {role.toUpperCase()}</span><h1>{tab==='Overview'?'Welcome home.':tab}</h1>
 {tab==='Overview'&&<><p className="page-intro">{admin?'Manage deposits, sales, ledger entries and milestones for Red Home clients.':'Follow your deposits, sales, documents and milestones in one place.'}</p><Button asChild><Link to="/listings" search={{purpose:'buy',location:'',type:'',budget:''}}>Discover homes <ArrowUpRight/></Link></Button></>}
 {tab==='Settings'&&<div className="account-settings"><h3>Account details</h3><p>Email: {account.user.email}</p><p>User ID: {account.user.id}</p><p>Account access: {role}</p><p>To change your account access, contact the platform administrator.</p></div>}
 {!admin&&<>
  {tab==='My properties'&&<RowsTable load={listMyProperties} cols={C.prop} empty="Your listed properties will appear here."/>}
  {tab==='Deposits'&&<RowsTable load={listMyDeposits} cols={C.dep} empty="Deposits recorded by Red Home will appear here."/>}
  {tab==='Sales'&&<RowsTable load={listMySales} cols={C.sale} empty="Your sales will appear here."/>}
  {tab==='Ledger'&&<RowsTable load={listMyLedger} cols={C.led} empty="Your ledger entries will appear here."/>}
  {tab==='Milestones'&&<RowsTable load={listMyMilestones} cols={C.mil} empty="Milestones for your purchase or sale will appear here."/>}
  {tab==='Documents'&&<Documents/>}
 </>}
 {admin&&<>
  {tab==='Users'&&<RowsTable load={listProfiles} cols={[{key:'userId',label:'User ID'},{key:'email',label:'Email'},{key:'role',label:'Role'}]} empty="No profiles yet."/>}
  {tab==='Deposits'&&<AdminSection label="Deposit" load={listAllDeposits} cols={C.dep} empty="No deposits yet." fields={[{key:'amount',label:'Amount',type:'number'},{key:'currency',label:'Currency',options:['EUR','USD','GBP']},{key:'status',label:'Status',options:['pending','received','refunded']}]} submit={(u,d)=>createDeposit(u,d as never)}/>}
  {tab==='Sales'&&<AdminSection label="Sale" load={listAllSales} cols={C.sale} empty="No sales yet." fields={[{key:'propertyId',label:'Property ID'},{key:'price',label:'Price',type:'number'},{key:'status',label:'Status',options:['offer','under_contract','completed']}]} submit={(u,d)=>createSale(u,d as never)}/>}
  {tab==='Ledger'&&<AdminSection label="Ledger entry" load={listAllLedger} cols={C.led} empty="No ledger entries yet." fields={[{key:'type',label:'Type',options:['credit','debit']},{key:'amount',label:'Amount',type:'number'},{key:'description',label:'Description'}]} submit={(u,d)=>createLedgerEntry(u,d as never)}/>}
  {tab==='Milestones'&&<AdminSection label="Milestone" load={listAllMilestones} cols={C.mil} empty="No milestones yet." fields={[{key:'title',label:'Title'},{key:'dueDate',label:'Due date',type:'date'},{key:'status',label:'Status',options:['upcoming','in_progress','done']}]} submit={(u,d)=>createMilestone(u,d as never)}/>}
  {tab==='Audit log'&&<RowsTable load={listAudit} cols={[{key:'userId',label:'By'},{key:'action',label:'Action'},{key:'targetUserId',label:'For user'},{key:'details',label:'Details'}]} empty="Admin actions will be logged here."/>}
 </>}
 </div></main>}
