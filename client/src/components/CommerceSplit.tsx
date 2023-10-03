import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

interface Payment {
  id: string;
  user: string;
  amount: number;
  status: string;
}

const CommerceSplit: React.FC = () => {
  const [amountToSplit, setAmountToSplit] = useState<number | ''>('');
  const [users, setUsers] = useState<string[]>([]);
  const [recentPayments, setRecentPayments] = useState<Payment[]>([]);
  const [paymentStatus, setPaymentStatus] = useState<string>('');
  const [splitPayments, setSplitPayments] = useState<Payment[][]>([]);
  const [isNewPayment, setIsNewPayment] = useState<boolean>(true);
  const [transactionId, setTransactionId] = useState<number>(1);
  const [transactionToTrack, setTransactionToTrack] = useState<string>('');
  const [previousPayment, setPreviousPayment] = useState<Payment | null>(null);

  const generateTransactionId = () => {
    const id = Math.floor(10000 + Math.random() * 90000).toString();
    return id;
  };

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAmountToSplit(event.target.value === '' ? '' : Number(event.target.value));
  };

  const addUser = () => {
    const usernameInput = document.getElementById('usernameInput') as HTMLInputElement;
    const newUsername = usernameInput.value.trim();

    if (newUsername !== '' && !users.includes(newUsername)) {
      setUsers([...users, newUsername]);
      usernameInput.value = '';
    }
  };

  const removeUser = (userToRemove: string) => {
    const updatedUsers = users.filter((user) => user !== userToRemove);
    setUsers(updatedUsers);
  };

  const submitPayment = () => {
    if (amountToSplit === '' || users.length < 2) {
      setPaymentStatus('Please enter an amount and add at least two unique users.');
      return;
    }

    setPaymentStatus('Processing...');
    const randomOutcome = Math.random(); 

    setTimeout(() => {
      const userShare = amountToSplit / users.length;

      const newPayments = users.map((user) => ({
        id: generateTransactionId(),
        user,
        amount: userShare,
        status: 'SUCCESSFUL', 
      }));

      setRecentPayments(newPayments);
      setPaymentStatus('SUCCESSFUL');

      const recentUsersAndFriends = recentPayments.map((payment) => payment.user);
      for (const user of recentUsersAndFriends) {
        if (!users.includes(user)) {
          newPayments.push({
            id: generateTransactionId(),
            user,
            amount: userShare,
            status: 'SUCCESSFUL', 
          });
        }
      }

      setPreviousPayment(recentPayments[recentPayments.length - 1]);
      setSplitPayments([...splitPayments, newPayments]);

      setIsNewPayment(false);
      setTransactionId(transactionId + 1);
    }, 3000);
  };

  const trackTransaction = () => {
    const foundPayment = recentPayments.find((payment) => payment.id === transactionToTrack);

    if (foundPayment) {
      setPaymentStatus(`Payment ${foundPayment.id} is ${foundPayment.status}`);
    } else if (previousPayment && previousPayment.id === transactionToTrack) {
      setPaymentStatus(`Payment ${previousPayment.id} is ${previousPayment.status}`);
    } else {
      setPaymentStatus(`Payment with ID ${transactionToTrack} not found`);
    }
  };

  const startNewPayment = () => {
    setIsNewPayment(true);
    setAmountToSplit('');
    setUsers([]);
    setPaymentStatus('');
    setPreviousPayment(null);
  };

  const getLastThreePayments = () => {
    if (splitPayments.length <= 3) {
      return splitPayments;
    }
    return splitPayments.slice(splitPayments.length - 3);
  };

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-6">
          <h1>Welcome to Commerce Split</h1>
          <div className="mb-3">
            <label htmlFor="amountToSplit" className="form-label">
              Enter the amount to split:
            </label>
            <input
              type="number"
              className="form-control"
              id="amountToSplit"
              placeholder="Enter amount"
              value={amountToSplit}
              onChange={handleAmountChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="usernameInput" className="form-label">
              Add users:
            </label>
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                id="usernameInput"
                placeholder="Enter username"
              />
              <button className="btn btn-outline-secondary" type="button" onClick={addUser}>
                Add User
              </button>
            </div>
          </div>
          <div className="mb-3">
            <strong>Added Users:</strong>
            <ul className="list-group">
              {users.map((user, index) => (
                <li className="list-group-item d-flex justify-content-between align-items-center" key={index}>
                  {user}
                  <button className="btn btn-danger btn-sm" onClick={() => removeUser(user)}>
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
          {isNewPayment ? (
            <button className="btn btn-primary" onClick={submitPayment}>
              Submit Payment
            </button>
          ) : (
            <button className="btn btn-secondary" onClick={startNewPayment}>
              Start New Payment
            </button>
          )}
          <div className="mb-3">
            <strong>Status:</strong> {paymentStatus}
          </div>
        </div>
        <div className="col-md-6">
          <div className="mb-3">
            <strong>Enter Transaction ID to Track:</strong>
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Enter Transaction ID"
                value={transactionToTrack}
                onChange={(e) => setTransactionToTrack(e.target.value)}
              />
              <button className="btn btn-outline-secondary" type="button" onClick={trackTransaction}>
                Track
              </button>
            </div>
          </div>
          <div className="mb-3">
            <strong>Status:</strong> {paymentStatus}
          </div>
          <div className="mb-3">
            <strong>Recent Split Payments:</strong>
            {getLastThreePayments().map((payments, index) => (
              <div className="mb-3" key={index}>
                <strong>Payment {splitPayments.length - 2 + index}:</strong>
                <ul className="list-group">
                  {payments.map((payment, i) => (
                    <li className="list-group-item" key={i}>
                      Transaction ID: {payment.id} - User: {payment.user} - Amount: {payment.amount} - Status: {payment.status}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          {previousPayment && (
            <div className="mb-3">
              <strong>Previous Payment:</strong>
              <ul className="list-group">
                <li className="list-group-item">
                  Transaction ID: {previousPayment.id} - User: {previousPayment.user} - Amount: {previousPayment.amount} - Status: {previousPayment.status}
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommerceSplit;
