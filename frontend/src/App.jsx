import { BrowserRouter, Routes, Route } from "react-router-dom";

import PublicLayout from "./layouts/PublicLayout";
import DashboardLayout from "./layouts/DashboardLayout";

import Home from "./pages/Home";
import Awareness from "./pages/Awareness";
import Disclaimer from "./pages/Disclaimer";
import ContactUs from "./pages/ContactUs";
import AboutUs from "./pages/AboutUs";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

import Dashboard from "./pages/Dashboard";
import Result from "./pages/Result";
import Predict from "./pages/Predict";
import MyProfile from "./pages/MyProfile";
import ViewAllReports from "./pages/ViewAllReports";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* -------- PUBLIC PAGES -------- */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/awareness" element={<Awareness />} />
          <Route path="/disclaimer" element={<Disclaimer />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>

        {/* -------- DASHBOARD PAGES -------- */}
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/predict" element={<Predict />} />
          <Route path="/result" element={<Result />} />
          <Route path="/profile" element={<MyProfile />} />
          <Route path="/dashboard/home"element={<Home/>}/>
          <Route path="/dashboard/contact" element={<ContactUs />} />
          <Route path="/dashboard/about" element={<AboutUs />} />
          <Route path="/dashboard/disclaimer" element={<Disclaimer />} />
          <Route path="/dashboard/awareness" element={<Awareness />} />
          <Route path="/reports" element={<ViewAllReports />} />

        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
