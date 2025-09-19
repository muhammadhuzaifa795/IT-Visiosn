import { inngest } from "../inngest/client.js";
import Ticket from "../models/Ticket.js";
import cloudinary from "../lib/cloudinary.js";

export const createTicket = async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title || !description) {
      return res.status(400).json({ message: "Title and description are required" });
    }

    let attachments = null;

    if (req.file) {
      const base64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
      const uploaded = await cloudinary.uploader.upload(base64, { resource_type: "auto" });
      attachments = {
        url: uploaded.secure_url,
        public_id: uploaded.public_id
      };
    }

    const newTicket = await Ticket.create({
      title,
      description,
      createdBy: req.user._id.toString(),
      status: "pending",
      attachments,
    });

    await inngest.send({
      name: "ticket/created",
      data: {
        ticketId: newTicket._id.toString(),
        title,
        description,
        createdBy: req.user._id.toString(),
      },
    });

    return res.status(201).json({
      message: "Ticket created and processing started",
      ticket: newTicket,
    });
  } catch (error) {
    console.error("Error creating ticket", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


// ✅ Fetch tickets excluding completed
export const getTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({ status: { $ne: "completed" } }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      message: "Tickets fetched successfully",
      tickets,
    });
  } catch (error) {
    console.error("Error fetching tickets", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


// ✅ Delete ticket
export const deleteTicket = async (req, res) => {
  try {
    const { id } = req.params;

    // Find ticket
    const ticket = await Ticket.findById(id);
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    // ✅ Delete attachment from Cloudinary if exists
    if (ticket.attachmentId) {
      try {
        await cloudinary.uploader.destroy(ticket.attachmentId);
        console.log("Cloudinary file deleted:", ticket.attachmentId);
      } catch (err) {
        console.error("Cloudinary delete failed:", err.message);
      }
    }

    // ✅ Delete ticket from DB
    await Ticket.findByIdAndDelete(id);

    return res.status(200).json({ message: "Ticket deleted successfully" });
  } catch (error) {
    console.error("Error deleting ticket:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


export const getTicketById = async (req, res) => {
  try {
    const { id } = req.params;

    const ticket = await Ticket.findById(id)
      .populate("createdBy", "fullName email")
      .populate("assignedTo", "fullName email");

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    res.status(200).json({ ticket });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const addSolution = async (req, res) => {
  try {
    const ticketId = req.params.id; // <-- use params instead of body
    const { solutionText } = req.body;
    const userId = req.user._id;

    if (!solutionText) {
      return res.status(400).json({ message: "Solution text is required" });
    }

    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    const userHasSubmitted = ticket.solutions.some(
      (solution) => solution.user.toString() === userId.toString()
    );
    if (userHasSubmitted) {
      return res.status(400).json({ message: "You have already submitted a solution" });
    }

    ticket.solutions.push({
      user: userId,
      solutionText,
      createdAt: new Date(),
    });

    await ticket.save();

    const updatedTicket = await Ticket.findById(ticketId).populate({
      path: "solutions.user",
      select: "fullName profileImage",
    });

    return res.status(200).json({
      message: "Solution added successfully",
      solutions: updatedTicket.solutions,
    });
  } catch (error) {
    console.error("Error adding solution:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
