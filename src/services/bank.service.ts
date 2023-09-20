import { input, select, confirm, password } from "@inquirer/prompts";
import Gopay from "gopay-sdk";
import uniqBy from "lodash.uniqby";

export const getBankList = async (gopay: Gopay) => {
  try {
    const resp = await gopay.bank.getBanks();
    const data = [...resp.data.top_banks, ...resp?.data.banks].map((b) => ({
      code: b.bank_code,
      name: b.bank_name,
    }));
    console.table(uniqBy(data, "code"));
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

export const transferBank = async (
  gopay: Gopay,
  amount: number,
  accountNumber: string,
  bankCode: string,
  pin: string
) => {
  try {
    const resp = await gopay.bank.transfer(
      amount,
      bankCode,
      accountNumber,
      pin
    );
    console.log(resp);
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

export const transferWizard = async (gopay: Gopay) => {
  try {
    const respBanks = await gopay.bank.getBanks();
    const banks = [...respBanks.data.top_banks, ...respBanks?.data.banks].map(
      (b) => ({
        code: b.bank_code,
        name: b.bank_name,
      })
    );

    const selectedBank = await select({
      message: "Select bank: ",
      choices: banks.map((b) => ({
        name: b.name,
        value: b.code,
      })),
    });

    const accountNumber = await input({
      message: "Enter bank account number: ",
      validate: (v: string) => !!v,
    });

    const respValidate = await gopay.bank.validateBankAccount(
      selectedBank,
      accountNumber
    );

    const confirmAcc = await confirm({
      message: `Are you sure want to transfer to [ ${accountNumber} - ${respValidate.data.account_name} ] ?`,
    });

    if (confirmAcc) {
      const amount = await input({
        message: "Enter amount: ",
        validate: (v: string) => !!v,
      });

      const fee = await gopay.bank.checkTransferFee(
        parseInt(amount),
        selectedBank,
        accountNumber
      );
      const confirmFee = await confirm({
        message: `Transfer Fee is ${fee.data.service_fee.display_value}, Transfer ?`,
      });
      if (confirmFee) {
        const pin = await password({ message: "Enter your pin: " });

        await transferBank(
          gopay,
          parseInt(amount),
          accountNumber,
          selectedBank,
          pin
        );
      }
    } else {
      process.exit(0);
    }
  } catch (error) {
    const respData = error?.response?.data || {};
    console.log(respData);
  }
};
