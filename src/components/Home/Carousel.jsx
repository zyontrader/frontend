import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css/bundle";
import { useEffect, useState } from "react";

function Carousel() {
  // Responsive direction
  const [direction, setDirection] = useState(
    window.matchMedia("(max-width: 640px)").matches ? "horizontal" : "vertical"
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 640px)");
    const handleChange = (e) => {
      setDirection(e.matches ? "horizontal" : "vertical");
    };
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);
  const messages = [
    {
      title: "Algo Forward testing",
      description:
        "Back testing does not work as expected with lot size, expirey changes you can forward test your algo strategy without risking real money.",
      color: "text-black",
      bgColor: "bg-green-300",
    },
    {
      title: "Virtual Ai assistant-Zyon X",
      description:
        "Edge Loss Limiter, real time position size alerter, Behavioral Bias Detector are just a subset of assistant rules that will make you a pro trader.",
      color: "text-black",
      bgColor: "bg-green-300",
    },
    {
      title: "Option Selling - The institutional way",
      description:
        "Iron Condor with Adaptive Widths, Skew-Adjusted Ratio Spread, Delta-Neutral Straddle with Gamma Scalping. Test these strategies without risking real capital.",
      color: "text-black",
      bgColor: "bg-green-300",
    },
    {
      title: "You Perform, We Partner - 80% profit split",
      description:
        "Our model is built on trust and performance. When you prove consistency, we provide the capital — and you take home 80% of the profits.",
      color: "text-black",
      bgColor: "bg-green-300",
    },
    {
      title: "Even A+ Setups Can Fail - But Capital Is Safe",
      description:
        "In real trading, even perfect setups lose. But on our platform, you don’t lose your savings — only a small predefined risk.",
      color: "text-white",
      bgColor: "bg-black",
    },
  ];

  return (
    <Swiper
      direction={direction}
      loop={true}
      autoplay={{ delay: 3000, disableOnInteraction: false }}
      modules={[Autoplay]}
      className="h-[400px] bg-black"
    >
      {messages.map((msg, index) => (
        <SwiperSlide key={index}>
          <div
            className={`w-full ${msg.bgColor} ${msg.color} flex flex-col items-center justify-center gap-y-6 px-6 lg:px-24 py-16 text-center`}
          >
            <h1 className="text-2xl lg:text-3xl !font-black">{msg.title}</h1>
            <p className="font-medium text-sm lg:text-base">
              {msg.description}
            </p>
            <button className="border-2 px-6 py-3 rounded !font-bold cursor-pointer hover:scale-110 hover:backdrop-blur-lg transition-all duration-500">
              Click Here
            </button>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

export default Carousel;
