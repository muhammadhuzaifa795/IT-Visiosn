import { inngest } from "../client.js";
import Ticket from "../../models/Ticket.js";
import User from "../../models/User.js";
import { NonRetriableError } from "inngest";
import analyzeTicket from "../../services/ticket.service.v2.js";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const onTicketCreated = inngest.createFunction(
  { id: "on-ticket-created", retries: 2 },
  { event: "ticket/created" },
  async ({ event, step }) => {
    try {
      const { ticketId } = event.data;

      const ticket = await step.run("fetch-ticket", async () => {
        const ticketObject = await Ticket.findById(ticketId);
        if (!ticketObject) throw new NonRetriableError("Ticket not found");
        return ticketObject;
      });

      await step.run("update-ticket-status", async () => {
        await Ticket.findByIdAndUpdate(ticket._id, { status: "TODO" });
      });

      const aiResponse = await step.run("ai-processing", async () => {
        const response = await analyzeTicket(ticket);
        const validPriority = ["low", "medium", "high"].includes(
          response.priority?.toLowerCase()
        )
          ? response.priority.toLowerCase()
          : "medium";

        await Ticket.findByIdAndUpdate(ticket._id, {
          priority: validPriority,
          helpfulNotes: response.helpfulNotes || "No additional notes provided.",
          status: "IN_PROGRESS",
          relatedSkills: Array.isArray(response.relatedSkills)
            ? response.relatedSkills
            : [],
        });

        return response;
      });

      const assignedUsers = await step.run("assign-users", async () => {
        const skills = Array.isArray(aiResponse.relatedSkills)
          ? aiResponse.relatedSkills.map((skill) => skill.trim().toLowerCase()).filter(Boolean)
          : [];

        let users = [];
        if (skills.length > 0) {
          users = await User.find({
            role: "user",
            skills: { $in: skills.map(skill => new RegExp(`^${skill}$`, "i")) },
            _id: { $ne: ticket.createdBy },
          });
        }

        await Ticket.findByIdAndUpdate(ticket._id, {
          assignedTo: users.map((u) => u._id),
        });

        return users;
      });

      await step.run("send-email-notification", async () => {
        if (assignedUsers.length > 0) {
          const finalTicket = await Ticket.findById(ticket._id);

          for (const user of assignedUsers) {
            await transporter.sendMail({
              from: `"Your App" <${process.env.SMTP_USER}>`,
              to: user.email,
              subject: "New Ticket Assigned",
              html: `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2>New Ticket Assigned</h2>
      <p>You have been assigned a new ticket:</p>
      <p style="font-size: 18px; font-weight: bold;">
        ${finalTicket.title}
      </p>
      <p><strong>Summary:</strong> ${aiResponse.summary || "No summary available"}</p>
      <p><strong>Notes:</strong> ${aiResponse.helpfulNotes}</p>
      <p>
        <a href="http://localhost:5173/ticket/${ticket._id}" style="color: #ffffff; background-color: #1d4ed8; padding: 8px 12px; text-decoration: none; border-radius: 4px;">
          View Ticket Details
        </a>
      </p>
    </div>
  `,
            });
          }
        }
      });

      return {
        success: true,
        assignedUsers: assignedUsers.map((u) => u.email),
      };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }
);

export async function findTicketsAssignedToUser(userId) {
  try {
    const tickets = await Ticket.find({ assignedTo: userId }).populate("assignedTo", "email fullName profilePic");
    return tickets;
  } catch (err) {
    throw new Error(`Error fetching tickets: ${err.message}`);
  }
}
