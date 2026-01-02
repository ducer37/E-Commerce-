import { Button } from "./variants/button";
import { ShoppingCart, User, Menu } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { useState } from "react";

interface HeaderProps {
  cartItemCount: number;
}

const Header = ({ cartItemCount }: HeaderProps) => {
  const navigate = useNavigate();

  const handleUserClick = () => {
    const token = localStorage.getItem("token");

    if (token) {
      navigate("/profile");
    } else {
      navigate("/signin");
    }
  };

  return (
    <>
      {/* 1. ANNOUNCEMENT BAR (Thanh thông báo trên cùng) */}
      <div className="bg-black text-white text-[11px] md:text-xs font-medium py-2.5 text-center tracking-wider uppercase">
        Free shipping on orders over $50 — Returns are on us!
      </div>

      {/* 2. MAIN HEADER */}
      <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/90 backdrop-blur-md transition-all duration-300">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden hover:bg-gray-100 -ml-2"
              >
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>

              {/* Logo */}
              <Link
                to="/"
                className="text-2xl font-extrabold tracking-widest text-black uppercase hover:opacity-80 transition-opacity"
              >
                Adam<span className="text-indigo-600">.</span>
              </Link>
            </div>

            <nav className="hidden md:flex items-center space-x-10">
              {["Home", "Products", "About", "Contact"].map((item) => (
                <Link
                  key={item}
                  to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                  className="text-sm font-medium text-gray-600 hover:text-black transition-colors uppercase tracking-wide relative group"
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"></span>
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-1 sm:gap-2">
              {/* User Profile */}
              <Button
                variant="ghost"
                size="icon"
                className="hidden sm:flex text-gray-600 hover:text-black hover:bg-gray-50 transition-colors"
                onClick={handleUserClick}
              >
                <User className="h-5 w-5" />
                <span className="sr-only">User Profile</span>
              </Button>

              {/* Cart */}
              <Button
                variant="ghost"
                size="icon"
                className="relative text-gray-600 hover:text-black hover:bg-gray-50 transition-colors group"
                asChild
              >
                <Link to="/cart">
                  <ShoppingCart className="h-5 w-5 transition-transform group-hover:scale-110" />
                  <span className="sr-only">View Cart</span>

                  {/* Cart Badge (Đã style lại đẹp hơn) */}
                  {cartItemCount > 0 && (
                    <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-black text-[10px] font-bold text-white ring-2 ring-white animate-fade-in">
                      {cartItemCount}
                    </span>
                  )}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
