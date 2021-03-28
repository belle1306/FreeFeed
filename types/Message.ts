export interface Message {
  signature: string;
  senderAddress: string;
  text: string;
  amount: number;
  isComment: boolean;
  toMessageSignature: string | null;
}