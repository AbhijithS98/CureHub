import express, { Request, Response } from 'express';
import Chat from '../models/chatModel.js'
import User from '../models/userModel.js'
import Doctor from '../models/doctorModel.js';

const router = express.Router();

// Route to fetch chat history between a doctor and patient
router.get('/', async (req:Request, res:Response): Promise<void> => {
  const { doctorId, patientId } = req.query;

  if (!doctorId || !patientId) {
     res.status(400).json({ message: 'doctorId and patientId are required' });
  }

  try {
    
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
  
    const patientIds = await Chat.find({ doctorId }).distinct("patientId");

    const users = await User.find(
      { _id: { $in: patientIds } },
      { name: 1, profilePicture: 1 }
    );

 
    const result = await Promise.all(
      users.map(async (user) => {
        const unreadCount = await Chat.countDocuments({
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
      })
    );

    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching doctor chats:", error);
    res.status(500).json({ message: "Server error" });
  }
});



router.get("/patientChats", async (req: Request, res: Response):Promise<void> => {

  const { patientId } = req.query;
  if (!patientId) {
   res.status(400).json({ message: "patientId is required" });
  }

  try {
    const doctorIds = await Chat.find({ patientId }).distinct("doctorId");
    const docs = await Doctor.find(
      { _id: { $in: doctorIds } },
      { name: 1, profilePicture: 1 }
    );

    const result = await Promise.all(
      docs.map(async (doc) => {
        const unreadCount = await Chat.countDocuments({
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
      })
    );

    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching user chats:", error);
    res.status(500).json({ message: "Server error" });
  }
});


router.put('/mark-read', async (req: Request, res: Response):Promise<void> => {
  const { doctorId, patientId, userRole } = req.body;

  if (!doctorId || !patientId || !userRole) {
    res.status(400).send({ success: false, error: 'Missing required fields' });
  }

  try {
    const query = userRole === 'doctor'
      ? { doctorId, patientId, isDoctorSender: false, isRead: false } // Mark patient's messages
      : { doctorId, patientId, isDoctorSender: true, isRead: false }; // Mark doctor's messages

    await Chat.updateMany(query, { $set: { isRead: true } });
    res.status(200).send({ success: true });

  } catch (error:any) {
    res.status(500).send({ success: false, error: error.message });
  }
});



router.get('/unread-count', async (req: Request, res: Response): Promise<void> => {
  const { doctorId, patientId } = req.query;

  if (!doctorId && !patientId) {
     res.status(400).json({ error: 'Either doctorId or patientId is required' });
  }

  try {
    const query = doctorId
      ? { doctorId, isRead: false, isDoctorSender: false } // Unread messages sent by the patient
      : { patientId, isRead: false, isDoctorSender: true }; // Unread messages sent by the doctor

    const unreadCount = await Chat.countDocuments(query);
    res.status(200).json({ unreadCount });
  } catch (error) {
    console.error('Error fetching unread messages count:', error);
    res.status(500).json({ error: 'Server error' });
  }
});


export default router;
