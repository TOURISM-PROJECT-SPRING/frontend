import axiosClient from '../api/axiosClient';

/**
 * Service for interacting with the Cambodian Smart Tourism AI Concierge (Sovann AI)
 * powered by Google Gemini and grounded in the platform database.
 */
export const aiService = {
  /**
   * Send a multi-turn chat message to Sovann AI.
   *
   * @param {Object} params
   * @param {string} params.message - Current user question/message
   * @param {Array<{role: string, content: string}>} [params.conversationHistory] - Previous chat turns
   * @param {string} [params.destination] - Optional target destination context (e.g. "Siem Reap")
   * @param {string} [params.language] - Optional preferred language ("en", "km")
   * @returns {Promise<{reply: string, suggestedFollowUps: string[], referencedItems: Array, modelUsed: string, fallbackUsed: boolean}>}
   */
  chat: async ({ message, conversationHistory = [], destination = '', language = 'en' }) => {
    const response = await axiosClient.post('/v1/ai/chat', {
      message,
      conversationHistory,
      destination,
      language,
    });
    return response.data;
  },

  /**
   * Generates a tailored day-by-day travel itinerary.
   *
   * @param {Object} params
   * @param {string} params.destination - e.g. "Siem Reap", "Phnom Penh", "Kampot"
   * @param {number} [params.numberOfDays=3] - Number of days (1 to 14)
   * @param {string} [params.budget='MODERATE'] - "BUDGET", "MODERATE", "LUXURY"
   * @param {string} [params.travelStyle='CULTURE_HERITAGE'] - "CULTURE_HERITAGE", "NATURE_ADVENTURE", "RELAXATION", "FOODIE", "FAMILY"
   * @param {string} [params.groupType='COUPLE'] - "SOLO", "COUPLE", "FAMILY", "FRIENDS"
   * @param {string} [params.specialRequests] - Optional traveler notes
   * @returns {Promise<Object>}
   */
  generateItinerary: async ({
    destination,
    numberOfDays = 3,
    budget = 'MODERATE',
    travelStyle = 'CULTURE_HERITAGE',
    groupType = 'COUPLE',
    specialRequests = '',
  }) => {
    const response = await axiosClient.post('/v1/ai/itinerary', {
      destination,
      numberOfDays,
      budget,
      travelStyle,
      groupType,
      specialRequests,
    });
    return response.data;
  },

  /**
   * Get smart recommendations for a specific query or preference.
   *
   * @param {Object} params
   * @param {string} [params.category='ALL'] - "ALL", "PLACES", "HOTELS", "RESTAURANTS", "FOODS", "TOURS"
   * @param {string} params.preference - Query or preference description
   * @param {string} [params.destination] - Destination filter
   * @returns {Promise<Object>}
   */
  getRecommendations: async ({ category = 'ALL', preference, destination = '' }) => {
    const response = await axiosClient.post('/v1/ai/recommendations', {
      category,
      preference,
      destination,
    });
    return response.data;
  },

  /**
   * Checks the health and configuration status of the AI service.
   *
   * @returns {Promise<{configured: boolean, model: string, fallbackModel: string, status: string, message: string, maskedApiKey: string}>}
   */
  getStatus: async () => {
    const response = await axiosClient.get('/v1/ai/status');
    return response.data;
  },
};
