"use client";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useAuthStore } from "../store/auth.store";
import { useIngredientStore } from "../store/ingredient.store";

interface IProps {
  children: React.ReactNode;
}

const AppLoader = ({ children }: IProps) => {
  const { data: session, status } = useSession();
  const { setAuthState, isAuth } = useAuthStore();
  const { loadIngredients } = useIngredientStore();

  useEffect(() => {
    setAuthState(status, session);
  }, [status, session]);

  useEffect(() => {
    if (isAuth) {
      loadIngredients("");
    }
  }, [isAuth]);

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">{children}</main>
    </div>
  );
};

export default AppLoader;
