import axiosClient from '../api/axiosClient';

/**
 * Service for interacting with the Bakong KHQR payment gateway endpoints.
 */
export const bakongService = {
  /**
   * Generates a dynamic Bakong KHQR code and MD5 transaction hash.
   *
   * @param {Object} params
   * @param {number} [params.bookingId] - Associated ticket, room, or food booking ID
   * @param {string} [params.bookingType] - "TICKET", "ROOM", "FOOD_ORDER", or "GENERAL"
   * @param {number} params.amount - Payment amount (e.g. 15.00)
   * @param {string} [params.currency] - "USD" or "KHR" (default "USD")
   * @param {string} [params.description] - Description or label (e.g. "Angkor Wat Sunrise")
   * @param {string} [params.customerPhone] - Optional customer mobile
   * @returns {Promise<Object>} Returns { qrString, qrImage, md5, billNumber, amount, currency, merchantName, expiresAt }
   */
  generateQr: async ({
    bookingId,
    bookingType = 'TICKET',
    amount,
    currency = 'USD',
    description = '',
    customerPhone = '',
  }) => {
    const response = await axiosClient.post('/v1/bakong/generate-qr', {
      bookingId,
      bookingType,
      amount,
      currency,
      description,
      customerPhone,
    });
    return response.data;
  },

  /**
   * Checks the status of a transaction using its generated MD5 hash.
   *
   * @param {Object} params
   * @param {string} params.md5 - The 32-char lowercase MD5 hash
   * @param {number} [params.bookingId] - Associated booking ID
   * @param {string} [params.bookingType] - Associated booking type
   * @returns {Promise<Object>} Returns { status, message, md5, transactionId, amount, currency, paidAt }
   */
  checkStatus: async ({ md5, bookingId, bookingType }) => {
    const response = await axiosClient.post('/v1/bakong/check-status', {
      md5,
      bookingId,
      bookingType,
    });
    return response.data;
  },

  /**
   * Developer Sandbox helper to simulate payment confirmation in development.
   *
   * @param {string} md5 - The MD5 hash of the pending transaction
   * @returns {Promise<Object>}
   */
  simulatePayment: async (md5) => {
    const response = await axiosClient.post('/v1/bakong/simulate-payment', null, {
      params: { md5 },
    });
    return response.data;
  },
};
