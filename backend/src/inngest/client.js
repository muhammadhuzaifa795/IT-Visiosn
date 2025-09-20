
import { Inngest } from "inngest";

export const inngest = new Inngest({
  id: "codezynx",
  eventKey: process.env.INNGEST_API_KEY,
});