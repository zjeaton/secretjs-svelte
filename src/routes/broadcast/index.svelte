<script lang="ts">
import { Wallet, SecretNetworkClient, MsgSend } from "secretjs";
import { onMount } from "svelte";

onMount( async () => {
  const wallet = new Wallet(
    "grant rice replace explain federal release fix clever romance raise often wild taxi quarter soccer fiber love must tape steak together observe swap guitar",
  );
  const myAddress = wallet.address;
  // To create a signer secret.js client, also pass in a wallet
  const secretjs = await SecretNetworkClient.create({
    grpcWebUrl: "https://testnet-web-rpc.roninventures.io",
    chainId: "pulsar-2",
    wallet: wallet,
    walletAddress: myAddress,
  });
  const bob = "secret1dgqnta7fwjj6x9kusyz7n8vpl73l7wsm0gaamk";
  const msg = new MsgSend({
    fromAddress: myAddress,
    toAddress: bob,
    amount: [{ denom: "uscrt", amount: "1" }],
  });
  const tx = await secretjs.tx.broadcast([msg], {
    gasLimit: 20_000,
    gasPriceInFeeDenom: 0.25,
    feeDenom: "uscrt",
    memo: "Hello World",
  });
  console.log('tx', tx);
  // this is strictly for displaying the console.log on the page
  // without having to open the console
  if (document.getElementById("console")) {
    const consoleLog = document.getElementById("console");
  
    // this block is mirroring the first console.log
    // consoleXL confines the enormous returned JSON object
    // to a smaller scrollable container within console
    const consoleXL = document.createElement('div');
    const log1 = document.createElement('code');
    log1.innerText = `secretjs:\n\n ${ JSON.stringify(tx) } \n\n`;
    consoleXL.style.height = "12em";
    consoleXL.style.overflow = "scroll";
    consoleXL.style.margin = "0 0 1em";
    if (consoleLog !== null) {
      consoleLog.appendChild(consoleXL);
    };
    consoleXL.appendChild(log1);
  };
});

</script>

<h1>Broadcasting Transactions</h1>



<p>On load, this page creates a wallet from a mnemonic and sends a message to another wallet over the pulsar-2 testnet.</p>

<div id="console">
  <h4>Console</h4>
</div>