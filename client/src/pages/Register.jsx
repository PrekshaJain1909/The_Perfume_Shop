import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Swal from "sweetalert2";
import "./Auth.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register({ name, email, password });
      Swal.fire({ icon: "success", title: "Account created" });
      navigate("/");
    } catch (err) {
      Swal.fire({ icon: "error", title: "Registration failed", text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <Navbar/>
    
    <div className="auth-root">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Register</h2>
        <label>
          Name
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </label>
        <label>
          Email
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label>
          Password
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>
        <button disabled={loading} type="submit">{loading ? "Creating..." : "Create account"}</button>
        <div style={{ marginTop: 12 }}>
          Already have an account? <Link to="/login">Login</Link>
        </div>
      </form>
    </div>
    <Footer />
    </>
  );
};

export default Register;
