import { Account, Ed25519PrivateKey, Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";


async function main() {

    /// 3. Create aptos instance and set it to testnet
    const config = new AptosConfig({ network: Network.TESTNET });
    const aptos = new Aptos(config);

    /// 4. Wallet Account
    const PRIVATE_KEY = new Ed25519PrivateKey("ed25519-priv-0xd25d59f43b4b201ff018ae47268b3f71146533e9e351e06105be9dbe17b01871");

    const MY_ACCOUNT = Account.fromPrivateKey({
        privateKey: PRIVATE_KEY,
    });

    /// 5. Get account balance
    const myBalance = await aptos.getAccountAPTAmount({
        accountAddress: MY_ACCOUNT.accountAddress,
    });

    /// 6. Build the transaction
    const transaction = await aptos.transaction.build.simple({
        sender: MY_ACCOUNT.accountAddress,
        data: {
          function:
            "0x777b93e13ff2a1bc872eb4d099ae15a52fb70f2f01dd18d7c809e217fb0e543e::tba_exam::add_participant",
          functionArguments: [
            "0x539f880b3da2bc33d98b5efbf611eb76b6a980b0fdb15badb537767e0767d6e3",
            "Mark Rhoy M. Sabal",
            "@sqq-crypto",
            "markrhoysbl@gmail.com",
            "@sqq.crypto",
          ],
        },
      });
    
    /// 7. Sign the transaction
    const senderAuthenticator = aptos.transaction.sign({
        signer: MY_ACCOUNT,
        transaction,
    });

    /// 8. Send the transaction to APTOS BLOCKCHAINNNN
    const pendingTransaction = await aptos.transaction.submit.simple({
        transaction,
        senderAuthenticator,
    });

    /// 9. Wait for the transaction to propagate
    const txnResult = await aptos.waitForTransaction({
        transactionHash: pendingTransaction.hash,
      });
      
    console.log(
        `Transaction completed with status: ${
          txnResult.success ? "SUCCESS" : "FAILURE"
        }`
    );
}

main().catch(console.error);