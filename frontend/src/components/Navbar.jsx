import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, User, LogOut, Menu, X, Zap } from 'lucide-react';
import { useState } from 'react';

/**
 * Navbar Component
 * Main navigation bar with responsive mobile menu
 */
const Navbar = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
        setMobileMenuOpen(false);
    };

    const isActive = (path) => location.pathname === path;

    const navLinkClass = (path) =>
        `flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${isActive(path)
            ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
            : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
        }`;

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-slate-700/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link
                        to={isAuthenticated ? '/dashboard' : '/login'}
                        className="flex items-center gap-2 text-xl font-bold"
                    >
                        <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <Zap className="w-5 h-5 text-white" />
                        </div>
                        <span className="gradient-text">Crypto Taskboard</span>
                    </Link>

                    {/* Desktop Navigation */}
                    {isAuthenticated && (
                        <div className="hidden md:flex items-center gap-2">
                            <Link to="/dashboard" className={navLinkClass('/dashboard')}>
                                <LayoutDashboard className="w-4 h-4" />
                                Dashboard
                            </Link>
                            <Link to="/profile" className={navLinkClass('/profile')}>
                                <User className="w-4 h-4" />
                                Profile
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg text-slate-300 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
                            >
                                <LogOut className="w-4 h-4" />
                                Logout
                            </button>
                        </div>
                    )}

                    {/* Auth Buttons (when not logged in) */}
                    {!isAuthenticated && (
                        <div className="hidden md:flex items-center gap-3">
                            <Link
                                to="/login"
                                className="px-4 py-2 text-slate-300 hover:text-white transition-colors"
                            >
                                Login
                            </Link>
                            <Link
                                to="/register"
                                className="btn-primary"
                            >
                                Get Started
                            </Link>
                        </div>
                    )}

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/50 transition-colors"
                    >
                        {mobileMenuOpen ? (
                            <X className="w-6 h-6" />
                        ) : (
                            <Menu className="w-6 h-6" />
                        )}
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden py-4 border-t border-slate-700/50 animate-slide-down">
                        {isAuthenticated ? (
                            <div className="space-y-2">
                                <Link
                                    to="/dashboard"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={navLinkClass('/dashboard')}
                                >
                                    <LayoutDashboard className="w-4 h-4" />
                                    Dashboard
                                </Link>
                                <Link
                                    to="/profile"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={navLinkClass('/profile')}
                                >
                                    <User className="w-4 h-4" />
                                    Profile
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-2 px-4 py-2 rounded-lg text-slate-300 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <Link
                                    to="/login"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="block px-4 py-2 text-slate-300 hover:text-white transition-colors"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="block btn-primary text-center"
                                >
                                    Get Started
                                </Link>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
