
const solanaWeb3 = require('@solana/web3.js');
const axios = require('axios');
const BN = require('bignumber.js');
const _ = require('lodash');

const {
  LENDING_RESERVES
} = require('./reserves');

const {
  RAY_VAULTS,
  ORCA_VAULTS,
} = require('./vaults');

const {
  RAY_FARMS,
  ORCA_FARMS,
} = require('./farms');

/**
 * Given Reserve account we fetch token.
 * @param {reserve account} _account base58() address
 * @returns reserve structure.
 */
const findReserveToken = (_account) => {

  try {
    if (_account == undefined | _account == null)
      throw ("Missing 'account' parameter");

    const reserve = _.find(LENDING_RESERVES, {
      account: _account
    });

    return reserve;
  } catch (error) {
    throw (error);
  }

};

const findVaultInfo = (_vault, _name) => {
  try {

    if (_name == undefined)
      throw ("Missing 'name' parameter");

    const vault = _vault == 0 ? RAY_VAULTS : ORCA_VAULTS;

    const vaultInfo = _.find(vault, {
      name: _name
    });

    console.log(vaultInfo);
    return vault;

  } catch (error) {
    throw (error);
  }
};

/** DATA EXAMPLE
 * RAYDIUM RAY-USDT
 * FARMS.RayUsdtVault,                             // Farm pool index on FARM object
  0,                                              // Array position on USER_FARM | This can be 0, 1 or 2; set value accordingly
  SOLFARM_PROGRAM_ID,                             // SOLFARM Program ID (DO NOT MODIFY)
  0,                                              // RAYDIUM:0 or ORCA:1 vaults
  "1ZpdBUTiDLTUe3izSdYfRXSf93fpJPmoKtA5bFjGesS",  // Pool "account" | VAULTS
  "CN8k9NFPZgGdk5QrXXMN1KSD5asWfMwyYHtjMMPTyLSF", // Address of user to check balances | user
  "DVa7Qmb5ct9RCpaU7UTpSaf3GVMYz17vNVU67XpdCRut", // ammId | FARMS
  "7UF3m8hDGZ6bNnHzaT2YHrhp7A7n9qFfBj6QEpHPv5S8", // ammOpenOrders | FARMS
  "C3sT1R3nsw4AVdepvLTLKr5Gvszr7jufyBWUCvy4TUvT", // lpMintAddress | FARMS
  "3wqhzSB9avepM9xMteiZnbJw75zmTBDVmPFLTQAGcSMN", // poolCoinTokenaccount | FARMS
  "5GtSbKJEPaoumrDzNj4kGkgZtfDyUceKaHrPziazALC1", // poolPcTokenAccount | FARMS
 ** /
 */

/**
 * 
 * @param {0 (RAY) | 1 (ORCA)} _pool number
 * @param {Pair Name as seen in gists, example: 'RAY-USDT'} _pairName string
 * @returns pool accounts
 */
const getPoolAccounts = (_pool, _pairName) => {

  try {
    const _FARM = _pool == 0 ? RAY_FARMS : ORCA_FARMS;

    //TODO: Better error ir PAIR does not exist.
    let baseMint;
    let quoteMint;
    let _account;

    if (_pool == 0) {

      const {
        account,
        serumBaseMint,
        serumQuoteMint
      } = _.find(RAY_VAULTS, { name: _pairName });
      _account = account;
      baseMint = serumBaseMint;
      quoteMint = serumQuoteMint;

    } else {
      const {
        account,
        swap_token_a_mint,
        swap_token_b_mint
      } = _.find(ORCA_VAULTS, { name: _pairName });

      _account = account;
      baseMint = swap_token_a_mint;
      quoteMint = swap_token_b_mint;
    }


    const {
      ammId,
      ammOpenOrders,
      lpMintAddress,
      poolCoinTokenaccount,
      poolPcTokenaccount,
      index,
    } = _.find(_FARM, { name: _pairName });

    return {
      account: _account,
      ammId,
      ammOpenOrders,
      lpMintAddress,
      poolCoinTokenaccount,
      poolPcTokenaccount,
      farmIndex: index,
      baseMint,
      quoteMint,
    };
  } catch (error) {
    console.log(`Error fetching pool accounts: ${error}`);
    throw (error);
  }

};


/**
* Gets USD value of given token from Coingecko
* @returns used value
*/
const getCoinsUsdValue = async (_tokenId) => {

  try {

    if (_tokenId == undefined || _tokenId == null)
      throw ("Missing Parameters");

    let BASE_URL = 'https://api.coingecko.com/api/v3';
    let URL_PARAMS = `/simple/price?ids=${_tokenId}&vs_currencies=usd`

    const config = {
      method: 'GET',
      url: `${BASE_URL}${URL_PARAMS}`
    };

    let result = await axios(config);
    return result.data[_tokenId].usd;

  } catch (error) {
    console.log(error.message);
    throw (error);
  }

};

/**
 *
 * @param {big number to format to} _bn
 * @returns formatted bignumber for USD fiat rep.
 */
const bnToFiatUsd = (_bn) => {

  try {

    if (!BN.isBigNumber(_bn))
      throw ("Not big Number");

    return _bn.dp(2).toNumber();
  } catch (error) {
    console.log(`Error formatting BN to USD: ${error}`);
    throw (error);
  }

};

/**
 *
 * @param {Account address to get info from} _address returns information of the account address using Solana RPC
 * @returns
 */
const getAccountInfo = async (_address) => {

  try {
    const data = JSON.stringify({
      "jsonrpc": "2.0",
      "id": 1,
      "method": "getAccountInfo",
      "params": [
        `${_address}`,
        {
          "encoding": "jsonParsed"
        }
      ]
    });

    const config = {
      method: 'post',
      url: 'https://solana-api.projectserum.com',
      headers: {
        'Content-Type': 'application/json'
      },
      data: data
    };

    let result = await axios(config);
    return result.data.result;

  } catch (error) {
    console.log(error);
  }

};

/**
 *
 * @param {Address to convert to PubKey} _address Base58
 * @returns PubKey
 */
const b58AddressToPubKey = (_address) => {

  try {
    let pubKey = new solanaWeb3.PublicKey(_address);
    return pubKey;
  } catch (error) {
    throw (error);
  }
};

module.exports = {
  getCoinsUsdValue,
  getAccountInfo,
  b58AddressToPubKey,
  bnToFiatUsd,
  findReserveToken,
  findVaultInfo,
  getPoolAccounts,
};