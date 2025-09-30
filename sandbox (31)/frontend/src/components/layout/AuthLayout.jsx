export default function AuthLayout({ title, children }) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800">
        <div className="w-full max-w-md bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg rounded-2xl shadow-xl p-8">
          <h1 className="text-2xl font-bold text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
            {title}
          </h1>
          {children}
        </div>
      </div>
    );
  }
  