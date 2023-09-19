import { banner } from "./constant";
import { Command } from "commander";
import { homedir } from "os";
import Gopay from "gopay-sdk";
import { login } from "./services/auth.service";
import { customerBalances, customerInfo } from "./services/customer.service";
import {
  getBankList,
  transferBank,
  transferWizard,
  validateBank,
} from "./services/bank.service";
const NodeLS = require("node-localstorage").LocalStorage;

const gopay = new Gopay({ localStorage: new NodeLS(`${homedir}/.gopay`) });
const program = new Command();

const main = async () => {
  console.clear()
  console.log(banner);
  program
    .name("gopay")
    .version("1.0.0")
    .description("Another unofficial gopay app");
  
  program
    .command("login")
    .description("login into your account")
    .argument("<phone>", "phone number without country code")
    .action(async (args) => {
      await login(gopay, args);
    });
  
  const userCommand = program.command("user");
  
  userCommand
    .command("info")
    .description("info of your user account")
    .action(async () => {
      await customerInfo(gopay);
    });
  
  userCommand
    .command("balance")
    .description("info of your balances")
    .action(async () => {
      await customerBalances(gopay);
    });
  
  const bankCommand = program.command("bank");
  bankCommand
    .command("ls")
    .description("get list of bank")
    .action(() => getBankList(gopay));
  
  bankCommand
    .command("v")
    .option("-b, --bank <bank_code>", "bank code")
    .option("-a, --account <account_number>", "bank account")
    .description("validate bank account")
    .action((_, opts) => {
      const { bank, account } = opts?._optionValues || {};
      validateBank(gopay, bank, account);
    });
  
  bankCommand
    .command("tf")
    .option("-b, --bank <bank_code>", "bank code")
    .option("-a, --account <account_number>", "bank account")
    .option("-m, --amount <amount>", "amount to transfer")
    .option("-p, --pin <pin>", "gopay pin")
    .description("tansfer to bank account")
    .action((_, opts) => {
      const { bank, account, amount, pin } = opts?._optionValues || {};
      if (bank && account && amount && pin) {
        transferBank(gopay, parseInt(amount), account, bank, pin);
      } else {
        // console.log(`Err: bank, account, amount and pin is required `);
        transferWizard(gopay)
      }
    });
  
  program.parse();
  
}

main()