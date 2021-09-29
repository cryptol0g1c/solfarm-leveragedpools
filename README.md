# Solfarm Leveraged Pools Information

### Installation

To install dependencies run:

```npm i```

### Usage

An example usage can be found on index.js file with pre-loaded RAY-USDT Leveraged pool account addresses.

You will need the pool information with all associated accounts, like so:

```
    {
      "name": "RAY-USDT",
      "lpMintAddress": "C3sT1R3nsw4AVdepvLTLKr5Gvszr7jufyBWUCvy4TUvT",
      "rewardAMintAddress": "4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R",
      "rewardBMintAddress": "4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R",
      "programId": "EhhTKczWMGQt46ynNeRX1WfeagwwJd7ufHvCDjRxjo5Q",
      "poolId": "AvbVWpBi2e4C9HPmZgShGdPoNydG4Yw8GJvG9HUcLgce",
      "poolAuthority": "8JYVFy3pYsPSpPRsqf43KSJFnJzn83nnRLQgG88XKB8q",
      "poolLpTokenAccount": "4u4AnMBHXehdpP5tbD6qzB5Q4iZmvKKR5aUr2gavG7aw",
      "poolRewardATokenAccount": "HCHNuGzkqSnw9TbwpPv1gTnoqnqYepcojHw9DAToBrUj",
      "poolRewardBTokenAccount": "HCHNuGzkqSnw9TbwpPv1gTnoqnqYepcojHw9DAToBrUj",
      "fusion": false,
      "ammId": "DVa7Qmb5ct9RCpaU7UTpSaf3GVMYz17vNVU67XpdCRut",
      "ammOpenOrders": "7UF3m8hDGZ6bNnHzaT2YHrhp7A7n9qFfBj6QEpHPv5S8",
      "ammQuantitiesOrTargetOrders": "3K2uLkKwVVPvZuMhcQAPLF8hw95somMeNwJS7vgWYrsJ",
      "poolCoinTokenaccount": "3wqhzSB9avepM9xMteiZnbJw75zmTBDVmPFLTQAGcSMN",
      "poolPcTokenaccount": "5GtSbKJEPaoumrDzNj4kGkgZtfDyUceKaHrPziazALC1",
      "swapOrLiquidityProgramId": "675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8",
      "ammAuthority": "5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1",
      "serumProgramId": "9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin",
      "dualReward": false
    }
```
For different accounts of different pools check:
[Leverage Pool Info](https://gist.github.com/therealssj/c6049ac59863df454fb3f4ff19b529ee)

If accounts are properly setted, result will show something like:

```
Borrowed: 56363957
Debt: 56.363957
VirtualValue: 112.78646317406607
Value: 56.42250617406607
```

Note: reserve prices needs to be included in order to do proper calculations.

For more information check Solfarm discord.