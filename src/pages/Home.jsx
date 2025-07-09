import {
  FaBusinessTime,
  FaCalendarDay,
  FaMoneyBillAlt,
  FaTradeFederation,
} from "react-icons/fa";
import Faq from "../components/Home/Faq";
import LoginModal from "../components/LoginModal";
import { useState } from "react";
import { useInView } from "react-intersection-observer";
import Carousel from './../components/Home/Carousel';
import CardSection from './../components/Home/CardSection';
import TvSection from './../components/Home/TvSection';

function Home() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const { ref: heroRef, inView: heroInView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });
  const { ref: iconsRef, inView: iconsInView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  return (
    <div>
      <div className="bg-[linear-gradient(to_bottom,_rgb(0,0,10)_8%,_rgb(30,41,59)_15%)] lg:bg-[linear-gradient(to_bottom,_rgb(0,0,10)_10%,_rgb(30,41,49)_35%)] w-full h-full px-4 lg:px-30">
        <div ref={heroRef} className="flex flex-col pt-36 lg:pt-50">
          <h1
            className={`text-3xl lg:text-[55px] uppercase !font-black text-emerald-500 ${
              heroInView
                ? "animate__animated animate__bounceInDown animate__slow"
                : ""
            }`}
          >
            Trade the market Not your savings
          </h1>

          <p
            className={`text-white text-xs lg:text-lg font-extrabold uppercase leading-8 ${
              heroInView
                ? "animate__animated animate__bounceInLeft animate__slow"
                : ""
            }`}
          >
            We fund disciplined traders with real capital and expert guidance{" "}
            <br />
            so they can grow without risking their own money
          </p>

          <button
            className={`w-60 p-4 mt-4 text-lg font-extrabold rounded-lg cursor-pointer 
    bg-white/10 border border-emerald-500 !text-emerald-400 
    backdrop-blur-md shadow-lg hover:bg-emerald-500 hover:!text-white transition-all duration-300
    ${
      heroInView ? "animate__animated animate__bounceInRight animate__slow" : ""
    }`}
            onClick={() => setIsLoginOpen(true)}
          >
            EARN FUNDING
          </button>
        </div>

        <div
          ref={iconsRef}
          className={`flex flex-col justify-center lg:flex-row gap-10 mt-20 lg:mt-60 items-center 
    ${iconsInView ? "animate__animated animate__slideInUp animate__slow" : ""}`}
        >
          {[
            {
              icon: <FaTradeFederation size={80} />,
              title: "INDEX OPTIONS",
              desc: "Nifty BankNifty Sensex",
            },
            {
              icon: <FaMoneyBillAlt size={80} />,
              title: "STOCK FUTURES",
              desc: "All FnO stocks",
            },
            {
              icon: <FaCalendarDay size={80} />,
              title: "5000 STOCKS",
              desc: "Pennny Stock , small cap Included",
            },
            {
              icon: <FaBusinessTime size={80} />,
              title: "OPTION SELLING",
              desc: "Strategic Option selling",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col gap-2 w-full lg:w-60 items-center text-center"
            >
              <div className="text-emerald-500">{item.icon}</div>
              <h1 className="text-emerald-500 text-3xl font-black">
                {item.title}
              </h1>
              <p className="text-white font-black">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-20 flex flex-col lg:flex-row gap-10">
          <div className="flex flex-col items-center lg:items-end w-full lg:w-[50%] text-center lg:text-right">
            <h1 className="font-extrabold text-emerald-500 text-4xl leading-10">
              Alpha Trading Championship
            </h1>
            <div className="h-1 border-3 w-[55%] border-emerald-500 mt-4"></div>
            <p className="w-[95%] text-white text-lg mt-10">
              Our program that helps traders build better skills, discipline,
              and habits, as they are evaluated for funding. Win championship
              and get immediate funding of Rs 10000 (instant payouts) weekly
              challenges on every expiry
            </p>
            <button
              className="w-[50%] p-4 mt-6 text-lg font-extrabold rounded-lg cursor-pointer bg-white/10 border border-emerald-500 !text-emerald-400 backdrop-blur-md shadow-md hover:bg-emerald-500 hover:!text-white transition-all duration-300"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              EXPLORE HOW IT WORKS
            </button>
          </div>

          <div className="w-full lg:w-[40%] h-[300px] mt-6 lg:mt-0">
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/Vmzm_4UzLxY"
              title="YouTube video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>

        <div className="mt-20 flex flex-col items-center">
          <h1 className="!font-extrabold text-emerald-400 text-4xl leading-10 text-center">
            Funding Program - Different Account Size
          </h1>
          <p className="text-white text-md lg:text-lg text-center w-[95%] !mt-10">
            Zyon offers three different trading program paths, in the first two
            you trade on simulated account with consistency rules. Once you meet
            the target you start trading in real account. Account size, rules,
            profit target, and loss limits will become 1/10th of the simulated
            account in the real account.
          </p>

          <div className="flex flex-row items-start lg:px-4 my-10 w-full">
            {/* Left labels section */}
            <div className="flex flex-col gap-y-6 justify-center text-right w-auto pr-3 border-white h-96 border-r">
              <p className="text-white text-xs lg:text-sm font-bold">
                MONTHLY PRICE
              </p>
              <p className="text-white text-xs lg:text-sm font-bold">
                PROFIT TARGET
              </p>
              <p className="text-white text-xs lg:text-sm font-bold">
                CONSISTENCY RULES APPLIES
              </p>
              <p className="text-white text-xs lg:text-sm font-bold">
                MAXIMUM LOSS LIMIT
              </p>
            </div>

            {/* Scrollable cards container */}
            <div className="w-full overflow-x-auto lg:overflow-visible">
              <div className="flex justify-around gap-4 px-4">
                {[
                  {
                    label: "SIMULATED",
                    amount: "500K",
                    price: "Rs 499 / MONTH",
                    profit: "Rs 25000",
                    consistency: "YES - SEE FAQ",
                    loss: "Rs 25000",
                  },
                  {
                    label: "SIMULATED",
                    amount: "1000K",
                    price: "Rs 999 / MONTH",
                    profit: "Rs 50000",
                    consistency: "YES - SEE FAQ",
                    loss: "Rs 50000",
                  },
                  {
                    label: "LIVE",
                    amount: "1500K",
                    price: "Rs 20000 ONE TIME",
                    profit: "NONE 80% PROFIT YOURS",
                    consistency: "NO",
                    loss: "Rs 20000",
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex-shrink-0 lg:w-[300px] h-96 bg-white relative overflow-hidden shadow-lg rounded"
                  >
                    <div className="absolute top-3 right-[-40px] w-[170px] bg-black text-white text-sm font-bold py-1.5 text-center rotate-45 z-10 shadow-md pl-6">
                      {item.label}
                    </div>
                    <div className="flex flex-col items-center px-8 pt-4">
                      <h1 className="text-5xl !font-black text-black">
                        <span className="align-top text-sm mr-1">Rs</span>
                        {item.amount}
                      </h1>
                      <p className="!font-black text-sm mt-1">Account Margin</p>
                      <div className="w-full space-y-2 mt-4">
                        {[
                          item.price,
                          item.profit,
                          item.consistency,
                          item.loss,
                        ].map((text, i) => (
                          <div key={i}>
                            <p className="text-sm font-medium text-center text-gray-600">
                              {text}
                            </p>
                          </div>
                        ))}
                      </div>
                      <button className="mt-4 bg-black hover:scale-110 transition-all duration-500  !text-white font-bold py-2 px-6 w-[70%] rounded cursor-pointer">
                        SELECT
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <p className="text-white text-sm lg:text-lg text-center w-[95%]">
            We don’t encourage hero-zero trades or unrealistic position sizing.
            Zyon-X risk limiter and position sizing bot help keep risk in check
            and enforce consistency rules.
          </p>
        </div>
      </div>
      <TvSection />
      <Carousel />
      <CardSection />
      <Faq />
      <LoginModal open={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </div>
  );
}

export default Home;
