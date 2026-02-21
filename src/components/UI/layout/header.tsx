"use client";
import { layoutConfig } from "@/src/config/layout.config";
import { siteConfig } from "@/src/config/site.config";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
} from "@heroui/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import RegistrationModal from "../modals/registration.modal";
import { useState } from "react";
import LoginModal from "../modals/login.modal";
import { signOutFunc } from "../../../actions/sign-out";
import { useAuthStore } from "../../../store/auth.store";

export const AcmeLogo = () => {
  return (
    <svg fill="none" height="36" viewBox="0 0 32 32" width="36">
      <path
        clipRule="evenodd"
        d="M17.6482 10.1305L15.8785 7.02583L7.02979 22.5499H10.5278L17.6482 10.1305ZM19.8798 14.0457L18.11 17.1983L19.394 19.4511H16.8453L15.1056 22.5499H24.7272L19.8798 14.0457Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
};

export default function Header() {
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const { isAuth, session, status, setAuthState } = useAuthStore();
  const pathname = usePathname();

  console.log(session, status);

  const NavbarMenu = () =>
    siteConfig.navigationBar
      .filter((item) => (item.href === "/ingredients" ? isAuth : true))
      .map((item) => {
        const isActive = pathname === item.href;

        return (
          <NavbarItem
            key={item.href}
            className={`px-3 py-1 ${isActive ? "font-bold" : "font-normal"}`}
          >
            <Link color="foreground" href={item.href}>
              {item.name}
            </Link>
          </NavbarItem>
        );
      });
  const handleSignOut = async () => {
    try {
      await signOutFunc();
    } catch (error) {
      console.log("error: ", error);
    }

    setAuthState("unauthenticated", null);
  };
  return (
    <>
      <Navbar style={{ height: layoutConfig.headerHeight }}>
        <NavbarBrand>
          <Link href="/" className="flex items-center">
            <AcmeLogo />
            Татарская кухня
          </Link>
        </NavbarBrand>
        <NavbarContent className="hidden sm:flex gap-4" justify="center">
          {NavbarMenu()}
        </NavbarContent>

        <NavbarContent justify="end">
          {status === "loading" ? (
            <p>Загрузка...</p>
          ) : (
            <>
              {isAuth && (
                <NavbarItem className="mr-4">
                  Привет, {session?.user?.email?.slice(0, 5)}
                </NavbarItem>
              )}

              {!isAuth ? (
                <>
                  <NavbarItem>
                    <Button
                      as={Link}
                      color="primary"
                      href="#"
                      variant="flat"
                      onPress={() => setIsRegistrationOpen(true)}
                    >
                      Регистрация
                    </Button>
                  </NavbarItem>
                  <NavbarItem className="hidden lg:flex">
                    <Button
                      as={Link}
                      color="primary"
                      href="#"
                      variant="flat"
                      onPress={() => setIsLoginOpen(true)}
                    >
                      Вход
                    </Button>
                  </NavbarItem>
                </>
              ) : (
                <NavbarItem className="hidden lg:flex">
                  <Button
                    as={Link}
                    color="primary"
                    href="#"
                    variant="flat"
                    onPress={handleSignOut}
                  >
                    Выход
                  </Button>
                </NavbarItem>
              )}
            </>
          )}
        </NavbarContent>
      </Navbar>
      <RegistrationModal
        isOpen={isRegistrationOpen}
        onClose={() => setIsRegistrationOpen(false)}
      />
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </>
  );
}
