import { useEffect, useState, type FC, type ReactNode } from "react";
import { useNavigate } from "react-router";
// Pas d'import de AuthStateStore ici, nous l'importerons dynamiquement

interface ProtectedRouteProps {
  children: ReactNode;
  redirectTo?: string;
}

/**
 * Composant qui protege les routes privées
 * Verifie si l'utilisateur est connecté
 * Si non, redirige vers la page de connexion
 */

const ProtectedRoutes: FC<ProtectedRouteProps> = ({
  children,
  redirectTo = "/auth/login",
}) => {
  const navigate = useNavigate();
  const [isClient, setIsClient] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Détecte quand le composant est monté côté client et initialise l'auth
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setIsClient(true);
        
        // Vérifie d'abord si un token existe dans localStorage
        const hasToken = typeof window !== 'undefined' && !!localStorage.getItem("token");
        
        if (!hasToken) {
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }
        
        // Import dynamique des modules après le montage
        const { AuthStateStore } = await import("../api/auth/authStore");
        const authState = AuthStateStore.getState();
        
        // Si déjà authentifié dans le store, utilise cette valeur
        if (authState.isAuthenticated) {
          setIsAuthenticated(true);
          setIsLoading(false);
        } else {
          // Sinon, vérifie avec l'API
          try {
            const { useGetMe } = await import("../hooks/auth/useAuth");
            const checkAuth = useGetMe();
            
            // Écoute les changements du store
            const unsubscribe = AuthStateStore.subscribe(
              (state) => {
                setIsAuthenticated(state.isAuthenticated);
                setIsLoading(false);
              }
            );
            
            return () => {
              unsubscribe();
            };
          } catch (error) {
            console.error("Failed to verify authentication:", error);
            setIsAuthenticated(false);
            setIsLoading(false);
          }
        }
      } catch (error) {
        console.error("Authentication initialization error:", error);
        setIsAuthenticated(false);
        setIsLoading(false);
      }
    };
    
    initializeAuth();
  }, []);
  
  // Effet pour la redirection, uniquement exécuté côté client
  useEffect(() => {
    if (isClient && !isLoading && !isAuthenticated) {
      try {
        const currentPath = window.location.pathname;
        if (currentPath !== redirectTo) {
          sessionStorage.setItem("redirectAfterLogin", currentPath);
        }
        navigate(redirectTo);
      } catch (error) {
        console.error("Redirection error:", error);
      }
    }
  }, [isAuthenticated, isLoading, navigate, redirectTo, isClient]);

  // Pendant le rendu côté serveur ou pendant le chargement initial côté client
  if (!isClient || isLoading) {
    return <div className="flex justify-center items-center h-screen">Chargement...</div>;
  }

  // Si l'utilisateur est authentifié, afficher le contenu protégé
  return isAuthenticated ? <>{children}</> : null;
};

export default ProtectedRoutes;
