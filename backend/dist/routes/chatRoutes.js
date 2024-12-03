var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import express from 'express';
import Chat from '../models/chatSchema.js';
import User from '../models/user.js';
const router = express.Router();
// Route to fetch chat history between a doctor and patient
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { doctorId, patientId } = req.query;
    if (!doctorId || !patientId) {
        res.status(400).json({ message: 'doctorId and patientId are required' });
    }
    try {
        // Fetch chat messages between the doctor and patient
        const chatHistory = yield Chat.find({ doctorId, patientId })
            .populate('doctorId', 'name profilePicture')
            .populate('patientId', 'name profilePicture')
            .sort({ createdAt: 1 });
        res.status(200).json(chatHistory);
    }
    catch (error) {
        console.error('Error fetching chat history:', error);
        res.status(500).json({ message: 'Server error' });
    }
}));
router.get("/doctorChats", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { doctorId } = req.query;
    if (!doctorId) {
        res.status(400).json({ message: "doctorId is required" });
    }
    try {
        // Find all unique patientIds from the chat collection
        const patientIds = yield Chat.find({ doctorId }).distinct("patientId");
        // Fetch user details for each patient
        const users = yield User.find({ _id: { $in: patientIds } }, { name: 1, profilePicture: 1 } // Project only required fields
        );
        // Map to the required interface structure
        const result = users.map((user) => ({
            userId: user._id,
            name: user.name,
            profilePicture: user.profilePicture,
        }));
        res.status(200).json(result);
    }
    catch (error) {
        console.error("Error fetching doctor chats:", error);
        res.status(500).json({ message: "Server error" });
    }
}));
router.put('/mark-read', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { doctorId, patientId, userRole } = req.body;
    try {
        const query = userRole === 'doctor'
            ? { doctorId, patientId, isDoctorSender: false } // Mark patient's messages
            : { doctorId, patientId, isDoctorSender: true }; // Mark doctor's messages
        yield Chat.updateMany(query, { $set: { isRead: true } });
        res.status(200).send({ success: true });
    }
    catch (error) {
        res.status(500).send({ success: false, error: error.message });
    }
}));
// Example: /api/chat/unread-count?doctorId={doctorId}
router.get('/unread-count', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { ownerId } = req.query;
    try {
        const unreadCount = yield Chat.countDocuments({
            ownerId,
            isRead: false,
        });
        res.status(200).json({ unreadCount });
    }
    catch (error) {
        res.status(500).json({ error: 'Error fetching unread messages count' });
    }
}));
export default router;
