import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { message } from "antd";
import useUserLoginStore from "../store/useLoginStore";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, token, checkTokenValidity } = useUserLoginStore();
  const isValid = checkTokenValidity();
  useEffect(() => {
    if (!isLoggedIn || !token) {
      message.warning("请先登录");
      navigate("/login", { state: { from: location.pathname } });
      return;
    }

    if (!isValid) {
      message.error("登录已过期，请重新登录");
      useUserLoginStore.getState().logout();
      navigate("/login", { state: { from: location.pathname } });
    }
  }, [isLoggedIn, token, navigate, location.pathname, isValid]);

  if (!isLoggedIn || !token) {
    return null;
  }

  if (!isValid) {
    return null;
  }

  return <>{children}</>;
}
