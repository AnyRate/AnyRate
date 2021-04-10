const { expect } = require("chai");
const fs = require("fs");

before(async () => {
  BillingFactory = await ethers.getContractFactory("BillingFactory");
  BillingABI = fs.readFileSync("artifacts/contracts/Billing.sol/Billing.json");
});

beforeEach(async () => {
  bf = await BillingFactory.deploy(500);
});

describe("Billing", () => {
  it("Should contain a default fee", async () => {
    expect((await bf.anyRateFee()).toNumber()).to.eq(500);
  });
  it("Should contain client business names", async () => {
    await bf.createBilling("corp", 3, "corp.com");
    expect((await bf.clients(0))).to.eq("corp");
  });
  it("Should enable updating the fee", async () => {
    await bf.createBilling("corp", 3, "corp.com");
    await bf.setAnyRateFee(400);
    expect((await bf.anyRateFee()).toNumber()).to.eq(400);
  });
  it("Should allow updating the AnyRate Treasury", async () => {
    // await bf.setAnyRateTreasury("0x5A0b54D5dc17e0AadC383d2db43C0a0D3E029c4c");
    // expect(await bf.anyRateTreasury()).to.eq("0x0");
  });
  it("Should enable updating the client cost per unit", async () => {
    await bf.createBilling("corp", 3, "corp.com");
    await bf.callSetCostPerUnit("corp", 4);
    const clientBillingAddress = await bf.billingContracts("corp");
    const clientBilling = new ethers.Contract(BillingABI, clientBillingAddress, ethers.getDefaultProvider());
    expect((await clientBilling.costPerUnit()).toNumber()).to.eq(4);
  });
});
