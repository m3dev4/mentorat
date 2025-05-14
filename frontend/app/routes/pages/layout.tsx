import React from "react";
import { Outlet } from "react-router";
import ProtectedRoutes from "../../components/protectedRoutes";


export default function PagesLayout() {
  return (
    <ProtectedRoutes>
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
    </ProtectedRoutes>
  );
}