"use server";
import { requireAdmin } from "@/lib/require-admin";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { addStaffNote, createStaffReservation, setRoomReadiness } from "@/lib/suites-staff";
import { validateInput } from "@/lib/stay-service";
export async function saveReadiness(id:string,form:FormData) {
  const session=await requireAdmin();
  let error="";
  try {await setRoomReadiness(id,String(form.get("state")),String(form.get("note")||""),session.email);}
  catch(e){error=(e as Error).message;}
  revalidatePath("/admin/housekeeping");revalidatePath("/admin/suites");
  redirect("/admin/housekeeping?"+(error?"error="+encodeURIComponent(error):"saved=1"));
}
export async function saveNote(id:string,form:FormData) {
  const session=await requireAdmin();
  let error="";
  try{await addStaffNote(id,String(form.get("body")||""),session.email);}
  catch(e){error=(e as Error).message;}
  revalidatePath("/admin/bookings/"+id);revalidatePath("/admin/suites");
  redirect("/admin/bookings/"+id+"?"+(error?"error="+encodeURIComponent(error):"saved=1"));
}
export async function createBooking(_previous:{error:string},form:FormData):Promise<{error:string}> {
  const session=await requireAdmin();
  let id="";
  try{
    const raw=Object.fromEntries(form.entries());
    const input=validateInput({...raw,extras:[],consent:form.get("consent")==="on",guests:Number(form.get("guests")),guestFirstName:raw.firstName,guestLastName:raw.lastName});
    const booking=await createStaffReservation(input,session.email);id=booking.id;
  }catch(e){return {error:(e as Error).message};}
  revalidatePath("/admin/suites");revalidatePath("/admin/bookings");revalidatePath("/admin/calendar");
  redirect("/admin/bookings/"+id+"?saved=1");
}
