import { Link } from 'react-router-dom';
import { AuthLayout } from '../../components/auth/AuthLayout';
import EmailPasswordLoginBox from '../../components/auth/login/EmailPasswordLoginBox';
import GuestLoginBox from '../../components/auth/login/GuestLoginBox';


export function SignInScreen() {

  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to your account">
      <div className="mt-8 space-y-6">

        <EmailPasswordLoginBox />

        <div className="relative flex items-center justify-center">
          <div className="border-t border-gray-300 dark:border-gray-700 w-full"></div>
          <div className="text-sm px-2 text-gray-500 dark:text-gray-400 bg-white dark:bg-dark-850">
            or
          </div>
          <div className="border-t border-gray-300 dark:border-gray-700 w-full"></div>
        </div>

        <GuestLoginBox />

        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">
            Don't have an account?{' '}
            <Link
              to="/signup"
              className="text-primary-600 dark:text-primary-400 font-medium hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}
