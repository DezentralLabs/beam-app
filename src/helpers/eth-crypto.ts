import EthCrypto from "eth-crypto";

export function createEthAccount() {
  const account = EthCrypto.createIdentity();
  return account;
}
