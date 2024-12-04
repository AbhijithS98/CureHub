import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { FaComments } from "react-icons/fa";
import './style.css';

interface Doctor {
  doctorId: string;
  name: string;
  profilePicture: string;
  unreadCount: number;
}

const UserChatList = () => {
  const { userId } = useParams<{ userId: string; }>();
  const [doctors, setDoctors] = useState<Doctor[]>([]);

  useEffect(() => {

    const fetchPatientChats = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/chat/patientChats?patientId=${userId}`);
        const data = await response.json();
        console.log("dataaaaa is: ",data);
        
        setDoctors(data);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };

    fetchPatientChats();
  }, []);


  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Your Chats</h2>
      <div className="list-group">
        {doctors.length > 0 ? 
        (
          doctors.map((doctor) => (
            <div key={doctor.doctorId} className="list-group-item d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center">
                <img
                  src={`http://localhost:5000/${doctor.profilePicture}`}
                  alt={doctor.name}
                  className="chatlist-profile-pic"
                />
                <span className="ms-3">{doctor.name}</span>
                {doctor.unreadCount > 0 && (
                        <span className="badge badge-danger ml-1">{doctor.unreadCount}</span>
                      )}
              </div>
              <Link to={{pathname: "/user/chat",}}
                    state={{ doctorId:doctor.doctorId, userId }} 
                    className="btn btn-primary">
                <FaComments /> Start Chat
              </Link>
            </div>
          ))
        )
        :
        (
        <h5 className="text-danger text-center mt-4">No chats yet</h5>
        )
        }
      </div>
    </div>
  );
};

export default UserChatList;
