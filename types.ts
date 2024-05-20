export type VerifySignatureResponse = {
  d: {
    __type: string,
    success: boolean,
    verifyResult: string,
    saveResult: string,
    isDuplicatedMessage: boolean,
    verifiedMessageLocation: string
  }
}