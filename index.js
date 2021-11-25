const { getSolFarmPoolInfo } = require('./leveragePools');
const { FARMS } = require('./config');
const BN = require('bn.js');
const { getCoinsUsdValue } = require('./utils');

const main = async () => {

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
     * For vault information check: https://gist.github.com/therealssj/c6049ac59863df454fb3f4ff19b529ee
     */
   const SOLFARM_PROGRAM_ID = "Bt2WPMmbwHPk36i4CRucNDyLcmoGdC7xEdrVuxgJaNE6"; //Solfarm Program ID

    let { borrowed, virtualValue, value, debt } = await getSolFarmPoolInfo(
      FARMS.RayUsdtVault, // Farm pool index on FARM object
      0, //Array position on USER_FARM | This can be 0, 1 or 2; set value accordingly
      SOLFARM_PROGRAM_ID,
      0, // RAYDIUM:0 or ORCA:1 vaults
      "1ZpdBUTiDLTUe3izSdYfRXSf93fpJPmoKtA5bFjGesS",//Pool Vault address | https://gist.github.com/therealssj/c6049ac59863df454fb3f4ff19b529ee#file-solfarm_ray_vault-json-L816
      "BN2vN85Q4HiWJL6JejX2ke82fKY7nxnFUBjAWFMC8Wcb",//Address of user to check balances
      "DVa7Qmb5ct9RCpaU7UTpSaf3GVMYz17vNVU67XpdCRut",//AMM program id | https://gist.github.com/therealssj/c6049ac59863df454fb3f4ff19b529ee#file-solfarm_ray_vault-json-L220
      "7UF3m8hDGZ6bNnHzaT2YHrhp7A7n9qFfBj6QEpHPv5S8",//Open orders program id | https://gist.github.com/therealssj/c6049ac59863df454fb3f4ff19b529ee#file-solfarm_ray_vault-json-L221
      "C3sT1R3nsw4AVdepvLTLKr5Gvszr7jufyBWUCvy4TUvT",//Address of LP Mint programm | https://gist.github.com/therealssj/c6049ac59863df454fb3f4ff19b529ee#file-solfarm_ray_vault-json-L210
      "3wqhzSB9avepM9xMteiZnbJw75zmTBDVmPFLTQAGcSMN",//Address of reserves0 token (poolCoinTokenaccount) | https://gist.github.com/therealssj/c6049ac59863df454fb3f4ff19b529ee#file-solfarm_ray_vault-json-L223
      "5GtSbKJEPaoumrDzNj4kGkgZtfDyUceKaHrPziazALC1",//Address of reserves1 token | https://gist.github.com/therealssj/c6049ac59863df454fb3f4ff19b529ee#file-solfarm_ray_vault-json-L224
      RESERVE_0_PRICE, //reserve0 usd price
      RESERVE_1_PRICE //reserve1 usd price
    );

    console.log("Borrowed:", borrowed);
    console.log("Debt:", debt);
    console.log("VirtualValue:", virtualValue);
    console.log("Value:", value);

    return {
      borrowed, virtualValue, value
    };

  } catch (error) {
    console.log(error);
    throw (error);
  };

};

main();


