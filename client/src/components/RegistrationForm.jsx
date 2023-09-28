import React, { useState } from "react";
import axios from "axios"; // Import Axios

const RegistrationForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = (e) => {
    e.preventDefault();

    // Create an object with the data to be sent in the POST request
    const userData = {
      email: email,
      password: password,
    };

    // Make a POST request using Axios
    axios
      .post("http://localhost:8888/register", userData) // Replace with your actual backend API URL
      .then((response) => {
        // Handle a successful response (e.g., show a success message)
        console.log("Registration successful!");
        console.log(response.data); // You can access the response data here
      })
      .catch((error) => {
        // Handle any errors (e.g., display an error message)
        console.error("Registration failed:", error);
      });
  };

  return (
    <div className="registration-form">
      <h2>Registration Form</h2>
      <h1>app</h1>
      <form onSubmit={handleRegister}>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default RegistrationForm;
