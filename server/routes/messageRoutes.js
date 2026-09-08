import express from "express";
import { Conversation, Message } from "../models/misc.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Start (or fetch existing) conversation with another user, optionally about a listing
router.post("/start", protect, async (req, res) => {
  try {
    const { toUserId, listingId, text } = req.body;
    if (!toUserId) return res.status(400).json({ message: "toUserId is required" });
    if (String(toUserId) === String(req.user._id)) {
      return res.status(400).json({ message: "You can't message yourself" });
    }

    let convo = await Conversation.findOne({
      participants: { $all: [req.user._id, toUserId] },
      ...(listingId ? { listing: listingId } : {}),
    });

    if (!convo) {
      convo = await Conversation.create({
        participants: [req.user._id, toUserId],
        listing: listingId || undefined,
      });
    }

    if (text && text.trim()) {
      await Message.create({ conversation: convo._id, sender: req.user._id, text: text.trim() });
      convo.lastMessage = text.trim();
      convo.lastMessageAt = new Date();
      await convo.save();
    }

    res.status(201).json({ conversationId: convo._id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// List all conversations for the current user
router.get("/conversations", protect, async (req, res) => {
  const conversations = await Conversation.find({ participants: req.user._id })
    .populate("participants", "name")
    .populate("listing", "brand model variant images price")
    .sort({ lastMessageAt: -1 });

  const shaped = conversations.map((c) => ({
    id: c._id,
    listing: c.listing,
    otherUser: c.participants.find((p) => String(p._id) !== String(req.user._id)),
    lastMessage: c.lastMessage,
    lastMessageAt: c.lastMessageAt,
  }));

  res.json({ items: shaped });
});

// Get all messages in a conversation (only participants may view)
router.get("/conversations/:id", protect, async (req, res) => {
  const convo = await Conversation.findById(req.params.id);
  if (!convo) return res.status(404).json({ message: "Conversation not found" });
  if (!convo.participants.some((p) => String(p) === String(req.user._id))) {
    return res.status(403).json({ message: "Not authorized" });
  }

  const messages = await Message.find({ conversation: convo._id }).sort({ createdAt: 1 });
  await Message.updateMany(
    { conversation: convo._id, sender: { $ne: req.user._id } },
    { read: true }
  );

  res.json({ messages, conversationId: convo._id });
});

// Send a message in an existing conversation
router.post("/conversations/:id", protect, async (req, res) => {
  const { text } = req.body;
  if (!text || !text.trim()) return res.status(400).json({ message: "Message text required" });

  const convo = await Conversation.findById(req.params.id);
  if (!convo) return res.status(404).json({ message: "Conversation not found" });
  if (!convo.participants.some((p) => String(p) === String(req.user._id))) {
    return res.status(403).json({ message: "Not authorized" });
  }

  const message = await Message.create({
    conversation: convo._id,
    sender: req.user._id,
    text: text.trim(),
  });
  convo.lastMessage = text.trim();
  convo.lastMessageAt = new Date();
  await convo.save();

  res.status(201).json({ message });
});

export default router;
