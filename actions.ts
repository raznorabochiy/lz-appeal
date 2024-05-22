import fetch from "node-fetch";
import { HttpsProxyAgent } from "https-proxy-agent";
import { PROXY, VERIFY_URL, MESSAGE } from "./constants";
import { VerifySignatureResponse } from "./types";
import {successLogger} from "./utils";

const agent = PROXY ? new HttpsProxyAgent(new URL(`http://${PROXY}`)) : undefined;

export async function verifySignatureRequest(address: string, signature: string): Promise<string> {
  const response = await fetch(VERIFY_URL, {
    headers: {
      "accept": "application/json, text/javascript, */*; q=0.01",
      "accept-language": "en-US, en;q=0.9",
      "content-type": "application/json",
      "priority": "u=0, i",
      "sec-ch-ua": '"Google Chrome";v="125", "Chromium";v="125", "Not.A/Brand";v="24"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-model": "\"\"",
      "sec-ch-ua-platform": "\"macOS\"",
      "sec-ch-ua-platform-version": "\"13.6.0\"",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      "sec-gpc": "1",
      "x-requested-with": "XMLHttpRequest",
      "Referer": "https://etherscan.io/verifiedSignatures",
      "Referrer-Policy": "origin-when-cross-origin"
    },
    body: `{"address":"${address.toLocaleLowerCase()}","messageSignature":"${signature}","messageRaw":"${MESSAGE}","saveOption":"1"}`,
    method: "POST",
    agent,
  });

  const data = await response.json() as VerifySignatureResponse;

  if (data.d.verifiedMessageLocation) {
    const [, , id] = data.d.verifiedMessageLocation.split('/');
    successLogger.info(`address: ${address} | Message Signature #${id}`);
    return `https://etherscan.io${data.d.verifiedMessageLocation}`;
  } else {
    throw new Error("Не могу получить подтверждение от etherscan")
  }
}

