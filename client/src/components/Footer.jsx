import { useEffect, useState } from "react";
import "./Footer.css";

const Footer = () => {
  const [bottles, setBottles] = useState([]);

  // helper to remove bottle by id
  const removeBottle = (id) => {
    setBottles((prev) => prev.filter((b) => b.id !== id));
  };

  // periodically spawn random bottles
  useEffect(() => {
    const interval = setInterval(() => {
      setBottles((prev) => {
        // keep list from growing forever
        const trimmed = prev.length > 25 ? prev.slice(prev.length - 25) : prev;

        const id = Date.now() + Math.random();
        const left = Math.random() * 100; // 0–100% across screen
        const duration = 5 + Math.random() * 4; // 5–9s
        const size = 22 + Math.random() * 10; // px font size

        const newBottle = { id, left, duration, size };

        return [...trimmed, newBottle];
      });
    }, 1200); // every 1.2s

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* floating bottles overlay */}
      <div className="floating-bottles">
        {bottles.map((bottle) => (
          <div
            key={bottle.id}
            className="perfume-bottle"
            style={{
              left: `${bottle.left}%`,
              animationDuration: `${bottle.duration}s`,
              fontSize: `${bottle.size}px`,
            }}
            onClick={() => removeBottle(bottle.id)}
            onAnimationEnd={() => removeBottle(bottle.id)}
          >
            🫧
          </div>
        ))}
      </div>

      <footer className="footer-root">
        <div className="footer-inner">
          <div className="footer-col">
            <h3 className="footer-heading">Did You Know?</h3>
            <ul className="footer-facts">
              <li>✨ Scents last longer on moisturized skin.</li>
              <li>🌹 Perfumes smell different on every person due to body chemistry.</li>
              <li>💫 Heat points like the wrist & neck make fragrances stronger.</li>
              <li>🕊 Higher concentration perfumes last up to 8–12 hours.</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          © {new Date().getFullYear()} The Perfume Club — All Rights Reserved.
        </div>
      </footer>
    </>
  );
};

export default Footer;
