import { pathToFileURL } from "node:url";

// UTC is explicit: nightly at 00:30 Africa/Johannesburg; read-only verification
// each Monday at 01:00. No host timezone dependency or additional packages.
export function dueTasks(now, lastSyncDay, lastVerificationDay) {
  const day = now.toISOString().slice(0, 10);
  const minutes = now.getUTCHours() * 60 + now.getUTCMinutes();
  return {
    day,
    sync: minutes >= 22 * 60 + 30 && lastSyncDay !== day,
    verify: now.getUTCDay() === 0 && minutes >= 23 * 60 && lastVerificationDay !== day,
  };
}

export async function requestSync(method, env = process.env, fetcher = fetch) {
  if (!env.VACANCY_SYNC_SECRET) throw new Error("VACANCY_SYNC_SECRET is not configured");
  const response = await fetcher("http://web:3000/api/cron/sync-vacancies", {
    method,
    headers: { "x-cron-secret": env.VACANCY_SYNC_SECRET },
    signal: AbortSignal.timeout(320000),
  });
  const result = await response.json();
  if (!response.ok || result.error || (method === "GET" && !result.healthy)) {
    // Do not log response bodies: provider or database errors may be sensitive.
    throw new Error(`Vacancy ${method === "GET" ? "verification" : "sync"} failed (HTTP ${response.status})`);
  }
  return result;
}

export async function runScheduler() {
  let lastSyncDay = "";
  let lastVerificationDay = "";
  let startup = true;
  for (;;) {
    try {
      const due = dueTasks(new Date(), lastSyncDay, lastVerificationDay);
      let catchUp = false;
      if (startup) {
        try { await requestSync("GET"); } catch { catchUp = true; }
        startup = false;
      }
      if (due.sync || catchUp) {
        await requestSync("POST");
        // An early catch-up must not suppress tonight's scheduled run.
        if (due.sync) lastSyncDay = due.day;
        console.log("Vacancy reconciliation succeeded");
      }
      if (due.verify) {
        await requestSync("GET");
        lastVerificationDay = due.day;
        console.log("Weekly vacancy verification succeeded");
      }
    } catch (error) {
      console.error(error.message);
      // Retry failed work after five minutes; never overlap calls.
      await new Promise(resolve => setTimeout(resolve, 240000));
      startup = true;
    }
    await new Promise(resolve => setTimeout(resolve, 60000));
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) await runScheduler();
