import React from "react";
import { Outlet } from "react-router";


export default function PagesLayout() {
  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}