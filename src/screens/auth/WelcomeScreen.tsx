import { Shield, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export function WelcomeScreen() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-primary-600 to-primary-800 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-12 text-center">
        <div className="space-y-4">
          <Shield className="w-20 h-20 text-white mx-auto" />
          <h1 className="text-4xl font-bold text-white">RugbyFantasy</h1>
          <p className="text-primary-100 text-lg">
            Build your dream team. Compete with friends. Rise through divisions.
          </p>
        </div>

        <div className="space-y-4">
          <Link
            to="/signup"
            className="w-full bg-white text-primary-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
          >
            Get Started
            <ArrowRight size={20} />
          </Link>
          <p className="text-primary-100">
            Already have an account?{" "}
            <Link
              to="/signin"
              className="text-white font-medium hover:underline"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
