import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { User, Mail, Lock, Loader } from "lucide-react";
import AuthLayout from "../components/layout/AuthLayout";

export default function Register() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "username":
        if (value.length < 4) error = "نام کاربری باید حداقل ۴ کاراکتر باشد";
        else if (!/^[a-zA-Z0-9_]+$/.test(value))
          error = "فقط حروف انگلیسی، اعداد و _ مجاز است";
        break;
      case "email":
        if (!/\S+@\S+\.\S+/.test(value)) error = "ایمیل وارد شده معتبر نیست";
        break;
      case "password":
        if (value.length < 8) error = "رمز عبور باید حداقل ۸ کاراکتر باشد";
        break;
      case "confirmPassword":
        if (value !== form.password)
          error = "رمز عبور و تکرار آن مطابقت ندارند";
        break;
    }
    setErrors((prev) => ({ ...prev, [name]: error }));
    return error;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");

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
        `${import.meta.env.VITE_API_BASE_URL}/api/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            username: form.username,
            email: form.email,
            password: form.password,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "ثبت نام ناموفق بود");
      }

      navigate("/login?registered=true");
    } catch (err) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="ایجاد حساب جدید">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              نام کاربری
            </label>
            <div className="relative">
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                className="input-field pl-10"
                placeholder="نام کاربری خود را وارد کنید"
                required
              />
              <User className="absolute right-3 top-3.5 h-5 w-5 text-gray-400" />
            </div>
            {errors.username && (
              <p className="mt-1 text-xs text-red-500">{errors.username}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              ایمیل
            </label>
            <div className="relative">
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="input-field pl-10"
                placeholder="ایمیل خود را وارد کنید"
                required
              />
              <Mail className="absolute right-3 top-3.5 h-5 w-5 text-gray-400" />
            </div>
            {errors.email && (
              <p className="mt-1 text-xs text-red-500">{errors.email}</p>
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
                placeholder="حداقل ۸ کاراکتر"
                required
              />
              <Lock className="absolute right-3 top-3.5 h-5 w-5 text-gray-400" />
            </div>
            {errors.password && (
              <p className="mt-1 text-xs text-red-500">{errors.password}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              تکرار رمز عبور
            </label>
            <div className="relative">
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={(e) =>
                  setForm({ ...form, confirmPassword: e.target.value })
                }
                className="input-field pl-10"
                placeholder="رمز عبور خود را مجدداً وارد کنید"
                required
              />
              <Lock className="absolute right-3 top-3.5 h-5 w-5 text-gray-400" />
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-xs text-red-500">
                {errors.confirmPassword}
              </p>
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
              <span>در حال ثبت نام...</span>
            </>
          ) : (
            <span>ایجاد حساب</span>
          )}
        </button>

        <p className="text-sm text-center text-gray-600 dark:text-gray-400">
          حساب کاربری دارید؟{" "}
          <Link
            to="/login"
            className="text-primary-600 hover:text-primary-700 dark:text-primary-500 dark:hover:text-primary-400 font-medium"
          >
            وارد شوید
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
