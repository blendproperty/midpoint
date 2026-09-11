"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Logo from "@/components/Logo";
import { ArrowRight, LockKeyhole } from "lucide-react";
export default function AdminLoginPage(){
  const router=useRouter(),[email,setEmail]=useState(""),[password,setPassword]=useState(""),[error,setError]=useState<string|null>(null),[loading,setLoading]=useState(false);
  async function handleSubmit(e:React.FormEvent){
    e.preventDefault();setLoading(true);setError(null);
    try{
      const res=await fetch("/api/admin/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email,password})});
      if(!res.ok){const data=await res.json().catch(()=>({}));setError(data.error||"Unable to sign in. Check your details.");return;}
      router.push("/admin");router.refresh();
    }catch{setError("We couldn't reach the server. Please try again.");}
    finally{setLoading(false);}
  }
  return <div className="min-h-screen grid lg:grid-cols-2 bg-[#f6f7f2] text-[#253d31]">
    <aside className="relative hidden lg:flex flex-col justify-between p-14 overflow-hidden bg-[#173c32]">
      <img src="/images/suites/suite-bedroom-workspace.png" alt="" className="absolute inset-0 h-full w-full object-cover opacity-40"/>
      <div className="absolute inset-0 bg-gradient-to-t from-[#103229] via-[#163a3280] to-[#12362e70]"/>
      <div className="relative"><Logo className="h-9 w-auto"/></div>
      <div className="relative max-w-md text-white"><p className="text-[10px] tracking-[.24em] text-[#d8e6c5] mb-5">THE SUITES AT MIDPOINT</p><h2 className="text-5xl font-medium leading-tight tracking-tight">Considered stays.<br/>Thoughtful operations.</h2><p className="text-sm leading-7 text-white/65 mt-6">Your staff workspace for reservations, room readiness and the details that make every stay feel effortless.</p></div>
      <p className="relative text-[10px] tracking-widest text-white/50">MIDPOINT · MIDRAND</p>
    </aside>
    <main className="flex items-center justify-center px-7 py-12"><div className="w-full max-w-sm"><span className="inline-flex bg-[#e8eee0] p-3 rounded-xl mb-7"><LockKeyhole size={23}/></span><p className="text-[10px] font-semibold tracking-[.2em] text-[#7b886b] mb-3">STAFF ACCESS</p><h1 className="text-3xl font-semibold tracking-tight">Welcome back.</h1><p className="mt-3 text-sm leading-6 text-[#7d8875]">Sign in to the Midpoint administration workspace.</p><form onSubmit={handleSubmit} className="mt-8 space-y-5"><label className="block text-xs font-medium">Email address<input type="email" required autoComplete="username" value={email} onChange={e=>setEmail(e.target.value)} className="mt-2 w-full rounded-lg border border-[#dce3d5] bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#9db789]" placeholder="you@company.co.za"/></label><label className="block text-xs font-medium">Password<input type="password" required autoComplete="current-password" value={password} onChange={e=>setPassword(e.target.value)} className="mt-2 w-full rounded-lg border border-[#dce3d5] bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#9db789]"/></label>{error&&<p role="alert" className="text-xs leading-6 text-red-700 rounded-lg bg-red-50 p-3">{error}</p>}<button type="submit" disabled={loading} className="w-full rounded-lg bg-[#244c38] px-5 py-3.5 text-xs font-semibold text-white disabled:opacity-50 flex justify-center items-center gap-3">{loading?"Signing in…":"Sign in to workspace"}<ArrowRight size={16}/></button></form><div className="mt-6 flex justify-between text-xs text-[#78846e]"><Link href="/admin/forgot-password" className="underline underline-offset-4">Forgot password?</Link><Link href="/" className="underline underline-offset-4">Back to website</Link></div><p className="text-[10px] text-[#929b88] leading-6 mt-10 border-t border-[#e0e6d8] pt-5">Authorised staff only. Use your existing Midpoint admin account. Contact your administrator if you need access.</p></div></main>
  </div>;
}
