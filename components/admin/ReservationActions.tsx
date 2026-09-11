"use client";
import { useFormStatus } from "react-dom";
function Actions({status,payment}:{status:string;payment:string}){
  const {pending}=useFormStatus();
  const actions=[
    {value:"checkin",label:"Check in",valid:status==="CONFIRMED"},
    {value:"checkout",label:"Check out",valid:status==="CHECKED_IN"},
    {value:"cancel",label:"Cancel reservation",valid:["PENDING","CONFIRMED"].includes(status)},
    {value:"noshow",label:"Mark no-show",valid:status==="CONFIRMED"},
    {value:"settle",label:"Settle test balance",valid:payment==="UNPAID"&&["CONFIRMED","CHECKED_IN","CHECKED_OUT"].includes(status)},
  ].filter(a=>a.valid);
  return <>{actions.map(a=><button key={a.value} name="action" value={a.value} disabled={pending} className="ops-button secondary" onClick={e=>{if(["cancel","noshow","settle"].includes(a.value)&&!window.confirm(a.value==="cancel"?"Cancel this test reservation and release its room? Any refund is simulated; no money moves.":a.value==="noshow"?"Mark this test guest as a no-show?":"Mark this simulated balance paid? This does not collect money."))e.preventDefault();}}>{pending?"Updating…":a.label}</button>)}{!actions.length&&<p className="text-xs text-stone-500">This reservation has no further status actions.</p>}</>;
}
export default function ReservationActions({action,status,payment}:{action:(form:FormData)=>Promise<void>;status:string;payment:string}){return <form action={action} className="ops-form-actions mt-6"><Actions status={status} payment={payment}/></form>;}
