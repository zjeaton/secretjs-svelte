On load, this page queries the scrt balance of a hardcoded wallet and also queries the token info of the sSCRT token contract. These queries are run on mainnet.

The js code running the show:
```typescript
    import { onMount } from "svelte";

    // Sending Queries 
    import { SecretNetworkClient } from "secretjs";

    onMount( async () => {
        // To create a readonly secret.js client, just pass in a gRPC-web endpoint
        const secretjs = await SecretNetworkClient.create({
        grpcWebUrl: "https://web-rpc.roninventures.io",
        chainId: "secret-4",
        });
        console.log('secretjs', secretjs);

        // this is strictly for displaying the console.log on the page
        // without having to open the console
        const consoleLog = document.getElementById("console");

        // this block is mirroring the first console.log
        const consoleXL = document.createElement('div');
        const log1 = document.createElement('code');
        log1.innerText = `secretjs:\n\n ${ JSON.stringify(secretjs) } \n\n`;
        consoleXL.style.height = "12em";
        consoleXL.style.overflow = "scroll";
        consoleXL.style.margin = "0 0 1em";
        consoleLog.appendChild(consoleXL);
        consoleXL.appendChild(log1);

        const {
          // @ts-ignore
          balance: { amount },
        } = await secretjs.query.bank.balance(
          {
            address: "secret1ap26qrlp8mcq2pg6r47w43l0y8zkqm8a450s03",
            denom: "uscrt",
          } /*,
          // optional: query at a specific height (using an archive node) 
          new grpc.Metadata({"x-cosmos-block-height": "2000000"})
          */,
        );
    

        console.log(`I have ${ Number(amount) / 1e6 } SCRT!`);

        // this mirrors console.log on the displayed webpage
        const log2 = document.createElement('code');
        log2.innerText = `I have ${ Number(amount) / 1e6 } SCRT!\n`;
        consoleLog.appendChild(log2);

        const sSCRT = "secret1k0jntykt7e4g3y88ltc60czgjuqdy4c9e8fzek";
        // Get codeHash using `secretcli q compute contract-hash secret1k0jntykt7e4g3y88ltc60czgjuqdy4c9e8fzek`
        const sScrtCodeHash =
          "af74387e276be8874f07bec3a87023ee49b0e7ebe08178c49d0a49c3c98ed60e";

        const { token_info } = await secretjs.query.compute.queryContract({
          contractAddress: sSCRT,
          codeHash: sScrtCodeHash, // optional but way faster
          query: { token_info: {} },
        });

        console.log(`sSCRT has ${ token_info.decimals } decimals!`);

        // this mirrors console.log on the displayed webpage
        const log3 = document.createElement('code');
        log3.innerText = `sSCRT has ${ token_info.decimals } decimals!\n`;
        consoleLog.appendChild(log3);
    });

```

And the html is here. `<Query />` is a markdown file. `<script>` contains the JS, and there is no page-specific css for this page.

```html
<script>
  import Query from '../query/query.md';
  ...
</script>
    
<h1>Sending Queries</h1>

<div id="console">
    <h4>Console</h4>
</div>

<Query />

<style>
    
</style>

```