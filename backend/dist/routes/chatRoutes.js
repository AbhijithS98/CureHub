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
import Doctor from '../models/doctor.js';
const router = express.Router();
// Route to fetch chat history between a doctor and patient
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { doctorId, patientId } = req.query;
    if (!doctorId || !patientId) {
        res.status(400).json({ message: 'doctorId and patientId are required' });
    }
    try {
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
        const patientIds = yield Chat.find({ doctorId }).distinct("patientId");
        const users = yield User.find({ _id: { $in: patientIds } }, { name: 1, profilePicture: 1 });
        const result = yield Promise.all(users.map((user) => __awaiter(void 0, void 0, void 0, function* () {
            const unreadCount = yield Chat.countDocuments({
                doctorId,
                patientId: user._id,
                isRead: false,
                isDoctorSender: false,
            });
            return {
                userId: user._id,
                name: user.name,
                profilePicture: user.profilePicture,
                unreadCount,
            };
        })));
        res.status(200).json(result);
    }
    catch (error) {
        console.error("Error fetching doctor chats:", error);
        res.status(500).json({ message: "Server error" });
    }
}));
router.get("/patientChats", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { patientId } = req.query;
    if (!patientId) {
        res.status(400).json({ message: "patientId is required" });
    }
    try {
        const doctorIds = yield Chat.find({ patientId }).distinct("doctorId");
        const docs = yield Doctor.find({ _id: { $in: doctorIds } }, { name: 1, profilePicture: 1 });
        const result = yield Promise.all(docs.map((doc) => __awaiter(void 0, void 0, void 0, function* () {
            const unreadCount = yield Chat.countDocuments({
                doctorId: doc._id,
                patientId,
                isRead: false,
                isDoctorSender: true,
            });
            return {
                doctorId: doc._id,
                name: doc.name,
                profilePicture: doc.profilePicture,
                unreadCount,
            };
        })));
        res.status(200).json(result);
    }
    catch (error) {
        console.error("Error fetching user chats:", error);
        res.status(500).json({ message: "Server error" });
    }
}));
router.put('/mark-read', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { doctorId, patientId, userRole } = req.body;
    if (!doctorId || !patientId || !userRole) {
        res.status(400).send({ success: false, error: 'Missing required fields' });
    }
    try {
        const query = userRole === 'doctor'
            ? { doctorId, patientId, isDoctorSender: false, isRead: false } // Mark patient's messages
            : { doctorId, patientId, isDoctorSender: true, isRead: false }; // Mark doctor's messages
        yield Chat.updateMany(query, { $set: { isRead: true } });
        res.status(200).send({ success: true });
    }
    catch (error) {
        res.status(500).send({ success: false, error: error.message });
    }
}));
router.get('/unread-count', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { doctorId, patientId } = req.query;
    if (!doctorId && !patientId) {
        res.status(400).json({ error: 'Either doctorId or patientId is required' });
    }
    try {
        const query = doctorId
            ? { doctorId, isRead: false, isDoctorSender: false } // Unread messages sent by the patient
            : { patientId, isRead: false, isDoctorSender: true }; // Unread messages sent by the doctor
        const unreadCount = yield Chat.countDocuments(query);
        res.status(200).json({ unreadCount });
    }
    catch (error) {
        console.error('Error fetching unread messages count:', error);
        res.status(500).json({ error: 'Server error' });
    }
}));
export default router;
