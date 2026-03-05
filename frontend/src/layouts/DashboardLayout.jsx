import { Outlet, useLocation } from "react-router-dom";
import DashboardNavbar from "../components/DashboardNavbar";
import Footer from "../components/Footer";
import FaqChatbot from "../components/FaqChatbot";

const DashboardLayout = () => {
  const location = useLocation();

  return (
    <>
      <DashboardNavbar />

      <div className="page-wrapper">
        <Outlet />
      </div>

      {location.pathname !== "/dashboard/home" && <Footer />}
      <FaqChatbot />
    </>
  );
};

export default DashboardLayout;