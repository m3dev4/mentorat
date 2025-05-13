import React from "react";
import { Globe, Languages, Search, ShoppingCart } from "lucide-react";
import { Link } from "react-router";

const NavBar = () => {
  return (
    <header className="sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b bg-white px-4 shadow-sm md:px-6">
      <div className="flex items-center gap-4">
        <div className="relative h-10 w-10 overflow-hidden rounded-full">
          <Link to="/">
            <img
              src="/images/mentorat.png"
              alt="logo"
              className="object-contain"
              width={200}
              height={200}
            />
          </Link>
        </div>
        <span className="text-lg font-medium tracking-wide text-gray-800">
          Explorez
        </span>
        <div className="relative ml-2 hidden md:block">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Rechercher..."
            className="h-9 w-64 rounded-full border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm outline-none transition-all focus:border-gray-300 focus:ring-1 focus:ring-gray-300 lg:w-80"
          />
        </div>
      </div>
      <div className="flex items-center justify-end gap-6">
        {/* Main Navigation */}
        <nav className="hidden md:block">
          <ul className="flex items-center gap-6">
            <li>
              <Link
                to="/"
                className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
              >
                Communauté
              </Link>
            </li>
            <li>
              <Link
                to="/"
                className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
              >
                Enseigner sur Mentora
              </Link>
            </li>
            <li>
              <Link
                to="/"
                className="relative flex h-9 w-9 items-center justify-center rounded-full text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
              >
                <ShoppingCart className="h-5 w-5" />
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#FF6347] text-xs font-medium text-white">
                  0
                </span>
              </Link>
            </li>
          </ul>
        </nav>

        {/* Auth & Language */}
        <div className="flex items-center gap-2">
          <ul className="flex items-center gap-3">
            <li className="hidden md:block">
              <Link
                to="/"
                className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
              >
                Se connecter
              </Link>
            </li>
            <li className="hidden md:block">
              <Link
                to="/"
                className="rounded-full bg-layout px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-layout/200"
              >
                S&apos;inscrire
              </Link>
            </li>
            <li>
              <Link
                to="/"
                className="flex h-9 w-9 items-center justify-center rounded-full text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
              >
                <Globe className="h-5 w-5" />
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
};

export default NavBar;
