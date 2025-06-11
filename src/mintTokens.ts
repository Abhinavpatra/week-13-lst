import { createBurnCheckedInstruction, getAssociatedTokenAddress, getOrCreateAssociatedTokenAccount, mintTo, TOKEN_2022_PROGRAM_ID } from "@solana/spl-token";
import { Connection, Keypair, PublicKey, sendAndConfirmTransaction, Transaction } from "@solana/web3.js";
import { PRIVATE_KEY, PUBLIC_KEY, TOKEN_MINT_ADDRESS } from "./address";



    const connection = new Connection("https://devnet.helius-rpc.com/?api-key=d78df475-693e-4990-82a9-01cbfe390f7a", "confirmed");
    const keyPair = Keypair.fromSecretKey(Uint8Array.from(JSON.parse(PRIVATE_KEY)))

    const mint = new PublicKey(TOKEN_MINT_ADDRESS) // Mint address: the address of the token mint    

export const mintTokens = async (fromAddress: string, amount: number) => {
    
    console.log("hi1");
    console.log("Creating associated token account for the new customer");
    
    const newCustomerMintingAddress =  await getOrCreateAssociatedTokenAccount(
        connection,
        keyPair, // Payer: the keypair that will pay for the transaction
        mint,
        new PublicKey(fromAddress), // Owner: the address of the account that will own the new token account
        false,
        undefined,
        undefined,
    )
    console.log("hi2")

    console.log("Minting tokens");

    await mintTo(
        connection,
        keyPair,
        mint,
        newCustomerMintingAddress.address, // the ATA where it'll be minted
        keyPair, // Authority: the minting authority or PublicKey
        amount
    );
        console.log(`Minted ${amount} tokens to the ATA of ${fromAddress}, which is ${newCustomerMintingAddress.address.toBase58()}`);
      
        console.log("Minting complete");
}   



export const burnTokens = async ( amount: number) => {
    
    console.log("Burning tokens");
    const tokenAccount = await getAssociatedTokenAddress(
        mint,
        keyPair.publicKey,
        false,
    )

    // can use 3 functions to burn tokens: createBurnCheckedInstruction, burn, burnChecked. 
    // oh and also createBurnInstruction
    console.log("Burning tokens from the token account: ", tokenAccount);
    const instruction = createBurnCheckedInstruction(
        tokenAccount,
        mint,
        keyPair.publicKey,
        amount,
        9,
        [],
    )
    const transaction = new Transaction().add(instruction);
    const signature = await sendAndConfirmTransaction(connection,transaction,[
        keyPair
    ])

}

export const sendNativeTokens = async (fromAddress: string, amount: number) => {
    console.log("Sending native tokens");
}