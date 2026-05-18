import { NextResponse } from 'next/server';
import { sendInviteEmail } from '@/lib/resend';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, workspaceName, invitedByEmail } = body;

    if (!email) {
      return NextResponse.json({ error: "Recipient email is required" }, { status: 400 });
    }

    console.log("Resend API: Sending workspace invite email to", email);

    // Verify if API Key exists
    if (!process.env.RESEND_API_KEY) {
      console.warn("Resend API Key is missing in environment variables. Email simulation completed.");
      return NextResponse.json({ success: true, simulated: true });
    }

    const data = await sendInviteEmail({
      email,
      workspaceName: workspaceName || 'a Workspace',
      invitedByEmail: invitedByEmail || 'Someone'
    });

    if (!data) {
      return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Resend API Invite sending failed:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
