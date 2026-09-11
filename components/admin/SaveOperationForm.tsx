"use client";
import { useActionState, type ReactNode } from "react";
export default function SaveOperationForm({action,children,className}:{action:(form:FormData)=>Promise<void>;children:ReactNode;className?:string}) {
  const [result,save,pending]=useActionState(async (_state:{error:string;saved:boolean},form:FormData)=>{
    try {await action(form);return {error:"",saved:true};}
    catch(e){return {error:(e as Error).message||"Unable to save. Please try again.",saved:false};}
  },{error:"",saved:false});
  return <form action={save} className={className}><fieldset disabled={pending} className="contents">{children}</fieldset>{pending&&<p role="status" className="col-span-full text-xs mt-2">Saving…</p>}{result.error&&<p role="alert" className="col-span-full text-xs text-red-700 mt-2">{result.error}</p>}{!pending&&result.saved&&<p role="status" className="col-span-full text-xs text-green-700 mt-2">Changes saved.</p>}</form>;
}
