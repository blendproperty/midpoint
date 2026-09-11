import { Prisma } from "@prisma/client";
export const reservationStatuses = ["PENDING","CONFIRMED","CHECKED_IN","CHECKED_OUT","CANCELLED","NO_SHOW"] as const;
export const housekeepingStates = ["UNASSESSED","DIRTY","CLEAN","INSPECTED"] as const;
export function bookingFilters(q: Record<string,string|undefined>, today: Date): Prisma.ReservationWhereInput {
  const tomorrow = new Date(+today+86400000);
  const where: Prisma.ReservationWhereInput = {isTest:true};
  const term=(q.q||"").trim().slice(0,120);
  if(term) where.OR=["bookingReference","guestFirstName","guestLastName","guestEmail","company"].map(field=>({[field]:{contains:term,mode:"insensitive"}}));
  if(reservationStatuses.includes(q.status as typeof reservationStatuses[number])) where.status=q.status as typeof reservationStatuses[number];
  if(["UNPAID","PAID","PARTIALLY_PAID","REFUNDED"].includes(q.payment||"")) where.paymentStatus=q.payment as Prisma.EnumPaymentStatusFilter["equals"];
  if(q.view==="arrivals"){where.checkIn={gte:today,lt:tomorrow};where.status="CONFIRMED";}
  if(q.view==="departures"){where.checkOut={gte:today,lt:tomorrow};where.status="CHECKED_IN";}
  if(q.view==="inhouse") where.status="CHECKED_IN";
  if(q.view==="cancellations"){where.cancellationRequested=true;where.status={in:["CONFIRMED","PENDING"]};}
  if(q.view==="unpaid"){where.paymentStatus="UNPAID";where.status={in:["CONFIRMED","CHECKED_IN","CHECKED_OUT"]};}
  return where;
}
export function pageNumber(value?:string) {const n=Number(value);return Number.isInteger(n)&&n>0?Math.min(n,100000):1;}
export function shortDate(value:Date) {return value.toLocaleDateString("en-ZA",{day:"numeric",month:"short",timeZone:"UTC"});}
export function validateHousekeeping(state: string,note:string) {
  if(!housekeepingStates.includes(state as typeof housekeepingStates[number])) throw new Error("Choose a valid readiness state.");
  if(note.trim().length>1000) throw new Error("Keep the handover note under 1,000 characters.");
  return {housekeeping:state,housekeepingNote:note.trim()||null};
}
