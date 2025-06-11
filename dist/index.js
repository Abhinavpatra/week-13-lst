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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const express_1 = __importDefault(require("express"));
const mintTokens_1 = require("./mintTokens");
const app = (0, express_1.default)();
const HELIUS_RESPONSE = {
    "accountData": [
        {
            "account": "2boZeCb6whqr1XqW2bJLV4ZHyCMsVvnHP4GZJd1dDnkw",
            "nativeBalanceChange": -1080000,
            "tokenBalanceChanges": []
        },
        {
            "account": "3vAzvartXm37aipvjG8yqfjg1EuY5qsKRrcbwhB9VGRg",
            "nativeBalanceChange": 1000000,
            "tokenBalanceChanges": []
        },
        {
            "account": "11111111111111111111111111111111",
            "nativeBalanceChange": 0,
            "tokenBalanceChanges": []
        },
        {
            "account": "ComputeBudget111111111111111111111111111111",
            "nativeBalanceChange": 0,
            "tokenBalanceChanges": []
        }
    ],
    "description": "2boZeCb6whqr1XqW2bJLV4ZHyCMsVvnHP4GZJd1dDnkw transferred 0.001 SOL to 3vAzvartXm37aipvjG8yqfjg1EuY5qsKRrcbwhB9VGRg.",
    "events": [],
    "fee": 80000,
    "feePayer": "2boZeCb6whqr1XqW2bJLV4ZHyCMsVvnHP4GZJd1dDnkw",
    "instructions": [
        {
            "accounts": [],
            "data": "3b1H8Rq1T3d1",
            "innerInstructions": [],
            "programId": "ComputeBudget111111111111111111111111111111"
        },
        {
            "accounts": [],
            "data": "LKoyXd",
            "innerInstructions": [],
            "programId": "ComputeBudget111111111111111111111111111111"
        },
        {
            "accounts": [
                "2boZeCb6whqr1XqW2bJLV4ZHyCMsVvnHP4GZJd1dDnkw",
                "3vAzvartXm37aipvjG8yqfjg1EuY5qsKRrcbwhB9VGRg"
            ],
            "data": "3Bxs4Bc3VYuGVB19",
            "innerInstructions": [],
            "programId": "11111111111111111111111111111111"
        }
    ],
    "nativeTransfers": [
        {
            "amount": 1000000,
            "fromUserAccount": "2boZeCb6whqr1XqW2bJLV4ZHyCMsVvnHP4GZJd1dDnkw",
            "toUserAccount": "3vAzvartXm37aipvjG8yqfjg1EuY5qsKRrcbwhB9VGRg"
        }
    ],
    "signature": "5emsxM1ZSbvSUEkNUge6KBzmfhEYJqWoJgPqSeuQvEsNAW7ghfjEKjXjzy9urFHmQrqmUEjNq1NQqHFtVpcMk1Zp",
    "slot": 386436377,
    "source": "SYSTEM_PROGRAM",
    "timestamp": 1749446965,
    "tokenTransfers": [],
    "transactionError": null,
    "type": "TRANSFER"
};
const VAULT = "3vAzvartXm37aipvjG8yqfjg1EuY5qsKRrcbwhB9VGRg"; // Replace with your vault address
app.post('/helius', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // const fromAddress = req.body.fromAddress;
    const transaction = HELIUS_RESPONSE.nativeTransfers.find(transfer => transfer.toUserAccount === VAULT);
    if (!transaction) {
        res.status(400).send('No valid transaction found for the vault address');
        return;
    }
    // const fromAddress = req.body.fromAddress 
    // const toAddress = req.body.toAddress;
    // const amount = req.body.amount;
    const fromAddress = transaction.fromUserAccount;
    const toAddress = transaction.toUserAccount;
    const amount = transaction.amount;
    console.log(`Processing transaction from ${fromAddress} to ${toAddress} for amount ${amount}`);
    var type = "received_native_sol";
    // type = "not"
    if (type === "received_native_sol") {
        yield (0, mintTokens_1.mintTokens)(fromAddress, amount);
    }
    else {
        // What could go wrong here?
        yield (0, mintTokens_1.burnTokens)(amount);
        yield (0, mintTokens_1.sendNativeTokens)(fromAddress, amount);
    }
    res.send('Transaction successful');
}));
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
