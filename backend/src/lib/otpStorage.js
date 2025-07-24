export const otpStore = new Map(); // { phone: { otp, expiresAt } }

export const saveOTP = (phone, otp) => {
  const expiresAt = Date.now() + 30 * 60 * 1000; // 30 minutes
  otpStore.set(phone, { otp, expiresAt });
};

export const verifyOTP = (phone, enteredOTP) => {
  const record = otpStore.get(phone);
  if (!record) return false;
  if (Date.now() > record.expiresAt) {
    otpStore.delete(phone);
    return false;
  }
  return record.otp === enteredOTP;
};

export const clearOTP = (phone) => otpStore.delete(phone);
