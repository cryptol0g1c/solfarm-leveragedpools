const BN = require('bignumber.js');
const { getSolFarmPoolInfo } = require('./leveragePools');

const {
  FARMS,
  SOLFARM_PROGRAM_ID
} = require('./config');

const { getCoinsUsdValue } = require('./utils');

const main = async () => {

  /**
   *  Uncomment Orca or Raydium examples to fetch data.
   * Please take into account that user pubkey address used here might have no funds when tested. 
   */
  
  // ORCA SOL_USDC Example
  //await OrcaVaultExample();
  
  // RAYDIUM RAY_USDT EXAMPLE
  await RayVaultExample();

};

const RayVaultExample = async () => {

  try {

    /**
     * This fetches token values directly from Coingecko API
     * Check it's doc for proper string ID
     * TODO: Better to send all ids in a single query.
     */
    const RAY_USD = await getCoinsUsdValue("raydium");
    const USDC = await getCoinsUsdValue("usd-coin");

    const RESERVE_0_PRICE = new BN(RAY_USD); //RAY USD VALUE
    const RESERVE_1_PRICE = new BN(USDC); // USDT USD VALUE

    /**
     * Example usage of RAY-USDT SolFarm Leverage Pool
     * For vault information check: https://gist.github.com/therealssj/c6049ac59863df454fb3f4ff19b529ee#file-solfarm_ray_vault-json-L815
     */

    let { borrowed, virtualValue, value } = await getSolFarmPoolInfo(
      FARMS.RayUsdtVault,                             // Farm pool index on FARM object
      0,                                              // Array position on USER_FARM | This can be 0, 1 or 2; set value accordingly
      SOLFARM_PROGRAM_ID,                             // SOLFARM Program ID (DO NOT MODIFY)
      0,                                              // RAYDIUM:0 or ORCA:1 vaults
      "1ZpdBUTiDLTUe3izSdYfRXSf93fpJPmoKtA5bFjGesS",  // Pool "account"
      "CN8k9NFPZgGdk5QrXXMN1KSD5asWfMwyYHtjMMPTyLSF", // Address of user to check balances
      "DVa7Qmb5ct9RCpaU7UTpSaf3GVMYz17vNVU67XpdCRut", // AMM program id
      "7UF3m8hDGZ6bNnHzaT2YHrhp7A7n9qFfBj6QEpHPv5S8", // Open orders program id
      "C3sT1R3nsw4AVdepvLTLKr5Gvszr7jufyBWUCvy4TUvT", // lpMintAddress
      "3wqhzSB9avepM9xMteiZnbJw75zmTBDVmPFLTQAGcSMN", // Address of reserves0 token (poolCoinTokenaccount)
      "5GtSbKJEPaoumrDzNj4kGkgZtfDyUceKaHrPziazALC1", // Address of reserves1 token (poolPcTokenAccount)
      RESERVE_0_PRICE,                                //reserve0 usd price
      RESERVE_1_PRICE                                 //reserve1 usd price
    );

    console.log("Borrowed:", borrowed);
    console.log("VirtualValue:", virtualValue);
    console.log("Value:", value);

    return {
      borrowed, virtualValue, value
    };

  } catch (error) {
    console.log(error);
  };

};


const OrcaVaultExample = async () => {

  try {

    /**
     * This fetches token values directly from Coingecko API
     * Check it's doc for proper string ID
     * TODO: Better to send all ids in a single query.
     */
    const SOL_USD = await getCoinsUsdValue("solana");
    const USDC = await getCoinsUsdValue("usd-coin");

    const RESERVE_0_PRICE = new BN(SOL_USD); //RAY USD VALUE
    const RESERVE_1_PRICE = new BN(USDC); // USDT USD VALUE

    /**
     * Example usage of ORCA SOL-USDC SolFarm Leverage Pool
     * For vault information check: https://gist.github.com/therealssj/c42df1c34c3a385c07fddda6df47d248#file-solfarm_orca_vaults-json-L109
     */
    let { borrowed, virtualValue, value } = await getSolFarmPoolInfo(
      FARMS.SolUsdcOrcaVault,                         // Farm pool index on FARM object
      0,                                              // This can be 0, 1 or 2; set value accordingly
      SOLFARM_PROGRAM_ID,                             // SOLFARM Program ID (DO NOT MODIFY)
      1,                                              // RAYDIUM:0 or ORCA:1 vaults
      "5Qk3dT58AmbGvgADpauiUaUccb4EPSUxvJaVHcUzVUT3", // Pool "account"
      "BN2vN85Q4HiWJL6JejX2ke82fKY7nxnFUBjAWFMC8Wcb", // Address of user to check balances
      "EGZ7tiLeH62TPV1gL8WwbXGzEPa9zmcpVnnkPKKnrE2U", // AMM program id
      "11111111111111111111111111111111",             // Open orders program id
      "APDFRM3HMr8CAGXwKHiu2f5ePSpaiEJhaURwhsRrUUt9", // lpMintAddress
      "ANP74VNsHwSrq9uUSjiSNyNWvf6ZPrKTmE4gHoNd13Lg", // Address of reserves0 token (poolCoinTokenaccount)
      "75HgnSvXbWKZBpZHveX68ZzAhDqMzNDS29X6BGLtxMo1", // Address of reserves1 token (poolPcTokenAccount)
      RESERVE_0_PRICE,                                //reserve0 usd price  
      RESERVE_1_PRICE                                 //reserve1 usd price
    );

    console.log("Borrowed:", borrowed);
    console.log("VirtualValue:", virtualValue);
    console.log("Value:", value);

    return {
      borrowed, virtualValue, value
    };

  } catch (error) {
    console.log(error);
  };

};

main();


