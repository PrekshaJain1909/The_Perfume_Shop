import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Swal from "sweetalert2";
import "./Auth.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const from = location.state?.from || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login({ email, password });
      Swal.fire({ icon: "success", title: "Logged in" });
      navigate(from);
    } catch (err) {
      Swal.fire({ icon: "error", title: "Login failed", text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <Navbar/>
    
    <div className="auth-root">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Login</h2>
<p>Welcome back to The Perfume Club</p>
        <label>
          Email
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label>
          Password
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>
        <button disabled={loading} type="submit">{loading ? "Logging in..." : "Login"}</button>
        <div style={{ marginTop: 12 }}>
          Don't have an account? <Link to="/register">Register</Link>
        </div>
      </form>
    </div>
    <Footer />
    </>
  );
};

export default Login;
