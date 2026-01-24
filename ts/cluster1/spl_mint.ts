import { Keypair, PublicKey, Connection, Commitment } from "@solana/web3.js";
import { getOrCreateAssociatedTokenAccount, mintTo } from '@solana/spl-token';
import wallet from "../turbin3-wallet.json"

// Import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

// Create a Solana devnet connection
const commitment: Commitment = "confirmed";
const connection = new Connection("https://api.devnet.solana.com", commitment);

const token_decimals = 1_000_000_000n;

// Mint address
// REPLACE WITH YOUR MINT ADDRESS from spl_init.ts
const mint = new PublicKey("5UzGiUGMp8JU4Vv7ftYsYr3SQadj6h8b9MPLffwVq7eD");

(async () => {
    try {
        // Create an ATA (Associated Token Account)
        // This is the account that will actually hold the tokens for the user
        const ata = await getOrCreateAssociatedTokenAccount(
            connection,
            keypair,
            mint,
            keypair.publicKey
        );
        console.log(`Your ata is: ${ata.address.toBase58()}`);

        // Mint to ATA
        const mintTx = await mintTo(
            connection,
            keypair,
            mint,
            ata.address, // Destination: The ATA we just created
            keypair,      // Authority: The keypair that has minting authority
            10n * token_decimals // Minting 10 tokens
        );
        console.log(`Your mint txid: ${mintTx}`);
    } catch (error) {
        console.log(`Oops, something went wrong: ${error}`)
    }
})()