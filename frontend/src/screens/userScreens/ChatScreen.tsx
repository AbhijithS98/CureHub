import { useEffect, useState } from "react";
import socket from "../../services/socketService";
import { useLocation } from "react-router-dom";
import { useUserGetDoctorQuery } from "../../slices/userSlices/userApiSlice";
import { useDoctorGetUserQuery } from "../../slices/doctorSlices/doctorApiSlice";
import './chat.css';
  
interface Message {
  doctorId: {_id:string, name:string, profilePicture:string};
  patientId: {_id:string, name:string, profilePicture:string};
  message: string;
  isDoctorSender: boolean;
  isRead?: boolean; 
  createdAt?: string;
}

const Chat = () => {
  const location = useLocation();
  const { doctorId, userId } = location.state || {}; 
  const {data:doctor} = useUserGetDoctorQuery(doctorId);
  const {data:user} = useDoctorGetUserQuery(userId);
  const isDoctor = location.pathname.includes("doctor");
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const messageData: Message = {
      doctorId,
      patientId: userId,
      message: newMessage,
      isDoctorSender: isDoctor, 
    };

    socket.emit("sendMessage", messageData);
    setNewMessage("");
  };


  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/chat?doctorId=${doctorId}&patientId=${userId}`
        );
        const data = await response.json();
        setMessages(data);
      } catch (error) {
        console.error("Error fetching chat history:", error);
      }
    };

    fetchChatHistory();

    socket.on("receiveMessage", (message: Message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [doctorId, userId, sendMessage]);

  
  useEffect(() => {
    const markMessagesAsRead = async () => {
      try {
        await fetch('http://localhost:5000/api/chat/mark-read', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            doctorId,
            patientId: userId,
            userRole: isDoctor ? 'doctor' : 'patient',
          }),
        });
        
      } catch (error) {
        console.error('Error marking messages as read:', error);
      }
    };
  
    markMessagesAsRead();
  }, [doctorId, userId, isDoctor]);
  
  return (
    <div className="chat-container">
      <div className="chat-header">
             <img
                src={`http://localhost:5000/${
                  isDoctor? user?.data.profilePicture : doctor?.data.profilePicture}`}
                alt={user?.data.name}
                className="chat-header-profile-pic"
                
              />
             {isDoctor ? `${user?.data.name}` : `${doctor?.data.name}`}
      </div>
      <div className="chat-body">
        <div className="message-list">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`message ${
                (msg.isDoctorSender && isDoctor) || (!msg.isDoctorSender && !isDoctor)
                  ? "align-right"
                  : "align-left"
              }`}
            >
              <div className="message-info d-flex align-items-center">
                <img
                  src={`http://localhost:5000/${
                    msg.isDoctorSender ? msg.doctorId.profilePicture : msg.patientId.profilePicture
                  }`}
                  alt={msg.isDoctorSender ? msg.doctorId.name : msg.patientId.name}
                  className="rounded-circle message-profile-pic"
                />
              </div>
              <div className="message-content">
                {msg.message}
                <div className="message-time">
                  {new Date(msg.createdAt || "").toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}

                  {msg.isRead ? (
                    <span className="read-indicator">&#10003;&#10003;</span>
                    ) : (
                      <span className="unread-indicator">&#10003;</span>
                  )}
                </div>
                
              </div>
            </div>
          ))}
        </div>
        <div className="input-container">
          <input
            type="text"
            className="input-field"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
          />
          <button className="send-button" onClick={sendMessage}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
