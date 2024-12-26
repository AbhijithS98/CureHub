import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { FaComments } from "react-icons/fa";
import './styles.css';

interface User {
  userId: string;
  name: string;
  profilePicture: string;
  unreadCount: number;
}

const DoctorChatList = () => {
  const { doctorId } = useParams<{ doctorId: string; }>();
  const [users, setUsers] = useState<User[]>([]);
  const backendURL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {

    const fetchUsers = async () => {
      try {
        const response = await fetch(`${backendURL}/api/chat/doctorChats?doctorId=${doctorId}`);
        const data = await response.json();
        console.log("dataaaaa is: ",data);
        
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);


  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Your Chats</h2>
      <div className="list-group">
        {users.map((user) => (
          <div key={user.userId} className="list-group-item d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <img
                src={`${backendURL}/${user.profilePicture}`}
                alt={user.name}
                className="chatlist-profile-pic"
              />
              <span className="ms-3">{user.name}</span>
              {user.unreadCount > 0 && (
                      <span className="badge badge-danger ml-1">{user.unreadCount}</span>
                    )}
            </div>
            <Link to={{pathname: "/doctor/single-chat",}}
                  state={{ doctorId,userId: user.userId }} 
                  className="btn btn-primary">
              <FaComments /> Start Chat
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorChatList;
