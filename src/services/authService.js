import axios from "axios";

const API_URL = "http://localhost:5004/api/auth";

// ============================================================
// SEND OTP
// ============================================================

export const sendOTP = async (mobileNumber) => {
  try {
    const response = await axios.post(
      `${API_URL}/send-otp`,
      {
        mobileNumber,
      }
    );

    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.message ||
      "Unable to send OTP.";

    throw new Error(message, {
      cause: error,
    });
  }
};

// ============================================================
// VERIFY OTP
// ============================================================

export const verifyOTP = async (
  mobileNumber,
  otp
) => {
  try {
    const response = await axios.post(
      `${API_URL}/verify-otp`,
      {
        mobileNumber,
        otp,
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Verify OTP Error:",
      error
    );

    throw (
      error.response?.data || {
        success: false,
        message: "Unable to verify OTP.",
      }
    );
  }
};

// ============================================================
// RESEND OTP
// ============================================================

export const resendOTP = async (
  mobileNumber
) => {
  try {
    const response = await axios.post(
      `${API_URL}/resend-otp`,
      {
        mobileNumber,
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Resend OTP Error:",
      error
    );

    throw (
      error.response?.data || {
        success: false,
        message: "Unable to resend OTP.",
      }
    );
  }
};

// ============================================================
// GOOGLE LOGIN
// ============================================================

export const googleLogin = async (
  credential
) => {
  try {
    const response = await axios.post(
      `${API_URL}/google`,
      {
        credential,
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Google Login Error:",
      error
    );

    throw (
      error.response?.data || {
        success: false,
        message:
          "Unable to login with Google.",
      }
    );
  }
};