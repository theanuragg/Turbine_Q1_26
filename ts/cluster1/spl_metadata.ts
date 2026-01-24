import wallet from "../turbin3-wallet.json";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  createMetadataAccountV3,
  CreateMetadataAccountV3InstructionAccounts,
  CreateMetadataAccountV3InstructionArgs,
  DataV2Args,
  findMetadataPda,
  updateMetadataAccountV2,
} from "@metaplex-foundation/mpl-token-metadata";
import {
  createSignerFromKeypair,
  signerIdentity,
  publicKey,
} from "@metaplex-foundation/umi";
import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";

// Define our Mint address
const mint = publicKey("5UzGiUGMp8JU4Vv7ftYsYr3SQadj6h8b9MPLffwVq7eD");

// Create a UMI connection
const umi = createUmi("https://api.devnet.solana.com");
const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);
umi.use(signerIdentity(createSignerFromKeypair(umi, keypair)));

(async () => {
  try {
    // Start here
    let accounts: CreateMetadataAccountV3InstructionAccounts = {
      mint: mint,
      mintAuthority: signer,
    };

    let data: DataV2Args = {
      name: "My Token",
      symbol: "MYT",
      uri: "https://example.com/token-metadata.json",
      sellerFeeBasisPoints: 500, // 5%
      creators: null,
      collection: null,
      uses: null,
    };

    let args: CreateMetadataAccountV3InstructionArgs = {
      data: data,
      isMutable: true,
      collectionDetails: null,
    };

    // Create the metadata account
    // let tx = createMetadataAccountV3(
    //     umi,
    //     {
    //         ...accounts,
    //         ...args
    //     }
    // )

    // update the metadata account
    const metadatapda = findMetadataPda(umi, { mint });
    const tx = updateMetadataAccountV2(umi, {
      metadata: metadatapda,
      data: data,
      isMutable: true,
      newUpdateAuthority: null,
      primarySaleHappened: null,
      updateAuthority: signer,
    });

    let result = await tx.sendAndConfirm(umi);
    console.log(bs58.encode(result.signature));
  } catch (e) {
    console.error(`Oops, something went wrong: ${e}`);
  }
})();