import express, { Request, Response } from 'express';
import Chat from '../models/chatSchema.js'
import User from '../models/user.js'


const router = express.Router();


// Route to fetch chat history between a doctor and patient
router.get('/', async (req:Request, res:Response): Promise<void> => {
  const { doctorId, patientId } = req.query;

  if (!doctorId || !patientId) {
     res.status(400).json({ message: 'doctorId and patientId are required' });
  }

  try {
    // Fetch chat messages between the doctor and patient
    const chatHistory = await Chat.find({ doctorId, patientId })
    .populate('doctorId', 'name profilePicture')
    .populate('patientId', 'name profilePicture')
    .sort({ createdAt: 1 });
    res.status(200).json(chatHistory);

  } catch (error) {
    console.error('Error fetching chat history:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


router.get("/doctorChats", async (req: Request, res: Response):Promise<void> => {
  const { doctorId } = req.query;

  if (!doctorId) {
   res.status(400).json({ message: "doctorId is required" });
  }

  try {
    // Find all unique patientIds from the chat collection
    const patientIds = await Chat.find({ doctorId }).distinct("patientId");

    // Fetch user details for each patient
    const users = await User.find(
      { _id: { $in: patientIds } },
      { name: 1, profilePicture: 1 } // Project only required fields
    );

    // Map to the required interface structure
    const result = users.map((user) => ({
      userId: user._id,
      name: user.name,
      profilePicture: user.profilePicture,
    }));

    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching doctor chats:", error);
    res.status(500).json({ message: "Server error" });
  }
});


router.put('/mark-read', async (req: Request, res: Response):Promise<void> => {
  const { doctorId, patientId, userRole } = req.body;
  try {
    const query = userRole === 'doctor'
      ? { doctorId, patientId, isDoctorSender: false } // Mark patient's messages
      : { doctorId, patientId, isDoctorSender: true }; // Mark doctor's messages

    await Chat.updateMany(query, { $set: { isRead: true } });
    res.status(200).send({ success: true });

  } catch (error:any) {
    res.status(500).send({ success: false, error: error.message });
  }
});


// Example: /api/chat/unread-count?doctorId={doctorId}
router.get('/unread-count', async (req: Request, res: Response):Promise<void> => {
  const { ownerId } = req.query;
  try {
    const unreadCount = await Chat.countDocuments({
      ownerId,
      isRead: false,
    });
    res.status(200).json({ unreadCount });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching unread messages count' });
  }
});


export default router;
