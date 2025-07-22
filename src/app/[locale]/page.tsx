import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-background to-background/80 backdrop-blur-sm" />
      </div>

      <div className="relative z-10 flex h-full flex-col items-center justify-center text-center">
        <div className="max-w-4xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl font-bold tracking-tight text-foreground sm:text-6xl md:text-7xl">
            ویتریتو، ویترین دیجیتال شما
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground sm:text-xl">
            کسب و کار خود را به راحتی به نمایش بگذارید و با مشتریان خود ارتباط
            برقرار کنید
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link href="/signup">
              <Button size="lg">همین حالا شروع کنید</Button>
            </Link>
            <Link href="/explore">
              <Button variant="outline" size="lg">
                مشاهده نمونه کارها
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
