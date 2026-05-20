import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { webhookUrl } = await req.json();

    if (!webhookUrl || (!webhookUrl.startsWith("http://") && !webhookUrl.startsWith("https://"))) {
      return NextResponse.json({ error: "Invalid Webhook URL. Must begin with http:// or https://" }, { status: 400 });
    }

    const testPayload = {
      event: "test_connection",
      message: "Automixa Webhook connected successfully!",
      timestamp: new Date().toISOString(),
      test_data: {
        lead_name: "John Doe (Test)",
        instagram_username: "automixa_test_user",
        delivered_link: "https://automixa.com/test-access"
      }
    };

    console.log(`🔗 [Webhook Test] Sending payload to ${webhookUrl}`);

    // Create an AbortController to enforce a 6-second timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    let response;
    try {
      response = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(testPayload),
        signal: controller.signal
      });
    } catch (fetchErr) {
      if (fetchErr.name === "AbortError") {
        return NextResponse.json({ error: "Connection timed out after 6 seconds. Ensure your endpoint responds quickly." }, { status: 504 });
      }
      throw fetchErr;
    } finally {
      clearTimeout(timeoutId);
    }

    if (!response.ok) {
      console.warn(`⚠️ [Webhook Test] Target returned status ${response.status}`);
      return NextResponse.json({ 
        error: `Target endpoint returned status code: ${response.status}. Please check your webhook config.` 
      }, { status: response.status });
    }

    console.log(`✅ [Webhook Test] Delivery confirmed! Status: ${response.status}`);
    return NextResponse.json({ success: true, status: response.status });

  } catch (error) {
    console.error("🔥 [Webhook Test] Unexpected failure:", error.message);
    return NextResponse.json({ error: error.message || "Failed to reach target server." }, { status: 500 });
  }
}
