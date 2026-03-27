import Hero from './components/main/Hero'
import PresentationSection from './components/main/PresentationSection'

import Projects from "./components/pages/projects_f/Projects";
import Services from "./components/pages/services_f/Services";
import AboutUs from "./components/pages/aboutus_f/AboutUs";
import ContactForm from "./components/pages/contactus_f/ContactUs";
import MainLayout from './components/MainLayout';
import CreateAccount from './components/pages/account_f/CreateAccount';
import { BrowserRouter, Route, Routes } from 'react-router-dom'

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
            </>
            } />
          <Route path="/projects" element={<Projects />} />
          <Route path="/services" element={<Services />} />
          <Route path="/aboutus" element={<AboutUs />} />
          <Route path="/contactus" element={<ContactForm />} />
          <Route path="/account" element={<CreateAccount />} />
        </Route>  
      </Routes>
      
      
    </BrowserRouter>    
    </>
  )
}

export default App
