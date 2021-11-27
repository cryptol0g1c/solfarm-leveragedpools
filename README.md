# Solfarm Leveraged Pools Information

### Installation

To install dependencies run:

```npm i```

### Usage

An example usage can be found on index.js file with pre-loaded RAY-USDT (RAYDIUM) or SOL-USDC (ORCA)

```
ORCA SOL_USDC Example
//await OrcaVaultExample();
  
RAYDIUM RAY_USDT EXAMPLE
//await RayVaultExample();
```

Uncomment example you want to test.

To fetch all accounts of each pools check:
- [SOLFARM RAYDIUM Pool Info](https://gist.github.com/therealssj/c6049ac59863df454fb3f4ff19b529ee)
- [SOLFARM ORCA Pool Info](https://gist.github.com/therealssj/c42df1c34c3a385c07fddda6df47d248)

If accounts and parameters are properly setted up, result will show something like:

```
//ORCA SOL-USDC Pool
Borrowed: 0.061414381
VirtualValue: 23.829277143471057
Value: 11.886022470401057
```

Note: reserve prices needs to be included in order to do proper calculations.

For more information check Solfarm discord.