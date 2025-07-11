import React, { useState, useEffect, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useInView,
  useScroll,
  useTransform,
} from "framer-motion";
import Lottie from "lottie-react";
import meditationAnimation from "./animations/meditation.json"; // Make sure this path is correct

// Load Google Fonts once
const loadGoogleFonts = () => {
  if (!document.getElementById("google-fonts")) {
    const link = document.createElement("link");
    link.id = "google-fonts";
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Poppins:wght@600;800&display=swap";
    document.head.appendChild(link);
  }
};

// Navigation Sections
const sections = [
  { id: "hero", label: "Home" },
  { id: "features", label: "Features" },
  { id: "how-it-works", label: "How It Works" },
  { id: "testimonials", label: "Testimonials" },
  { id: "faq", label: "FAQ" },
  { id: "cta", label: "Get Started" },
];

// FAQ data
const faqs = [
  {
    question: "Is Numi AI free to use?",
    answer: "Yes! Start your first tiny habit for free, no credit card needed.",
  },
  {
    question: "How does the AI personalize my habits?",
    answer:
      "Numi AI learns from your inputs and progress to deliver habits that suit your lifestyle.",
  },
  {
    question: "Can I use Numi on my mobile device?",
    answer: "Definitely! It’s optimized for desktop and mobile browsers seamlessly.",
  },
];

// Testimonials
const testimonials = [
  {
    name: "Sophia M.",
    role: "Product Manager",
    quote:
      "Numi helped me reduce stress and build positive routines with tiny, easy-to-follow habits.",
  },
  {
    name: "James L.",
    role: "Software Engineer",
    quote:
      "I love how Numi’s AI adapts and gently nudges me to take care of my mental health daily.",
  },
  {
    name: "Ava K.",
    role: "Graphic Designer",
    quote: "The calm animations and personalized approach make wellness feel accessible and fun!",
  },
];

// Motion Variants (Updated and new ones)
const heroTextVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      damping: 10,
      stiffness: 100,
      delay: 0.3,
      duration: 1,
    },
  },
};

const heroButtonVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      damping: 10,
      stiffness: 100,
      delay: 0.6,
      duration: 0.8,
    },
  },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemReveal = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      damping: 12,
      stiffness: 100,
      duration: 0.7,
    },
  },
};

const iconHover = {
  scale: 1.15,
  rotate: 10,
  transition: { type: "spring", stiffness: 300, damping: 10 },
};

const cardHover = {
  y: -8,
  boxShadow: "0 15px 30px rgba(0, 0, 0, 0.2)",
  transition: { type: "spring", stiffness: 300, damping: 15 },
};

// IconButton Component (for dark mode toggle and generic use)
const IconButton = ({ children, onClick, ariaLabel, className = "" }) => (
  <button
    onClick={onClick}
    aria-label={ariaLabel}
    type="button"
    className={`p-2 rounded-full bg-gradient-to-tr from-purple-600 to-pink-500 hover:from-pink-500 hover:to-purple-600 shadow-lg hover:shadow-pink-500/50 transition duration-300 focus:outline-none focus:ring-4 focus:ring-pink-400 dark:focus:ring-purple-700 ${className}`}
  >
    {children}
  </button>
);

// Magnetic Button Component
const MagneticButton = ({ children, className = "", onClick }) => {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const { width, height, left, top } = ref.current.getBoundingClientRect();
    const x = clientX - (left + width / 2);
    const y = clientY - (top + height / 2);
    setPosition({ x: x * 0.15, y: y * 0.15 }); // Reduced intensity
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  const { x, y } = position;

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x, y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      onClick={onClick}
      className={`relative inline-flex items-center justify-center overflow-hidden rounded-full font-bold text-white transition-all duration-300 ease-in-out ${className}`}
    >
      <span className="absolute inset-0 bg-gradient-to-r from-pink-600 via-purple-700 to-indigo-700 rounded-full"></span>
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
};

export default function App() {
  loadGoogleFonts();

  // Dark mode state with localStorage persistence
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("darkMode");
      if (saved !== null) return saved === "true";
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });

  // Apply dark mode class to <html> for Tailwind dark mode
  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) root.classList.add("dark");
    else root.classList.remove("dark");
    localStorage.setItem("darkMode", darkMode.toString());
  }, [darkMode]);

  // Scroll progress & active nav tracking
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress((scrollTop / docHeight) * 100);

      // Detect active section (with offset for navbar height)
      let current = "hero";
      for (const sec of sections) {
        const el = document.getElementById(sec.id);
        if (el) {
          const offsetTop = el.offsetTop - 150; // Adjusted offset for smoother highlight
          if (scrollTop >= offsetTop) current = sec.id;
        }
      }
      setActiveSection(current);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // initial
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Mobile menu toggle state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Smooth scroll handler for nav links
  function handleNavClick(id) {
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el)
      el.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
  }

  // Refs for section animations with intersection observer
  const featuresRef = useRef(null);
  const featuresInView = useInView(featuresRef, { once: true, margin: "-100px" });

  const howRef = useRef(null);
  const howInView = useInView(howRef, { once: true, margin: "-100px" });

  const testRef = useRef(null);
  const testInView = useInView(testRef, { once: true, margin: "-100px" });

  const faqRef = useRef(null);
  const faqInView = useInView(faqRef, { once: true, margin: "-100px" });

  // Parallax circles effect on mouse move/touch move (enhanced)
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start end", "end start"],
  });

  const parallaxOpacity1 = useTransform(scrollYProgress, [0, 0.5], [1, 0.3]);
  const parallaxY1 = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const parallaxRotate1 = useTransform(scrollYProgress, [0, 1], ["0deg", "180deg"]);

  const parallaxOpacity2 = useTransform(scrollYProgress, [0.2, 0.7], [1, 0.4]);
  const parallaxY2 = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"]);
  const parallaxRotate2 = useTransform(scrollYProgress, [0, 1], ["0deg", "-180deg"]);

  // Dynamic parallax for mouse movement
  function handleParallax(e) {
    const circles = document.querySelectorAll(".parallax-circle-mouse");
    circles.forEach((circle) => {
      const speed = parseFloat(circle.getAttribute("data-speed")) || 0;
      const x = (window.innerWidth / 2 - e.clientX) * speed;
      const y = (window.innerHeight / 2 - e.clientY) * speed;
      circle.style.transform = `translate(${x}px, ${y}px) rotate(${x * 0.1 + y * 0.1}deg)`; // More dynamic rotation
    });
  }

  return (
    <>
      {/* Scroll Progress Bar */}
      <motion.div
        aria-hidden="true"
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-500 z-50"
        style={{ width: `${scrollProgress}%` }}
        initial={{ width: 0 }}
        animate={{ width: `${scrollProgress}%` }}
        transition={{ ease: "easeOut", duration: 0.3 }}
      />

      {/* Main wrapper with background and font */}
      <div
        className={`min-h-screen font-sans text-gray-900 dark:text-gray-100 transition-colors duration-700 relative overflow-hidden
          ${
            darkMode
              ? "bg-gradient-to-tr from-gray-950 via-purple-950 to-pink-950"
              : "bg-gradient-to-tr from-indigo-50 via-purple-50 to-pink-50"
          }
        `}
      >
        {/* Navbar */}
        <nav
          role="navigation"
          aria-label="Main navigation"
          className="fixed top-0 left-0 right-0 bg-white bg-opacity-80 dark:bg-gray-900 dark:bg-opacity-80 backdrop-blur-lg shadow-xl z-50 transition-all duration-300"
        >
          <div className="max-w-7xl mx-auto px-6 md:px-16 flex justify-between items-center h-20 relative">
            {/* Logo / Brand */}
            <motion.div
              tabIndex={0}
              role="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }
              }}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl font-extrabold cursor-pointer bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 select-none z-50
                focus:outline-none focus:ring-2 focus:ring-pink-500 dark:focus:ring-indigo-400 transform hover:scale-105 transition-transform"
            >
              Numi AI
            </motion.div>

            {/* Desktop Navigation */}
            <ul
              className="hidden md:flex space-x-10 text-lg font-semibold relative"
              role="menubar"
            >
              {sections.map(({ id, label }) => (
                <li
                  key={id}
                  role="menuitem"
                  tabIndex={0}
                  onClick={() => handleNavClick(id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") handleNavClick(id);
                  }}
                  className={`cursor-pointer hover:text-indigo-700 dark:hover:text-pink-400 transition-all duration-200 relative focus:outline-none focus:ring-2 focus:ring-indigo-600 dark:focus:ring-pink-400 p-2 rounded-md ${
                    activeSection === id
                      ? "text-indigo-700 dark:text-pink-400 font-bold"
                      : "text-gray-700 dark:text-gray-300"
                  }`}
                >
                  {label}

                  {/* Animated underline */}
                  {activeSection === id && (
                    <motion.div
                      layoutId="underline"
                      className="absolute bottom-0 left-0 right-0 h-1 rounded-full bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600"
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </li>
              ))}
            </ul>

            {/* Dark Mode Toggle */}
            <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
              <IconButton
                ariaLabel="Toggle dark mode"
                onClick={() => setDarkMode((d) => !d)}
              >
                {darkMode ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-yellow-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                    aria-hidden="true"
                    focusable="false"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 3v1m0 16v1m8.66-10h-1M4.34 12h-1m15.07 4.07l-.7-.7M6.34 6.34l-.7-.7m12.02 12.02l-.7-.7M6.34 17.66l-.7-.7M12 5a7 7 0 0 0 0 14 7 7 0 0 0 0-14z"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-gray-900"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                    aria-hidden="true"
                    focusable="false"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z"
                    />
                  </svg>
                )}
              </IconButton>
            </motion.div>

            {/* Mobile Hamburger Menu Button */}
            <button
              className="md:hidden ml-4 p-2 rounded-md hover:bg-indigo-100 dark:hover:bg-pink-700 transition z-50 focus:outline-none focus:ring-2 focus:ring-indigo-600 dark:focus:ring-pink-400"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close Mobile Menu" : "Open Mobile Menu"}
              type="button"
            >
              {mobileMenuOpen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-7 w-7 text-gray-800 dark:text-gray-200"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                  focusable="false"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-7 w-7 text-gray-800 dark:text-gray-200"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                  focusable="false"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 8h16M4 16h16" />
                </svg>
              )}
            </button>

            {/* Mobile Menu Slide-in */}
            <AnimatePresence>
              {mobileMenuOpen && (
                <motion.nav
                  aria-label="Mobile navigation"
                  initial={{ x: "100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "100%" }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="fixed top-0 right-0 bottom-0 w-64 bg-white dark:bg-gray-900 shadow-xl z-40 flex flex-col p-6 pt-24"
                >
                  <ul className="flex flex-col space-y-6 text-xl" role="menu">
                    {sections.map(({ id, label }) => (
                      <li
                        key={id}
                        role="menuitem"
                        tabIndex={0}
                        className="cursor-pointer hover:text-indigo-700 dark:hover:text-pink-400 transition focus:outline-none focus:ring-2 focus:ring-indigo-600 dark:focus:ring-pink-400 p-2 rounded-md"
                        onClick={() => handleNavClick(id)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") handleNavClick(id);
                        }}
                      >
                        {label}
                      </li>
                    ))}
                  </ul>
                </motion.nav>
              )}
            </AnimatePresence>
          </div>
        </nav>

        {/* Hero Section */}
        <section
          id="hero"
          ref={heroRef}
          className="relative min-h-screen flex flex-col items-center justify-center px-6 md:px-16 text-center pt-20 overflow-hidden"
          onMouseMove={handleParallax}
          onTouchMove={(e) => handleParallax(e.touches[0])}
          aria-label="Hero Section"
        >
          {/* Parallax Background Circles (Enhanced) */}
          <motion.div
            data-speed="0.025"
            aria-hidden="true"
            className="parallax-circle-mouse absolute -top-40 -left-40 w-[35rem] h-[35rem] rounded-full bg-gradient-to-tr from-pink-400 via-purple-500 to-indigo-600 opacity-30 blur-3xl pointer-events-none"
            style={{ y: parallaxY1, opacity: parallaxOpacity1, rotate: parallaxRotate1 }}
            animate={{ scale: [1, 1.05, 1], x: [-20, 20, -20], y: [20, -20, 20] }}
            transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            data-speed="0.015"
            aria-hidden="true"
            className="parallax-circle-mouse absolute bottom-28 right-28 w-96 h-96 rounded-full bg-gradient-to-br from-green-400 via-teal-400 to-blue-400 opacity-25 blur-2xl pointer-events-none"
            style={{ y: parallaxY2, opacity: parallaxOpacity2, rotate: parallaxRotate2 }}
            animate={{ scale: [1, 0.95, 1], x: [30, -30, 30], y: [-30, 30, -30] }}
            transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            data-speed="0.035"
            aria-hidden="true"
            className="parallax-circle-mouse absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-gradient-to-tl from-yellow-300 to-orange-400 opacity-20 blur-xl pointer-events-none"
            animate={{ scale: [1, 1.1, 1], x: [15, -15, 15], y: [-15, 15, -15] }}
            transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
          />

          <motion.div
            initial={{ opacity: 0, y: 80 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.1 }}
            className="relative bg-white bg-opacity-30 backdrop-blur-xl rounded-3xl p-8 md:p-12 shadow-3xl max-w-5xl z-10 border border-white border-opacity-30 dark:bg-gray-900 dark:bg-opacity-30 dark:border-purple-700/50 transform hover:scale-[1.01] transition-transform duration-300"
          >
            <motion.h1
              variants={heroTextVariants}
              initial="hidden"
              animate="visible"
              style={{ fontFamily: "'Poppins', sans-serif" }}
              className="text-5xl md:text-8xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-pink-600 via-purple-700 to-indigo-700 dark:from-pink-400 dark:via-purple-500 dark:to-indigo-400 drop-shadow-lg"
            >
              Your AI Wellness Coach
            </motion.h1>
            <motion.p
              variants={heroTextVariants}
              initial="hidden"
              animate="visible"
              style={{ fontFamily: "'Inter', sans-serif" }}
              className="text-xl md:text-3xl text-indigo-900 dark:text-indigo-200 mb-10 max-w-2xl mx-auto drop-shadow-md leading-relaxed"
            >
              Personalized support to build calm, healthy micro-habits every day.
            </motion.p>
            <motion.div variants={heroButtonVariants} initial="hidden" animate="visible">
              <MagneticButton
                onClick={() => alert("Signup flow coming soon!")}
                className="px-12 py-4 md:px-16 md:py-6 text-xl md:text-2xl shadow-2xl hover:shadow-pink-500/60 transition-all duration-300"
              >
                Start for Free
              </MagneticButton>
            </motion.div>
          </motion.div>

          {/* Meditation Lottie Animation bottom right */}
          <motion.div
            className="absolute -bottom-10 -right-10 w-64 h-64 md:w-96 md:h-96 opacity-60 pointer-events-none select-none z-0"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1, duration: 1.5, ease: "easeOut" }}
          >
            <Lottie animationData={meditationAnimation} loop={true} />
          </motion.div>
        </section>

        {/* Features Section */}
        <section
          id="features"
          ref={featuresRef}
          className="max-w-7xl mx-auto px-6 md:px-16 py-24 relative"
          aria-label="Features"
        >
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate={featuresInView ? "visible" : "hidden"}
            className="text-center mb-20"
          >
            <motion.h2
              variants={fadeInUp}
              className="text-4xl md:text-5xl font-extrabold mb-4 text-indigo-800 dark:text-indigo-300 drop-shadow"
            >
              Why Choose Numi AI?
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="max-w-2xl mx-auto text-lg md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed"
            >
              Tiny habits powered by AI, designed to reduce stress and boost mental wellness.
            </motion.p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate={featuresInView ? "visible" : "hidden"}
            className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12"
          >
            {[
              {
                title: "Personalized AI Support",
                desc: "Get habit suggestions tailored just for you, based on your progress and preferences. Our AI adapts to your unique journey.",
                icon: (
                  <motion.svg
                    variants={itemReveal}
                    whileHover={iconHover}
                    className="w-14 h-14 text-pink-500 transform transition-transform duration-300"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 14l9-5-9-5-9 5 9 5z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 14l6.16-3.422A12.083 12.083 0 0118 19.5c0 3.314-2.686 6-6 6s-6-2.686-6-6c0-1.213.4-2.33 1.08-3.244L12 14z"
                    />
                  </motion.svg>
                ),
              },
              {
                title: "Calming UI & Experience",
                desc: "Soft colors, smooth animations, and gentle reminders help you stay relaxed and focused on your wellbeing.",
                icon: (
                  <motion.svg
                    variants={itemReveal}
                    whileHover={iconHover}
                    className="w-14 h-14 text-purple-600 transform transition-transform duration-300"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <circle cx="12" cy="12" r="10" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M12 6v6l4 2" strokeLinecap="round" strokeLinejoin="round" />
                  </motion.svg>
                ),
              },
              {
                title: "Track & Improve",
                desc: "Monitor your habit streaks and see your progress over time with insightful charts and clear visual feedback.",
                icon: (
                  <motion.svg
                    variants={itemReveal}
                    whileHover={iconHover}
                    className="w-14 h-14 text-indigo-600 transform transition-transform duration-300"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 3v18h18"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 17l4-4 4 4"
                    />
                  </motion.svg>
                ),
              },
            ].map(({ title, desc, icon }, i) => (
              <motion.div
                key={title}
                variants={itemReveal}
                whileHover={cardHover}
                className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-lg flex flex-col items-center text-center space-y-5 border border-transparent dark:border-gray-700 hover:border-indigo-300 dark:hover:border-purple-600 transition-all duration-300"
              >
                <div className="mb-4">{icon}</div>
                <h3 className="text-2xl font-semibold text-indigo-800 dark:text-indigo-300">
                  {title}
                </h3>
                <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed">
                  {desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* How It Works Section */}
        <section
          id="how-it-works"
          ref={howRef}
          className="max-w-7xl mx-auto px-6 md:px-16 py-24 bg-gradient-to-tr from-pink-50 via-purple-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900 rounded-3xl shadow-inner-lg"
          aria-label="How It Works"
        >
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate={howInView ? "visible" : "hidden"}
            className="max-w-4xl mx-auto text-center mb-16"
          >
            <motion.h2
              variants={fadeInUp}
              className="text-4xl md:text-5xl font-extrabold mb-6 text-indigo-900 dark:text-indigo-200 drop-shadow"
            >
              How Numi AI Works
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-lg md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed"
            >
              AI-powered habit suggestions, gentle reminders, and progress tracking all in one seamless experience.
            </motion.p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate={howInView ? "visible" : "hidden"}
            className="space-y-10 md:space-y-16 max-w-5xl mx-auto"
          >
            {[
              {
                step: "1",
                title: "Tell Numi About You",
                desc: "Share your daily routine, aspirations, and any specific wellness goals. Our AI uses this to create a baseline understanding.",
              },
              {
                step: "2",
                title: "Receive Daily Habit Suggestions",
                desc: "Numi AI analyzes your input and suggests tiny, achievable habits tailored to your lifestyle, helping you build momentum without overwhelm.",
              },
              {
                step: "3",
                title: "Track Your Progress & Improve",
                desc: "Log your habits effortlessly. View detailed insights, celebrate streaks, and watch as Numi AI adapts and refines its suggestions based on your growth.",
              },
            ].map(({ step, title, desc }, i) => (
              <motion.div
                key={step}
                variants={itemReveal}
                whileHover={cardHover}
                className="flex flex-col md:flex-row items-center md:space-x-10 bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-lg border border-transparent dark:border-gray-700 hover:border-purple-400 dark:hover:border-pink-500 transition-all duration-300"
              >
                <div className="flex-shrink-0 mb-6 md:mb-0 transform hover:scale-110 transition-transform duration-300">
                  <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-r from-pink-600 via-purple-700 to-indigo-700 text-white font-bold text-2xl select-none shadow-md">
                    {step}
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-indigo-800 dark:text-indigo-300 mb-3">{title}</h3>
                  <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">{desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Testimonials Section */}
        <section
          id="testimonials"
          ref={testRef}
          className="max-w-7xl mx-auto px-6 md:px-16 py-24 relative"
          aria-label="Testimonials"
        >
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate={testInView ? "visible" : "hidden"}
            className="text-center mb-20"
          >
            <motion.h2
              variants={fadeInUp}
              className="text-4xl md:text-5xl font-extrabold mb-6 text-indigo-800 dark:text-indigo-300 drop-shadow"
            >
              What Users Say
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="max-w-2xl mx-auto text-lg md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed"
            >
              Real feedback from people who improved their wellbeing with Numi AI.
            </motion.p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate={testInView ? "visible" : "hidden"}
            className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12"
          >
            {testimonials.map(({ name, role, quote }, i) => (
              <motion.div
                key={name}
                variants={itemReveal}
                whileHover={cardHover}
                className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-lg flex flex-col justify-between border border-transparent dark:border-gray-700 hover:border-pink-400 dark:hover:border-indigo-500 transition-all duration-300"
              >
                <p className="text-gray-900 dark:text-gray-100 italic mb-6 flex-grow text-lg leading-relaxed">
                  &ldquo;{quote}&rdquo;
                </p>
                <div className="font-semibold text-indigo-800 dark:text-indigo-300 text-lg">
                  {name}, <span className="font-normal text-gray-600 dark:text-gray-400">{role}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* FAQ Section */}
      <section
        id="faq"
        ref={faqRef}
        className="max-w-7xl mx-auto px-6 md:px-16 py-24 bg-gradient-to-tr from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-pink-900 rounded-3xl shadow-inner-lg"
        aria-label="Frequently Asked Questions"
      >
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={faqInView ? "visible" : "hidden"}
          className="max-w-4xl mx-auto text-center mb-16"
        >
          <motion.h2
            variants={fadeInUp}
            className="text-4xl md:text-5xl font-extrabold mb-6 text-indigo-900 dark:text-indigo-200 drop-shadow"
          >
            Frequently Asked Questions
          </motion.h2>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={faqInView ? "visible" : "hidden"}
          className="max-w-4xl mx-auto space-y-8"
        >
          {faqs.map(({ question, answer }, i) => (
            <motion.div
              key={i}
              variants={itemReveal}
              whileHover={cardHover}
              className="bg-white dark:bg-gray-800 rounded-3xl p-6 md:p-8 shadow-lg border border-transparent dark:border-gray-700 hover:border-indigo-400 dark:hover:border-purple-500 transition-all duration-300"
            >
              <h3 className="font-semibold text-xl text-indigo-800 dark:text-indigo-300 mb-3">{question}</h3>
              <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">{answer}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Call To Action Section */}
      <section
        id="cta"
        // Added margin-top to create space above the CTA section
        className="mt-24 md:mt-32 bg-gradient-to-r from-pink-600 via-purple-700 to-indigo-700 text-white py-20 px-6 md:px-16 text-center rounded-[3rem] mx-6 md:mx-16 mb-16 shadow-2xl transform hover:scale-[1.01] transition-transform duration-300"
        aria-label="Call to Action"
      >
        <h2
          style={{ fontFamily: "'Poppins', sans-serif" }}
          className="text-5xl md:text-7xl font-extrabold mb-6 drop-shadow-md"
        >
          Ready to transform your habits?
        </h2>
        <p className="text-xl md:text-2xl max-w-4xl mx-auto mb-10 leading-relaxed opacity-90">
          Join thousands who have built better habits and improved their mental wellness with Numi AI. Your journey to a calmer, healthier you starts now.
        </p>
        <MagneticButton
          onClick={() => alert("Signup flow coming soon!")}
          className="bg-white text-pink-600 font-bold rounded-full px-16 py-6 text-xl md:text-2xl shadow-xl hover:shadow-white/70 transition-all duration-300"
        >
          Get Started Now
        </MagneticButton>
      </section>

        {/* Footer */}
        <footer className="text-center text-gray-500 dark:text-gray-400 py-8 select-none border-t border-gray-200 dark:border-gray-800">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} Numi AI. All rights reserved.
          </p>
          <div className="flex justify-center space-x-4 mt-4">
            <a href="#" className="hover:text-indigo-500 dark:hover:text-pink-400 transition-colors">Privacy Policy</a>
            <span aria-hidden="true">|</span>
            <a href="#" className="hover:text-indigo-500 dark:hover:text-pink-400 transition-colors">Terms of Service</a>
          </div>
        </footer>
      </div>
    </>
  );
}