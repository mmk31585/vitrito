"use client";

import React, { useState, useCallback } from "react";
import {
  Button,
  Input,
  Link,
  Card,
  CardBody,
  CardHeader,
  Divider,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = useCallback(() => {
    const newErrors: typeof errors = {};
    let isValid = true;

    if (!email.trim()) {
      newErrors.email = "لطفا ایمیل خود را وارد کنید";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "ایمیل نامعتبر است";
      isValid = false;
    }

    if (!password) {
      newErrors.password = "لطفا رمز عبور خود را وارد کنید";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  }, [email, password]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (validateForm()) {
        console.log("فرم ارسال شد:", { email, password });
        // اینجا لاجیک ارسال داده یا اتصال به API رو اضافه کن
      }
    },
    [email, password, validateForm]
  );

  const toggleShowPassword = () => setShowPassword((prev) => !prev);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900 dark:to-primary-800 flex items-center justify-center p-6 rtl">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <Card className="shadow-xl rounded-3xl overflow-hidden border border-gray-200 dark:border-gray-700">
          <CardHeader className="flex flex-col items-center gap-2 py-8 bg-gradient-to-r from-blue-600 to-blue-500 dark:from-blue-800 dark:to-blue-700 text-white">
            <Icon
              icon="logos:vitrito"
              className="text-7xl"
              aria-hidden="true"
            />
            <h1 className="text-4xl font-extrabold select-none tracking-wide">
              ورود به ویتریتو
            </h1>
            <p className="text-sm opacity-90 mt-2 max-w-xs text-center">
              پروفایل آنلاین کسب و کار خود را بسازید
            </p>
          </CardHeader>

          <Divider className="border-blue-400 dark:border-blue-600" />

          <CardBody className="pt-10 px-12 pb-12 bg-white dark:bg-neutral-900">
            <form onSubmit={handleSubmit} noValidate className="space-y-8">
              <Input
                id="email"
                name="email"
                label="ایمیل"
                placeholder="example@example.com"
                type="email"
                autoComplete="email"
                value={email}
                onValueChange={setEmail}
                errorMessage={errors.email}
                isInvalid={!!errors.email}
                required
                startContent={
                  <Icon
                    icon="lucide:mail"
                    className="text-blue-500 w-5 h-5 ml-2"
                  />
                }
                classNames={{
                  input:
                    "text-right text-base font-medium pr-10 py-3 placeholder:text-sm placeholder:text-gray-400 dark:placeholder:text-gray-500",
                  inputWrapper:
                    "bg-white dark:bg-neutral-800 border border-gray-300 dark:border-gray-600 rounded-xl focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all duration-200",
                  label:
                    "font-semibold text-sm text-gray-700 dark:text-gray-300 mb-1",
                  errorMessage: "text-xs text-red-500 mt-1",
                }}
                aria-describedby="email-error"
                aria-invalid={!!errors.email}
              />

              <Input
                id="password"
                name="password"
                label="رمز عبور"
                placeholder="رمز عبور خود را وارد کنید"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onValueChange={setPassword}
                errorMessage={errors.password}
                isInvalid={!!errors.password}
                required
                startContent={
                  <Icon
                    icon="lucide:lock"
                    className="text-blue-500 w-5 h-5 ml-2"
                  />
                }
                endContent={
                  <Button
                    onClick={toggleShowPassword}
                    variant="light"
                    size="sm"
                    className="text-default-400 px-2 min-w-0 hover:text-blue-600 dark:hover:text-blue-400"
                    type="button"
                    aria-label={showPassword ? "مخفی کردن رمز" : "نمایش رمز"}
                  >
                    <Icon
                      icon={showPassword ? "lucide:eye-off" : "lucide:eye"}
                      width={20}
                      height={20}
                    />
                  </Button>
                }
                classNames={{
                  input:
                    "text-right text-base font-medium pr-10 py-3 placeholder:text-sm placeholder:text-gray-400 dark:placeholder:text-gray-500",
                  inputWrapper:
                    "bg-white dark:bg-neutral-800 border border-gray-300 dark:border-gray-600 rounded-xl focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all duration-200",
                  label:
                    "font-semibold text-sm text-gray-700 dark:text-gray-300 mb-1",
                  errorMessage: "text-xs text-red-500 mt-1",
                }}
                aria-describedby="password-error"
                aria-invalid={!!errors.password}
              />

              <div className="flex justify-between items-center text-sm text-blue-600 font-medium">
                <Link href="#" className="hover:underline">
                  فراموشی رمز عبور؟
                </Link>
              </div>

              <Button
                type="submit"
                color="primary"
                size="lg"
                className="w-full font-semibold tracking-wide py-4 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                aria-label="ورود به حساب کاربری"
              >
                ورود
              </Button>
            </form>

            <Divider className="my-8 border-gray-300 dark:border-gray-700" />

            <p className="text-center text-sm text-gray-600 dark:text-gray-400 font-medium">
              حساب کاربری ندارید؟{" "}
              <Link
                href="#"
                className="text-blue-600 font-semibold hover:underline"
              >
                ثبت نام
              </Link>
            </p>
          </CardBody>
        </Card>
      </motion.div>
    </div>
  );
};

export default LoginPage;
