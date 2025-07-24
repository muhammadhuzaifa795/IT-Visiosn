import { Vonage } from '@vonage/server-sdk';

const vonage = new Vonage({
  apiKey: process.env.VONAGE_API_KEY,
  apiSecret: process.env.VONAGE_API_SECRET
});

export const sendOtp = async (toNumber, otpCode) => {
  const from = 'Vonage';
  const text = `Your OTP is ${otpCode}. It will expire in 30 minutes.`;

  return new Promise((resolve, reject) => {
    vonage.sms.send({ to: toNumber, from, text }, (err, responseData) => {
      if (err) return reject(err);

      const message = responseData.messages[0];
      if (message.status === '0') {
        resolve('OTP sent successfully');
      } else {
        reject(new Error(message['error-text']));
      }
    });
  });
};


