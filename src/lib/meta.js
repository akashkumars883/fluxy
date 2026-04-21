const GRAPH_API_VERSION = 'v21.0'; 
const BASE_URL = `https://graph.facebook.com/${GRAPH_API_VERSION}`;

/**
 * Meta API Helper Functions
 */
export const MetaService = {
  // --- OAUTH FLOW HELPERS ---

  /**
   * 1. Exchange short-lived User Code for User Token
   */
  exchangeCodeForToken: async (code, redirectUri) => {
    try {
      const params = new URLSearchParams({
        client_id: process.env.INSTAGRAM_APP_ID,
        client_secret: process.env.INSTAGRAM_APP_SECRET,
        redirect_uri: redirectUri,
        code: code,
      });

      const response = await fetch(`${BASE_URL}/oauth/access_token?${params.toString()}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || "Code exchange failed");
      return { success: true, accessToken: data.access_token };
    } catch (error) {
      console.error("Meta API - exchangeCodeForToken Error:", error.message);
      return { success: false, error: error.message };
    }
  },

  /**
   * 2. Convert short-lived token to long-lived (60 days)
   */
  getLongLivedToken: async (shortToken) => {
    try {
      const params = new URLSearchParams({
        grant_type: 'fb_exchange_token',
        client_id: process.env.INSTAGRAM_APP_ID,
        client_secret: process.env.INSTAGRAM_APP_SECRET,
        fb_exchange_token: shortToken,
      });

      const response = await fetch(`${BASE_URL}/oauth/access_token?${params.toString()}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || "Long-lived token exchange failed");
      return { success: true, accessToken: data.access_token };
    } catch (error) {
      console.error("Meta API - getLongLivedToken Error:", error.message);
      return { success: false, error: error.message };
    }
  },

  /**
   * 3. Fetch Instagram Business Accounts from User Pages
   */
  getInstagramAccounts: async (userAccessToken) => {
    try {
      // Step A: Get pages managed by user
      const response = await fetch(`${BASE_URL}/me/accounts?fields=name,access_token,instagram_business_account&access_token=${userAccessToken}`);
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.error?.message || "Failed to fetch pages");

      // Step B: Filter pages that HAVE an Instagram Business Account linked
      const igAccounts = data.data
        .filter(page => page.instagram_business_account)
        .map(page => ({
          page_id: page.id,
          page_name: page.name,
          page_token: page.access_token,
          instagram_business_id: page.instagram_business_account.id
        }));

      return { success: true, accounts: igAccounts };
    } catch (error) {
      console.error("Meta API - getInstagramAccounts Error:", error.message);
      return { success: false, error: error.message };
    }
  },

  // --- CORE MESSAGING & ACTIONS ---

  getUserProfile: async (userId, accessToken) => {
    try {
      const response = await fetch(`${BASE_URL}/${userId}?fields=name,profile_pic&access_token=${accessToken}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || "Failed to fetch user profile");
      return { success: true, data };
    } catch (error) {
      console.error("Meta API - getUserProfile Error:", error.message);
      return { success: false, error: error.message };
    }
  },

  sendDM: async (recipientId, text, accessToken) => {
    try {
      const response = await fetch(`${BASE_URL}/me/messages?access_token=${accessToken}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipient: { id: recipientId },
          message: { text: text },
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        console.error(`❌ Meta API sendDM Error [${response.status}]:`, data.error?.message || "Unknown error");
        throw new Error(data.error?.message || "Failed to send DM");
      }
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  sendPrivateReply: async (commentId, text, accessToken) => {
    try {
      const response = await fetch(`${BASE_URL}/${commentId}/private_replies?access_token=${accessToken}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || "Failed to send private reply");
      return { success: true, data };
    } catch (error) {
      console.error("Meta API - sendPrivateReply Error:", error.message);
      return { success: false, error: error.message };
    }
  },

  sendCommentReply: async (commentId, text, accessToken) => {
    try {
      const response = await fetch(`${BASE_URL}/${commentId}/replies?access_token=${accessToken}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || "Failed to reply to comment");
      return { success: true, data };
    } catch (error) {
      console.error("Meta API - sendCommentReply Error:", error.message);
      return { success: false, error: error.message };
    }
  },

  checkFollowStatus: async (userId, pageId, accessToken) => {
    try {
      const response = await fetch(`${BASE_URL}/${pageId}?fields=is_user_follow_business&user_id=${userId}&access_token=${accessToken}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || "Failed to check follow status");
      return { success: true, isFollowing: data.is_user_follow_business };
    } catch (error) {
      console.error("Meta API - checkFollowStatus Error:", error.message);
      return { success: false, isFollowing: false };
    }
  },

  sendReaction: async (recipientId, messageId, emoji, accessToken) => {
    try {
      const response = await fetch(`${BASE_URL}/me/messages?access_token=${accessToken}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipient: { id: recipientId },
          sender_action: "react",
          payload: {
            mid: messageId,
            reaction: emoji
          }
        })
      });
      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error("Meta API - sendReaction Error:", error.message);
      return { success: false };
    }
  },

  getMediaContext: async (mediaId, accessToken) => {
    try {
      const response = await fetch(`${BASE_URL}/${mediaId}?fields=caption&access_token=${accessToken}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || "Failed to fetch caption");
      return { success: true, caption: data.caption };
    } catch (error) {
      console.error("Meta API - getMediaContext Error:", error.message);
      return { success: false, caption: "" };
    }
  },

  sendFollowGateCard: async (recipientId, brandName, accessToken, instagramId = null) => {
    try {
      const followLink = instagramId ? `https://www.instagram.com/${instagramId}/` : `https://www.instagram.com/`;
      const payload = {
        recipient: { id: recipientId },
        message: {
          attachment: {
            type: "template",
            payload: {
              template_type: "generic",
              elements: [{
                title: `One final step to unlock! 🎁`,
                subtitle: `Please follow @${brandName || 'us'} to get your link immediately.`,
                buttons: [
                  { type: "web_url", url: followLink, title: "Follow Now 🚀" },
                  { type: "postback", title: "I am following ✅", payload: "VERIFY_FOLLOW_CLICKED" }
                ]
              }]
            }
          }
        }
      };

      const response = await fetch(`${BASE_URL}/me/messages?access_token=${accessToken}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) {
        console.error(`❌ Meta API FollowGate Error [${response.status}]:`, data.error?.message);
        throw new Error(data.error?.message || "Failed to send Follow-Gate card");
      }
      return { success: true };
    } catch (error) {
      return { success: false };
    }
  },

  sendGenericCard: async (recipientId, title, subtitle, buttonTitle, url, accessToken) => {
    try {
      const payload = {
        recipient: { id: recipientId },
        message: {
          attachment: {
            type: "template",
            payload: {
              template_type: "generic",
              elements: [{
                title: title || "Exclusive Access! 🎁",
                subtitle: subtitle,
                buttons: [
                  {
                    type: "web_url",
                    url: url,
                    title: buttonTitle || "Open Link"
                  }
                ]
              }]
            }
          }
        }
      };

      const response = await fetch(`${BASE_URL}/me/messages?access_token=${accessToken}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || "Failed to send generic card");
      return { success: true, data };
    } catch (error) {
      console.error("Meta API - sendGenericCard Error:", error.message);
      return { success: false, error: error.message };
    }
  },

  getMediaList: async (instagramId, accessToken) => {
    try {
      const response = await fetch(`${BASE_URL}/${instagramId}/media?fields=id,media_url,permalink,caption,timestamp,media_type&access_token=${accessToken}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || "Failed to fetch media list");
      return { success: true, data: data.data || [] };
    } catch (error) {
      console.error("Meta API - getMediaList Error:", error.message);
      return { success: false, error: error.message };
    }
  }
};

// Legacy exports for compatibility
export const getUserProfile = MetaService.getUserProfile;
export const sendDM = MetaService.sendDM;
export const sendPrivateReply = MetaService.sendPrivateReply;
export const sendCommentReply = MetaService.sendCommentReply;
export const checkFollowStatus = MetaService.checkFollowStatus;
export const sendFollowGateCard = MetaService.sendFollowGateCard;
export const getMediaContext = MetaService.getMediaContext;
export const sendReaction = MetaService.sendReaction;
export const sendGenericCard = MetaService.sendGenericCard;
export const getMediaList = MetaService.getMediaList;
