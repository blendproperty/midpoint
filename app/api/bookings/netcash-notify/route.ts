import { NextRequest, NextResponse } from "next/server";

// Netcash's Pay Now – eCommerce product POSTs transaction results here
// after a payment attempt. This is a stub: it does not verify Netcash's
// signature, does not confirm any Booking, and always 501s unless
// NETCASH_SERVICE_KEY is configured (which it currently is not anywhere).
//
// TODO before this can go live:
//  - Verify the request against Netcash's documented signature scheme
//    using NETCASH_SERVICE_KEY (an ISV Agreement / Software Vendor Key
//    may be required for a custom, non-plugin integration — confirm with
//    Netcash before building this out further).
//  - Look up the Booking by the paymentRef Netcash echoes back.
//  - Call lib/bookings.confirmBooking() only after signature + amount
//    verification both pass.
//  - Return the exact response format Netcash expects to acknowledge
//    receipt (check their current API docs — this varies by product).
export async function POST(_req: NextRequest) {
  if (!process.env.NETCASH_SERVICE_KEY) {
    return NextResponse.json(
      { error: "Netcash integration is not configured." },
      { status: 501 }
    );
  }

  return NextResponse.json(
    { error: "Netcash signature verification not implemented yet." },
    { status: 501 }
  );
}
