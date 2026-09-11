import { prisma } from "@/lib/prisma";
import { lock, reserve, type BookingInput } from "@/lib/stay-service";
import { validateHousekeeping } from "@/lib/suites-operations";
export async function setRoomReadiness(id:string,state:string,note:string,actor:string) {
  const data=validateHousekeeping(state,note);
  return prisma.$transaction(async db=>{
    await lock(db);
    await db.room.update({where:{id},data:{...data,housekeepingBy:actor,housekeepingAt:new Date()}});
    await db.bookingAudit.create({data:{actor,action:"Room readiness: "+state.toLowerCase(),target:id}});
  });
}
export async function addStaffNote(id:string,body:string,actor:string) {
  const note=body.trim();
  if(!note || note.length>2000) throw new Error("Enter a staff note of 1–2,000 characters.");
  return prisma.$transaction(async db=>{
    const r=await db.reservation.findFirst({where:{id,isTest:true}});
    if(!r) throw new Error("Test reservation not found.");
    await db.bookingNote.create({data:{reservationId:id,body:note,actor}});
    await db.bookingAudit.create({data:{actor,action:"Added internal staff note",target:id}});
  });
}
export async function createStaffReservation(input:BookingInput,actor:string) {
  // Stable, unexposed token makes repeated authenticated submissions idempotent.
  const held=await reserve(input,"staff:"+actor+":"+input.idempotencyKey);
  return prisma.$transaction(async db=>{
    await lock(db);
    const r=await db.reservation.findUniqueOrThrow({where:{id:held.id}});
    if(r.status==="CONFIRMED") return r;
    if(r.status!=="PENDING" || (r.expiresAt && r.expiresAt<new Date())) throw new Error("The test hold expired. Start a new reservation.");
    const updated=await db.reservation.update({where:{id:r.id},data:{status:"CONFIRMED",expiresAt:null,paymentStatus:"UNPAID",source:"staff-test"}});
    await db.bookingMessage.create({data:{reservationId:r.id,subject:"Staff test reservation — "+r.bookingReference,body:"THE SUITES AT MIDPOINT\n\nTest reservation "+r.bookingReference+" created by staff. Payment is unpaid. No real stay, email or charge has been made."}});
    await db.bookingAudit.create({data:{actor,action:"Created staff test reservation",target:r.id}});
    return updated;
  });
}
