import React from "react";
import Category from "./category";
import TabsLayout from "../tabsLayout";

const Cta = () => {
  return (
    <div className="w-full min-h-auto overflow-hidden py-5">
      <div className="container relative mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-12 space-y-4">
            <p className="text-lg text-muted-foreground md:text-xl">
              <span className="font-bold text-primary">
                Nous sommes passionnés par l'autonomisation des apprenants
              </span>{" "}
              du monde entier avec une éducation de haute qualité, accessible et
              engageante. Notre mission est d'offrir une gamme diversifiée de
              cours.
            </p>
          </div>
        </div>
      </div>

      {/* Les plus populaires */}
      <div className="mt-10 flex items-start flex-col relative mx-auto py-17">
        <div>
          <h3 className="text-2xl font-bold text-primary font-serif">
            Les plus populaires
          </h3>
          <p className="text-1xl text-muted-foreground mt-2 font-serif">
            Des compétences essentielles aux sujets techniques, Mentorat
            contribue à votre développement professionnel.
          </p>
        </div>
      </div>

      {/* Les cours par catégorie */}
      <div className="flex items-start flex-col relative mx-auto py-17">
        <div>
          <h3 className="text-2xl font-bold text-primary font-serif">
            Apprenez les compétences les plus demandées grâce à nos formations
            les mieux notées.
          </h3>
          <p className="text-1xl text-muted-foreground mt-2 font-serif">
            Des compétences essentielles aux sujets techniques, Mentorat
            contribue à votre développement professionnel.
          </p>
        </div>

        {/* Les cours */}
        <div className="relative mt-8">
          <TabsLayout />
        </div>
      </div>
      <Category />
    </div>
  );
};

export default Cta;
