import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { AuthStateStore } from "../../../../api/auth/authStore";
import { useTrainerStore } from "../../../../api/trainers/trainerStore";
import {
  useCheckTrainerStatus,
  useCreateTrainer,
} from "../../../../hooks/trainer/useTrainerQueries";

// Composants pour les différentes étapes
const StepIndicator = ({ currentStep, totalSteps }) => {
  return (
    <div className="flex items-center mb-6">
      {Array.from({ length: totalSteps }).map((_, index) => (
        <React.Fragment key={index}>
          <div 
            className={`flex items-center justify-center w-8 h-8 rounded-full ${
              index + 1 <= currentStep 
                ? "bg-indigo-500 text-white" 
                : "bg-gray-200 text-gray-500"
            }`}
          >
            {index + 1}
          </div>
          {index < totalSteps - 1 && (
            <div 
              className={`h-1 flex-1 mx-2 ${
                index + 1 < currentStep ? "bg-indigo-500" : "bg-gray-200"
              }`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

const OnboardingHeader = ({ step }) => {
  const stepTitles = {
    1: "Complétez votre profil",
    2: "Ajoutez votre spécialisation",
    3: "Vos certifications",
    4: "Finalisez votre profil formateur"
  };

  const stepDescriptions = {
    1: "Parlez-nous de vous et de votre parcours professionnel",
    2: "Quels domaines maîtrisez-vous le mieux?",
    3: "Ajoutez vos diplômes et certifications pertinentes",
    4: "Ajoutez une vidéo de présentation et des liens vers vos réalisations"
  };

  return (
    <div className="mb-8">
      <div className="flex items-center text-sm text-gray-500 mb-2">
        <div className="flex items-center justify-center w-5 h-5 rounded-full bg-indigo-100 text-indigo-500 mr-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
        <span>Étape {step} sur 4</span>
      </div>
      <h1 className="text-2xl font-semibold text-gray-800">{stepTitles[step]}</h1>
      <p className="text-gray-600">{stepDescriptions[step]}</p>
    </div>
  );
};

// Composants pour chaque étape
const Step1Profile = ({ data, setData, goToNextStep }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">Biographie</label>
        <textarea 
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          rows={5}
          placeholder="Décrivez votre parcours professionnel et votre expérience..."
          value={data.biography}
          onChange={(e) => setData({ biography: e.target.value })}
        />
      </div>
      
      <div className="flex justify-end mt-6">
        <button
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          onClick={goToNextStep}
        >
          Continuer
        </button>
      </div>
    </div>
  );
};

const Step2Specialization = ({ data, setData, goToNextStep, goToPrevStep }) => {
  const [newSpecialization, setNewSpecialization] = useState("");
  
  const addSpecialization = () => {
    if (newSpecialization.trim() && !data.specialization.includes(newSpecialization)) {
      setData({ 
        specialization: [...data.specialization, newSpecialization.trim()] 
      });
      setNewSpecialization("");
    }
  };
  
  const removeSpecialization = (index) => {
    setData({
      specialization: data.specialization.filter((_, i) => i !== index)
    });
  };
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">Spécialisations</label>
        <div className="flex mb-2">
          <input
            type="text"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Ex: JavaScript, React, Design UI/UX..."
            value={newSpecialization}
            onChange={(e) => setNewSpecialization(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addSpecialization()}
          />
          <button
            className="px-4 py-2 bg-indigo-600 text-white rounded-r-md hover:bg-indigo-700 transition-colors"
            onClick={addSpecialization}
          >
            Ajouter
          </button>
        </div>
        
        <div className="mt-4">
          {data.specialization.map((spec, index) => (
            <div key={index} className="inline-flex items-center bg-indigo-100 text-indigo-800 rounded-full px-3 py-1 text-sm mr-2 mb-2">
              {spec}
              <button
                className="ml-2 text-indigo-600 hover:text-indigo-800"
                onClick={() => removeSpecialization(index)}
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex justify-between mt-6">
        <button
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          onClick={goToPrevStep}
        >
          Retour
        </button>
        <button
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          onClick={goToNextStep}
        >
          Continuer
        </button>
      </div>
    </div>
  );
};

const Step3Certifications = ({ data, setData, goToNextStep, goToPrevStep }) => {
  const [certification, setCertification] = useState({ name: "", issuer: "", year: "" });
  
  const addCertification = () => {
    if (certification.name && certification.issuer) {
      setData({
        certifications: [...data.certifications, certification]
      });
      setCertification({ name: "", issuer: "", year: "" });
    }
  };
  
  const removeCertification = (index) => {
    setData({
      certifications: data.certifications.filter((_, i) => i !== index)
    });
  };
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">Certifications et diplômes</label>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
          <div>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Nom du diplôme/certification"
              value={certification.name}
              onChange={(e) => setCertification({...certification, name: e.target.value})}
            />
          </div>
          <div>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Établissement/Émetteur"
              value={certification.issuer}
              onChange={(e) => setCertification({...certification, issuer: e.target.value})}
            />
          </div>
          <div>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Année d'obtention"
              value={certification.year}
              onChange={(e) => setCertification({...certification, year: e.target.value})}
            />
          </div>
        </div>
        
        <button
          className="px-4 py-2 border border-indigo-600 text-indigo-600 rounded-md hover:bg-indigo-50 transition-colors"
          onClick={addCertification}
        >
          + Ajouter une certification
        </button>
        
        <div className="mt-6 space-y-3">
          {data.certifications.map((cert, index) => (
            <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
              <div>
                <div className="font-medium">{cert.name}</div>
                <div className="text-sm text-gray-600">{cert.issuer} {cert.year && `• ${cert.year}`}</div>
              </div>
              <button
                className="text-gray-400 hover:text-red-500"
                onClick={() => removeCertification(index)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex justify-between mt-6">
        <button
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          onClick={goToPrevStep}
        >
          Retour
        </button>
        <button
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          onClick={goToNextStep}
        >
          Continuer
        </button>
      </div>
    </div>
  );
};

const Step4Portfolio = ({ data, setData, goToPrevStep, submitForm, isSubmitting }) => {
  const [portfolioUrl, setPortfolioUrl] = useState("");
  
  const addPortfolioItem = () => {
    if (portfolioUrl.trim()) {
      setData({
        portfolio: [...data.portfolio, portfolioUrl.trim()]
      });
      setPortfolioUrl("");
    }
  };
  
  const removePortfolioItem = (index) => {
    setData({
      portfolio: data.portfolio.filter((_, i) => i !== index)
    });
  };
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">Vidéo de présentation</label>
        <input 
          type="text"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="URL de votre vidéo (YouTube, Vimeo...)"
          value={data.presentationVideo}
          onChange={(e) => setData({ presentationVideo: e.target.value })}
        />
        <p className="text-sm text-gray-500 mt-1">Partagez une courte vidéo où vous vous présentez et expliquez votre approche pédagogique</p>
      </div>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">Portfolio et réalisations</label>
        <div className="flex mb-2">
          <input
            type="text"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="URL de votre portfolio ou d'un projet"
            value={portfolioUrl}
            onChange={(e) => setPortfolioUrl(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addPortfolioItem()}
          />
          <button
            className="px-4 py-2 bg-indigo-600 text-white rounded-r-md hover:bg-indigo-700 transition-colors"
            onClick={addPortfolioItem}
          >
            Ajouter
          </button>
        </div>
        
        <div className="mt-4 space-y-2">
          {data.portfolio.map((url, index) => (
            <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded-md">
              <a href={url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline truncate flex-1">
                {url}
              </a>
              <button
                className="text-gray-400 hover:text-red-500 ml-2"
                onClick={() => removePortfolioItem(index)}
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex justify-between mt-6">
        <button
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          onClick={goToPrevStep}
        >
          Retour
        </button>
        <button
          className={`px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors flex items-center ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
          onClick={submitForm}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Soumission en cours...
            </>
          ) : (
            "Finaliser mon profil"
          )}
        </button>
      </div>
    </div>
  );
};

const Teach = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = AuthStateStore();
  const {
    onboardingData,
    onboardingStep,
    setOnboardingStep,
    setOnboardigData,
    isloading,
    isTrainer,
  } = useTrainerStore();

  const trainerStatusQuery = useCheckTrainerStatus();
  const createTrainerMutation = useCreateTrainer();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (isTrainer) {
      navigate("/formateur/dashboard");
    }
  }, [isTrainer, navigate]);

  const goToNextStep = () => {
    setOnboardingStep(onboardingStep + 1);
  };

  const goToPrevStep = () => {
    setOnboardingStep(onboardingStep - 1);
  };

  const handleSubmitForm = () => {
    createTrainerMutation.mutate(onboardingData);
  };

  const renderStep = () => {
    switch (onboardingStep) {
      case 1:
        return (
          <Step1Profile 
            data={onboardingData} 
            setData={setOnboardigData}
            goToNextStep={goToNextStep}
          />
        );
      case 2:
        return (
          <Step2Specialization 
            data={onboardingData} 
            setData={setOnboardigData}
            goToNextStep={goToNextStep}
            goToPrevStep={goToPrevStep}
          />
        );
      case 3:
        return (
          <Step3Certifications 
            data={onboardingData} 
            setData={setOnboardigData}
            goToNextStep={goToNextStep}
            goToPrevStep={goToPrevStep}
          />
        );
      case 4:
        return (
          <Step4Portfolio 
            data={onboardingData} 
            setData={setOnboardigData}
            goToPrevStep={goToPrevStep}
            submitForm={handleSubmitForm}
            isSubmitting={createTrainerMutation.isPending}
          />
        );
      default:
        return null;
    }
  };

  if (trainerStatusQuery.isPending || isloading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4 max-w-3xl">
      <div className="mb-10">
        <StepIndicator currentStep={onboardingStep} totalSteps={4} />
        <OnboardingHeader step={onboardingStep} />
      </div>
      
      {renderStep()}
      
      {createTrainerMutation.isError && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
          Une erreur est survenue: {createTrainerMutation.error?.message || "Veuillez réessayer ultérieurement."}
        </div>
      )}
    </div>
  );
};

export default Teach;
