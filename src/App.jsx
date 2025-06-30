import { Route, Routes } from "react-router";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Topbar from "./components/Topbar";
import Blog from "./pages/Blog";
import Contactus from "./pages/Contactus";
import ForextoFuture from "./pages/ForextoFuture";
import Freecoaching from "./pages/Freecoaching";
import Futuretrading101 from "./pages/Futuretrading101";
import Helpcenter from "./pages/Helpcenter";
import Home from "./pages/Home";
import Howitworks from "./pages/Howitworks";
import Joinourcommunity from "./pages/Joinourcommunity";
import Tradersuccessstories from "./pages/Tradersuccessstories";
import TradeZyonTrader from "./pages/TradeZyonTrader";
import Weeklylevels from "./pages/Weeklylevels";
import Zyontradertv from "./pages/Zyontradertv";

function App() {
  return (
    <>
      <Topbar />
      <Header />
      <div className="min-h-24">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/how-it-works" element={<Howitworks />} />
          <Route path="/future-trading-101" element={<Futuretrading101 />} />
          <Route path="/forex-to-future" element={<ForextoFuture />} />
          <Route path="/trade-zyontrader" element={<TradeZyonTrader />} />
          <Route path="/free-coaching" element={<Freecoaching />} />
          <Route path="/help-center" element={<Helpcenter />} />
          <Route path="/zyontradertv" element={<Zyontradertv />} />
          <Route path="/blog" element={<Blog />} />
          <Route
            path="/trader-success-stories"
            element={<Tradersuccessstories />}
          />
          <Route path="/weekly-levels" element={<Weeklylevels />} />
          <Route path="/join-our-community" element={<Joinourcommunity />} />
          <Route path="/contact-us" element={<Contactus />} />
        </Routes>
      </div>
      <Footer />
    </>
  );
}

export default App;
