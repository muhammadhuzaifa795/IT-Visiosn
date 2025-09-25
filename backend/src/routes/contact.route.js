import express from "express";
import {
  addContact,
  getContacts,
  updateStatus,
  getUserContacts,
  deleteContact,
} from "../controllers/contact.controller.js";

const router = express.Router();

router.post("/", addContact);
router.get("/get-contacts", getContacts);
router.put("/:id/status", updateStatus);
router.get("/user/contacts/:userId", getUserContacts);
router.delete("/:id", deleteContact);

export default router;