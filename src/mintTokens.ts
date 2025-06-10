import { getOrCreateAssociatedTokenAccount, mintTo } from "@solana/spl-token";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import { PRIVATE_KEY, PUBLIC_KEY, TOKEN_MINT_ADDRESS } from "./address";


const connection = new Connection("https://devnet.helius-rpc.com/?api-key=d78df475-693e-4990-82a9-01cbfe390f7a", "confirmed");
export const mintTokens = async (fromAddress: string, amount: number) => {
    const keyPair = Keypair.fromSecretKey(Uint8Array.from(JSON.parse(PRIVATE_KEY)))
    console.log("hi1");
    console.log("Creating associated token account for the new customer");
    
    const newCustomerMintingAddress =  await getOrCreateAssociatedTokenAccount(
        connection,
        keyPair, // Payer: the keypair that will pay for the transaction
        new PublicKey(TOKEN_MINT_ADDRESS), // Mint address: 
        new PublicKey(fromAddress), // Owner: the address of the account that will own the new token account
    )
    console.log("hi2")

    console.log("Minting tokens");

    await mintTo(
        connection,
        keyPair,
        new PublicKey(TOKEN_MINT_ADDRESS), // Mint address: the address of the token mint
        newCustomerMintingAddress.address, // the ATA where it'll be minted
        keyPair, // Authority: the minting authority, which is the keypair in this case
        amount);
        console.log(`Minted ${amount} tokens to the ATA of ${fromAddress}, which is ${newCustomerMintingAddress.address.toBase58()}`);
    console.log("Minting complete");

}   

// export const burnTokens = async (fromAddress: string, toAddress: string, amount: number) => {
//     console.log("Burning tokens");
// }

// export const sendNativeTokens = async (fromAddress: string, toAddress: string, amount: number) => {
//     console.log("Sending native tokens");
// }