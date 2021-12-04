
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

const {
  RPC_URL
} = require('./config');

/**
 * Given Reserve mint we fetch token.
 * @param {reserve _mint} _account base58() address
 * @returns reserve structure.
 */
const findReserveTokenByMint = (_mint) => {
  try {
    if (_mint == undefined | _mint == null)
      throw ("Missing 'mint' parameter");

    const reserve = _.find(LENDING_RESERVES, {
      mintAddress: _mint
    });

    return reserve;
  } catch (error) {
    throw (error);
  }
};

const findReserveTokenByAccount = (_account) => {
  try {
    if (_account == undefined | _account == null)
      throw ("Missing 'acount' parameter");

    const reserve = _.find(LENDING_RESERVES, {
      account: _account
    });

    return reserve;
  } catch (error) {
    throw (error);
  }
};

/**
 * 
 * @param {0 (RAY) | 1 (ORCA)} _pool number
 * @param {Pair Name as seen in gists, example: 'RAY-USDT'} _pairName string
 * @returns pool accounts
 */
const getPoolAccounts = (_pool, _pairName) => {

  try {
    const _FARM = _pool == 0 ? RAY_FARMS : ORCA_FARMS;

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
    throw (`${_pairName} pair not found, try other like: RAY-USDT`);
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

    return _bn.dp(3).toNumber();
  } catch (error) {
    console.log(error);
    throw ("Error formatting BN to USD");
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
      url: RPC_URL,
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
  findReserveTokenByMint,
  findReserveTokenByAccount,
  getPoolAccounts,
};