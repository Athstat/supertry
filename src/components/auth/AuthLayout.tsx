import ScrummyLogo from "../branding/scrummy_logo";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-dark-850 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center items-center justify-center flex flex-col">

           <ScrummyLogo className="w-44 h-44"/>

          <h1 className="text-2xl mt-0 font-bold text-gray-900 dark:text-gray-100">
            {title}
          </h1>

          {subtitle && (
            <p className="mt-2 text-gray-600 dark:text-gray-400">{subtitle}</p>
          )}
        </div>
        {children}
      </div>
    </main>
  );
}
