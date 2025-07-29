// // src/inngest/client.js
// import { Inngest } from "inngest";

// export const inngest = new Inngest({
//   id: "ai-roadmap",                    // single project name
//   eventKey: process.env.INNGEST_API_KEY,
// });






import { Inngest } from "inngest";

export const inngest = new Inngest({
  id: "ai-roadmap",
  eventKey: process.env.INNGEST_API_KEY,
});