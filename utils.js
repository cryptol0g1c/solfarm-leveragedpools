
const solanaWeb3 = require('@solana/web3.js');
const axios = require('axios');
const BN = require('bignumber.js');

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

    if(!BN.isBigNumber(_bn))
      throw("Not big Number");

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
};