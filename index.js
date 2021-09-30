const { getSolFarmPoolInfo } = require('./leveragePools');
const { FARMS } = require('./config');

const main = async () => {

  try {

    /**
     * Example usage of RAY-USDT SolFarm Leverage Pool
     * For vault information check: https://gist.github.com/therealssj/c6049ac59863df454fb3f4ff19b529ee
     */
    const RESERVE_0_PRICE = 8.97; //RAY USD VALUE
    const RESERVE_1_PRICE = 1; // USDT USD VALUE

    let { borrowed, virtualValue, value, debt } = await getSolFarmPoolInfo(
      FARMS.RayUsdtVault, //Farm pool index on FARM object}
      0, //Array position on USER_FARM}
      "Bt2WPMmbwHPk36i4CRucNDyLcmoGdC7xEdrVuxgJaNE6",//Solfarm Program ID
      "1ZpdBUTiDLTUe3izSdYfRXSf93fpJPmoKtA5bFjGesS",//Pool Vault address
      "BN2vN85Q4HiWJL6JejX2ke82fKY7nxnFUBjAWFMC8Wcb",//Address of user to check balances
      "DVa7Qmb5ct9RCpaU7UTpSaf3GVMYz17vNVU67XpdCRut",//AMM program id
      "7UF3m8hDGZ6bNnHzaT2YHrhp7A7n9qFfBj6QEpHPv5S8",//Open orders program id
      "C3sT1R3nsw4AVdepvLTLKr5Gvszr7jufyBWUCvy4TUvT",//Address of LP Mint programm
      "3wqhzSB9avepM9xMteiZnbJw75zmTBDVmPFLTQAGcSMN",//Address of reserves0 token
      "5GtSbKJEPaoumrDzNj4kGkgZtfDyUceKaHrPziazALC1",//Address of reserves1 token
      3,//RAY POOL VERSION (as seen in the pool object)
      RESERVE_0_PRICE,//reserve0 usd price}
      RESERVE_1_PRICE//reserve1 usd price
    );

    console.log("Borrowed:", borrowed);
    console.log("Debt:", debt);
    console.log("VirtualValue:", virtualValue);
    console.log("Value:", value);

    return {
      borrowed, virtualValue, value
    };

  } catch (error) {
    throw (error);
  };

};

main();


