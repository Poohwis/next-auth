import { LoginButton } from "@/components/auth/login-button";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Poppins } from "next/font/google";

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});
export default function Home() {
  return (
    <main
      className="flex h-full flex-col justify-center items-center 
    bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-500 to-slate-800"
    >
      <div className="space-y-6">
        <h1
          className={cn(
            "text-6xl font-semibold text-white drop-shadow-md text-center",
            font.className
          )}
        >
          Auth
        </h1>
        <p className="text-white text-lg text-center">
          A simple authentication service
        </p>
        <div className="text-center">
          <LoginButton>
            <Button variant="secondary" size="lg" >
              Sign in
            </Button>
          </LoginButton>
        </div>
      </div>
    </main>
  );
}
