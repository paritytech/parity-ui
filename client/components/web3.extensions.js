
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
      })
    ],
    properties: []
  };
}
