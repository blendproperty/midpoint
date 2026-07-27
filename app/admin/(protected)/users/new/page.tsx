import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { createUser } from "../actions";

export default async function NewUserPage() {
  const session = await getSession();
  if (!session || session.role !== "SUPER_ADMIN") redirect("/admin");

  return (
    <div>
      <h1 className="text-2xl font-semibold">New user</h1>
      <form action={createUser} className="mt-6 max-w-md space-y-5 rounded-xl bg-white p-6 shadow-sm">
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input type="email" name="email" required className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium">Name</label>
          <input name="name" className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium">Temporary password (min. 8 characters)</label>
          <input type="password" name="password" required minLength={8} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium">Role</label>
          <select name="role" defaultValue="EDITOR" className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm">
            <option value="EDITOR">Editor</option>
            <option value="SUPER_ADMIN">Super admin</option>
          </select>
        </div>
        <button type="submit" className="rounded-full bg-midpoint-dark px-5 py-2.5 text-sm font-semibold text-white">
          Create user
        </button>
      </form>
    </div>
  );
}
