import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function Navbar() {
    const location = useLocation();
    const navigate = useNavigate();
    const px = location.pathname;

    const [isStudent, setIsStudent] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        setIsStudent(!!localStorage.getItem("studentId"));
        setIsAdmin(!!localStorage.getItem("adminId"));
    }, [location]);

    const handleLogout = () => {
        localStorage.removeItem("studentId");
        localStorage.removeItem("adminId");
        setIsStudent(false);
        setIsAdmin(false);
        navigate("/");
    };

    const getNavLinks = () => {
        if (isAdmin) {
            return [
                { name: "Admin Panel", path: "/admin-dashboard" },
            ];
        }
        if (isStudent) {
            return [
                { name: "My Feed", path: "/dashboard" },
            ];
        }
        return [
            { name: "Login", path: "/" },
            { name: "Register", path: "/register" },
            { name: "Admin", path: "/admin" },
        ];
    };

    const navLinks = getNavLinks();

    return (
        <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 py-4 backdrop-blur-md bg-black/20 border-b border-white/10"
        >
            <Link to={isAdmin ? "/admin-dashboard" : (isStudent ? "/dashboard" : "/")} className="flex items-center gap-2 group">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center shadow-lg group-hover:shadow-purple-500/50 transition-all duration-300">
                    <span className="text-white font-bold font-mono">EEE</span>
                </div>
                <span className="text-lg font-bold tracking-wide text-white group-hover:text-purple-300 transition-colors">
                    Project
                </span>
            </Link>

            <div className="flex items-center gap-6">
                <ul className="flex items-center gap-6">
                    {navLinks.map((link) => {
                        const isActive = px === link.path;
                        return (
                            <li key={link.name}>
                                <Link
                                    to={link.path}
                                    className={`relative text-sm font-medium tracking-wider uppercase transition-colors duration-300 ${isActive ? "text-purple-400" : "text-gray-400 hover:text-white"
                                        }`}
                                >
                                    {link.name}
                                    {isActive && (
                                        <motion.div
                                            layoutId="underline"
                                            className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500"
                                        />
                                    )}
                                </Link>
                            </li>
                        );
                    })}
                </ul>

                {(isStudent || isAdmin) && (
                    <button
                        onClick={handleLogout}
                        className="ml-4 px-4 py-1.5 rounded-lg border border-red-500/30 bg-red-500/10 text-red-500 text-xs font-bold uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all duration-300"
                    >
                        Logout
                    </button>
                )}
            </div>
        </motion.nav>
    );
}
