import { Link, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { Menu, X, Layout, LogIn, LogOut, Settings } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../App';
import { loginWithGoogle, logout } from '../lib/firebase';
import { cn } from '../lib/utils';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAdmin, settings } = useAuth();
  const location = useLocation();

  const navLinks = [
    { name: '홈', path: '/' },
    { name: '포트폴리오', path: '/portfolio' },
    { name: '블로그', path: '/blog' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
              <Layout className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tighter text-white">
              {settings?.siteName || '상상점포'}
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-purple-400",
                  location.pathname === link.path ? "text-purple-500" : "text-gray-300"
                )}
              >
                {link.name}
              </Link>
            ))}
            
            {isAdmin && (
              <Link
                to="/admin"
                className="flex items-center space-x-1 text-sm font-medium text-purple-400 hover:text-purple-300"
              >
                <Settings className="w-4 h-4" />
                <span>관리자</span>
              </Link>
            )}

            {user ? (
              <button
                onClick={() => logout()}
                className="flex items-center space-x-1 text-sm font-medium text-gray-300 hover:text-white"
              >
                <LogOut className="w-4 h-4" />
                <span>로그아웃</span>
              </button>
            ) : (
              <button
                onClick={() => loginWithGoogle()}
                className="flex items-center space-x-1 text-sm font-medium bg-purple-600 px-4 py-2 rounded-full hover:bg-purple-700 transition-colors"
              >
                <LogIn className="w-4 h-4" />
                <span>로그인</span>
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-white"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-black border-b border-white/10 px-4 pt-2 pb-6 space-y-4"
        >
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={cn(
                "block text-base font-medium",
                location.pathname === link.path ? "text-purple-500" : "text-gray-300"
              )}
            >
              {link.name}
            </Link>
          ))}
          {isAdmin && (
            <Link
              to="/admin"
              onClick={() => setIsOpen(false)}
              className="block text-base font-medium text-purple-400"
            >
              관리자 대시보드
            </Link>
          )}
          {user ? (
            <button
              onClick={() => {
                logout();
                setIsOpen(false);
              }}
              className="w-full text-left text-base font-medium text-gray-300"
            >
              로그아웃
            </button>
          ) : (
            <button
              onClick={() => {
                loginWithGoogle();
                setIsOpen(false);
              }}
              className="w-full text-left text-base font-medium text-purple-500"
            >
              로그인
            </button>
          )}
        </motion.div>
      )}
    </nav>
  );
}
