import { randomBytes } from "crypto";
import { Transaction as EthereumTx } from "@ethereumjs/tx";
import keccak256 from "keccak256";
import Web3 from "web3";

const secp256k1 = require("secp256k1");

const config = require("../config.json");

/**** create account ****/

let privateKey;
do {
  privateKey = randomBytes(32);
} while (!secp256k1.privateKeyVerify(privateKey));

const publicKey = secp256k1.publicKeyCreate(privateKey, false).slice(1);

const address = keccak256(Buffer.from(publicKey)).slice(-20);

/**** sign transaction ****/

const web3 = new Web3(new Web3.providers.HttpProvider(config.infura.endpoint));

const tx = new EthereumTx({
  nonce: web3.utils.toHex(0),
  gasPrice: web3.utils.toHex(3_000_000_000),
  gasLimit: web3.utils.toHex(21000),
  to: "0x0000000000000000000000000000000000000000",
  value: web3.utils.toHex(1e18),
});
const signedTx = tx.sign(privateKey);
const serializedTx = signedTx.serialize();

/**** recover address ****/

const recoveredAddress = web3.eth.accounts.recoverTransaction(`0x${serializedTx.toString("hex")}`);
