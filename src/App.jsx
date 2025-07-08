import { FaWhatsapp } from "react-icons/fa";
import { Route, Routes } from "react-router";
import Faq from "./components/Faq";
import Footer from "./components/Footer";
import Header from "./components/Header";
import AboutUs from "./pages/AboutUs";

import Home from "./pages/Home";
import Team from "./pages/Team";
import TermsAndConditions from "./pages/TermsAndConditions";
import FundingProgram from "./pages/FundingProgram";
import PaperTrading from "./pages/PaperTrading";
import OptionsTrading from "./pages/OptionsTrading";
import MarketData from "./pages/MarketData";
import News from "./pages/News";
import AlgoTrading from "./pages/AlgoTrading";
import ForwardTesting from "./pages/ForwardTesting";
import DeveloperForum from "./pages/DeveloperForum";
import ContactUs from "./pages/Contactus";

function App() {
  return (
    <>
      {/* <Topbar /> */}
      <Header />
      <div className=" overflow-hidden relative">
        <button className="hidden lg:block bg-green-600 h-16 w-16  px-3 rounded-full fixed bottom-4 right-4 cursor-pointer">
          <a href="https://api.whatsapp.com/resolve/?deeplink=%2F91XXXXXXXXXX&not_found=1">
            <FaWhatsapp className="text-white" size={40} />
          </a>
        </button>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/funding-program" element={<FundingProgram />} />
          <Route path="/paper-trading" element={<PaperTrading />} />
          <Route path="/options-trading" element={<OptionsTrading />} />
          <Route path="/market-data" element={<MarketData />} />
          <Route path="/news" element={<News />} />
          <Route path="/algo-trading" element={<AlgoTrading />} />
          <Route path="/forward-testing" element={<ForwardTesting />} />
          <Route path="/developer-forum" element={<DeveloperForum />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/team" element={<Team />} />
          <Route
            path="/terms-and-conditions"
            element={<TermsAndConditions />}
          />
        </Routes>
      </div>
      <Footer />
    </>
  );
}

export default App;
