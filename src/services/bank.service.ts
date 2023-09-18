import Gopay from "gopay-sdk";
import uniqBy from "lodash.uniqby";

export const getBankList = async (gopay: Gopay) => {
  try {
    const resp = await gopay.bank.getBanks();
    const data = [...resp.data.top_banks, ...resp?.data.banks].map((b) => ({
      code: b.bank_code,
      name: b.bank_name,
    }));
    console.table(uniqBy(data, 'code'));
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
