import { useState, useEffect } from "react";
import API, { getCsrfToken } from "../services/api";
import { useNavigate } from "react-router-dom";
import axios from "../services/api";

const Signup = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("/api/csrf/")
      .then(res => console.log("CSRF Token:", res.data))
      .catch(err => console.error(err));
  }, []); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
  
    try {
      const csrfToken = getCsrfToken();  // ✅ Get CSRF token
      if (!csrfToken) {
        console.error("No CSRF token found!");
        return;
      }
  
      await API.post(
        "/admin/signup/",
        {
          username: formData.email,
          password: formData.password,
        },
        {
          headers: {
            "X-CSRFToken": csrfToken,  // ✅ Ensure token is sent
          },
        }
      );
  
      alert("Signup successful! Redirecting to login...");
      navigate("/login");
    } catch (error) {
      console.error("Signup Error:", error);
      setError(error.response?.data?.error || "Signup failed! Try again.");
    }
  };
  

  return (
    <div className="container mt-5 col-md-4">
      <h2>Admin Signup</h2>
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
          Signup
        </button>
      </form>
    </div>
  );
};

export default Signup;
