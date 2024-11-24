import React, { useEffect, useState } from 'react';
import { useUserGetWalletQuery,
         useUserWalletRechargeMutation, 
         useUserGetWalletTransactionsQuery } from '../../slices/userSlices/userApiSlice';
import { useSelector } from 'react-redux';
import { RootState } from '../../store.js';
import { toast } from 'react-toastify';
import { IWallet } from '../../types/walletInterface';
import { Itransaction } from '../../types/transactionInterface';
import TableWithPagination,{ Column } from '../../components/PaginatedTable';
import 'bootstrap/dist/css/bootstrap.min.css';


const WalletScreen: React.FC = () => {
  const { data, isLoading, refetch } = useUserGetWalletQuery({});
  const wallet: IWallet | null = data?.wallet;
  const { data:transactionsData, refetch:transactionsRefetch } = useUserGetWalletTransactionsQuery({});
  const transactions: Itransaction[] | [] = transactionsData?.result;
  const { userInfo } = useSelector((state: RootState) => state.userAuth);
  const [rechargeWallet] = useUserWalletRechargeMutation();
  const [rechargeAmount, setRechargeAmount] = useState('');


  useEffect(()=>{
    if(transactions){
      console.log("txns: ",transactions); 
    }
  },[transactions])

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
              refetch();
              transactionsRefetch();
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

  

  const columns: Column<Itransaction>[] = [
    {
      key: 'createdAt',
      label: 'Date',
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
    {
      key: 'createdAt',
      label: 'Time',
      render: (value: string) =>
        new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
    { key: 'amount', label: 'Amount' },
    { key: 'transactionType', label: 'Type' },
    { key: 'status', label: 'Status' },
  ];


  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="container my-5">
      <div className="row g-4">
        {/* Left Section */}
        <div className="col-md-4">
          <div className="card shadow">
            <div className="card-body text-center">
              <h2 className="card-title mb-3">My Wallet</h2>
              <p className="display-6 text-success">₹<strong>{wallet?.balance || 0}</strong></p>
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
                <TableWithPagination data={transactions} columns={columns} rowsPerPage={5} />
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletScreen;
