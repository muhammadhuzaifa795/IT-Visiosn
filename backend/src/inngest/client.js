import { Inngest } from 'inngest';
export const inngest = new Inngest({ id: 'ai-roadmap' ,
    eventKey:process.env.INNGEST_API_KEY
});