"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mintTokens = void 0;
const spl_token_1 = require("@solana/spl-token");
const web3_js_1 = require("@solana/web3.js");
const address_1 = require("./address");
const connection = new web3_js_1.Connection("https://devnet.helius-rpc.com/?api-key=d78df475-693e-4990-82a9-01cbfe390f7a", "confirmed");
const mintTokens = (fromAddress, amount) => __awaiter(void 0, void 0, void 0, function* () {
    const keyPair = web3_js_1.Keypair.fromSecretKey(Uint8Array.from(JSON.parse(address_1.PRIVATE_KEY)));
    console.log("hi1");
    console.log("Creating associated token account for the new customer");
    const newCustomerMintingAddress = yield (0, spl_token_1.getOrCreateAssociatedTokenAccount)(connection, keyPair, // Payer: the keypair that will pay for the transaction
    new web3_js_1.PublicKey(address_1.TOKEN_MINT_ADDRESS), // Mint address: 
    new web3_js_1.PublicKey(fromAddress));
    console.log("hi2");
    console.log("Minting tokens");
    yield (0, spl_token_1.mintTo)(connection, keyPair, new web3_js_1.PublicKey(address_1.TOKEN_MINT_ADDRESS), // Mint address: the address of the token mint
    newCustomerMintingAddress.address, // the ATA where it'll be minted
    keyPair, // Authority: the minting authority, which is the keypair in this case
    amount);
    console.log(`Minted ${amount} tokens to the ATA of ${fromAddress}, which is ${newCustomerMintingAddress.address.toBase58()}`);
    console.log("Minting complete");
});
exports.mintTokens = mintTokens;
// export const burnTokens = async (fromAddress: string, toAddress: string, amount: number) => {
//     console.log("Burning tokens");
// }
// export const sendNativeTokens = async (fromAddress: string, toAddress: string, amount: number) => {
//     console.log("Sending native tokens");
// }
