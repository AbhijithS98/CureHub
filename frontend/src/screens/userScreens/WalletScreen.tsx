import React, { useState } from 'react';
import { useUserGetWalletQuery,useUserWalletRechargeMutation } from '../../slices/userSlices/userApiSlice';
import { useSelector } from 'react-redux';
import { RootState } from '../../store.js';
import { toast } from 'react-toastify';
import { IWallet } from '../../types/walletInterface';
import 'bootstrap/dist/css/bootstrap.min.css';


const WalletScreen: React.FC = () => {
  const { data, isLoading } = useUserGetWalletQuery({});
  const wallet: IWallet= data?.wallet;
  const { userInfo } = useSelector((state: RootState) => state.userAuth);
  const [rechargeWallet] = useUserWalletRechargeMutation();
  const [rechargeAmount, setRechargeAmount] = useState('');

  const handleRecharge = async () => {
    if (parseInt(rechargeAmount) > 0) {

      const response = await fetch('http://localhost:5000/api/payment/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: rechargeAmount, currency: 'INR' }),
      });

      const data = await response.json();
      if(data.success){
        const options = {
          key: 'rzp_test_SLWTHwkkbKB9bv',
          amount: parseInt(rechargeAmount) * 100, 
          currency: 'INR',
          name: 'CURE HUB',
          description: `For recharging user wallet`,
          order_id: data.order.id,
          handler: async function (response: any) {
            try{
              await rechargeWallet({ amount: rechargeAmount }).unwrap();
              setRechargeAmount('');
              toast.success('Recharge successful!'); 
            } catch(err:any){
              toast.error(err.data.message || 'Recharge failed')
            }
          },
          prefill: {
            name: userInfo?.name, 
            email: userInfo?.email,
            contact: userInfo?.phone,
          },
          theme: {
            color: '#0d6efd',
          },
        };
    
        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
      
      }else {
        toast.error('Failed to create Razorpay order');
      }

    } else {
      toast.error('Enter a valid amount');
    }
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="container my-5">
      <div className="row g-4">
        {/* Left Section */}
        <div className="col-md-4">
          <div className="card shadow">
            <div className="card-body text-center">
              <h2 className="card-title mb-3">My Wallet</h2>
              <p className="display-6 text-success">₹<strong>{wallet.balance}</strong></p>
              <div className="mt-4">
                <input
                  type="number"
                  className="form-control mb-3"
                  placeholder="Enter recharge amount"
                  value={rechargeAmount}
                  onChange={(e) => setRechargeAmount(e.target.value)}
                />
                <button className="btn btn-primary w-100" onClick={handleRecharge}>
                  Recharge
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="col-md-8">
          <div className="card shadow">
            <div className="card-body">
              <h3 className="card-title mb-4">Transaction History</h3>
              <div className="table-responsive">
                <table className="table table-hover table-bordered">
                  <thead className="table-secondary">
                    <tr>
                      <th>Date</th>
                      <th>Amount</th>
                      <th>Type</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* {wallet?.transactions?.length > 0 ? (
                      wallet.transactions.map((txn, index) => (
                        <tr key={index}>
                          <td>{new Date(txn.date).toLocaleDateString()}</td>
                          <td>₹{txn.amount}</td>
                          <td>{txn.type}</td>
                          <td>{txn.status}</td>
                        </tr>
                      ))
                    ) : ( */}
                    <tr>
                      <td colSpan={4} className="text-center">
                        No transactions found
                      </td>
                    </tr>
                    {/* )} */}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletScreen;
