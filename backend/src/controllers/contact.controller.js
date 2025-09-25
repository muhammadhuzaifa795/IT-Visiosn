import Contact from "../models/Contact.js";

export const addContact = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    const userId = req.user._id;
    if (!name || !email || !message) {
      return res.status(400).json({ error: "Please fill all required fields" });
    }

    const newContact = await Contact.create({
      userId,
      name,
      email,
      phone: phone || "",
      message,
      status: "Pending",
    });

    res.status(201).json({
      success: true,
      message: "Contact form submitted successfully",
      data: newContact,
    });
  } catch (error) {
    res.status(500).json({ error: "Server Error", details: error.message });
  }
};

export const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find()
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: contacts });
  } catch (error) {
    res.status(500).json({ error: "Server Error", details: error.message });
  }
};

export const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["Pending", "In Progress", "Resolved"].includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    const updatedContact = await Contact.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedContact) {
      return res.status(404).json({ error: "Contact not found" });
    }

    res.status(200).json({
      success: true,
      message: "Status updated successfully",
      data: updatedContact,
    });
  } catch (error) {
    res.status(500).json({ error: "Server Error", details: error.message });
  }
};

export const getUserContacts = async (req, res) => {
  try {
    const userId = req.params.userId;
    const contacts = await Contact.find({ userId }).sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: contacts });
  } catch (error) {
    res.status(500).json({ error: "Server Error", details: error.message });
  }
};


export const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedContact = await Contact.findByIdAndDelete(id);

    if (!deletedContact) {
      return res.status(404).json({ error: "Contact not found" });
    }

    res.status(200).json({
      success: true,
      message: "Contact deleted successfully",
      data: deletedContact,
    });
  } catch (error) {
    res.status(500).json({ error: "Server Error", details: error.message });
  }
};