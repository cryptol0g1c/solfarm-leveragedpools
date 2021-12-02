const {
  getSolFarmPoolInfo
} = require('./leveragePools');

const POOLS = {
  RAYDIUM: 0,
  ORCA: 1
};

const main = async () => {

  /**
   *  Fill this with proper values
   */

  // ORCA WHETH-USDC Example
  await getVaultData(
    POOLS.ORCA,
    "WHETH-USDC",
    "BN2vN85Q4HiWJL6JejX2ke82fKY7nxnFUBjAWFMC8Wcb"
  );

  //RAYDIUM RAY_USDC EXAMPLE
  await getVaultData(
    POOLS.RAYDIUM,
    "RAY-USDC",
    "f97zRpxzr8ZmacmeWvTxpJDNVdEJeVJtqhM9cAnekca",
  );

};

const getVaultData = async (
  _pool,
  _pair,
  _userPubKey
) => {

  try {

    let { borrowed, virtualValue, value, debtValue, borrowedAsset } = await getSolFarmPoolInfo(
      _pool,
      _pair,
      _userPubKey,
    );

    console.log("User Key", _userPubKey);
    console.log("Pair", _pair);
    console.log(`Borrowed: ${borrowed} ${borrowedAsset}`);
    console.log(`Position Value: ${virtualValue} USD`);
    console.log(`Debt Value: ${debtValue} USD`);
    console.log(`Equity Value: ${value} USD`);
    console.log("");

    return {
      borrowed, virtualValue, value
    };

  } catch (error) {
    console.log(error);
  };

};


main();


