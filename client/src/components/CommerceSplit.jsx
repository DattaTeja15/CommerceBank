import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const CommerceSplit = () => {
  const [totalAmount, setTotalAmount] = useState(1);
  const [users, setUsers] = useState([]);
  const [paymentStatus, setPaymentStatus] = useState('');
  const [recentPayments, setRecentPayments] = useState([]);
  const [isNewPayment, setIsNewPayment] = useState(true);
  const [transactionId, setTransactionId] = useState(1);
  const [transactionToTrack, setTransactionToTrack] = useState('');
  const [previousPayment, setPreviousPayment] = useState(null);
  const [isPaymentApproved, setIsPaymentApproved] = useState(false);

  const generateTransactionId = () => {
    const id = Math.floor(10000 + Math.random() * 90000).toString();
    return id;
  };

  const addUser = () => {
    const usernameInput = document.getElementById('usernameInput');
    const newUsername = usernameInput.value.trim();

    if (newUsername !== '' && !users.some(user => user.name === newUsername) && newUsername.includes('@')) {
      setUsers([...users, { name: newUsername, customAmount: 0 }]);
      usernameInput.value = '';
    } else {
      alert('Invalid username. Please enter a unique username containing "@".');
    }
  };

  const removeUser = (userToRemove) => {
    const updatedUsers = users.filter((user) => user !== userToRemove);
    setUsers(updatedUsers);
  };

  const updateCustomAmount = (index, value) => {
    const updatedUsers = [...users];
    updatedUsers[index].customAmount = parseFloat(value) || 0;
    setUsers(updatedUsers);
  };

  const submitPayment = () => {
    if (totalAmount <= 0 || users.length < 2) {
      setPaymentStatus('Please enter a valid amount and add at least two unique users');
    } else {
      let remainingAmount = totalAmount;
      const equalShare = totalAmount / users.length;
      const newPayments = [];

      users.forEach((user, index) => {
        const customAmount = user.customAmount;
        const userShare = Math.min(equalShare + customAmount, remainingAmount);
        remainingAmount -= userShare;

        newPayments.push({
          id: generateTransactionId(),
          user: user.name,
          amount: userShare,
          status: 'PENDING',
        });
      });

      setRecentPayments((prevPayments) => [...prevPayments, ...newPayments]);
      setPaymentStatus('Payment Submitted - Awaiting Approval');
      setPreviousPayment(recentPayments[recentPayments.length - 1]);

      setIsNewPayment(false);
      setTransactionId(transactionId + 1);

      setIsPaymentApproved(false); // Set the payment approval status to false initially
    }
  };

  const startNewPayment = () => {
    setIsNewPayment(true);
    setTotalAmount(1);
    setUsers([]);
    setPaymentStatus('');
    setPreviousPayment(null);
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

  const getLastThreePayments = () => {
    const reversedPayments = [...recentPayments].reverse();
    return reversedPayments.slice(0, 3);
  };

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-6">
          <h2>Split Payment</h2>
          <div className="mb-3">
            <label htmlFor="totalAmount" className="form-label">
              Enter the total amount to split:
            </label>
            <input
              type="number"
              className="form-control"
              id="totalAmount"
              placeholder="Enter total amount"
              value={totalAmount}
              onChange={(e) => setTotalAmount(Math.max(parseFloat(e.target.value) || 1, 1))}
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
                  {user.name}
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Custom Amount"
                    value={user.customAmount}
                    onChange={(e) => updateCustomAmount(index, e.target.value)}
                  />
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
        </div>
        <div className="col-md-6">
          <h2>Payment Tracking</h2>
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
            {paymentStatus === 'Payment Submitted - Awaiting Approval' && !isPaymentApproved && (
              <button className="btn btn-primary" onClick={() => setIsPaymentApproved(true)}>
                Approve Payment
              </button>
            )}
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
      <div className="col-md-6">
        <h2>Recent Transactions</h2>
        <ul className="list-group">
        {getLastThreePayments().map((payment, index) => (
            <li className="list-group-item" key={index}>
              Transaction ID: {payment.id} - User: {payment.user} - Amount: {payment.amount} - Status: {payment.status}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CommerceSplit;
