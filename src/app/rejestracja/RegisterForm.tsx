"use client";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, type SubmitHandler, useForm } from "react-hook-form";
import { type RegisterSchema, registerSchema } from "schemas/register";
import FormInput from "app/common/FormInput";
import CustomButton from "app/common/CustomButton";
import { api } from "utils/api";

const RegisterForm: React.FC = () => {
  const { mutate, isLoading } = api.auth.register.useMutation();

  const methods = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit: SubmitHandler<RegisterSchema> = (data) => {
    //ok
  };

  return (
    <div className="flex flex-col items-center justify-center px-6 py-8 md:h-screen lg:py-0">
      <div className="w-full rounded-lg border border-gray-700 bg-gray-800 shadow sm:max-w-md md:mt-0 xl:p-0">
        <div className="space-y-4 p-6 sm:p-8 md:space-y-6">
          <h1 className="text-xl font-bold leading-tight tracking-tight text-white md:text-2xl">
            Stwórz konto
          </h1>
          <FormProvider {...methods}>
            <form
              className="space-y-4 md:space-y-6"
              onSubmit={methods.handleSubmit(onSubmit)}
            >
              <FormInput<keyof RegisterSchema>
                name="email"
                type="email"
                label="Twój email"
                placeholder="jankowalski@wp.pl"
              />
              <FormInput<keyof RegisterSchema>
                name="password"
                type="password"
                label="Hasło"
                placeholder="••••••••"
              />
              <FormInput<keyof RegisterSchema>
                name="passwordConfirmation"
                type="password"
                label="Potwierdź hasło"
                placeholder="••••••••"
              />
              <CustomButton
                type="submit"
                text="Stwórz konto"
                className="w-full"
                loading={isLoading}
              />
              <p className="text-sm font-light text-gray-400">
                Posiadasz już konto?{" "}
                <Link
                  href="/"
                  className="font-medium text-primary-500 hover:underline"
                >
                  Zaloguj tutaj
                </Link>
              </p>
            </form>
          </FormProvider>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
