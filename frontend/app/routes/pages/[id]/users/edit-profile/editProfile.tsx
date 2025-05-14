import ProgressProfile from "../../../../../components/progressProfile";
import NavBar from "../../../../..//components/layouts/navBar";
import { AuthStateStore } from "../../../../../api/auth/authStore";
import { Link } from "react-router";
import EditProfileForm from "../../../../../components/editProfileForm";

const EditProfile = () => {
  const { user } = AuthStateStore();
  return (
    <main className="min-h-screen w-full">
      <div className="fixed top-0 left-0 right-0 z-10">
        <NavBar />
      </div>
      <div className="container mx-auto px-4 pt-24">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/4">
            <div className="rounded-lg p-6 shadow-md bg-white">
              <ProgressProfile />
            </div>

            <div className="bg-white rounded-lg shadow-sm">
              <Link
                to={`/pages/${user?.id}/users/edit-profile`}
                className="flex items-center p-4 border-l-4 border-[#FF9966]"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-3 text-gray-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <span className="font-medium">Informations personnelles</span>
              </Link>

              <Link
                to={`/pages/${user?.id}/users/account`}
                className="flex items-center p-4"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-3 text-gray-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span className="font-medium">Informations du compte</span>
              </Link>

              <Link
                to={`/pages/${user?.id}/users/password`}
                className="flex items-center p-4"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-3 text-gray-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                <span className="font-medium">Mot de passe</span>
              </Link>

              <Link
                to={`/pages/${user?.id}/users/payment-methods`}
                className="flex items-center p-4"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-3 text-gray-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
                <span className="font-medium">Méthodes de paiement</span>
              </Link>

              <Link
                to={`/pages/${user?.id}/users/invitations`}
                className="flex items-center p-4"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-3 text-gray-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <span className="font-medium">Inviter des amis</span>
                <span className="ml-auto text-xs text-gray-500">
                  Gagnez 3$ par invitation
                </span>
              </Link>
            </div>
          </div>

          <div className="w-full md:w-3/4">
            <div className="rounded-lg p-6 shadow-md bg-white">
              {/* Profile edit form would go here */}
              <h2 className="text-xl font-semibold mb-4">
                Modifier votre profil
              </h2>
              <p className="text-gray-500">
                Formulaire d'édition du profil à implémenter ici
              </p>
              <EditProfileForm />
            </div>
           
          </div>
        </div>
      </div>
    </main>
  );
};

export default EditProfile;
