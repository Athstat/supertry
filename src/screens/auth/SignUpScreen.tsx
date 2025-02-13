import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";
import { AuthLayout } from "../../components/auth/AuthLayout";
import { CountrySelect } from "../../components/auth/CountrySelect";
import { TeamSelect } from "../../components/auth/TeamSelect";
import { SignUpForm, Country, Team } from "../../types/auth";

export function SignUpScreen() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [form, setForm] = useState<SignUpForm>({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleNext = () => {
    if (currentStep === 1) {
      // Validate email and password
      if (!form.email || !form.password || !form.confirmPassword) {
        alert("Please fill in all fields");
        return;
      }
      if (form.password !== form.confirmPassword) {
        alert("Passwords do not match");
        return;
      }
    }
    setCurrentStep(currentStep + 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Add validation and API call here
    navigate("/dashboard");
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Join thousands of fantasy rugby players"
    >
      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        {currentStep === 1 && (
          <div className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Email address
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  required
                  className="w-full px-4 py-3 bg-white dark:bg-dark-800/40 border border-gray-300 dark:border-dark-600 rounded-xl focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent dark:text-gray-100"
                  value={form.email}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, email: e.target.value }))
                  }
                />
                <Mail className="absolute right-3 top-3.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="w-full px-4 py-3 bg-white dark:bg-dark-800/40 border border-gray-300 dark:border-dark-600 rounded-xl focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent dark:text-gray-100"
                  value={form.password}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, password: e.target.value }))
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  required
                  className="w-full px-4 py-3 bg-white dark:bg-dark-800/40 border border-gray-300 dark:border-dark-600 rounded-xl focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent dark:text-gray-100"
                  value={form.confirmPassword}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      confirmPassword: e.target.value,
                    }))
                  }
                />
                <Lock className="absolute right-3 top-3.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <button
              type="button"
              onClick={handleNext}
              className="w-full bg-primary-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-700 transition-colors flex items-center justify-center gap-2"
            >
              Continue
              <ArrowRight size={20} />
            </button>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Select your nationality
              </label>
              <CountrySelect
                value={form.nationality}
                onChange={(country: Country) =>
                  setForm((prev) => ({ ...prev, nationality: country }))
                }
              />
            </div>
            <button
              type="button"
              onClick={handleNext}
              className="w-full bg-primary-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-700 transition-colors flex items-center justify-center gap-2"
            >
              Continue
              <ArrowRight size={20} />
            </button>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Choose your favorite team
              </label>
              <TeamSelect
                value={form.favoriteTeam}
                onChange={(team: Team) =>
                  setForm((prev) => ({ ...prev, favoriteTeam: team }))
                }
              />
            </div>
            <button
              type="submit"
              className="w-full bg-primary-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-700 transition-colors flex items-center justify-center gap-2"
            >
              Complete Sign Up
              <ArrowRight size={20} />
            </button>
          </div>
        )}

        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">
            Already have an account?{" "}
            <Link
              to="/signin"
              className="text-primary-600 dark:text-primary-400 font-medium hover:underline"
            >
              Sign In
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
}
