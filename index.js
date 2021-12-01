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
  
  // ORCA SOL_USDC Example
  await getVaultData(
    POOLS.ORCA,
    "ORCA-USDC",
    "BN2vN85Q4HiWJL6JejX2ke82fKY7nxnFUBjAWFMC8Wcb"
  );
  
  // RAYDIUM RAY_USDT EXAMPLE
  await getVaultData(
    POOLS.RAYDIUM,
    "RAY-USDT",
    "BN2vN85Q4HiWJL6JejX2ke82fKY7nxnFUBjAWFMC8Wcb",
  );

};

const getVaultData = async (
    _pool,
    _pair,
    _userPubKey
  ) => {

  try {

    let { borrowed, virtualValue, value } = await getSolFarmPoolInfo(
      _pool,
      _pair,
      _userPubKey,
    );
    
    console.log("User Key", _userPubKey);
    console.log("Pair", _pair);
    console.log("Borrowed:", borrowed);
    console.log("VirtualValue:", virtualValue);
    console.log("Value:", value);
    console.log("--")

    return {
      borrowed, virtualValue, value
    };

  } catch (error) {
    console.log(error);
  };

};


main();


