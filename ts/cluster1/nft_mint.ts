import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
    createSignerFromKeypair,
    signerIdentity,
    generateSigner,
    percentAmount,
} from "@metaplex-foundation/umi";
import {
    createNft,
    mplTokenMetadata,
} from "@metaplex-foundation/mpl-token-metadata";

import wallet from "../turbin3-wallet.json";
import base58 from "bs58";

const RPC_ENDPOINT = "https://api.devnet.solana.com";
const umi = createUmi(RPC_ENDPOINT);

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const myKeypairSigner = createSignerFromKeypair(umi, keypair);

// Use the keypair signer and the MPL Token Metadata program
umi.use(signerIdentity(myKeypairSigner));
umi.use(mplTokenMetadata());

// Generate a new signer for the Mint address
const mint = generateSigner(umi);

(async () => {
    try {
        // Create the NFT
        let tx = createNft(umi, {
            mint,
            name: "Rug",
            symbol: "RUG",
            // The URI from the metadata upload step (nft_metadata.ts)
            uri: "https://gateway.irys.xyz/2d7Pb1ZQVMuRfUdy2XrBaiYxmER5ZTDZVrwQkjLWr7wr",
            sellerFeeBasisPoints: percentAmount(5), // 5% royalty
        });

        let result = await tx.sendAndConfirm(umi);
        const signature = base58.encode(result.signature);

        console.log(
            `Succesfully Minted! Check out your TX here:\nhttps://explorer.solana.com/tx/${signature}?cluster=devnet`,
        );

        console.log("Mint Address: ", mint.publicKey);
    } catch (error) {
        console.log("Oops.. Something went wrong", error);
    }
})();