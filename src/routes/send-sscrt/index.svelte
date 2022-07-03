<script lang="ts">
    import { SecretNetworkClient } from "secretjs";
    import SendSscrt from '../send-sscrt/sendSscrt.md';
    import { onMount } from "svelte";
  
      onMount( async () => {
          const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  
          while (
            !window.keplr ||
            !window.getEnigmaUtils ||
            !window.getOfflineSignerOnlyAmino
          ) {
            await sleep(100);
          }
  
          const CHAIN_ID = "secret-4";
  
          await window.keplr.enable(CHAIN_ID);
  
          const keplrOfflineSigner = window.getOfflineSignerOnlyAmino(CHAIN_ID);
          const [{ address: myAddress }] = await keplrOfflineSigner.getAccounts();
  
          const secretjs = await SecretNetworkClient.create({
            grpcWebUrl: "https://secret-4.api.trivium.network:9091",
            chainId: CHAIN_ID,
            wallet: keplrOfflineSigner,
            walletAddress: myAddress,
            encryptionUtils: window.getEnigmaUtils(CHAIN_ID),
          });
          console.log('secretjs', secretjs);
  
          // Note: Using `window.getEnigmaUtils` is optional, it will allow
          // Keplr to use the same encryption seed across sessions for the account.
          // The benefit of this is that `secretjs.query.getTx()` will be able to decrypt
          // the response across sessions.
  
          console.log('myAddress:', myAddress);
  
          // add keplr wallet address to the sending address within html
          document.getElementById("address").append(myAddress);
          
      });
  
      // document.sendForm.onsubmit = () => {
      function onSubmit() {
        // let recipient = document.sendForm.recipient.value;
        let recipient = document.getElementById('recipient').value;
        console.log('recipient:', recipient);
        // let amount = document.sendForm.amount.value;
        let amount = document.getElementById('amount').value;
        console.log('amount:', amount);
        
        amount = parseFloat(amount);
        if (isNaN(amount)) {
            alert("Invalid amount");
            return false;
        }
      
        amount *= 1000000;
        amount = Math.floor(amount);
  
        (async () => {
          const CHAIN_ID = "secret-4";
          const keplrOfflineSigner = window.getOfflineSignerOnlyAmino(CHAIN_ID);
          const [{ address: myAddress }] = await keplrOfflineSigner.getAccounts();
  
          const secretjs = await SecretNetworkClient.create({
            grpcWebUrl: "https://secret-4.api.trivium.network:9091",
            chainId: CHAIN_ID,
            wallet: keplrOfflineSigner,
            walletAddress: myAddress,
            encryptionUtils: window.getEnigmaUtils(CHAIN_ID),
          });
  
          const sSCRTaddress = "secret1k0jntykt7e4g3y88ltc60czgjuqdy4c9e8fzek";
  
          // Can also get codeHash using `secretcli q compute contract-hash secret1k0jntykt7e4g3y88ltc60czgjuqdy4c9e8fzek`
          // const sScrtCodeHash = "af74387e276be8874f07bec3a87023ee49b0e7ebe08178c49d0a49c3c98ed60e";
          const sScrtCodeHash = await secretjs.query.compute.contractCodeHash(sSCRTaddress);
          // console.log('sScrtCodeHash:', sScrtCodeHash);
  
          //get sSCRT viewing key from Keplr
          let sSCRTviewKey = await window.keplr.getSecret20ViewingKey(CHAIN_ID, sSCRTaddress);
  
          //query sSCRT balance using view key
          const balanceQuery = { 
              balance: {
                  key: sSCRTviewKey, 
                  // address: window.accounts[0].address
                  address: myAddress
              }
          };
          // console.log('balanceQuery', balanceQuery);
  
          // this is unneeded for this operation, but it was left in because it was used for
          // info gathering and is another query example
          // const contractInfo = await secretjs.query.compute.contractInfo(sSCRTaddress);
          // console.log('contractInfo', contractInfo);
  
          // let balance = await window.secretJS.queryContractSmart(sSCRTaddress, balanceQuery);
          let balance = await secretjs.query.compute.queryContract({
            contractAddress: sSCRTaddress,
            codeHash: sScrtCodeHash, // optional but way faster 
            query: balanceQuery
          });
          console.log('balance', balance);
          balance = balance.balance.amount / 1000000;
  
          console.log('My token balance: ', balance);
  
  
          
          // Transfer some tokens
          // Amount must be a string
          let transferMsg = {
              transfer: 
              {
                  recipient: recipient, amount: String(amount)
              }
          };
          console.log('Transferring tokens');
  
          // response = await window.secretJS.execute(sSCRTaddress, transferMsg);
          let response = await secretjs.tx.compute.executeContract(
            {
              sender: myAddress,
              contractAddress: sSCRTaddress,
              codeHash: sScrtCodeHash, // optional but way faster 
              msg: transferMsg,
              sentFunds: [], //optional
            },
            {
              gasLimit: 100_000,
            }
          );
          console.log('Transfer response: ', response)
  
          // balance = await window.secretJS.queryContractSmart(sSCRTaddress, balanceQuery);
          balance = await secretjs.query.compute.queryContract({
            contractAddress: sSCRTaddress,
            codeHash: sScrtCodeHash, // optional but way faster 
            query: balanceQuery
          });
          balance = balance.balance.amount / 1000000;
          console.log('New sSCRT balance', balance)
  
          if (response.code !== undefined &&
              response.code !== 0) {
              alert("Failed to send tx: " + response.log || response.rawLog);
          } else {
              alert("Succeed to send tx");
          }
  
        // clear form input text boxes
        const inputs = document.querySelectorAll('.form-control');
        inputs.forEach(input => {
          input.value = '';
        });
  
        })();
  
        return false;
        
      };
          
  </script>
  
  <h1>Sending sSCRT using Keplr Wallet</h1>

  <div class="send-sscrt-container">
    <h2>This executes a live transaction on mainnet!</h2>

    <p>Keplr wallet must be connected or transaction will fail.</p>
    
    <div id="app">
      <div class="container-sm">
      <b>Address:</b>
      <div id="address"></div>
      <!-- <form name="sendForm"> -->
        <form on:submit|preventDefault={onSubmit}>
          <div class="form-group">
              <label for="recipient">Recipient</label>
              <input class="form-control" id="recipient" name="recipient">
          </div>
          <div class="form-group">
              <label for="amount">Amount</label>
              <div class="input-group">
                  <input class="form-control" id="amount" name="amount">
                  <div class="input-group-append">
                      <div class="input-group-text">sSCRT</div>
                  </div>
              </div>
          </div>
          <button type="submit" class="btn btn-primary">Submit</button>
      </form>
      </div>
    </div>
  </div>

  <SendSscrt />

  <style>
    .send-sscrt-container {
      background-color: rgb(39,33,46);
      border-radius: .5em;
      padding: 0.01em 1em 1.5em;
      margin: 1.5em 0;
    }
  </style>