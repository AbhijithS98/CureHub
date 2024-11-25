import React ,{useEffect, useState} from 'react';
import { useAdminListUsersQuery, 
         useAdminBlockUserMutation, 
         useAdminUnblockUserMutation } from '../../slices/adminSlices/adminApiSlice';
import { toast, ToastPosition, Id } from 'react-toastify';
import { Table, Button, Container } from "react-bootstrap";
import { Iuser } from '../../types/userInterface';


const ManageUsers: React.FC = () => {
  const [users, setUsers] = useState<Iuser[]>([]);
  const { data , error, isLoading, refetch } = useAdminListUsersQuery({});
  const [blockUser] = useAdminBlockUserMutation();
  const [unblockUser] = useAdminUnblockUserMutation();

  const confirmAndHandleAction = (email: string, action: "block" | "unblock") => {
    const toastId: Id = toast.info(
      <span>
        Are you sure you want to {action} this user?
        <Button
          variant="primary"
          size="sm"
          onClick={() => {
            handleAction(email, action);
            toast.dismiss(toastId);
          }}
          className="ms-3"
        >
          Confirm
        </Button>
      </span>,
      {
        autoClose: false,
        closeOnClick: false,
        draggable: false,
        position: "top-center" as ToastPosition,
      }
    );
  };

  const handleAction = async (email:string, action: "block" | "unblock") => {
    
    try{
      if (action === "block") {
        await blockUser({email}).unwrap();
        toast.success('User blocked successfully');

      } else if (action === "unblock") {
        await unblockUser({email}).unwrap();
        toast.success('User unblocked successfully');
      }
      refetch();
    } catch(error:any){
      toast.error(error.message || "Action failed")
    }    
  };

  useEffect(()=>{
    console.log("runing useeffect");
    
    if (data) {   
      setUsers(data);
      console.log("data is: ",data);
      
    } else if (error) {
      toast.error("failed to fetch Users");
    }
  })


  return (
    <Container>
      <h1 className="my-4 text-center">User Management</h1>
      {isLoading ? (
        <p className="text-center text-primary fs-4 mt-5">Loading users...</p>
      ) : error ? (
        <p className="text-center text-danger fs-4 mt-5">Error loading users</p>
      ) : users?.length === 0 ? (
        <p className="text-center text-danger fs-4 mt-5">No users found</p>
      ) : (
        <Table striped bordered hover responsive className="table-sm">
          <thead>
            <tr>
              <th>index</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user.id}>
                <td>{index + 1}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td>{user.isBlocked ? 'Blocked' : 'Active'}</td>
                <td>
                  {user.isBlocked ? (
                    <Button
                      variant="success"
                      className="btn-sm"
                      onClick={() => confirmAndHandleAction(user.email,'unblock')}
                    >
                      Unblock
                    </Button>
                  ) : (
                    <Button
                      variant="danger"
                      className="btn-sm"
                      onClick={() => confirmAndHandleAction(user.email,'block')}
                    >
                      Block
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default ManageUsers;
