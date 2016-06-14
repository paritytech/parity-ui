export default function web3extensions (web3) {
  const { Method } = web3._extend;

  return {
    property: 'ethcore',
    methods: [
      new Method({
        name: 'getNetChain',
        call: 'ethcore_netChain',
        params: 0
      })
    ],
    properties: []
  };
}
