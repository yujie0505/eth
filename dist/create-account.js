"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
const tx_1 = require("@ethereumjs/tx");
const keccak256_1 = __importDefault(require("keccak256"));
const web3_1 = __importDefault(require("web3"));
const secp256k1 = require("secp256k1");
const config = require("../config.json");
/**** create account ****/
let privateKey;
do {
    privateKey = crypto_1.randomBytes(32);
} while (!secp256k1.privateKeyVerify(privateKey));
const publicKey = secp256k1.publicKeyCreate(privateKey, false).slice(1);
const address = keccak256_1.default(Buffer.from(publicKey)).slice(-20);
/**** sign transaction ****/
const web3 = new web3_1.default(new web3_1.default.providers.HttpProvider(config.infura.endpoint));
const tx = new tx_1.Transaction({
    nonce: web3.utils.toHex(0),
    gasPrice: web3.utils.toHex(3000000000),
    gasLimit: web3.utils.toHex(21000),
    to: "0x0000000000000000000000000000000000000000",
    value: web3.utils.toHex(1e18),
});
const signedTx = tx.sign(privateKey);
const serializedTx = signedTx.serialize();
/**** recover address ****/
const recoveredAddress = web3.eth.accounts.recoverTransaction(`0x${serializedTx.toString("hex")}`);
