import { useMutation } from "@tanstack/react-query";
import { sendOTP, resendOTP, verifyOTP, resetPassword } from "../lib/api";

export const useSendOTP = () => {
  const { mutate, isPending, error, isSuccess, data, reset } = useMutation({
    mutationFn: sendOTP,
  });

  return { 
    sendOTPMutation: mutate, 
    isSendingOTP: isPending, 
    sendOTPError: error,
    otpSent: isSuccess,
    otpData: data,
    resetSendOTP: reset
  };
};

export const useResendOTP = () => {
  const { mutate, isPending, error, isSuccess, data, reset } = useMutation({
    mutationFn: resendOTP,
  });

  return { 
    resendOTPMutation: mutate, 
    isResendingOTP: isPending, 
    resendOTPError: error,
    otpResent: isSuccess,
    resendData: data,
    resetResendOTP: reset
  };
};

export const useVerifyOTP = () => {
  const { mutate, isPending, error, isSuccess, data, reset } = useMutation({
    mutationFn: ({ data, otp }) => verifyOTP(data, otp),
  });

  return { 
    verifyOTPMutation: mutate, 
    isVerifyingOTP: isPending, 
    verifyOTPError: error,
    otpVerified: isSuccess,
    verifyData: data,
    resetVerifyOTP: reset
  };
};

export const useResetPassword = () => {
  const { mutate, isPending, error, isSuccess, data, reset } = useMutation({
    mutationFn: ({ data, newPassword }) => resetPassword(data, newPassword),
  });

  return { 
    resetPasswordMutation: mutate, 
    isResettingPassword: isPending, 
    resetPasswordError: error,
    passwordReset: isSuccess,
    resetData: data,
    resetPasswordReset: reset
  };
};