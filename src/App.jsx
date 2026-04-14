import Hero from './components/main/Hero'
import PresentationSection from './components/main/PresentationSection'
import ProjectsSection from './components/main/ProjectsSection'
import Services from "./components/pages/services_f/Services";
import AboutUs from "./components/pages/aboutus_f/AboutUs";
import ContactForm from "./components/pages/contactus_f/ContactUs";
import MainLayout from './components/MainLayout';
import CreateAccount from './components/pages/account_f/CreateAccount';
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import ProtectedRoute from './components/restrictedPages/ProtectedRoute';
import AdminHub from './components/restrictedPages/AdminHub';
import AdminLogin from './components/restrictedPages/AdminLogin';
import AdminCreateUser from './components/restrictedPages/AdminUserCreation';
import AdminServiceEditor from './components/restrictedPages/ServicesEdition';
import AdminCreateService from './components/restrictedPages/CreateService';
import AdminEditCustomer from './components/restrictedPages/EditCustomer';
import AdminCustomerList from './components/restrictedPages/CustomerList';
import CustomerDashboard from './components/pages/account_f/CustomerDashboard';
import CustomerLogin from './components/pages/account_f/CustomerLogin';
import VerifyEmail from './components/pages/account_f/VerifyEmail';
// import AdminImages from './components/restrictedPages/ManageImages';
// import AdminLogs from './components/restrictedPages/ViewLogs';
// import AdminSettings from './components/restrictedPages/Settings';

function App() {
  
  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={
            <>
              <Hero/>
              <PresentationSection/>
              <ProjectsSection/>
            </>
            }/>
          <Route path="/services" element={<Services />} />
          <Route path="/aboutus" element={<AboutUs />} />
          <Route path="/contactus" element={<ContactForm />} />
          <Route path="/account" element={<CreateAccount />} />
          <Route path="/signin" element={<CustomerLogin />} />
          <Route path="/verify-email/:token" element={<VerifyEmail />} />
        </Route>
        <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/users/create" element={<AdminCreateUser />} />  
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute>
                <AdminHub />
              </ProtectedRoute>
            }
          /> 

        <Route path="/admin/services" element={<AdminServiceEditor />} />
        <Route path="/admin/services/create" element={<AdminCreateService />} />
        <Route path="/admin/services/edit" element={<AdminServiceEditor />} />
        <Route path="/admin/users/create" element={<AdminCreateUser />} />
        <Route path="/admin/customers" element={<AdminCustomerList />} />
        <Route path="/admin/customers/edit/:id" element={<AdminEditCustomer />} />
        <Route
          path="/my-account"
          element={
            <ProtectedRoute>
              <CustomerDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
      
      
    </BrowserRouter>    
    </>
  )
}

export default App;
