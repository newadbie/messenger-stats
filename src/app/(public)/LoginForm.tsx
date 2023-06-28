"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FormProvider, type SubmitHandler, useForm } from "react-hook-form";

import { type LoginSchema, loginSchema } from "schemas/login";

import CustomButton from "../common/CustomButton";
import FormInput from "../common/FormInput";



const LoginForm: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const methods = useForm<LoginSchema>({ resolver: zodResolver(loginSchema) });
  const supabase = createClientComponentClient();

  const onSubmit: SubmitHandler<LoginSchema> = async ({ email, password }) => {
    try {
      setIsLoading(true);
      const response = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      router.refresh();
      console.log(response);
    } catch {
      console.error("Maybe i will catch it in future ");
    }
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center px-6 py-8 md:h-screen lg:py-0">
      <div className="w-full rounded-lg border border-gray-700 bg-gray-800 shadow sm:max-w-md md:mt-0 xl:p-0">
        <div className="space-y-4 p-6 sm:p-8 md:space-y-6">
          <h1 className="tracking-tightmd:text-2xl text-xl font-bold leading-tight text-white">
            Zaloguj się na platformę
          </h1>
          <FormProvider {...methods}>
            <form
              className="space-y-4 md:space-y-6"
              onSubmit={methods.handleSubmit(onSubmit)}
            >
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
              <CustomButton
                loading={isLoading}
                type="submit"
                text="Zaloguj"
                className="w-full"
              />
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
