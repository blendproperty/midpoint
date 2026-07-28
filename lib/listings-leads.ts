// Forwards Midpoint's own contact-form enquiries out to
// listings.blendproperty.co.za's lead intake, so someone who enquires on
// mid-point.co.za also shows up in the group-wide leads system — not just
// in Midpoint's own Contacts table. This is the outbound half of the same
// integration app/api/leads/route.ts is the inbound half of: that route
// already accepts { email, firstName?, lastName?, phone?, source?,
// interest?, message? } over POST with an `x-api-key` header from other
// Blend sites, so this uses the identical shape in the other direction.
//
// Configure with LISTINGS_LEADS_URL (the endpoint on that site, e.g.
// https://listings.blendproperty.co.za/api/leads) and
// LISTINGS_LEADS_API_KEY (a shared secret provided by whoever maintains
// that site — not the same value as this site's own LEADS_API_KEY, which
// is for the reverse direction). Both env vars are optional: if either is
// missing, this is a no-op, and any failure here is swallowed so a hiccup
// on that side never blocks or breaks a visitor's enquiry submission here.
export async function pushLeadToListings(payload: {
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  phone?: string | null;
  interest?: string | null;
  message?: string | null;
}): Promise<void> {
  const url = process.env.LISTINGS_LEADS_URL;
  const apiKey = process.env.LISTINGS_LEADS_API_KEY;
  if (!url || !apiKey) return;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": apiKey },
      body: JSON.stringify({
        email: payload.email,
        firstName: payload.firstName || undefined,
        lastName: payload.lastName || undefined,
        phone: payload.phone || undefined,
        source: "mid-point.co.za",
        interest: payload.interest || undefined,
        message: payload.message || undefined,
      }),
    });
    if (!res.ok) {
      console.error(`Lead push to listings.blendproperty.co.za returned ${res.status}`);
    }
  } catch (err) {
    console.error("Failed to push lead to listings.blendproperty.co.za", err);
  }
}
