import { inngest } from "../client.js";
import { evaluateAnswer } from "../agent.js";
import InterviewResult from "../../models/InterviewResult.js";

export const evalFlow = inngest.createFunction(
  { name: "evaluateAnswer" },
  { event: "interview/answer" },
  async ({ event }) => {
    const { interviewId, question, answer } = event.data;
    const feedback = await evaluateAnswer(question, answer);
    await InterviewResult.findOneAndUpdate(
      { interview: interviewId },
      { $push: { answers: { question, answer, feedback } } },
      { upsert: true }
    );
  }
);