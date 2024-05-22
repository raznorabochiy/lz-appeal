import cli from "cli";
import { Wallet } from "ethers";
import random from "lodash/random";
import { DELAY_SECONDS, KEYS_FILENAME, MESSAGE } from "./constants";
import { verifySignatureRequest } from "./actions";
import { delayProgress, loadFromFile, failLogger } from "./utils";

const keys = await loadFromFile(KEYS_FILENAME);

for (const key of keys) {
  const wallet = new Wallet(key);
  const { address } = wallet;
  console.log(`===== Адрес: ${address} ======`);

  const signature = await wallet.signMessage(MESSAGE);
  console.log(`Signature Hash: ${signature}`);

  try {
    cli.spinner("Отправляем подпись", false);
    const result = await verifySignatureRequest(address, signature);
    cli.spinner(result, true);
  } catch (e) {
    failLogger.info(`key: ${key} | address: ${address}`);
    cli.spinner("", true);
    console.log("Ошибка:", e.message);
  }

  const [delayFrom, delayTo] = DELAY_SECONDS;
  const delayTimeout = random(delayFrom, delayTo);
  await delayProgress(delayTimeout);

  console.log(`=============================`);
}
