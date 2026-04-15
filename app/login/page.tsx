"use client";

import { useState, useEffect, useActionState, startTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { authenticate } from "@/app/lib/actions/authActions";
import { getUserByDob, registerUser } from "@/app/lib/actions/userActions";

const AUTH_KEY = "bomayangu-auth";
const AUTH_EVENT = "auth-changed";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const dobFromUrl = searchParams.get("dob");

  console.log("DOB from URL:", dobFromUrl);

  const [isLogin, setIsLogin] = useState(true);
  const [loginState, loginAction] = useActionState(authenticate, null);
  const [formData, setFormData] = useState({
    fullName: "",
    dob: "",
    phone: "",
    email: "",
    nationalId: "",
    personalNumber: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Prefill registration form if dob is provided in URL
  useEffect(() => {
    if (dobFromUrl) {
      const fetchUser = async () => {
        try {
          const user = await getUserByDob(dobFromUrl);

          console.log("another", user);
          if (user) {
            setFormData((prev) => ({
              ...prev,
              fullName: user.fullName || "",
              dob: user.dob || dobFromUrl,
              phone: user.phone || "",
              email: user.email || "",
              nationalId: user.nationalId || "",
              personalNumber: user.personalNumber || "",
            }));
          } else {
            setFormData((prev) => ({
              ...prev,
              dob: dobFromUrl,
            }));
          }
          setIsLogin(false);
        } catch (err) {
          console.error("Failed to fetch user by dob:", err);
        }
      };
      fetchUser();
    }
  }, [dobFromUrl]);

  const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    const result = await authenticate(null, formData);
    setIsLoading(false);
    if (result === true) {
      localStorage.setItem(AUTH_KEY, "true");
      window.dispatchEvent(new Event(AUTH_EVENT));
      router.push("/projects");
    } else if (typeof result === "string") {
      setError(result);
    }
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    // Validation
    if (
      !formData.fullName ||
      !formData.dob ||
      !formData.phone ||
      !formData.email ||
      !formData.nationalId ||
      !formData.personalNumber ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("All fields are required");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return;
    }

    // Create FormData for server action
    const fd = new FormData();
    fd.append("fullName", formData.fullName);
    fd.append("dob", formData.dob);
    fd.append("phone", formData.phone);
    fd.append("email", formData.email);
    fd.append("nationalId", formData.nationalId);
    fd.append("personalNumber", formData.personalNumber);
    fd.append("password", formData.password);

    startTransition(async () => {
      const result = await registerUser(fd);
      if (result.success) {
        // Auto-login after registration
        localStorage.setItem(AUTH_KEY, "true");
        window.dispatchEvent(new Event(AUTH_EVENT));
        router.push("/projects");
      } else {
        setError(result.error || "Registration failed");
      }
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <main className="flex-1 flex items-center justify-center py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-md mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden transition-all duration-300">
              {/* Header */}
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-8 py-6">
                <h1 className="text-3xl font-bold text-white text-center">
                  {isLogin ? "Welcome Back" : "Create Account"}
                </h1>
                <p className="text-green-100 text-center mt-2">
                  {isLogin
                    ? "Login to access your Boma Yangu account"
                    : "Join the affordable housing program"}
                </p>
              </div>

              {/* Form Container */}
              <div className="p-8">
                {isLogin ? (
                  // Login Form
                  <form className="space-y-6" onSubmit={handleLoginSubmit}>
                    <div>
                      <label
                        htmlFor="identifier"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      >
                        Email / National ID / Personal Number
                      </label>
                      <input
                        type="text"
                        id="identifier"
                        name="identifier"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                        placeholder="Email, National ID, or Personal Number"
                        required
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="password"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      >
                        Password
                      </label>
                      <input
                        type="password"
                        id="password"
                        name="password"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                        placeholder="Enter your password"
                        required
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                          Remember me
                        </span>
                      </label>
                      <Link
                        href="/forgot-password"
                        className="text-sm text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300"
                      >
                        Forgot password?
                      </Link>
                    </div>

                    {error && (
                      <div className="text-red-500 text-sm text-center bg-red-50 dark:bg-red-900/20 p-2 rounded-lg">
                        {error}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all font-semibold shadow-md hover:shadow-lg disabled:opacity-50"
                    >
                      {isLoading ? "Signing in..." : "Sign In"}
                    </button>
                  </form>
                ) : (
                  // Registration Form (same as before)
                  <form className="space-y-5" onSubmit={handleRegister}>
                    {/* Full Name */}
                    <div>
                      <label
                        htmlFor="fullName"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      >
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                        placeholder="Enter your full name"
                        required
                      />
                    </div>

                    {/* Date of Birth */}
                    <div>
                      <label
                        htmlFor="dob"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      >
                        Date of Birth
                      </label>
                      <input
                        type="text"
                        id="dob"
                        name="dob"
                        value={formData.dob}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                        required
                      />
                    </div>

                    {/* Phone Number */}
                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      >
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                        placeholder="e.g., 0712345678"
                        required
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      >
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                        placeholder="you@example.com"
                        required
                      />
                    </div>

                    {/* National ID */}
                    <div>
                      <label
                        htmlFor="nationalId"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      >
                        National ID Number
                      </label>
                      <input
                        type="text"
                        id="nationalId"
                        name="nationalId"
                        value={formData.nationalId}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                        placeholder="Enter your ID number"
                        required
                      />
                    </div>

                    {/* Personal Number */}
                    <div>
                      <label
                        htmlFor="personalNumber"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      >
                        Personal Number
                      </label>
                      <input
                        type="text"
                        id="personalNumber"
                        name="personalNumber"
                        value={formData.personalNumber}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                        placeholder="Enter your personal number"
                        required
                      />
                    </div>

                    {/* Password */}
                    <div>
                      <label
                        htmlFor="password"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      >
                        Password
                      </label>
                      <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                        placeholder="Create a password"
                        required
                      />
                    </div>

                    {/* Confirm Password */}
                    <div>
                      <label
                        htmlFor="confirmPassword"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      >
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                        placeholder="Confirm your password"
                        required
                      />
                    </div>

                    {error && (
                      <div className="text-red-500 text-sm text-center bg-red-50 dark:bg-red-900/20 p-2 rounded-lg">
                        {error}
                      </div>
                    )}

                    <button
                      type="submit"
                      className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all font-semibold shadow-md hover:shadow-lg"
                    >
                      Create Account
                    </button>
                  </form>
                )}

                {/* Toggle Link */}
                <div className="mt-6 text-center">
                  <p className="text-gray-600 dark:text-gray-400">
                    {isLogin
                      ? "Don't have an account? "
                      : "Already have an account? "}
                    <button
                      onClick={() => {
                        setIsLogin(!isLogin);
                        setError("");
                      }}
                      className="text-green-600 dark:text-green-400 font-semibold hover:text-green-700 dark:hover:text-green-300 transition-colors"
                    >
                      {isLogin ? "Register here" : "Back to login"}
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
