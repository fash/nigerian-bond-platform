interface VerificationResponse {
  success: boolean;
  message: string;
  data?: {
    firstName: string;
    lastName: string;
    phone: string;
    email?: string;
    dateOfBirth?: string;
  };
}

/**
 * Calls our internal Next.js API route to verify BVN securely.
 */
export const verifyBVN = async (bvnNumber: string): Promise<VerificationResponse> => {
  try {
    const response = await fetch('/api/verify-bvn', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ bvn: bvnNumber }),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Client API Error:", error);
    return {
      success: false,
      message: "Unable to connect to verification server."
    };
  }
};