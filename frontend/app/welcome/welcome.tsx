import React from "react";
import NavBar from "../components/layouts/navBar";
import Hero from "../components/layouts/hero";
import Cta from "../components/layouts/cta";
import Instructors from "../components/layouts/instructors";
import Footer from "../components/layouts/footer";

const Welcome = () => {
  return (
    <main className="w-full h-full ">
        <NavBar />
        <Hero />
        <div className="flex flex-col items-center justify-center m-auto p-auto overflow-auto h-full w-full max-w-7xl">
        <Cta />
        <Instructors />
        <Footer />
      </div>
    </main>
  );
};

export default Welcome;
