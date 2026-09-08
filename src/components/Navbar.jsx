import { useState, useRef, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useToast } from "./Toast";
import {
  Menu,
  X,
  Search,
  PlusCircle,
  User,
  Smartphone,
  MessageSquareText,
  Heart,
  LayoutDashboard,
  ShieldCheck,
  LogOut,
} from "lucide-react";
import SearchBar from "./SearchBar";
import { useAuth } from "../context/AuthContext";
import { resolveImageUrl } from "../api/client";

const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/mobiles", label: "Buy Mobile" },
  { to: "/sell", label: "Sell Mobile" },
  { to: "/wanted-phones", label: "Wanted Phones" },
  { to: "/how-it-works", label: "CPID Services" },
  { to: "/about", label: "About" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const { user, logout, isAdmin } = useAuth();
  const { showToast } = useToast();

  const avatarUrl = user?.avatar ? resolveImageUrl(user.avatar) : null;

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate("/");
    showToast("You have been logged out", "success");
  };

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-paper-line bg-white/95 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <span className="flex h-9 w-9 items-center justify-center rounded-tag bg-bazaar-500 text-white">
            <Smartphone size={19} />
          </span>
          <span className="font-display text-lg font-extrabold text-ink leading-none">
            Johi <span className="text-bazaar-600">Mobile Mart</span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `text-sm font-semibold transition-colors ${
                  isActive ? "text-bazaar-600" : "text-ink-light hover:text-bazaar-600"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={() => {
              setSearchOpen((s) => !s);
              setMenuOpen(false);
            }}
            aria-label="Toggle search"
            className="btn-ghost h-10 w-10 rounded-full p-0"
          >
            <Search size={19} />
          </button>

          {user && (
            <>
              <Link to="/messages" aria-label="Messages" className="btn-ghost h-10 w-10 rounded-full p-0">
                <MessageSquareText size={19} />
              </Link>
              <Link to="/favorites" aria-label="Favorites" className="btn-ghost h-10 w-10 rounded-full p-0">
                <Heart size={19} />
              </Link>
            </>
          )}

          <Link to="/sell" className="btn-tag">
            <PlusCircle size={17} /> Sell Your Phone
          </Link>

          {!user ? (
            <Link to="/login" className="btn-secondary">
              <User size={17} /> Login
            </Link>
          ) : (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => {
                  setMenuOpen((m) => !m);
                  setSearchOpen(false);
                }}
                className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-bazaar-100 font-display text-sm font-bold text-bazaar-700"
              >
                {avatarUrl ? (
                  <img src={avatarUrl} alt={user.name} className="h-full w-full object-cover" />
                ) : (
                  user.name.charAt(0)
                )}
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-48 overflow-hidden rounded-tag border border-paper-line bg-white shadow-cardHover">
                  <div className="flex items-center gap-2.5 border-b border-paper-line px-3.5 py-2.5">
                    <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-bazaar-100 text-xs font-bold text-bazaar-700">
                      {avatarUrl ? (
                        <img src={avatarUrl} alt={user.name} className="h-full w-full object-cover" />
                      ) : (
                        user.name.charAt(0)
                      )}
                    </span>
                    <p className="truncate text-sm font-semibold text-ink">{user.name}</p>
                  </div>
                  <Link
                    to="/dashboard"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 px-3.5 py-2.5 text-sm text-ink-light hover:bg-paper"
                  >
                    <LayoutDashboard size={15} /> Dashboard
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 px-3.5 py-2.5 text-sm text-ink-light hover:bg-paper"
                    >
                      <ShieldCheck size={15} /> Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 px-3.5 py-2.5 text-left text-sm text-alert hover:bg-paper"
                  >
                    <LogOut size={15} /> Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 md:hidden">
          <button
            onClick={() => {
              setSearchOpen((s) => !s);
              setMenuOpen(false);
            }}
            aria-label="Toggle search"
            className="btn-ghost h-10 w-10 rounded-full p-0"
          >
            <Search size={20} />
          </button>
          <Link to="/sell" aria-label="Sell your phone" className="btn-tag !px-3 !py-2">
            <PlusCircle size={18} />
          </Link>
          <button
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
            className="btn-ghost h-10 w-10 rounded-full p-0"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {searchOpen && (
        <div className="border-t border-paper-line bg-white p-3">
          <div className="container-page">
            <SearchBar />
          </div>
        </div>
      )}

      {open && (
        <nav className="border-t border-paper-line bg-white lg:hidden">
          <div className="container-page flex flex-col py-2">
            {user && (
              <div className="flex items-center gap-2.5 border-b border-paper-line py-3">
                <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-bazaar-100 text-sm font-bold text-bazaar-700">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt={user.name} className="h-full w-full object-cover" />
                  ) : (
                    user.name.charAt(0)
                  )}
                </span>
                <p className="truncate text-sm font-semibold text-ink">{user.name}</p>
              </div>
            )}
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `border-b border-paper-line py-3 text-sm font-semibold ${
                    isActive ? "text-bazaar-600" : "text-ink-light"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            {user && (
              <>
                <Link
                  to="/messages"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 border-b border-paper-line py-3 text-sm font-semibold text-ink-light"
                >
                  <MessageSquareText size={16} /> Messages
                </Link>
                <Link
                  to="/favorites"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 border-b border-paper-line py-3 text-sm font-semibold text-ink-light"
                >
                  <Heart size={16} /> Favorites
                </Link>
                <Link
                  to="/dashboard"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 border-b border-paper-line py-3 text-sm font-semibold text-ink-light"
                >
                  <LayoutDashboard size={16} /> Dashboard
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2 border-b border-paper-line py-3 text-sm font-semibold text-ink-light"
                  >
                    <ShieldCheck size={16} /> Admin Panel
                  </Link>
                )}
              </>
            )}
            {!user ? (
              <button
                onClick={() => {
                  setOpen(false);
                  navigate("/login");
                }}
                className="btn-secondary mt-3 mb-2 w-full"
              >
                <User size={17} /> Login / Register
              </button>
            ) : (
              <button
                onClick={() => {
                  setOpen(false);
                  handleLogout();
                }}
                className="btn-secondary mt-3 mb-2 w-full text-alert"
              >
                <LogOut size={17} /> Logout
              </button>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}