import { useState } from "react";
import axios from "../services/api";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
  
    try {
      const res = await axios.post("/api/token/", 
        {
          username: formData.email,
          password: formData.password
        }, 
        { headers: { "Content-Type": "application/json" } }
      );
  
      localStorage.setItem("access_token", res.data.access);
      localStorage.setItem("refresh_token", res.data.refresh);
      axios.defaults.headers.common["Authorization"] = `Bearer ${res.data.access}`;
  
      navigate("/books"); 
    } catch (error) {
      console.error("Login Error:", error);
      setError(error.response?.data?.detail || "Invalid credentials!");
    }
  };
  

  return (
    <div className="container mt-5 col-md-4">
      <h2>Admin Login</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          className="form-control mb-2"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="form-control mb-2"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
        />
        <button type="submit" className="btn btn-primary w-100">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
