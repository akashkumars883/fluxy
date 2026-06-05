# Automixa Product Roadmap & TODO

## 🚀 Future Features (Planned)
- [ ] **Cookie Consent Banner 🍪**
  - Implement a modern floating glassmorphic cookie consent banner
  - Save user preferences in `localStorage` and conditionally load Google Analytics based on consent
- [ ] **User Onboarding & Activation Email Sequence 📧**
  - Integrate automatic DB checks (cron jobs/queues) for user onboarding state
  - Create Resend email templates for:
    - Immediate Welcome Email (Sign up confirmation + next steps)
    - 2-Hour Setup Nudge (Triggered if Instagram is not connected)
    - 24-Hour Social Proof/Case Study Email (To build trust and show value)
    - 72-Hour Feedback Email (Direct check-in from founder if not activated)
  - Track email delivery states in database (`nudge_sent`, etc.) to prevent duplicate sending


## ✅ Completed Refinements
- [x] **Mobile App (PWA) Optimization 📱**
  - Fully dynamic web app manifest configurations mapping standalone display capability
  - Dynamic display standardizing launch colors, theme indicators, and metadata
  - High-fidelity visual iOS & Android app install helper drawer floating prompt
- [x] **Auto-Profile Intelligence (Magic Setup) 🔮**
  - Auto-configure Brand Kit AI settings by scanning connected IG Bio & Captions
  - Auto-detect Brand Voice / Tone from previous posts
  - Instantly generate & configure 2 high-converting pre-built campaign triggers in DB
- [x] **Advanced AI Intent Analysis**
  - Moving from synonym-based matching to real LLM (Gemini) intent recognition
- [x] **Collaboration & Team Roles**
  - Invite team members to specific workspaces using their email address
  - Role-based access control (Admin, Editor, Viewer)
  - Interactive collaborator management (updating roles, removing members)
  - Auto-acceptance of pending invitations during login flow
  - Shared "Team" badge highlights in workspace dropdown switcher
- [x] **Multiple Workspaces**
  - Vercel-style workspace switcher in Sidebar
  - Link multiple Instagram accounts to one profile
  - Isolated data (Campaigns, CRM, Analytics) per workspace
  - Workspace management settings & branding
- [x] **AI FAQ Assistant Studio**
  - Full Question/Answer training interface
  - Delete functionality for FAQ entries
  - AI Persona selector (Professional, Friendly, Funny, Concise)
  - AI Emoji usage toggle
- [x] **Interactive AI Sandbox**
  - Live chat simulation in the mobile preview
  - Smart response generation based on Persona & Emojis
  - Real-time "Typing" animation
- [x] **Instagram Premium Mockup**
  - High-fidelity DM & FAQ interface simulation
  - Native-style headers, bubbles, and status indicators
- [x] **UI/UX Polish**
  - "Compact Premium" design language implementation
  - Consistent rounding, shadows, and glassmorphism
  - Removed browser default outlines for a native feel

