import BetaTag from '../branding/BetaTag';
import ScrummyLogo from '../branding/scrummy_logo';
import ScrummyMatrixBackground from '../shared/ScrummyMatrixBackground';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <ScrummyMatrixBackground>
      <main className="min-h-screen overflow-y-auto  flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center items-center justify-center flex flex-col">
            <ScrummyLogo className="w-44 h-44 md:w-44 md:h-44" />

            {window.location.pathname !== '/signup' && (
              <>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{title}</h1>
                  <BetaTag />
                </div>

                {subtitle && <p className="mt-2 text-gray-600 dark:text-gray-400">{subtitle}</p>}

                <p className="mt-2 text-center text-xs text-gray-500 dark:text-gray-400">
                  By continuing, you acknowledge that you have read and understand our{' '}
                  <a
                    href="https://scrummy-app.com/#/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                  >
                    Privacy Policy
                  </a>
                  .
                </p>
              </>
            )}
          </div>

          {children}
        </div>
      </main>
    </ScrummyMatrixBackground>
  );
}
