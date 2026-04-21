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
      // Silence Error #230 (Consent required) as it's expected for new commenters
      if (!error.message.includes("(#230)")) {
        console.error("Meta API - getUserProfile Error:", error.message);
      }
      return { success: false, error: error.message };
    }
  },

  sendDM: async (recipientId, text, accessToken) => {
    if (!text || text.trim() === "") {
      console.warn("⚠️ Meta API - sendDM: Attempted to send empty text. Skipping.");
      return { success: false, error: "Empty text" };
    }
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

  sendPrivateReply: async (commentId, messagePayload, accessToken) => {
    try {
      // Support both simple text and structured message objects (for quick_replies)
      const messageBody = typeof messagePayload === 'string' 
        ? { text: messagePayload } 
        : messagePayload;

      const response = await fetch(`${BASE_URL}/me/messages?access_token=${accessToken}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          recipient: { comment_id: commentId },
          message: messageBody 
        }),
      });
      const data = await response.json();
      if (!response.ok) {
         console.error("❌ Meta API PrivateReply Error:", data.error?.message);
         throw new Error(data.error?.message || "Failed to send private reply");
      }
      return { success: true, data };
    } catch (error) {
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

  checkFollowStatus: async (userId, accessToken) => {
    try {
      const response = await fetch(`${BASE_URL}/${userId}?fields=is_user_follow_business&access_token=${accessToken}`);
      const data = await response.json();
      
      console.log(`🔍 [DEBUG] Follow Check Response for ${userId}:`, JSON.stringify(data));
      
      if (!response.ok) {
        console.error("❌ Meta API - checkFollowStatus API Error:", data.error?.message);
        throw new Error(data.error?.message || "Failed to check follow status");
      }

      // Explicitly return success and the boolean value
      return { 
        success: true, 
        isFollowing: data.is_user_follow_business === true,
        exists: data.is_user_follow_business !== undefined
      };
    } catch (error) {
      console.error("Meta API - checkFollowStatus Throwable Error:", error.message);
      return { success: false, isFollowing: false, error: error.message };
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

  sendFollowGateCard: async (recipientId, brandName, accessToken, instagramId = null, customPayload = "VERIFY_FOLLOW_CLICKED", customTitle = null, customSubtitle = null) => {
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
                title: customTitle || `One final step to unlock! 🎁`,
                subtitle: customSubtitle !== null && customSubtitle !== undefined ? customSubtitle : `Please follow @${brandName || 'us'} to get your link immediately.`,
                buttons: [
                  { type: "web_url", url: followLink, title: "Visit Profile 👤" },
                  { type: "postback", title: "I am following", payload: customPayload }
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

  sendGenericCard: async (recipientId, title, subtitle, buttonTitle, url, accessToken, imageUrl = null) => {
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
                image_url: imageUrl,
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
      // Enhanced fields for Reels, Videos and Carousels
      const fields = "id,media_url,permalink,caption,timestamp,media_type,thumbnail_url,children{media_url,media_type}";
      const response = await fetch(`${BASE_URL}/${instagramId}/media?fields=${fields}&access_token=${accessToken}`);
      const data = await response.json();
      
      if (!response.ok) {
        console.error("❌ Meta API getMediaList Error:", data.error?.message);
        throw new Error(data.error?.message || "Failed to fetch media list");
      }
      
      // Post-process to ensure even Carousels have a media_url for the UI
      const processedMedia = (data.data || []).map(item => ({
        ...item,
        media_url: item.media_url || (item.children?.data?.[0]?.media_url) || item.thumbnail_url
      }));

      return { success: true, data: processedMedia };
    } catch (error) {
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
