import { useState, useEffect } from "react";
import API, { getCsrfToken } from "../services/api";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Ensure CSRF token is available
  useEffect(() => {
    API.get("/api/csrf/") // ✅ Django should return CSRF token
      .then(() => console.log("CSRF Token fetched"))
      .catch((err) => console.error("CSRF Fetch Error:", err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await API.post(
        "/admin/signup/",
        {
          username: formData.email,
          password: formData.password,
        },
        {
          headers: {
            "X-CSRFToken": getCsrfToken(), // ✅ Fetch token from cookies
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
