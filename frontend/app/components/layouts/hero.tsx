import React from "react";

const Hero = () => {
  return (
    <div className="min-h-screen w-full bg-hero relative overflow-hidden">
    {/* Badge flottant */}
    <div className="absolute top-16 md:top-24 lg:top-20 left-4 md:left-12 lg:left-20 transform -rotate-12 px-2 rounded-full bg-layout z-10">
      <h3 className="p-1 text-amber-50 text-sm md:text-base font-semibold">Mentorat Plateforme</h3>
    </div>

    <div className="container mx-auto px-4 py-12 md:py-16 lg:py-24 flex flex-col md:flex-row items-center justify-between gap-8">
      {/* Titre et texte */}
      <div className="w-full md:w-1/2 space-y-4 md:space-y-6 pt-16 md:pt-8">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
          Smart Learning Deeper & More <span className="block mt-2 text-layout">- Amazing</span>
        </h1>
        <p className="text-sm sm:text-base text-para max-w-md">
          Déployez facilement un capital intellectuel unique sans entreprise, après briques & efforts de synergie.
          Révolutionnez l'industrie avec enthousiasme.
        </p>

        <div className="pt-4 md:pt-6">
          <button className="bg-green-700 text-white px-6 py-3 rounded-lg text-sm md:text-base font-medium hover:bg-opacity-90 transition-all">
            Commencer maintenant
          </button>
        </div>
      </div>

      {/* Image */}
      <div className="w-full md:w-1/2 flex justify-center md:justify-end mt-8 md:mt-0">
        <img
          src="/placeholder.svg?height=400&width=400"
          alt="Hero illustration"
          className="w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] md:w-[360px] md:h-[360px] lg:w-[400px] lg:h-[400px] object-contain"
        />
      </div>
    </div>
  </div>
  );
};

export default Hero;
