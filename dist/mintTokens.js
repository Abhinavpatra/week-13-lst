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
exports.sendNativeTokens = exports.burnTokens = exports.mintTokens = void 0;
const spl_token_1 = require("@solana/spl-token");
const web3_js_1 = require("@solana/web3.js");
const address_1 = require("./address");
const connection = new web3_js_1.Connection("https://devnet.helius-rpc.com/?api-key=d78df475-693e-4990-82a9-01cbfe390f7a", "confirmed");
const keyPair = web3_js_1.Keypair.fromSecretKey(Uint8Array.from(JSON.parse(address_1.PRIVATE_KEY)));
const mint = new web3_js_1.PublicKey(address_1.TOKEN_MINT_ADDRESS); // Mint address: the address of the token mint    
const mintTokens = (fromAddress, amount) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("hi1");
    console.log("Creating associated token account for the new customer");
    const newCustomerMintingAddress = yield (0, spl_token_1.getOrCreateAssociatedTokenAccount)(connection, keyPair, // Payer: the keypair that will pay for the transaction
    mint, new web3_js_1.PublicKey(fromAddress), // Owner: the address of the account that will own the new token account
    false, undefined, undefined);
    console.log("hi2");
    console.log("Minting tokens");
    yield (0, spl_token_1.mintTo)(connection, keyPair, mint, newCustomerMintingAddress.address, // the ATA where it'll be minted
    keyPair, // Authority: the minting authority or PublicKey
    amount);
    console.log(`Minted ${amount} tokens to the ATA of ${fromAddress}, which is ${newCustomerMintingAddress.address.toBase58()}`);
    console.log("Minting complete");
});
exports.mintTokens = mintTokens;
const burnTokens = (amount) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Burning tokens");
    const tokenAccount = yield (0, spl_token_1.getAssociatedTokenAddress)(mint, keyPair.publicKey, false);
    // can use 3 functions to burn tokens: createBurnCheckedInstruction, burn, burnChecked. 
    // oh and also createBurnInstruction
    console.log("Burning tokens from the token account: ", tokenAccount);
    const instruction = (0, spl_token_1.createBurnCheckedInstruction)(tokenAccount, mint, keyPair.publicKey, amount, 9, []);
    const transaction = new web3_js_1.Transaction().add(instruction);
    const signature = yield (0, web3_js_1.sendAndConfirmTransaction)(connection, transaction, [
        keyPair
    ]);
});
exports.burnTokens = burnTokens;
const sendNativeTokens = (fromAddress, amount) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Sending native tokens");
});
exports.sendNativeTokens = sendNativeTokens;
