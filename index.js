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
     * Example usage of RAY-USDT SolFarm Leverage Pool
     * For vault information check: https://gist.github.com/therealssj/c6049ac59863df454fb3f4ff19b529ee#file-solfarm_ray_vault-json-L815
     */

    let { borrowed, virtualValue, value } = await getSolFarmPoolInfo(
      FARMS.RayUsdtVault,                             // Farm pool index on FARM object
      0,                                              // Array position on USER_FARM | This can be 0, 1 or 2; set value accordingly
      SOLFARM_PROGRAM_ID,                             // SOLFARM Program ID (DO NOT MODIFY)
      0,                                              // RAYDIUM:0 or ORCA:1 vaults
      "1ZpdBUTiDLTUe3izSdYfRXSf93fpJPmoKtA5bFjGesS",  // Pool "account" | VAULTS
      "CN8k9NFPZgGdk5QrXXMN1KSD5asWfMwyYHtjMMPTyLSF", // Address of user to check balances | user
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
     * Example usage of ORCA SOL-USDC SolFarm Leverage Pool
     * For vault information check: https://gist.github.com/therealssj/c42df1c34c3a385c07fddda6df47d248#file-solfarm_orca_vaults-json-L109
     */
    let { borrowed, virtualValue, value } = await getSolFarmPoolInfo(
      FARMS.SolUsdcOrcaVault,                         // Farm pool index on FARM object
      0,                                              // This can be 0, 1 or 2; set value accordingly
      SOLFARM_PROGRAM_ID,                             // SOLFARM Program ID (DO NOT MODIFY)
      1,                                              // RAYDIUM:0 or ORCA:1 vaults
      "5Qk3dT58AmbGvgADpauiUaUccb4EPSUxvJaVHcUzVUT3", // Pool "account" | ESTO ES VAULTS
      "BN2vN85Q4HiWJL6JejX2ke82fKY7nxnFUBjAWFMC8Wcb", // Address of user to check balances | USER
      "EGZ7tiLeH62TPV1gL8WwbXGzEPa9zmcpVnnkPKKnrE2U", // AMM program id | FARMS 
      "11111111111111111111111111111111",             // Open orders program id
      "APDFRM3HMr8CAGXwKHiu2f5ePSpaiEJhaURwhsRrUUt9", // lpMintAddress | FARMS
      "ANP74VNsHwSrq9uUSjiSNyNWvf6ZPrKTmE4gHoNd13Lg", // Address of reserves0 token (poolCoinTokenaccount) | FARMS
      "75HgnSvXbWKZBpZHveX68ZzAhDqMzNDS29X6BGLtxMo1", // Address of reserves1 token (poolPcTokenAccount) | FARMS
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


