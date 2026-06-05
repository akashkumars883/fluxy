import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// Helper function exported to allow dynamic real-time rendering in preview route
export function getInvoiceHtml({ name, planName, amount, invoiceId }) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet">
        <style>
          body, table, td, div, p, a, span {
            font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
          }
          h1, h2 {
            font-family: 'Space Grotesk', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
          }
        </style>
      </head>
      <body style="margin: 0; padding: 0; background-color: #fafafa;">
        <!-- Hidden Preheader (Inbox Snippet Summary) -->
        <div style="display: none; max-height: 0px; overflow: hidden; font-size: 0px; line-height: 0px; opacity: 0; mso-hide: all; color: #fafafa;">
          Your payment of ${amount} was successful. Here is your transaction invoice receipt from Automixa.
        </div>
        <div style="font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 40px 20px; color: #18181b; max-width: 580px; margin: 0 auto; background: #fafafa; border-radius: 24px; border: 1px solid #e4e4e7; margin-top: 20px; margin-bottom: 20px;">
      
      <!-- Header -->
      <div style="text-align: center; margin-bottom: 32px;">
        <h1 style="color: #09090b; font-size: 36px; font-weight: 600; margin: 0; letter-spacing: -2px; line-height: 1;">Automixa</h1>
        <p style="color: #71717a; font-size: 11px; font-weight: 500; margin: 8px 0 0 0; text-transform: lowercase; letter-spacing: -0.2px;">conversations that convert, automatically</p>
      </div>

      <!-- Main Content Card -->
      <div style="background: #ffffff; padding: 36px; border-radius: 20px; border: 1px solid #e4e4e7; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.02), 0 4px 6px -4px rgba(0, 0, 0, 0.02);">
        
        <div style="text-align: center; margin-bottom: 24px;">
          <span style="background: #f4f4f5; border: 1px solid #e4e4e7; color: #3f3f46; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; padding: 6px 12px; border-radius: 9999px;">
            Payment Successful
          </span>
        </div>

        <h2 style="font-size: 22px; font-weight: 800; color: #09090b; margin-top: 0; margin-bottom: 12px; text-align: center; letter-spacing: -0.5px;">Thank you for your purchase!</h2>
        
        <p style="font-size: 14px; line-height: 1.6; color: #52525b; margin: 0 0 24px 0; text-align: center;">
          Hi ${name || 'Customer'}, your subscription to <strong>${planName || 'Plan'}</strong> is now fully active. Your billing transaction details are listed below:
        </p>

        <!-- Invoice Box -->
        <div style="background: #fafafa; border: 1px solid #e4e4e7; border-radius: 14px; padding: 20px; margin-bottom: 24px;">
          <div style="margin-bottom: 12px; border-bottom: 1px solid #f4f4f5; padding-bottom: 8px; display: flex; justify-content: space-between;">
            <span style="font-size: 12px; color: #71717a;">Invoice ID:</span>
            <span style="font-size: 12px; font-weight: 700; color: #09090b;">${invoiceId || 'INV-000000'}</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span style="font-size: 12px; color: #71717a;">Amount Paid:</span>
            <span style="font-size: 12px; font-weight: 700; color: #09090b;">${amount || 'INR 0'}</span>
          </div>
        </div>

        <!-- Call to Action -->
        <div style="text-align: center; margin-bottom: 12px;">
          <a href="https://automixa.in/dashboard" style="background: #6366F1; color: #ffffff; padding: 14px 36px; border-radius: 14px; font-size: 13px; font-weight: 700; text-decoration: none; display: inline-block; border: 1px solid #6366F1; box-shadow: 0 4px 14px rgba(99, 102, 241, 0.3);">
            Go to Dashboard
          </a>
        </div>

      </div>

      <!-- Footer Branding & Socials -->
      <div style="text-align: center; margin-top: 36px; border-top: 1px solid #e4e4e7; padding-top: 24px;">
        
        <!-- Social Links -->
        <div style="margin-bottom: 16px;">
          <a href="https://instagram.com/automixa.in" target="_blank" style="margin: 0 8px; text-decoration: none; color: #71717a; font-size: 12px; font-weight: 600;">Instagram</a>
          <span style="color: #d4d4d8;">•</span>
          <a href="https://x.com/automixa_in" target="_blank" style="margin: 0 8px; text-decoration: none; color: #71717a; font-size: 12px; font-weight: 600;">Twitter</a>
          <span style="color: #d4d4d8;">•</span>
          <a href="https://automixa.in" target="_blank" style="margin: 0 8px; text-decoration: none; color: #71717a; font-size: 12px; font-weight: 600;">Website</a>
        </div>
        
        <!-- Legal & Copyright -->
        <p style="font-size: 11px; color: #a1a1aa; margin: 0 0 6px 0; line-height: 1.6;">
          © 2026 Automixa | Akash Enterprises. All rights reserved.
        </p>
        <p style="font-size: 10px; color: #a1a1aa; margin: 0; line-height: 1.6;">
          Delivered securely by Automixa. For support, contact <a href="mailto:info@automixa.in" style="color: #6366F1; text-decoration: none; font-weight: 500;">info@automixa.in</a>
        </p>

      </div>
      </div>
      </body>
    </html>
  `;
}

export const sendInvoiceEmail = async ({ email, name, planName, amount, invoiceId }) => {
  try {
    const data = await resend.emails.send({
      from: 'automixa <billing@automixa.in>',
      to: [email],
      subject: `Your Invoice from automixa - ${invoiceId}`,
      html: getInvoiceHtml({ name, planName, amount, invoiceId }),
    });
    return data;
  } catch (error) {
    console.error("Failed to send email:", error);
    return null;
  }
};

export function getInviteHtml(invitedByEmail, workspaceName, email) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet">
        <style>
          body, table, td, div, p, a, span {
            font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
          }
          h1, h2 {
            font-family: 'Space Grotesk', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
          }
        </style>
      </head>
      <body style="margin: 0; padding: 0; background-color: #fafafa;">
        <!-- Hidden Preheader (Inbox Snippet Summary) -->
        <div style="display: none; max-height: 0px; overflow: hidden; font-size: 0px; line-height: 0px; opacity: 0; mso-hide: all; color: #fafafa;">
          Collaborate on smart Instagram automation workflows together on Automixa.
        </div>
        <div style="font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 40px 20px; color: #18181b; max-width: 580px; margin: 0 auto; background: #fafafa; border-radius: 24px; border: 1px solid #e4e4e7; margin-top: 20px; margin-bottom: 20px;">
      
      <!-- Header -->
      <div style="text-align: center; margin-bottom: 32px;">
        <h1 style="color: #09090b; font-size: 36px; font-weight: 600; margin: 0; letter-spacing: -2px; line-height: 1;">Automixa</h1>
        <p style="color: #71717a; font-size: 11px; font-weight: 500; margin: 8px 0 0 0; text-transform: lowercase; letter-spacing: -0.2px;">conversations that convert, automatically</p>
      </div>

      <!-- Main Content Card -->
      <div style="background: #ffffff; padding: 36px; border-radius: 20px; border: 1px solid #e4e4e7; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.02), 0 4px 6px -4px rgba(0, 0, 0, 0.02);">
        
        <div style="text-align: center; margin-bottom: 24px;">
          <span style="background: #f4f4f5; border: 1px solid #e4e4e7; color: #3f3f46; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; padding: 6px 12px; border-radius: 9999px;">
            Workspace Invitation
          </span>
        </div>

        <h2 style="font-size: 22px; font-weight: 800; color: #09090b; margin-top: 0; margin-bottom: 12px; text-align: center; letter-spacing: -0.5px;">You've been invited!</h2>
        
        <p style="font-size: 14px; line-height: 1.6; color: #52525b; margin: 0 0 20px 0; text-align: center;">
          <strong>${invitedByEmail}</strong> has invited you to join and collaborate on their workspace <strong>"${workspaceName}"</strong> on automixa.
        </p>

        <!-- Feature Badges Section -->
        <div style="background: #fafafa; border: 1px solid #f4f4f5; border-radius: 12px; padding: 16px; margin-bottom: 28px; text-align: center;">
          <div style="display: inline-block; margin: 0 8px; font-size: 11px; font-weight: 700; color: #71717a;">⚡ Studio</div>
          <div style="display: inline-block; margin: 0 8px; font-size: 11px; font-weight: 700; color: #71717a;">💬 Sandbox</div>
          <div style="display: inline-block; margin: 0 8px; font-size: 11px; font-weight: 700; color: #71717a;">📊 Analytics</div>
        </div>

        <!-- Call to Action -->
        <div style="text-align: center; margin-bottom: 28px;">
          <a href="https://automixa.in/dashboard" style="background: #6366F1; color: #ffffff; padding: 14px 36px; border-radius: 14px; font-size: 13px; font-weight: 700; text-decoration: none; display: inline-block; transition: all 0.2s ease; border: 1px solid #6366F1; box-shadow: 0 4px 14px rgba(99, 102, 241, 0.3);">
            Accept Invite & Go to Dashboard
          </a>
        </div>

        <!-- Bottom Disclaimer -->
        <p style="font-size: 11px; color: #a1a1aa; text-align: center; margin: 0; line-height: 1.5; padding: 0 10px;">
          If you don't have an automixa account yet, simply sign up using <strong>${email}</strong>. The workspace will be automatically linked to your account upon registration.
        </p>

      </div>

      <!-- Footer Branding & Socials -->
      <div style="text-align: center; margin-top: 36px; border-top: 1px solid #e4e4e7; padding-top: 24px;">
        
        <!-- Social Links -->
        <div style="margin-bottom: 16px;">
          <a href="https://instagram.com/automixa.in" target="_blank" style="margin: 0 8px; text-decoration: none; color: #71717a; font-size: 12px; font-weight: 600;">Instagram</a>
          <span style="color: #d4d4d8;">•</span>
          <a href="https://x.com/automixa_in" target="_blank" style="margin: 0 8px; text-decoration: none; color: #71717a; font-size: 12px; font-weight: 600;">Twitter</a>
          <span style="color: #d4d4d8;">•</span>
          <a href="https://automixa.in" target="_blank" style="margin: 0 8px; text-decoration: none; color: #71717a; font-size: 12px; font-weight: 600;">Website</a>
        </div>
        
        <!-- Legal & Copyright -->
        <p style="font-size: 11px; color: #a1a1aa; margin: 0 0 6px 0; line-height: 1.6;">
          © 2026 Automixa | Akash Enterprises. All rights reserved.
        </p>
        <p style="font-size: 10px; color: #a1a1aa; margin: 0; line-height: 1.6;">
          Delivered securely by Automixa. For support, contact <a href="mailto:info@automixa.in" style="color: #6366F1; text-decoration: none; font-weight: 500;">info@automixa.in</a>
        </p>

      </div>
      </div>
      </body>
    </html>
  `;
}

export const sendInviteEmail = async ({ email, workspaceName, invitedByEmail }) => {
  try {
    const data = await resend.emails.send({
      from: 'automixa <invite@automixa.in>',
      to: [email],
      subject: `Invitation to collaborate on "${workspaceName}" on automixa`,
      html: getInviteHtml(invitedByEmail || 'Someone', workspaceName || 'a Workspace', email || 'collaborator@email.com'),
    });
    return data;
  } catch (error) {
    console.error("Failed to send invite email:", error);
    return null;
  }
};

export function getLimitExceededHtml({ name, planName, limitAmount }) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet">
        <style>
          body, table, td, div, p, a, span {
            font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
          }
          h1, h2 {
            font-family: 'Space Grotesk', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
          }
        </style>
      </head>
      <body style="margin: 0; padding: 0; background-color: #fafafa;">
        <div style="font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 40px 20px; color: #18181b; max-width: 580px; margin: 0 auto; background: #fafafa; border-radius: 24px; border: 1px solid #e4e4e7; margin-top: 20px; margin-bottom: 20px;">
          
          <!-- Header -->
          <div style="text-align: center; margin-bottom: 32px;">
            <h1 style="color: #09090b; font-size: 36px; font-weight: 600; margin: 0; letter-spacing: -2px; line-height: 1;">Automixa</h1>
            <p style="color: #71717a; font-size: 11px; font-weight: 500; margin: 8px 0 0 0; text-transform: lowercase; letter-spacing: -0.2px;">conversations that convert, automatically</p>
          </div>

          <!-- Main Content Card -->
          <div style="background: #ffffff; padding: 36px; border-radius: 20px; border: 1px solid #e4e4e7; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.02), 0 4px 6px -4px rgba(0, 0, 0, 0.02);">
            
            <div style="text-align: center; margin-bottom: 24px;">
              <span style="background: #fef2f2; border: 1px solid #fee2e2; color: #ef4444; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; padding: 6px 12px; border-radius: 9999px;">
                Plan Quota Exceeded
              </span>
            </div>

            <h2 style="font-size: 22px; font-weight: 800; color: #09090b; margin-top: 0; margin-bottom: 12px; text-align: center; letter-spacing: -0.5px;">Your Auto-Replies are Paused! ⚠️</h2>
            
            <p style="font-size: 14px; line-height: 1.6; color: #52525b; margin: 0 0 24px 0; text-align: center;">
              Hi ${name || 'User'}, your active workspace has reached the maximum allowed monthly limit of <strong>${(limitAmount || 1000).toLocaleString()} replies</strong> for the <strong>${planName || 'Free'} Plan</strong>.
            </p>

            <div style="background: #fafafa; border: 1px solid #e4e4e7; border-radius: 14px; padding: 20px; margin-bottom: 24px; text-align: center;">
              <p style="font-size: 12px; color: #71717a; margin: 0 0 6px 0;">Monthly Limit Consumed</p>
              <h3 style="font-size: 28px; font-weight: 800; color: #ef4444; margin: 0;">100%</h3>
              <p style="font-size: 11px; color: #71717a; margin: 6px 0 0 0;">All automatic DMs & Comment Replies are currently on hold.</p>
            </div>

            <!-- Call to Action -->
            <div style="text-align: center; margin-bottom: 12px;">
              <a href="https://automixa.in/dashboard" style="background: #6366F1; color: #ffffff; padding: 14px 36px; border-radius: 14px; font-size: 13px; font-weight: 700; text-decoration: none; display: inline-block; border: 1px solid #6366F1; box-shadow: 0 4px 14px rgba(99, 102, 241, 0.3);">
                Upgrade Plan & Resume Replies
              </a>
            </div>

          </div>

          <!-- Footer Branding & Socials -->
          <div style="text-align: center; margin-top: 36px; border-top: 1px solid #e4e4e7; padding-top: 24px;">
            
            <!-- Social Links -->
            <div style="margin-bottom: 16px;">
              <a href="https://instagram.com/automixa.in" target="_blank" style="margin: 0 8px; text-decoration: none; color: #71717a; font-size: 12px; font-weight: 600;">Instagram</a>
              <span style="color: #d4d4d8;">•</span>
              <a href="https://x.com/automixa_in" target="_blank" style="margin: 0 8px; text-decoration: none; color: #71717a; font-size: 12px; font-weight: 600;">Twitter</a>
              <span style="color: #d4d4d8;">•</span>
              <a href="https://automixa.in" target="_blank" style="margin: 0 8px; text-decoration: none; color: #71717a; font-size: 12px; font-weight: 600;">Website</a>
            </div>
            
            <!-- Legal & Copyright -->
            <p style="font-size: 11px; color: #a1a1aa; margin: 0 0 6px 0; line-height: 1.6;">
              © 2026 Automixa | Akash Enterprises. All rights reserved.
            </p>
            <p style="font-size: 10px; color: #a1a1aa; margin: 0; line-height: 1.6;">
              Delivered securely by Automixa. For support, contact <a href="mailto:info@automixa.in" style="color: #6366F1; text-decoration: none; font-weight: 500;">info@automixa.in</a>
            </p>

          </div>
        </div>
      </body>
    </html>
  `;
}

export const sendLimitExceededEmail = async ({ email, name, planName, limitAmount }) => {
  try {
    const data = await resend.emails.send({
      from: 'automixa <billing@automixa.in>',
      to: [email],
      subject: `[ACTION REQUIRED] Plan limit exceeded on automixa - Auto-Replies Paused`,
      html: getLimitExceededHtml({ name, planName, limitAmount }),
    });
    return data;
  } catch (error) {
    console.error("Failed to send limit email:", error);
    return null;
  }
};

export function getWelcomeHtml(name) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet">
        <style>
          body, table, td, div, p, a, span {
            font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
          }
          h1, h2 {
            font-family: 'Space Grotesk', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
          }
        </style>
      </head>
      <body style="margin: 0; padding: 0; background-color: #fafafa;">
        <div style="font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 40px 20px; color: #18181b; max-width: 580px; margin: 0 auto; background: #fafafa; border-radius: 24px; border: 1px solid #e4e4e7; margin-top: 20px; margin-bottom: 20px;">
          <!-- Header -->
          <div style="text-align: center; margin-bottom: 32px;">
            <h1 style="color: #09090b; font-size: 36px; font-weight: 600; margin: 0; letter-spacing: -2px; line-height: 1;">Automixa</h1>
            <p style="color: #71717a; font-size: 11px; font-weight: 500; margin: 8px 0 0 0; text-transform: lowercase; letter-spacing: -0.2px;">conversations that convert, automatically</p>
          </div>

          <!-- Main Content Card -->
          <div style="background: #ffffff; padding: 36px; border-radius: 20px; border: 1px solid #e4e4e7; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.02), 0 4px 6px -4px rgba(0, 0, 0, 0.02);">
            <h2 style="font-size: 22px; font-weight: 800; color: #09090b; margin-top: 0; margin-bottom: 12px; letter-spacing: -0.5px;">Welcome to Automixa! 🎉</h2>
            <p style="font-size: 14px; line-height: 1.6; color: #52525b; margin: 0 0 20px 0;">
              Hi ${name || 'there'},
            </p>
            <p style="font-size: 14px; line-height: 1.6; color: #52525b; margin: 0 0 20px 0;">
              Thank you for signing up! Automixa is designed to help you turn your Instagram comments, story mentions, and DMs into automatic conversions and leads.
            </p>
            <p style="font-size: 14px; line-height: 1.6; color: #52525b; margin: 0 0 20px 0;">
              To get started, the first step is to connect your Instagram Business account. It takes less than a minute.
            </p>
            
            <!-- Call to Action -->
            <div style="text-align: center; margin-top: 28px; margin-bottom: 24px;">
              <a href="https://automixa.in/dashboard" style="background: #6366F1; color: #ffffff; padding: 14px 36px; border-radius: 14px; font-size: 13px; font-weight: 700; text-decoration: none; display: inline-block; border: 1px solid #6366F1; box-shadow: 0 4px 14px rgba(99, 102, 241, 0.3);">
                Connect Instagram Now
              </a>
            </div>
            
            <!-- Troubleshooting helper -->
            <div style="margin-top: 32px; padding: 20px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; margin-bottom: 24px;">
              <h4 style="margin: 0 0 8px 0; font-size: 13px; font-weight: 700; color: #0f172a;">Stuck with Facebook connection? 🛠️</h4>
              <p style="margin: 0 0 8px 0; font-size: 12px; color: #475569; line-height: 1.5;">
                Make sure of these 3 requirements to avoid integration errors:
              </p>
              <ul style="margin: 0; padding-left: 18px; font-size: 12px; color: #475569; line-height: 1.6;">
                <li>Your Instagram is a <strong>Business or Creator</strong> profile (Personal accounts don't support API integrations).</li>
                <li>Your Instagram is linked to a <strong>Facebook Page</strong> that you own or manage.</li>
                <li>When Facebook login window pops up, click <strong>"Select All"</strong> and allow all page permissions.</li>
              </ul>
            </div>

            <p style="font-size: 14px; line-height: 1.6; color: #52525b; margin: 0;">
              If you have any questions or get stuck along the way, simply reply to this email. I read and respond to every message personally.
            </p>
            <p style="font-size: 14px; line-height: 1.6; color: #52525b; margin: 24px 0 0 0;">
              Best,<br/>
              <strong>Akash</strong><br/>
              Founder, Automixa
            </p>
          </div>
        </div>
      </body>
    </html>
  `;
}

export function getNudge2hHtml(name) {
  return `
    <div style="font-family: sans-serif; font-size: 15px; color: #18181b; line-height: 1.6; max-width: 550px;">
      <p>Hi ${name || 'there'},</p>
      <p>I noticed you logged into Automixa, but you haven't connected your Instagram or created your first automation yet.</p>
      <p>Connecting your account takes less than a minute and starts auto-replying to comments and DMs instantly so you don't lose leads.</p>
      <p style="margin: 24px 0;">
        <a href="https://automixa.in/dashboard" style="background: #6366F1; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block; border: 1px solid #6366F1;">
          Connect Instagram & Get Started
        </a>
      </p>

      <!-- Troubleshooting helper -->
      <div style="margin-top: 24px; margin-bottom: 24px; padding: 16px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 13px; color: #475569;">
        <strong style="color: #0f172a; display: block; margin-bottom: 6px;">Facing Facebook Connection Issues? 🛠️</strong>
        Make sure of these 3 details:
        <ul style="margin: 6px 0 0 0; padding-left: 18px; line-height: 1.5;">
          <li>Your Instagram profile must be a <strong>Creator or Business</strong> account (Personal accounts won't work).</li>
          <li>Your Instagram must be linked to a <strong>Facebook Page</strong> you manage.</li>
          <li>Give <strong>all permissions</strong> to Automixa during the Facebook login authorization.</li>
        </ul>
      </div>

      <p>If you got stuck or have any questions about how to set it up, just reply directly to this email. I'm here to help!</p>
      <br/>
      <p>Best,<br/><strong>Akash</strong><br/>Founder, Automixa</p>
    </div>
  `;
}

export function getCaseStudyHtml(name) {
  return `
    <div style="font-family: sans-serif; font-size: 15px; color: #18181b; line-height: 1.6; max-width: 550px;">
      <p>Hi ${name || 'there'},</p>
      <p>Are you still replying to your Instagram comments and DMs manually? 🥵</p>
      <p>Manual replies are slow and meta algorithms penalize pages that don't respond to active messages immediately. That means you are missing out on potential sales and profile reach every single day.</p>
      <p>By connecting Automixa, you can instantly reply to comment keywords like <em>"INFO"</em> or <em>"LINK"</em>, sending a direct message with details inside 1.5 seconds. Our creators are seeing a <strong>30% to 40% increase in conversions</strong> in their first week alone.</p>
      <p style="margin: 24px 0;">
        <a href="https://automixa.in/dashboard" style="background: #6366F1; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block; border: 1px solid #6366F1;">
          Start Automating Your Instagram
        </a>
      </p>
      <p>Connecting takes 60 seconds and requires no password. If you need a demo or help setting it up, feel free to reply directly to this email.</p>
      <br/>
      <p>Best,<br/><strong>Akash</strong><br/>Founder, Automixa</p>
    </div>
  `;
}

export function getFeedbackHtml(name) {
  return `
    <div style="font-family: sans-serif; font-size: 15px; color: #18181b; line-height: 1.6; max-width: 550px;">
      <p>Hi ${name || 'there'},</p>
      <p>Akash here (founder of Automixa).</p>
      <p>I noticed you signed up for Automixa a few days ago, but didn't connect your Instagram account. I wanted to check in personally to see if you faced any issues or if the tool wasn't a good fit for you.</p>
      <p>We are constantly improving Automixa, and your honest feedback is incredibly valuable. If you got stuck during setup, or if you found the product too complex, please let me know by replying directly to this email.</p>
      <p>If you just got busy and want to give it another try, you can jump back in here:</p>
      <p style="margin: 24px 0;">
        <a href="https://automixa.in/dashboard" style="background: #6366F1; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block; border: 1px solid #6366F1;">
          Connect My Account
        </a>
      </p>
      <p>Thank you for your time, and I look forward to hearing your thoughts!</p>
      <br/>
      <p>Best,<br/><strong>Akash</strong><br/>Founder, Automixa</p>
    </div>
  `;
}

export const sendOnboardingEmail = async ({ email, name, type }) => {
  try {
    let subject = '';
    let htmlContent = '';
    let from = 'Akash from Automixa <info@automixa.in>'; // Personal touch sender

    if (type === 'welcome') {
      subject = 'Welcome to Automixa! 🎉 Let\'s get you set up';
      htmlContent = getWelcomeHtml(name);
    } else if (type === 'nudge_2h') {
      subject = 'Quick question about your Automixa setup';
      htmlContent = getNudge2hHtml(name);
    } else if (type === 'case_study_24h') {
      subject = 'Stop replying manually: increase your conversions by 40%';
      htmlContent = getCaseStudyHtml(name);
    } else if (type === 'feedback_72h') {
      subject = 'Quick question from the founder of Automixa';
      htmlContent = getFeedbackHtml(name);
    } else {
      throw new Error(`Invalid email type: ${type}`);
    }

    const data = await resend.emails.send({
      from,
      to: [email],
      subject,
      html: htmlContent,
    });
    return data;
  } catch (error) {
    console.error(`Failed to send onboarding email (${type}):`, error);
    return null;
  }
};

