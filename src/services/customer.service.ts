import Gopay from "gopay-sdk";

export const customerInfo = async (gopay: Gopay) => {
  try {
    const resp = await gopay.customer.getCustomerInfo();
    console.table(resp?.customer);
  } catch (error) {
    const respData = error?.response?.data || {};
    console.log(respData);
  }
};


export const customerBalances = async (gopay: Gopay) => {
  try {
    const resp = await gopay.customer.getBalances();
    console.table(resp?.data.map(d => ({name: d.type, balance: d.balance.value})));
  } catch (error) {
    const respData = error?.response?.data || {};
    console.log(respData);
  }
};
