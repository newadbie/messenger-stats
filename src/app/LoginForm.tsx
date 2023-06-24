"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { FormProvider, useForm } from "react-hook-form";
import { type LoginSchema, loginSchema } from "schemas/login";
import FormInput from "./common/FormInput";

const LoginForm: React.FC = () => {
  const methods = useForm<LoginSchema>({ resolver: zodResolver(loginSchema) });
  return (
    <div className="flex flex-col items-center justify-center px-6 py-8 md:h-screen lg:py-0">
      <div className="w-full rounded-lg border border-gray-700 bg-gray-800 shadow sm:max-w-md md:mt-0 xl:p-0">
        <div className="space-y-4 p-6 sm:p-8 md:space-y-6">
          <h1 className="tracking-tightmd:text-2xl text-xl font-bold leading-tight text-white">
            Zaloguj się na platformę
          </h1>
          <FormProvider {...methods}>
            <form className="space-y-4 md:space-y-6" action="#">
              <FormInput<keyof LoginSchema>
                name="email"
                label="Twój email"
                placeholder="jankowalski@wp.pl"
                type="email"
              />
              <FormInput<keyof LoginSchema>
                name="password"
                label="Hasło"
                type="password"
                placeholder="••••••••"
              />
              <div className="flex items-center justify-end">
                <a
                  href="#"
                  className=" text-sm font-medium text-primary-500 hover:underline"
                >
                  Zapomniałeś hasła?
                </a>
              </div>
              <button
                type="submit"
                className="w-full rounded-lg bg-primary-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-800"
              >
                Zaloguj
              </button>
              <p className="text-sm font-light text-gray-400">
                Nie masz jeszcze konta?{" "}
                <Link
                  href="/rejestracja"
                  className="font-medium text-primary-500 hover:underline"
                >
                  Zarejestruj się
                </Link>
              </p>
            </form>
          </FormProvider>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
