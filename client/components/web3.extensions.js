
export default function web3extensions (web3) {
  const {Method, formatters} = web3._extend;

  return {
    property: 'personal',
    methods: [
      new Method({
        name: 'signAndSendTransaction',
        call: 'personal_signAndSendTransaction',
        params: 2,
        inputFormatter: [formatters.inputTransactionFormatter, null]
      }),
      new Method({
        name: 'signerEnabled',
        call: 'personal_signerEnabled',
        params: 0,
        inputFormatter: []
      })
    ],
    properties: []
  };
}
