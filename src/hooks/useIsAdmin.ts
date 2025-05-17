import { useAuthStore } from "../pages/auth/store/authStore";

/**
 * A custom hook that checks if the current user is an admin
 * @returns boolean indicating if the current user has admin privileges
 */
export const useIsAdmin = (): boolean => {
  const { role } = useAuthStore();

  // For demo purposes, we're hardcoding the admin check
  // In production, this should be replaced with a proper role check
  // return role?.toLowerCase() === 'admin';
  console.log("Current role:", role);
  
  // Temporarily hardcoded to true for testing
  return  role?.toLowerCase() === 'admin';
  
  // Uncomment the line below when ready to use actual role check
  // return role?.toLowerCase() === "admin";
};

export default useIsAdmin;
