"use client";

import { Button } from "@heroui/button";
import Image from "next/image";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <section className="relative w-full overflow-hidden bg-white dark:bg-black py-32 font-[--font-vazir]">
      {/* پس‌زمینه گرادیانت */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-blue-50/20 to-transparent dark:from-blue-900/10" />

      {/* محتوای اصلی */}
      <div
        className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-6 md:grid-cols-2 lg:gap-24"
        dir="rtl"
      >
        {/* متن و دکمه‌ها */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="space-y-8 text-right"
        >
          <span className="inline-block rounded-full bg-blue-100 px-4 py-1 text-sm font-medium text-blue-700 dark:bg-blue-900 dark:text-blue-300">
            بدون نیاز به سایت – راه‌اندازی رایگان
          </span>

          <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
            ویترین دیجیتال خودت رو بساز،
            <br /> حرفه‌ای‌تر دیده شو ✨
          </h1>

          <p className="max-w-xl text-lg leading-relaxed text-gray-700 dark:text-gray-300">
            با Vitrito تنها در چند دقیقه، یک ویترین آنلاین برای معرفی کسب‌وکار،
            شبکه‌های اجتماعی و محصولاتت بساز و خیلی راحت‌تر به مشتری‌ها دسترسی
            پیدا کن.
          </p>

          <div className="flex flex-wrap justify-end gap-4 pt-4">
            <Button
              size="lg"
              color="primary"
              className="rounded-full px-6 py-3 text-white font-semibold shadow-md transition active:scale-95"
            >
              شروع رایگان
            </Button>

            <Button
              variant="bordered"
              color="primary"
              className="rounded-full px-6 py-3 font-medium"
            >
              مشاهده نمونه ویترین
            </Button>
          </div>
        </motion.div>

        {/* تصویر */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
          className="relative mx-auto w-full max-w-md"
        >
          <div className="overflow-hidden rounded-3xl shadow-2xl ring-1 ring-gray-300 dark:ring-gray-700">
            <Image
              src="/image.png"
              alt="نمونه ویترین"
              width={600}
              height={600}
              className="h-auto w-full object-cover"
              priority
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
