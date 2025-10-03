import Ticket from "../models/Ticket.js";
import Post from "../models/Post.js";
import RoadMap from "../models/RoadMap.js";
import Interview from "../models/Interview.js";
import Leaderboard from "../models/Leaderboard.js";
import User from "../models/User.js";
import Conversation from "../models/Conversation.js";
import { fetchJarvisResponse } from "../services/jarvis.service.js";

const staticInfo = `
PLATFORM INFORMATION:
- Name: Codezynx AI Platform
- Founder: Rajeel Siddiqui  
- Purpose: Full-featured learning & career growth platform
- Features: Posts, Tickets, Roadmaps, Interviews, Leaderboard, AI Assistant
- Mission: Empower learners with AI-assisted career growth tools

AVAILABLE COMMANDS:
- Platform Info: "What is this platform?", "Who created this?"
- User Data: "Show my tickets", "My progress", "My posts"
- Community: "Top performers", "Recent activity", "Popular posts"
- Help: "What can you do?", "How to use this platform?"
`;

export const askJarvisQuestion = async (req, res) => {
  try {
    const { question, sessionId, isVoice = false } = req.body;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized: User not authenticated" });
    }

    if (!question || typeof question !== "string" || question.trim() === "") {
      return res.status(400).json({ error: "Invalid or missing question" });
    }

    let conversation;
    if (sessionId) {
      conversation = await Conversation.findOne({ _id: sessionId, user: userId });
    }
    if (!conversation) {
      conversation = await Conversation.create({
        user: userId,
        messages: [],
        title: question.substring(0, 50) + "..."
      });
    }

    let userData = "No user data available.";
    let otherUsersData = "No community data available.";

    try {
      const [tickets, posts, roadmaps, interviews, leaderboard] = await Promise.all([
        Ticket.find({ createdBy: userId }).select("title status priority deadline").lean(),
        Post.find({ author: userId }).select("title description tags createdAt").lean(),
        RoadMap.find({ user: userId }).select("goal level weeks progress").lean(),
        Interview.find({ user: userId }).select("topic level status duration scheduledAt").lean(),
        Leaderboard.find({ user: userId }).select("ticket points rank").lean(),
      ]);

      if (tickets.length > 0 || posts.length > 0 || roadmaps.length > 0) {
        userData = `
USER DATA:
${tickets.length > 0 ? `- TICKETS (${tickets.length}): ${tickets.map(t => `${t.title} [${t.status}]`).join(', ')}` : ''}
${posts.length > 0 ? `- POSTS (${posts.length}): ${posts.map(p => p.title).join(', ')}` : ''}
${roadmaps.length > 0 ? `- ROADMAPS (${roadmaps.length}): ${roadmaps.map(r => `${r.goal} (${r.level})`).join(', ')}` : ''}
${interviews.length > 0 ? `- INTERVIEWS (${interviews.length}): ${interviews.map(i => `${i.topic} [${i.status}]`).join(', ')}` : ''}
${leaderboard.length > 0 ? `- LEADERBOARD: Rank ${leaderboard[0].rank} with ${leaderboard[0].points} points` : ''}
        `.trim();
      }

      const [topLeaderboard, recentTickets, popularPosts] = await Promise.all([
        Leaderboard.find({}).sort({ points: -1 }).limit(3).populate("user", "fullName").lean(),
        Ticket.find({ createdBy: { $ne: userId } })
          .select("title status createdBy createdAt")
          .populate("createdBy", "fullName")
          .sort({ createdAt: -1 })
          .limit(3)
          .lean(),
        Post.find({ author: { $ne: userId } })
          .select("title description author likes")
          .populate("author", "fullName")
          .sort({ likes: -1 })
          .limit(3)
          .lean()
      ]);

      if (topLeaderboard.length > 0 || recentTickets.length > 0 || popularPosts.length > 0) {
        otherUsersData = `
COMMUNITY DATA:
${topLeaderboard.length > 0 
  ? `- TOP PERFORMERS: ${topLeaderboard.map((lb, idx) => `${idx + 1}. ${lb.user.fullName} (${lb.points} pts)`).join(', ')}` 
  : ''}

${recentTickets.length > 0 
  ? `- RECENT TICKETS: ${recentTickets.map(t => `${t.title} (${t.description}) by ${t.createdBy.fullName}`).join(', ')}` 
  : ''}

${popularPosts.length > 0 
  ? `- POPULAR POSTS: ${popularPosts.map(p => `${p.title} (${p.description}) by ${p.author.fullName}`).join(', ')}` 
  : ''}

        `.trim();
      }
    } catch (dbError) {
      console.log("Database query failed, using static info only:", dbError.message);
    }

    const cleanQuestion = question.replace(/\*\*/g, '').replace(/\*/g, '').trim();

    const prompt = `
You are Jarvis, an advanced AI assistant for Codezynx platform. 
You are ONLY allowed to answer questions about:
- Platform information (from Static Info)
- User's own data (Tickets, Posts, Roadmaps, Interviews, Leaderboard)
- Community data (Top performers, Popular posts, Recent activity)

STRICT RULE:
- If the question is about coding, general knowledge, or anything outside this platform, 
  politely respond with: "I can only answer questions related to the Codezynx platform, your data, and the community."

Static Platform Information:
${staticInfo}

Context Data:
${userData}
${otherUsersData}

Current Question: ${cleanQuestion}
Previous Conversation: ${conversation.messages.slice(-3).map(m => `${m.role}: ${m.text}`).join('\n')}

Guidelines:
- Answer platform questions from Static Information
- Answer user-specific questions from USER DATA if available
- Answer community questions from COMMUNITY DATA if available  
- If data is not available, say you don't have that information
- If question is outside platform scope, respond with the STRICT RULE
- Keep responses clear and natural
- Avoid markdown formatting, use plain text
- Use simple line breaks for readability
- Be honest about data limitations
${isVoice ? '- Keep responses concise for voice' : ''}

Response:
    `.trim();

    const answer = await fetchJarvisResponse(prompt);

    const cleanAnswer = answer
      .replace(/\*\*/g, '')
      .replace(/\*/g, '')
      .replace(/#{1,6}/g, '')
      .replace(/```[\s\S]*?```/g, '')
      .trim();

    conversation.messages.push({
      role: 'user',
      text: cleanQuestion,
      timestamp: new Date()
    });
    conversation.messages.push({
      role: 'assistant',
      text: cleanAnswer,
      timestamp: new Date()
    });
    await conversation.save();

    return res.status(200).json({
      answer: cleanAnswer,
      sessionId: conversation._id,
      userData: { tickets: [], posts: [], roadmaps: [], interviews: [], leaderboard: [] },
      conversationHistory: conversation.messages
    });

  } catch (err) {
    console.error("Jarvis controller error:", err.message);
    const fallbackResponse = "I'm experiencing technical difficulties. Please try again in a moment.";
    return res.status(500).json({ 
      error: "Failed to process request",
      answer: fallbackResponse,
      sessionId: null 
    });
  }
};


export const getConversationHistory = async (req, res) => {
  try {
    const userId = req.user?._id;
    const conversations = await Conversation.find({ user: userId })
      .sort({ updatedAt: -1 })
      .select('title messages updatedAt');
    
    res.json(conversations);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch conversations" });
  }
};

export const deleteConversation = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user?._id;
    
    await Conversation.findOneAndDelete({ _id: sessionId, user: userId });
    res.json({ message: "Conversation deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete conversation" });
  }
};