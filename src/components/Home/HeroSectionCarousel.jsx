import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
function HeroSectionCarousel() {
  const heroSlides = [
    {
      title: "Real-Time Paper Trading",
      description: [
        {
          text: "Simulated trading using live market data — perfect for skill-building and habit-forming.",
        },
      ],
    },
    {
      title: "Trading Competitions",
      description: [
        {
          text: "₹500 entry fee, winner earns ₹10,000 Zyon Coins (redeemable in a bank account). Compete, learn, and earn.",
        },
      ],
    },
    {
      title: "Funded Trading Program",
      description: [
        {
          text: "High-performing traders are selected to manage Zyon’s capital. No capital barrier, just skill-based growth.",
        },
      ],
    },
    {
      title: "Zyon Trading Desk Career Track",
      description: [
        {
          text: "We’re not just a platform — we’re building a next-gen trading desk. Consistent performers get:",
          points: [
            "Long-term funded accounts",
            "Mentorship and strategy feedback",
            "Growth opportunities inside Zyon as full-time or remote prop traders",
          ],
        },
      ],
    },
    {
      title: "Algo Forward Testing",
      description: [
        {
          text: "Test trading bots using live Option Greeks & market data with virtual capital.",
        },
      ],
    },
    {
      title: "Zyon Market Data Dashboard",
      description: [
        {
          text: "Professional analytics, including:",
          points: [
            "OI buildup, PCR, Adv/Decline",
            "Heatmaps, Synthetic Futures",
            "Long/Short Buildup, Active Strike OI",
          ],
        },
        {
          text: "All updated in real time.",
        },
      ],
    },
  ];
  return (
    <div className="text-emerald-500">
      <Swiper
        autoHeight={true}
        direction="horizontal"
        loop={true}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        modules={[Autoplay]}
      >
        {heroSlides.map(({ title, description }) => (
          <SwiperSlide key={title}>
            <div className="flex flex-col justify-center  gap-4">
              <h1 className="text-4xl lg:text-[55px] !font-black ">{title}</h1>
              <div className="flex flex-col justify-center">
                {description.map(({ text, points }) => (
                  <div key={text}>
                    <p className="text-lg md:text-2xl font-semibold text-white my-4">{text}</p>
                    {points && (
                      <ul className="font-medium text-sm md:text-lg list-disc pl-10">
                        {points.map((item) => (
                          <li
                            key={item}
                            className="my-2 font-semibold"
                          >
                            {item}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default HeroSectionCarousel;
