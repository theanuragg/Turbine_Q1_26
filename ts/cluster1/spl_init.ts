import { Keypair, Connection, Commitment } from "@solana/web3.js";
import { createMint } from '@solana/spl-token';
import wallet from "../turbin3-wallet.json"

// Import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

// Create a Solana devnet connection
const commitment: Commitment = "confirmed";
const connection = new Connection("https://api.devnet.solana.com", commitment);

(async () => {
    try {
        // Create a new SPL Token Mint
        const mint = await createMint(
            connection,
            keypair,             // Payer of the transaction
            keypair.publicKey,   // Mint Authority: who can mint new tokens
            keypair.publicKey,   // Freeze Authority: who can freeze accounts (optional, can be null)
            9                    // Decimals: 9 is standard for SOL-like tokens (1,000,000,000 subunits = 1 Token)
        );
        console.log("Mint Address: ", mint.toBase58());
    } catch (error) {
        console.log(`Oops, something went wrong: ${error}`)
    }
})()