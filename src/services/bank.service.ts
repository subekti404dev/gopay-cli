import Gopay from "gopay-sdk";

export const getBankList = async (gopay: Gopay) => {
  try {
    const resp = await gopay.bank.getBanks();
    console.table(
      [...resp?.data.banks, ...resp.data.top_banks].map((b) => ({
        code: b.bank_code,
        name: b.bank_name,
      }))
    );
  } catch (error) {
    const respData = error?.response?.data || {};
    console.log(respData);
  }
};

export const validateBank = async (
  gopay: Gopay,
  bankCode: string,
  accountNumber: string
) => {
  try {
    const resp = await gopay.bank.validateBankAccount(bankCode, accountNumber);
    console.table(resp?.data);
  } catch (error) {
    const respData = error?.response?.data || {};
    console.log(respData);
    //  const fs = require("fs");
    // fs.writeFileSync("./err.json", JSON.stringify(error, undefined, 2));
    // fs.writeFileSync(
    //   "./err-resp.json",
    //   JSON.stringify(respData || {}, undefined, 2)
    // );
  }
};
