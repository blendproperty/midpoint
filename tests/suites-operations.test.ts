import { describe, expect, it, afterAll } from "vitest";
import { randomUUID } from "node:crypto";
import { prisma } from "@/lib/prisma";
import { bookingFilters, pageNumber, validateHousekeeping } from "@/lib/suites-operations";
import { addStaffNote, createStaffReservation, setRoomReadiness } from "@/lib/suites-staff";
import { validateInput } from "@/lib/stay-service";
import { changeReservation } from "@/lib/stay-admin";
describe("Suites operations filters",()=>{
  const today=new Date("2028-01-01T00:00:00Z");
  it("always scopes booking queries to test records",()=>{
    expect(bookingFilters({q:"Guest",status:"CONFIRMED"},today)).toMatchObject({isTest:true,status:"CONFIRMED"});
    expect(bookingFilters({view:"cancellations"},today)).toMatchObject({isTest:true,cancellationRequested:true,status:{in:["CONFIRMED","PENDING"]}});
  });
  it("uses operational statuses for arrivals, departures and unpaid balances",()=>{
    expect(bookingFilters({view:"arrivals"},today)).toMatchObject({status:"CONFIRMED",checkIn:{gte:today,lt:new Date("2028-01-02T00:00:00Z")}});
    expect(bookingFilters({view:"departures"},today)).toMatchObject({status:"CHECKED_IN"});
    expect(bookingFilters({view:"unpaid"},today)).toMatchObject({paymentStatus:"UNPAID"});
    expect(bookingFilters({status:"invalid",payment:"invalid"},today)).toEqual({isTest:true});
  });
  it("validates pagination and readiness without approving a room by default",()=>{
    expect(pageNumber("-1")).toBe(1);expect(pageNumber("2.5")).toBe(1);expect(pageNumber("3")).toBe(3);
    expect(validateHousekeeping("INSPECTED"," checked ")).toEqual({housekeeping:"INSPECTED",housekeepingNote:"checked"});
    expect(()=>validateHousekeeping("UNKNOWN","")).toThrow();
    expect(()=>validateHousekeeping("CLEAN","x".repeat(1001))).toThrow();
  });
});
describe.skipIf(process.env.BOOKING_INTEGRATION!=="1")("staff operations against PostgreSQL",()=>{
  let category="",room="",reservation="";
  afterAll(async()=>{
    if(category){
      await prisma.bookingAudit.deleteMany({where:{target:{in:[room,reservation]}}});
      await prisma.reservation.deleteMany({where:{categoryId:category}});
      await prisma.room.deleteMany({where:{categoryId:category}});
      await prisma.roomCategory.delete({where:{id:category}});
    }
    await prisma.$disconnect();
  });
  it("creates one unpaid staff booking, saves private notes and tracks room handovers",async()=>{
    if(!process.env.DATABASE_URL?.includes("localhost:55439/midpoint_booking_test")) throw new Error("Disposable test database required");
    const tag="ops-"+randomUUID();
    const c=await prisma.roomCategory.create({data:{name:tag,code:tag,slug:tag,description:"Test",baseRate:1150,maxGuests:2,active:true,images:[],amenities:[]}});category=c.id;
    const rm=await prisma.room.create({data:{roomNumber:tag,categoryId:category,active:true,status:"AVAILABLE"}});room=rm.id;
    expect(rm.housekeeping).toBe("UNASSESSED");
    const input=validateInput({categoryId:category,checkIn:"2028-06-01",checkOut:"2028-06-03",guests:1,extras:[],firstName:"Operations",lastName:"Tester",email:"ops@example.test",mobile:"+27000000000",country:"South Africa",consent:true,idempotencyKey:randomUUID()});
    const a=await createStaffReservation(input,"staff@example.test");reservation=a.id;
    const b=await createStaffReservation(input,"staff@example.test");
    expect(b.id).toBe(a.id);expect(a.paymentStatus).toBe("UNPAID");expect(a.status).toBe("CONFIRMED");expect(a.isTest).toBe(true);expect(a.expiresAt).toBeNull();
    expect(await prisma.bookingMessage.count({where:{reservationId:a.id}})).toBe(1);
    await expect(createStaffReservation(input,"different@example.test")).rejects.toThrow("already used");
    await addStaffNote(a.id,"Please check arrival time.","staff@example.test");
    expect(await prisma.bookingNote.count({where:{reservationId:a.id}})).toBe(1);
    await expect(addStaffNote(a.id," ","staff@example.test")).rejects.toThrow();
    await expect(addStaffNote("missing","test","staff@example.test")).rejects.toThrow();
    await setRoomReadiness(room,"INSPECTED","Ready for test arrival","staff@example.test");
    expect((await prisma.room.findUniqueOrThrow({where:{id:room}})).housekeeping).toBe("INSPECTED");
    await changeReservation(a.id,"checkin","staff@example.test");
    await changeReservation(a.id,"checkout","staff@example.test");
    expect((await prisma.room.findUniqueOrThrow({where:{id:room}})).housekeeping).toBe("DIRTY");
    expect(await prisma.bookingAudit.count({where:{target:room}})).toBeGreaterThan(0);
  },30000);
});
