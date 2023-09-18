import Gopay from "gopay-sdk";
import select from "@inquirer/select";
import input from "@inquirer/input";

export const login = async (
  gopay: Gopay,
  phone: string,
  opts = { isResend: false, otpToken: "" }
) => {
  try {
    let otpToken;
    if (!opts.isResend) {
      const requestOTPResp = await gopay.auth.requestOTP(phone);
      otpToken = requestOTPResp?.data?.otp_token;
    } else {
      otpToken = opts.otpToken;
    }

    const nextAction = await select({
      message: "Select next action",
      choices: [
        {
          name: "Resend OTP",
          value: "resend-otp",
          description: "Resend OTP",
        },
        {
          name: "Verify OTP",
          value: "verify-otp",
          description: "Verify OTP",
        },
      ],
    });

    if (nextAction === "verify-otp") {
      await verifyOTP(gopay, otpToken);
    }

    if (nextAction === "resend-otp") {
      await gopay.auth.retryOTP(otpToken);
      await login(gopay, phone, { isResend: true, otpToken });
    }
  } catch (error) {
    const respData = error?.response?.data || {};
    console.log(respData);
    // const fs = require("fs");
    // fs.writeFileSync("./err.json", JSON.stringify(error, undefined, 2));
    // fs.writeFileSync(
    //   "./err-resp.json",
    //   JSON.stringify(respData || {}, undefined, 2)
    // );
  }
};

const verifyOTP = async (gopay: Gopay, otpToken: string) => {
  const otp = await input({
    message: "Input your otp here",
    validate: (v: string) => !!v,
  });
  const verifyOTPResp = await gopay.auth.verifyOTP(otp, otpToken);

  if (verifyOTPResp?.next_action) {
    const pin = await input({
      message: "Set PIN for this device",
      validate: (v: string) => !!v,
    });
    await gopay.auth.setPin(
      pin,
      verifyOTPResp?.challenge_id,
      verifyOTPResp?.challenge_token
    );
    console.log("Successfully Logged In");
  } else {
    console.log("Successfully Logged In");
  }
};

export const logout = async (gopay: Gopay) => {
  try {
    await gopay.auth.logout();
  } catch (error) {
    const respData = error?.response?.data || {};
    console.log(respData);
  }
};


export const refreshToken = async (gopay: Gopay) => {
  try {
    await gopay.auth.refreshToken();
  } catch (error) {
    const respData = error?.response?.data || {};
    console.log(respData);
  }
};
