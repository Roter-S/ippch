import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export const useRedirectActiveUser = (user: any, path: string): void => {
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate(path);
    }
  }, [user, navigate, path]);
};
