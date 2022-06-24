<script lang="ts">
import { Wallet, SecretNetworkClient, MsgSend } from "secretjs";
import { onMount } from "svelte";
import { fade } from 'svelte/transition';
import { Stretch } from 'svelte-loading-spinners';

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

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

  const array = [
    `wallet mnemonic: grant rice replace explain federal release fix clever romance raise often wild taxi quarter soccer fiber love must tape steak together observe swap guitar`,
    `wallet address: ${ myAddress }`,
    `grpcWebUrl: "https://testnet-web-rpc.roninventures.io"`,
    `chainId: "pulsar-2"`,
    `toAddress: ${ bob }`,
    `amount: 1 uSCRT`
  ];
  const txParams = document.getElementById('txParams');
  if (txParams !== null) {
    txParams.style.padding = "1em 2em .25em";
    for (const item in array) {
      let element = document.createElement('p');
      element.innerText = `${ array[item] }`;

        txParams.appendChild(element);

      if (array[item] !== array[array.length-1]) {
        await sleep(350);
      };
    };
  };

  // this is strictly for displaying the console.log on the page
  // without having to open the console
  const consoleLog = document.getElementById("console");
  const spinner = document.getElementById('spinner');
  
  if (spinner !== null) {
    spinner.style.height = "60px";
    spinner.style.visibility = "visible";
  };

  const tx = await secretjs.tx.broadcast([msg], {
    gasLimit: 20_000,
    gasPriceInFeeDenom: 0.25,
    feeDenom: "uscrt",
    memo: "Hello World",
  });
  console.log('tx', tx);

  const success = document.createElement('p');
  success.innerText = "Transaction sent successfully!";
  success.style.color = "#E26F7A";
  if (txParams !== null) {
    txParams.appendChild(success);
  };
  
  if (spinner !== null && spinner.parentNode !== null) {
    spinner.parentNode.removeChild(spinner);
  };

  // this block is mirroring the first console.log
  // consoleXL confines the enormous returned JSON object
  // to a smaller scrollable container within console
  const consoleXL = document.createElement('div');
  const log1 = document.createElement('code');
  log1.innerText = `tx:\n\n ${ JSON.stringify(tx) } \n\n`;
  consoleXL.style.height = "12em";
  consoleXL.style.overflow = "auto";
  consoleXL.style.margin = "0 0 1em";
  if (consoleLog !== null) {
    consoleLog.appendChild(consoleXL);
  };
  consoleXL.appendChild(log1);
});

</script>

<h1>Broadcasting Transactions</h1>

<p>On load, this page creates a wallet from a mnemonic and sends a message to another wallet over the pulsar-2 testnet.</p>

<div id="txParams"></div>

<div transition:fade id="console">
  <h4>Console</h4>
  <div id="spinner">
    <Stretch size="60" color="#DA4453"></Stretch>
  </div>
</div>

<style>
  #txParams {
    background-color: rgb(39, 33, 46);
    border-radius: .5em;
    overflow: auto;
  }

  #spinner {
    height: 0;
    width: 60px;
    margin: auto;
    visibility: hidden;
  }

</style>