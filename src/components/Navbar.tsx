import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, User } from 'lucide-react';
import { useUserAuth } from '@/contexts/UserAuthContext';
import logo from '/Geek247 Logo.png';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Services', path: '/services' },
  { name: 'How It Works', path: '/how-it-works' },
  { name: 'Pricing', path: '/pricing' },
  { name: 'About', path: '/about' },
  { name: 'Contact', path: '/contact' },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated } = useUserAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-primary/10">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="Geek247" className="h-20 w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-all duration-300 hover:text-primary ${
                  location.pathname === link.path
                    ? 'text-primary text-glow'
                    : 'text-muted-foreground'
                }`}
              >
                {link.name}
              </Link>
            ))}
            {isAuthenticated ? (
              <Link
                to="/portal"
                className="btn-outline-glow px-4 py-2 rounded-lg text-sm font-semibold inline-flex items-center gap-2"
              >
                <User className="w-4 h-4" />
                Portal
              </Link>
            ) : (
              <Link
                to="/login"
                className="btn-outline-glow px-4 py-2 rounded-lg text-sm font-semibold"
              >
                Login
              </Link>
            )}
            <Link
              to="/contact"
              className="btn-primary-glow px-5 py-2.5 rounded-lg text-sm font-semibold"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-foreground p-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden mt-4 pb-4"
            >
              <div className="flex flex-col gap-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`text-sm font-medium transition-all duration-300 ${
                      location.pathname === link.path
                        ? 'text-primary'
                        : 'text-muted-foreground'
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
                {isAuthenticated ? (
                  <Link
                    to="/portal"
                    onClick={() => setIsOpen(false)}
                    className="btn-outline-glow px-5 py-2.5 rounded-lg text-sm font-semibold text-center mt-2 inline-flex items-center justify-center gap-2"
                  >
                    <User className="w-4 h-4" />
                    Portal
                  </Link>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="btn-outline-glow px-5 py-2.5 rounded-lg text-sm font-semibold text-center mt-2"
                  >
                    Login
                  </Link>
                )}
                <Link
                  to="/contact"
                  onClick={() => setIsOpen(false)}
                  className="btn-primary-glow px-5 py-2.5 rounded-lg text-sm font-semibold text-center mt-2"
                >
                  Get Started
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};
