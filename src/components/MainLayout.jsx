// MainLayout.jsx
import Header from "./Header";
import Footer from "./footer/foot";
import ContactInfo from "./contactHome/contactInfo";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <>
      <Header />
      <Outlet />  
      <ContactInfo />
      <Footer />
    </>
  );
}
