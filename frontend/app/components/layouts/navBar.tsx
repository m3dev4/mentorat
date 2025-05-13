"use client";

import { useState, useRef, useEffect } from "react";
import {
  Bell,
  Globe,
  LogOut,
  Search,
  ShoppingCart,
  User,
  ChevronDown,
  Heart,
  MessageSquare,
  Settings,
} from "lucide-react";
import { Link } from "react-router";
import { AuthStateStore } from "../../api/auth/authStore";

const NavBar = () => {
  const { user, isAuthenticated, logout } = AuthStateStore();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);

  // Fermer le menu lorsqu'on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setIsProfileMenuOpen(false);
  };

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

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
            <li className="group relative">
              <Link
                to="/"
                className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
              >
                Communauté
              </Link>
              {/* Effet de survol - ligne qui apparaît */}
              <div className="absolute -bottom-[17px] left-0 h-0.5 w-0 bg-gray-900 transition-all duration-200 group-hover:w-full"></div>
            </li>
            <li className="group relative">
              <Link
                to={`pages/${user?.id}/teaching/teach`}
                className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
              >
                Enseigner sur Mentora
              </Link>
              {/* Effet de survol - ligne qui apparaît */}
              <div className="absolute -bottom-[17px] left-0 h-0.5 w-0 bg-gray-900 transition-all duration-200 group-hover:w-full"></div>
            </li>
            <li>
              <Link
                to={`pages/${user?.id}/cart`}
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
            {isAuthenticated ? (
              <>
                <li>
                  <Link
                    to={`pages/${user?.id}/users/notifications`}
                    className="relative flex h-9 w-9 items-center justify-center rounded-full text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
                  >
                    <Bell className="h-5 w-5" />
                    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
                      2
                    </span>
                  </Link>
                </li>
                <li className="relative" ref={profileMenuRef}>
                  <button
                    onClick={toggleProfileMenu}
                    className="flex items-center gap-2 rounded-full p-1 transition-colors hover:bg-gray-100"
                  >
                    {user?.profilePicture ? (
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-200">
                        <span className="text-sm font-medium text-gray-600">
                          {user?.firstName
                            ? user.firstName.charAt(0).toUpperCase()
                            : "U"}
                          {user?.lastName
                            ? user.lastName.charAt(0).toUpperCase()
                            : ""}
                        </span>
                      </div>
                    ) : (
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-200">
                        <span className="text-sm font-medium text-gray-600">
                          {user?.firstName
                            ? user.firstName.charAt(0).toUpperCase()
                            : "U"}
                          {user?.lastName
                            ? user.lastName.charAt(0).toUpperCase()
                            : ""}
                        </span>
                      </div>
                    )}
                    <ChevronDown className="h-4 w-4 text-gray-600" />
                  </button>

                  {isProfileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-64 origin-top-right rounded-sm bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <div className="py-1">
                        <div className="border-b border-gray-100 px-4 py-3">
                          <div className="flex items-center gap-3">
                            {user?.profilePicture ? (
                              <img
                                src={user.profilePicture || "/placeholder.svg"}
                                alt="profile"
                                className="h-12 w-12 rounded-full"
                              />
                            ) : (
                              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-800 text-white">
                                <span className="text-lg font-medium">
                                  {user?.firstName?.charAt(0).toUpperCase()}
                                  {user?.lastName?.charAt(0).toUpperCase()}
                                </span>
                              </div>
                            )}
                            <div>
                              <p className="text-base font-medium text-gray-900">
                                {user?.firstName} {user?.lastName}
                              </p>
                              <p className="truncate text-xs text-gray-500">
                                {user?.email}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Menu principal */}
                        <Link
                          to={`pages/${user?.id}/courses/my-courses/learning`}
                          className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          Mon apprentissage
                        </Link>
                        <Link
                          to={`pages/${user?.id}/cart`}
                          className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          Mon panier
                        </Link>
                        <Link
                          to={`pages/${user?.id}/courses/whitelist`}
                          className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          Liste de souhaits
                        </Link>
                        <Link
                          to={`pages/${user?.id}/teaching/teach`}
                          className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          Enseigner sur Mentora
                        </Link>

                        {/* Séparateur */}
                        <div className="my-1 border-t border-gray-100"></div>

                        {/* Notifications et messages */}
                        <Link
                          to={`pages/${user?.id}/users/notifications`}
                          className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          Notifications
                        </Link>
                        <Link
                          to={`pages/${user?.id}/messages`}
                          className="relative block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          Messages
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center rounded-full bg-purple-600 text-xs font-medium text-white">
                            7
                          </span>
                        </Link>

                        {/* Séparateur */}
                        <div className="my-1 border-t border-gray-100"></div>

                        {/* Paramètres et options */}
                        <Link
                          to={`pages/${user?.id}/users/edit-profile`}
                          className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          Paramètres du compte
                        </Link>
                        <Link
                          to={`pages/${user?.id}/users/payment-methods`}
                          className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          Modes de paiement
                        </Link>
                        <Link
                          to={`pages/${user?.id}/users/purchases-history`}
                          className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          Historique des achats
                        </Link>

                        {/* Séparateur */}
                        <div className="my-1 border-t border-gray-100"></div>

                        {/* Langue et déconnexion */}
                        <div className="flex items-center justify-between px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                          <span>Langues</span>
                          <span className="flex items-center gap-1 text-gray-600">
                            Français <Globe className="h-4 w-4" />
                          </span>
                        </div>
                        <button
                          onClick={handleLogout}
                          className="block w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50"
                        >
                          Se déconnecter
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    to="/auth/login"
                    className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
                  >
                    Se connecter
                  </Link>
                </li>
                <li>
                  <Link
                    to="/auth/register"
                    className="rounded-full bg-layout px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-layout/90"
                  >
                    S&apos;inscrire
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </header>
  );
};

export default NavBar;
