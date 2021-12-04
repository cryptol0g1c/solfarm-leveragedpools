# Solfarm Leveraged Pools Information

### Installation

To install dependencies run:

```npm i```

### Usage

An example usage can be found on index.js file with pre-loaded (RAYDIUM) and(ORCA)

```
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
    "H5WK8gBgjRzdvRuC6tdoNRNjrfnxrmifjgxiAmShagmn",
  );
```

Complete the parameters with proper values:

1. Param is the pool project: POOLS.RAYDIUM or POOLS.ORCA
2. Pair name as seen in [Tulip Site](https://tulip.garden) site, example "RAY-USDC"
3. User PubKey.

The script will fetch all needed accounts automatically.

After completing the parameters just run:

```
npm run fetch
```

An example response look like this:

```
Reserve0: RAY price: 11.16 USD
Reserve1: USDC price: 1 USD
User Key f97zRpxzr8ZmacmeWvTxpJDNVdEJeVJtqhM9cAnekca
Pair RAY-USDC
Borrowed: 98.522212 USDC
Position Value: 148 USD
Debt Value: 98.522 USD
Equity Value: 49.477 USD
```

Note: reserve prices needs to be included in order to do proper calculations.

For more information check Solfarm discord.