import { motion } from "framer-motion";
import { useRef } from "react";

export function HeroButton() {
  const btnRef = useRef<HTMLAnchorElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    e.currentTarget.style.setProperty("--x", `${x}%`);
    e.currentTarget.style.setProperty("--y", `${y}%`);
  };

  return (
    <a
      ref={btnRef}
      className="btn"
      href="/cv.pdf"
      download
      onMouseMove={handleMouseMove}
    >
      <span>Download CV</span>
    </a>
  );
}

export default function Hero() {
  return (
    <section className="hero">
      <motion.div
        className="hero-name"
        initial={{ opacity: 0, x: -80 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.3 }}
      >
        <h1>LEVENTE BLANÁR</h1>
      </motion.div>

      <motion.div
        className="hero-info"
        initial={{ opacity: 0, x: 80 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.3 }}
      >
        <h2>Junior Developer</h2>
        <p>Building backend systems & web apps with Python, Go, and SQL</p>

        <HeroButton />
      </motion.div>
    </section>
  );
}
