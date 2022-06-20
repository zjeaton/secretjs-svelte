<script>
    import { Wallet, SecretNetworkClient, MsgSend, MsgMultiSend } from "secretjs";

const doIt = async () => {
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
};
doIt();
</script>

<h1>Broadcasting Transactions</h1>

<p>On load, this page creates a wallet from a mnemonic and sends a message to another wallet over the pulsar-2 testnet.</p>