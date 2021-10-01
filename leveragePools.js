const solanaWeb3 = require('@solana/web3.js');
const { OpenOrders } = require('@project-serum/serum');
const axios = require('axios');
const BN = require('bn.js');

const connection = new solanaWeb3.Connection(
  "https://solana-api.projectserum.com"
);

const {
  VAULT_LAYOUT,
  MINT_LAYOUT,
  LENDING_OBLIGATION_LAYOUT,
  AMM_INFO_LAYOUT_V4
} = require("./config.js");


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

/**
 *
 * @param {Authority address} authority base58
 * @param {Solfarm leveraged address } programId base58
 * @param {0 as of now} index number
 * @param {farm IDs as show on FARM object} farm number
 * @returns
 */
const findUserFarmAddress = async (
  authority,
  programId,
  index, // hardcoded to 0 for now
  farm,//check FARMS IDs
) => {

  try {
    let seeds = [
      authority.toBuffer(),
      index.toArrayLike(Buffer, "le", 8),
      farm.toArrayLike(Buffer, "le", 8),
    ];

    let k = await solanaWeb3.PublicKey.findProgramAddress(seeds, programId);

    return k;
  } catch (error) {
    throw (error);
  }

}

/**
 *
 * @param {Authority address} authority base58
 * @param {Address found with findProgramAddress } userFarmAddr base58
 * @param {Leverage programid } programId
 * @param {index obligation on USER_FARM} obligationIndex
 * @returns
 */
const findUserFarmObligationAddress = async (
  authority,
  userFarmAddr,
  programId,
  obligationIndex
) => {
  try {
    let seeds = [
      authority.toBuffer(),
      userFarmAddr.toBuffer(),
      obligationIndex.toArrayLike(Buffer, "le", 8),
    ];

    return solanaWeb3.PublicKey.findProgramAddress(seeds, programId);

  } catch (error) {
    throw (error);
  }
};


/**
 * Fetches and decodes the VAULT data to return;
 * @param {Address of the Vault to decode} _vaultAddress BASE58
 * @param {VAULT instructions to decode} _INSTRUCTIONS BORSH/struct
 * @returns
 */
const getVaultData = async (_vaultAddress, _INSTRUCTIONS) => {

  try {

    const vaultAddress = b58AddressToPubKey(_vaultAddress);

    const { data } = await connection.getAccountInfo(vaultAddress);

    let vaultData = _INSTRUCTIONS.decode(Buffer.from(data, "base64"));

    return vaultData;

  } catch (error) {
    throw (error);
  }

};

/**
 * This returns the LP amount of the user converting VaultShares to LP tokens.
 * @param {vaultShares fetched with LENDING_OBLIGATION_LAYOUT.decode} _userVaultShares
 * @param {Pool Account as seen here: https://gist.github.com/therealssj/c6049ac59863df454fb3f4ff19b529ee} _vaultAddress address
 * @returns
 */
const getDepositedLpTokens = async (_userVaultShares, _vaultAddress) => {

  try {
    let { total_vault_balance, total_vlp_shares } = await getVaultData(_vaultAddress, VAULT_LAYOUT);

    let lpTokens = (_userVaultShares.toNumber() * total_vault_balance.toNumber()) / total_vlp_shares.toNumber();

    return lpTokens;
  } catch (error) {
    throw (error);
  }

};

/**
 *
 * @param {address of LP mint of vault} _lpMintAddress base58 encoded
 * @param {address of reserves0} _poolCoinTokenaccount base58 encoded
 * @param {address of reserves1} _poolPcTokenaccount base58 encoded
 * @returns
 */
const getPoolStatus = async (_lpMintAddress, _poolCoinTokenaccount, _poolPcTokenaccount) => {

  try {
    let result;
    result = await connection.getAccountInfo(b58AddressToPubKey(_lpMintAddress));

    let mintData = MINT_LAYOUT.decode(Buffer.from(result.data, "base64"));

    let lpTotalSupply = mintData.supply.toString();
    result = await connection.getTokenAccountBalance(b58AddressToPubKey(_poolCoinTokenaccount));
    let RayBalance = result.value.amount;

    result = await connection.getTokenAccountBalance(b58AddressToPubKey(_poolPcTokenaccount));
    let UsdtBalance = result.value.amount;

    return {
      totalSupply: lpTotalSupply,
      coinBalance: RayBalance,
      pcBalance: UsdtBalance
    };

  } catch (error) {
    throw (error);
  }
};

/**
 *
 * @param {Farm pool index on FARM object} _farmIndex number
 * @param {Array position on USER_FARM} _obligationIndex number
 * @param {Solfarm Program ID} _farmProgramId address
 * @param {Pool Vault address} _vaultAddress address
 * @param {Address of user to check balances} _userAddress address
 * @param {AMM program id} _ammId address
 * @param {Open orders program id} _ammOpenOrders address
 * @param {Address of LP Mint programm} _lpMintAddress address
 * @param {Address of reserves0 token} _poolCoinTokenAccount address
 * @param {Address of reserves1 token} _poolPcTokenAccount address
 * @param {reserve0 usd price} _reserve0Price number
 * @param {reserve1 usd price} _reserve1Price number
 * @returns
 */
const getSolFarmPoolInfo = async (
  _farmIndex,
  _obligationIndex,
  _farmProgramId,
  _vaultAddress,
  _userAddress,
  _ammId,
  _ammOpenOrders,
  _lpMintAddress,
  _poolCoinTokenAccount,
  _poolPcTokenAccount,
  _reserve0Price,
  _reserve1Price,
) => {

  try {
    /**
     * Information:
     * Vault data: https://gist.github.com/therealssj/c6049ac59863df454fb3f4ff19b529ee
     *
     * coin = base
     * pc = quote
     *
     * User LpTokens * token USD value = virtual value
     * borrowed = obligationBorrowX.borrowedAmountWads
     * virtual value - borrowed  = value
     *
     */

    if (_reserve0Price == undefined || _reserve1Price == undefined)
      throw ("Reserve prices needs to be passed as parameters");

    let key = await findUserFarmAddress(
      b58AddressToPubKey(_userAddress),
      b58AddressToPubKey(_farmProgramId),
      new BN(0), // hard code to 0 for now
      new BN(_farmIndex) // index of the farm
    );

    let [userObligationAcct1] = await findUserFarmObligationAddress(
      b58AddressToPubKey(_userAddress),
      key[0],
      b58AddressToPubKey(_farmProgramId),
      new BN(0) // obligation index from the UserFarm obligations list
    );

    let accInfo = await getAccountInfo(userObligationAcct1.toBase58());

    let buf = accInfo.value.data[0];

    const dataBuffer = Buffer.from(buf, "base64");

    let decoded = LENDING_OBLIGATION_LAYOUT.decode(dataBuffer);

    let userLpTokens = await getDepositedLpTokens(decoded.vaultShares, _vaultAddress);

    /**
     * To get Pool information
     * pcBalance = Total reserve0 balances
     * coinBalance = Total reserve1 balances
     * TotalSupply = total supply of minted lp tokens
     *
   */
    let poolPosition = await getPoolStatus(_lpMintAddress, _poolCoinTokenAccount, _poolPcTokenAccount);

    let pcBalance = parseInt(poolPosition.pcBalance);
    let coinBalance = parseInt(poolPosition.coinBalance);
    let totalSupply = parseInt(poolPosition.totalSupply);

    /**
     * To get AMM ID and fetch circulating values.
     */

    let getAMMData = await getVaultData(_ammId, AMM_INFO_LAYOUT_V4);
    let needTakePnlCoin = parseInt(getAMMData.needTakePnlCoin.toString());
    let needTakePnlPc = parseInt(getAMMData.needTakePnlPc.toString());

    /**
     * Get and decode AMM Open Order values
     */
    let OPEN_ORDER_INSTRUCTIONS = OpenOrders.getLayout(b58AddressToPubKey(_ammOpenOrders));
    let openOrdersData = await getVaultData(_ammOpenOrders, OPEN_ORDER_INSTRUCTIONS);

    let baseTokenTotal = parseInt(openOrdersData.baseTokenTotal.toString());
    let quoteTokenTotal = parseInt(openOrdersData.quoteTokenTotal.toString());

    let r0Bal = (coinBalance +
      baseTokenTotal -
      needTakePnlCoin
    ) / 10 ** 6;

    let r1Bal = (pcBalance +
      quoteTokenTotal -
      needTakePnlPc
    ) / 10 ** 6;

    let poolTVL = (r0Bal * _reserve0Price) + (r1Bal * _reserve1Price);
    let unitLpValue = poolTVL / (totalSupply / 10 ** 6);

    let virtualValue = (userLpTokens * unitLpValue) / 10 ** 6;

    let borrow1 = decoded.obligationBorrowOne.borrowedAmountWads.toString();
    let borrow2 = decoded.obligationBorrowTwo.borrowedAmountWads.toString();

    let borrowed;
    let debt;

    if (borrow1 != 0) {
      borrowed = borrow1 / 10 ** 18;
      debt = (borrowed / 10 ** 6) * _reserve1Price;
    } else {
      borrowed = borrow2 / 10 ** 18;
      debt = (borrowed / 10 ** 6) * _reserve0Price;
    };

    let value = virtualValue - debt;

    let vaultInfo = {
      borrowed,
      debt,
      virtualValue,
      value
    };

    return vaultInfo;

  } catch (error) {
    throw (error);
  }

};
module.exports = {
  getSolFarmPoolInfo
};

