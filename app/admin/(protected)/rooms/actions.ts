"use server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { revalidatePath } from "next/cache";

export async function updateRoom(id:string, formData:FormData){
  await requireAdmin();
  const status=String(formData.get("status")||"BLOCKED") as "AVAILABLE"|"OCCUPIED"|"OUT_OF_SERVICE"|"MAINTENANCE"|"BLOCKED";
  const categoryId=String(formData.get("categoryId")||"")||null;
  await prisma.room.update({where:{id},data:{roomNumber:String(formData.get("roomNumber")||"").trim(),floor:String(formData.get("floor")||"").trim()||null,categoryId,status,active:formData.get("active")==="on",notes:String(formData.get("notes")||"").trim()||null}});
  revalidatePath("/admin/rooms"); revalidatePath("/stay");
}

export async function updateCategory(id:string, formData:FormData){
  await requireAdmin();
  const raw=String(formData.get("baseRate")||"").trim(); const max=String(formData.get("maxGuests")||"").trim();
  await prisma.roomCategory.update({where:{id},data:{baseRate:raw?Number(raw):null,maxGuests:max?Number(max):null,active:formData.get("active")==="on"}});
  revalidatePath("/admin/rooms"); revalidatePath("/stay");
}
