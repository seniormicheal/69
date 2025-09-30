import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import VirtualNumbersHomepage from "./pages/VirtualNumbersHomepage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Orders from "./pages/Orders";
import FAQ from "./pages/FAQ"; // Import the new FAQ component

export default function App() {
  return (
    <>
      <Toaster
        position="bottom-center"
        toastOptions={{
          className: '',
          style: {
            border: '1px solid #713200',
            padding: '16px',
            color: '#713200',
            fontFamily: 'Vazirmatn, sans-serif'
          },
        }}
      />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<VirtualNumbersHomepage />} />
          <Route path="/faq" element={<FAQ />} /> {/* Add the new FAQ route */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/orders" element={<Orders />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}