const { ethers } = require("hardhat");
const hre = require("hardhat");
const config = require("../src/config.json");

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), "ether");
};

const wait = (seconds) => {
  const milliseconds = seconds * 1000;
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

async function main() {
  // Fetch accounts from wallet - these are unlocked
  const accounts = await ethers.getSigners();

  //Fetch network
  const { chainId } = await ethers.provider.getNetwork();
  console.log("Using chainId:", chainId);

  //Fetch deployed tokens
  const DApp = await ethers.getContractAt(
    "Token",
    config[chainId].DApp.address
  );
  console.log(`Dapp Token fetch: ${DApp.address}\n`);

  const mETH = await ethers.getContractAt(
    "Token",
    config[chainId].mETH.address
  );
  console.log(`mETH token fetch: ${mETH.address}\n`);

  const mDAI = await ethers.getContractAt(
    "Token",
    config[chainId].mDAI.address
  );
  console.log(`mDAI Token fetch: ${mDAI.address}\n`);

  // Fetch the deployed exchange
  const exchange = await ethers.getContractAt(
    "Exchange",
    config[chainId].exchange.address
  );
  console.log(`Exchange fetch: ${exchange.address}\n`);

  // Give tokens to account[1]
  //sender is the deployer and has all the tokens(both mETH & mDAI), so we transfer some to reciever
  const sender = accounts[0];
  const receiver = accounts[1];
  let amount = tokens(10000);

  // user1 transfers 10,000 mETH...
  let transaction, result;
  transaction = await mETH.connect(sender).transfer(receiver.address, amount);
  console.log(
    `Transferred ${amount} tokens from ${sender.address} to ${receiver.address}\n`
  );

  //Set up exchange users
  const user1 = accounts[0];
  const user2 = accounts[1];
  amount = tokens(10000);

  //user1 approves 10,000 Dapp...
  transaction = await DApp.connect(user1).approve(exchange.address, amount);
  await transaction.wait();
  console.log(`Approved ${amount} Dapp tokens from ${user1.address}`);

  //user1 deposits 10,000 DApp...
  transaction = await exchange
    .connect(user1)
    .depositToken(DApp.address, amount);
  await transaction.wait();
  console.log(`Deposited ${amount} Dapp tokens from ${user1.address}\n`);

  //User 2 approves mETH
  transaction = await mETH.connect(user2).approve(exchange.address, amount);
  await transaction.wait();
  console.log(`Approved ${amount} mETH tokens from ${user2.address}`);

  //User 2 Deposits mETH
  transaction = await exchange
    .connect(user2)
    .depositToken(mETH.address, amount);
  await transaction.wait();
  console.log(`Deposited ${amount} mETH tokens from ${user2.address}\n`);

  /////////////////////////////////////////////////////////////////////////////
  //Seed a Cancelled Order
  //

  //User 1 makes order to get token
  let orderId;
  transaction = await exchange
    .connect(user1)
    .makeOrder(mETH.address, tokens(100), DApp.address, tokens(5));
  result = await transaction.wait();
  console.log(`made order from ${user1.address}`);

  // User 1 cancels order
  //here we get the id by using the order event
  orderId = result.events[0].args.id;
  transaction = await exchange.connect(user1).cancelOrder(orderId);
  result = await transaction.wait();
  console.log(`Cancelled order from ${user1.address}\n`);

  //Wait 1 second
  await wait(1);

  ////////////////////////////////////////////////////////////////////////////
  //Seed filled Order

  //User 1 makes order
  transaction = await exchange
    .connect(user1)
    .makeOrder(mETH.address, tokens(100), DApp.address, tokens(10));
  result = await transaction.wait();
  console.log(`made order from ${user1.address}`);

  //here we get the id by using the order event
  orderId = result.events[0].args.id;
  transaction = await exchange.connect(user2).fillOrder(orderId);
  result = await transaction.wait();
  console.log(`Filled order from ${user1.address}\n`);

  //Wait 1 second
  await wait(1);

  //User 1 makes another order
  transaction = await exchange
    .connect(user1)
    .makeOrder(mETH.address, tokens(50), DApp.address, tokens(15));
  result = await transaction.wait();
  console.log(`made order from ${user1.address}`);

  //User 2 fills another order
  orderId = result.events[0].args.id;
  transaction = await exchange.connect(user2).fillOrder(orderId);
  result = await transaction.wait();
  console.log(`Filled order from ${user1.address}\n`);

  //Wait 1 second
  await wait(1);

  //User 1 makes final order
  transaction = await exchange
    .connect(user1)
    .makeOrder(mETH.address, tokens(50), DApp.address, tokens(15));
  result = await transaction.wait();
  console.log(`made order from ${user1.address}`);

  //User 2 fills final order
  orderId = result.events[0].args.id;
  transaction = await exchange.connect(user2).fillOrder(orderId);
  result = await transaction.wait();
  console.log(`Filled order from ${user1.address}\n`);

  //Wait 1 second
  await wait(1);

  ///////////////////////////////////////////////////////////
  // Seed Open Orders
  //

  //User 10 makes orders
  for (let i = 1; i <= 10; i++) {
    transaction = await exchange
      .connect(user1)
      .makeOrder(mETH.address, tokens(10 * i), DApp.address, tokens(10));
    result = await transaction.wait();
    console.log(`made order from ${user1.address}`);

    //Wait 1 second
    await wait(1);
  }

  //User 2 makes 10 orders
  for (let i = 1; i <= 10; i++) {
    transaction = await exchange
      .connect(user2)
      .makeOrder(DApp.address, tokens(10), mETH.address, tokens(10 * i));
    result = await transaction.wait();
    console.log(`made order from ${user2.address}`);

    //Wait 1 second
    await wait(1);
  }
}
// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
