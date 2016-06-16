export default function web3extensions (web3) {
  const { Method } = web3._extend;

  return {
    property: 'ethcore',
    methods: [
      new Method({
        name: 'getNetChain',
        call: 'ethcore_netChain',
        params: 0
      }),
      new Method({
        name: 'gasPriceStatistics',
        call: 'ethcore_gasPriceStatistics',
        params: 0,
        outputFormatter: a => a.map(web3.toBigNumber)
      })
    ],
    properties: []
  };
}
