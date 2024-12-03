import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { FaComments } from "react-icons/fa";

interface User {
  userId: string;
  name: string;
  profilePicture: string;
}

const DoctorChatList = () => {
  const { doctorId } = useParams<{ doctorId: string; }>();
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {

    const fetchUsers = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/chat/doctorChats?doctorId=${doctorId}`);
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
                src={`http://localhost:5000/${user.profilePicture}`}
                alt={user.name}
                className="rounded-circle"
                style={{ width: "40px", height: "40px", objectFit: "cover" }}
              />
              <span className="ms-3">{user.name}</span>
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
