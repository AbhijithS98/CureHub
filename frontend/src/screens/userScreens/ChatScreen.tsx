import { useCallback, useEffect, useRef, useState } from "react";
import socket from "../../services/socketService";
import { useLocation } from "react-router-dom";
import { useUserGetDoctorQuery } from "../../slices/userSlices/userApiSlice";
import { useDoctorGetUserQuery } from "../../slices/doctorSlices/doctorApiSlice";
const backendURL = import.meta.env.VITE_BACKEND_URL;
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
  const [lastMessage, setLastMessage] = useState<string | null>(null);
  const inputRef = useRef<HTMLDivElement | null>(null);

  const fetchChatHistory = async () => {
    try {
      const response = await fetch(
        `${backendURL}/api/chat?doctorId=${doctorId}&patientId=${userId}`
      );
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error("Error fetching chat history:", error);
    }
  };

  const markMessagesAsRead = async () => {
    try {
      await fetch(`${backendURL}/api/chat/mark-read`, {
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



  useEffect(() => {
    fetchChatHistory();
    socket.emit('join', { userId, doctorId});

    socket.on("receiveMessage", (message: Message) => {     
      setMessages((prevMessages) => [...prevMessages, message]);
      // setLastMessage(message.message)
      fetchChatHistory();
      markMessagesAsRead();
    });

    return () => {
      socket.off("receiveMessage");
      socket.emit('leave', { userId, doctorId});
    };
  }, [doctorId, userId]);

  



  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const messageData: Message = {
      doctorId,
      patientId: userId,
      message: newMessage,
      isDoctorSender: isDoctor, 
    };
    socket.emit("sendMessage", messageData);
    
    // setLastMessage(newMessage)
    setNewMessage(""); 
    fetchChatHistory(); 
  };


  useEffect(() => {
    markMessagesAsRead();
  }, [doctorId, userId, isDoctor]);


  // Scroll to the latest message whenever messages change
  useEffect(() => {
    if (inputRef.current) {     
      inputRef.current.scrollIntoView({ behavior: "smooth" });
      console.log("Scrolling to the input element");
    } else {
      console.log("Input reference not available during initial render");
    }
  }, [messages]);


  return (
    <div className="chat-container">
      <div className="chat-header">
             <img
                src={isDoctor? user?.data.profilePicture?
                              `${backendURL}/${user.data.profilePicture}` : '/assets/dummy-profile.png'
                            :
                              `${backendURL}/${doctor?.data.profilePicture}`}
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
                  src={!msg.isDoctorSender ? msg.patientId.profilePicture?
                      `${backendURL}/${msg.patientId.profilePicture}` : '/assets/dummy-profile.png'
                      :
                      `${backendURL}/${msg.doctorId.profilePicture}`                                     
                  }
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

                  {(msg.isDoctorSender && isDoctor) || (!msg.isDoctorSender && !isDoctor) ?
                  msg.isRead ? (
                    <span className="read-indicator">&#10003;&#10003;</span>
                    ) : (
                      <span className="unread-indicator">&#10003;</span>
                  )
                  :
                  ''
                  }
                </div>                
              </div>
            </div>
          ))}          
        </div>
        <div ref={inputRef} className="input-container">
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
