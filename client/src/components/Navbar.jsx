import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import "./Navbar.css";
import { useCart } from "../context/CartContext"; 
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { itemCount } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const toggleMenu = () => setIsOpen((prev) => !prev);
  const closeMenu = () => setIsOpen(false);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <header className="nav-root">
      <div className="nav-inner">
        {/* Logo on the left */}
        <div className="nav-logo">
          <Link to="/" onClick={closeMenu} className="nav-logo-link">
            <img src="/images/logoo.png" alt="The Perfume Club" className="nav-logo-img" />
             <h1>The Perfume Club</h1>
          </Link>
        </div>

        {/* Desktop links (right side) */}
        <nav className="nav-links">
          <NavLink to="/collections">Collections</NavLink>
          <NavLink to="/about">About</NavLink>
          {user&&<NavLink to="/orders">My Orders</NavLink>}
          
          {!user && <NavLink to="/login">Login</NavLink>}
          {!user && <NavLink to="/register">Register</NavLink>}
          <NavLink to="/contact">Contact</NavLink>
          {user && (
  <>
    <button className="nav-logout-btn" onClick={handleLogout}>
      Logout
    </button>
  </>
)}


          <Link to="/cart" className="nav-cart-link">
            🛒
            {itemCount > 0 && <span className="nav-cart-badge">{itemCount}</span>}
          </Link>
         
        </nav>

        {/* Hamburger (shown only on mobile via CSS) */}
        <button
          type="button"
          className={`nav-hamburger ${isOpen ? "open" : ""}`}
          onClick={toggleMenu}
          aria-label="Toggle navigation"
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* Mobile dropdown menu */}
      {isOpen && (
        <nav className="nav-links-mobile">
          <NavLink to="/collections" onClick={closeMenu}>
            Collections
          </NavLink>
          <NavLink to="/about" onClick={closeMenu}>
            About
          </NavLink>
          {user && (
            <NavLink to="/orders" onClick={closeMenu}>My Orders</NavLink>
          )}
          <NavLink to="/contact" onClick={closeMenu}>
            Contact
          </NavLink>
          {!user && <NavLink to="/login" onClick={closeMenu}>Login</NavLink>}
          {!user && <NavLink to="/register" onClick={closeMenu}>Register</NavLink>}
          {user && (
  <button
    className="nav-logout-btn"
    onClick={() => {
      handleLogout();
      closeMenu();
    }}
  >
    Logout
  </button>
)}

          <Link to="/cart" className="nav-cart-link">
            🛒
            {itemCount > 0 && <span className="nav-cart-badge">{itemCount}</span>}
          </Link>
        </nav>
      )}
    </header>
  );
};

export default Navbar;
