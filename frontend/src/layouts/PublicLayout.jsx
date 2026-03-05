import Footer from "../components/Footer";
import { Outlet, useLocation } from "react-router-dom";
import PublicNavbar from "../components/PublicNavbar";
import FaqChatbot from "../components/FaqChatbot";

const PublicLayout = () => {
  const location = useLocation();

  return (
    <>
      <PublicNavbar />

      <div className="page-wrapper">
        <Outlet />
      </div>

      {location.pathname !== "/" && <Footer />}
      <FaqChatbot />
    </>
  );
};

export default PublicLayout;