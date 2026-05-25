import { Router, type IRouter, type Request, type Response } from "express";
import { randomUUID } from "crypto";
import {
  getMessages,
  saveMessages,
  addMessage,
  updateMessage,
  deleteMessage,
  getAdminPassword,
  saveAdminPassword,
  type Message
} from "../data/store";

const router: IRouter = Router();

// Login
router.post("/login", (req: Request, res: Response) => {
  const { password } = req.body;
  const adminPassword = getAdminPassword();

  console.log("[ADMIN] Login attempt");
  
  if (adminPassword === password) {
    console.log("[ADMIN] Login successful");
    res.json({ success: true });
  } else {
    console.log("[ADMIN] Login failed - wrong password");
    res.status(401).json({ success: false, error: "Invalid password" });
  }
});

// Change password
router.post("/change-password", (req: Request, res: Response) => {
  const { currentPassword, newPassword } = req.body;
  const adminPassword = getAdminPassword();

  if (adminPassword === currentPassword) {
    saveAdminPassword(newPassword);
    console.log("[ADMIN] Password changed successfully");
    res.json({ success: true });
  } else {
    console.log("[ADMIN] Password change failed - wrong current password");
    res.status(401).json({ success: false, error: "Invalid current password" });
  }
});

// Get messages
router.get("/messages", (req: Request, res: Response) => {
  const { all } = req.query;
  let messages = getMessages();

  console.log(`[ADMIN] Fetching messages (all=${all}), total: ${messages.length}`);

  if (all !== "true") {
    messages = messages.filter(m => m.isVisible);
  }

  res.json(messages);
});

// Create message
router.post("/messages", (req: Request, res: Response) => {
  const { author, content, color } = req.body;

  if (!author || !content) {
    return res.status(400).json({ error: "Author and content are required" });
  }

  const newMessage: Message = {
    id: randomUUID(),
    author,
    content,
    color: color || "#e8b4a8",
    isVisible: true,
    createdAt: new Date().toISOString()
  };

  addMessage(newMessage);
  console.log("[ADMIN] Message created:", newMessage.id);
  res.status(201).json(newMessage);
});

// Update message
router.patch("/messages/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const updates = req.body;

  const messages = getMessages();
  const message = messages.find(m => m.id === id);

  if (!message) {
    return res.status(404).json({ error: "Message not found" });
  }

  updateMessage(id, updates);
  console.log("[ADMIN] Message updated:", id);
  
  const updated = getMessages().find(m => m.id === id);
  res.json(updated);
});

// Delete message
router.delete("/messages/:id", (req: Request, res: Response) => {
  const { id } = req.params;

  const messages = getMessages();
  if (!messages.find(m => m.id === id)) {
    return res.status(404).json({ error: "Message not found" });
  }

  deleteMessage(id);
  console.log("[ADMIN] Message deleted:", id);
  res.status(204).send();
});

export default router;
