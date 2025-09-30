import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, Loader } from "lucide-react";
import AuthLayout from "../components/layout/AuthLayout";

export default function Login() {
  const [form, setForm] = useState({ loginIdentifier: "", password: "" });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateField = (name, value) => {
    let error = "";
    if (!value) error = "این فیلد نمی‌تواند خالی باشد";
    setErrors((prev) => ({ ...prev, [name]: error }));
    return error;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");
    setSuccess("");

    const validationErrors = {};
    Object.keys(form).forEach((name) => {
      const error = validateField(name, form[name]);
      if (error) validationErrors[name] = error;
    });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "ورود ناموفق بود");

      localStorage.setItem("authToken", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      window.dispatchEvent(new Event("authChange"));
      navigate("/dashboard");
    } catch (err) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="ورود به حساب کاربری">
      <form onSubmit={handleSubmit} className="space-y-6">
        {success && (
          <div className="p-4 rounded-xl bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800">
            <p className="text-green-600 dark:text-green-400 text-sm text-center">
              {success}
            </p>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              نام کاربری یا ایمیل
            </label>
            <div className="relative">
              <input
                type="text"
                name="loginIdentifier"
                value={form.loginIdentifier}
                onChange={(e) =>
                  setForm({ ...form, loginIdentifier: e.target.value })
                }
                className="input-field pl-10"
                placeholder="نام کاربری یا ایمیل خود را وارد کنید"
                required
              />
              <Mail className="absolute right-3 top-3.5 h-5 w-5 text-gray-400" />
            </div>
            {errors.loginIdentifier && (
              <p className="mt-1 text-xs text-red-500">
                {errors.loginIdentifier}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              رمز عبور
            </label>
            <div className="relative">
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="input-field pl-10"
                placeholder="رمز عبور خود را وارد کنید"
                required
              />
              <Lock className="absolute right-3 top-3.5 h-5 w-5 text-gray-400" />
            </div>
            {errors.password && (
              <p className="mt-1 text-xs text-red-500">{errors.password}</p>
            )}
          </div>
        </div>

        {apiError && (
          <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800">
            <p className="text-red-600 dark:text-red-400 text-sm text-center">
              {apiError}
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader className="animate-spin h-5 w-5" />
              <span>در حال ورود...</span>
            </>
          ) : (
            <span>ورود به حساب</span>
          )}
        </button>

        <p className="text-sm text-center text-gray-600 dark:text-gray-400">
          حساب کاربری ندارید؟{" "}
          <Link
            to="/register"
            className="text-primary-600 hover:text-primary-700 dark:text-primary-500 dark:hover:text-primary-400 font-medium"
          >
            ثبت‌نام کنید
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
