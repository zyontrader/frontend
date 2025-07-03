import { CiFlag1 } from "react-icons/ci";
import { FaHandPointRight } from "react-icons/fa";
import { GiSwordClash } from "react-icons/gi";
import { VscGraph } from "react-icons/vsc";
import "swiper/css";
import "swiper/css/effect-coverflow";
import { Autoplay, EffectCoverflow } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { useInView } from "react-intersection-observer";
const videos = [
  {
    url: "https://www.youtube.com/embed/BZbChKzedEk?feature=oembed&autoplay=1&rel=0&controls=0",
    thumbnail:
      "https://zyontech.in/wp-content/plugins/elementor/assets/images/placeholder.png",
    title: "Strategy 1",
  },
  {
    url: "https://www.youtube.com/embed/BZbChKzedEk?feature=oembed&autoplay=1&rel=0&controls=0",
    thumbnail:
      "https://zyontech.in/wp-content/plugins/elementor/assets/images/placeholder.png",
    title: "Strategy 2",
  },
  {
    url: "https://www.youtube.com/embed/BZbChKzedEk?feature=oembed&autoplay=1&rel=0&controls=0",
    thumbnail:
      "https://zyontech.in/wp-content/plugins/elementor/assets/images/placeholder.png",
    title: "Strategy 3",
  },
  {
    url: "https://www.youtube.com/embed/BZbChKzedEk?feature=oembed&autoplay=1&rel=0&controls=0",
    thumbnail:
      "https://zyontech.in/wp-content/plugins/elementor/assets/images/placeholder.png",
    title: "Strategy 4",
  },
  {
    url: "https://www.youtube.com/embed/BZbChKzedEk?feature=oembed&autoplay=1&rel=0&controls=0",
    thumbnail:
      "https://zyontech.in/wp-content/plugins/elementor/assets/images/placeholder.png",
    title: "Strategy 5",
  },
  {
    url: "https://www.youtube.com/embed/BZbChKzedEk?feature=oembed&autoplay=1&rel=0&controls=0",
    thumbnail:
      "https://zyontech.in/wp-content/plugins/elementor/assets/images/placeholder.png",
    title: "Strategy 6",
  },
];

function TvSection() {
  const { ref: leftCardRef, inView: isLeftCardInView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });
  const { ref: rightCardRef, inView: isRightCardInView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });
  return (
    <div className="bg-black flex flex-col items-center text-white py-20">
      <h1 className="text-green-300 text-xl !font-black">ZYONTRADER TV</h1>
      <p className="text-slate-600 text-center px-4">
        EverLorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit
        tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.
      </p>

      <div className="bg-black py-12 w-full">
        <Swiper
          effect="coverflow"
          grabCursor
          centeredSlides
          loop
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          breakpoints={{
            0: { slidesPerView: 1 },
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          coverflowEffect={{
            rotate: 50,
            stretch: 0,
            depth: 200,
            modifier: 1,
            slideShadows: true,
          }}
          modules={[EffectCoverflow, Autoplay]}
          className="w-full max-w-[70em] mx-auto"
        >
          {videos.map((video, index) => (
            <SwiperSlide
              key={index}
              className="w-[200px] h-[100px] rounded-lg overflow-hidden relative shadow-lg"
            >
              <div className="relative w-full h-full">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => window.open(video.url, "_blank")}
                  className="absolute inset-0 flex items-center justify-center bg-black/50 hover:bg-black/70 transition cursor-pointer"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 text-white"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M10.804 8.697 6.518 11.5c-.55.36-1.268-.044-1.268-.697V5.197c0-.653.718-1.057 1.268-.697l4.286 2.803a.824.824 0 0 1 0 1.394z" />
                    <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm0 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14z" />
                  </svg>
                </button>
                <div className="absolute bottom-0 w-full text-center bg-black/60 text-white text-sm py-1 font-semibold">
                  {video.title}
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className="flex flex-col lg:flex-row w-full justify-evenly gap-12 px-4 text-justify ">
        {/* Left Card */}
        <div
          ref={leftCardRef}
          className={`flex flex-col items-center w-full lg:w-[50%] text-justify px-8 ${
            isLeftCardInView
              ? "animate__animated animate__slideInLeft animate__slow"
              : ""
          }`}
        >
          <GiSwordClash size={40} className="text-green-300" />
          <h1 className="!font-black text-4xl !mb-9">Alpha Clash</h1>
          <ul className="text-lg ">
            <li className="list-disc">
              Skill based trading challenge with live market data
            </li>
            <li className="list-disc">Start with ₹500 in risk free demo</li>
            <li className="list-disc">
              Leaderboard rewards consistency not luck
            </li>
            <li className="list-disc">Connect with top traders and mentors</li>
            <li className="list-disc">
              Options , futures, stock choose your area
            </li>
          </ul>
          <button
            className="bg-emerald-500 text-white flex items-center gap-3 px-6 py-3 rounded-lg font-bold mt-6 cursor-pointer
             shadow-md hover:bg-emerald-600 hover:scale-105 transition-all duration-300"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            Join The Contest <CiFlag1 className="text-white" size={24} />
          </button>
        </div>

        <div
          ref={rightCardRef}
          className={`flex flex-col items-center w-full lg:w-[50%] lg:border-l-2 text-justify px-8 ${
            isRightCardInView
              ? "animate__animated animate__slideInRight animate__slow"
              : ""
          } `}
        >
          <VscGraph size={40} className="text-green-300" />
          <h1 className="!font-black text-3xl !mb-9">GET FUNDED</h1>
          <ul className="text-lg">
            <li className="list-disc">
              Demonstrate trading skills in a structured evaluation
            </li>
            <li className="list-disc">
              Qualify for capital access through performance-based milestones
            </li>
            <li className="list-disc">
              Emphasis on discipline, strategy, and risk management
            </li>
            <li className="list-disc">
              Learn from real-time analytics and expert feedback
            </li>
            <li className="list-disc">
              No promises, just merit-driven opportunities to grow
            </li>
          </ul>
          <button
            className="bg-emerald-500 text-white flex items-center gap-3 px-6 py-3 rounded-lg font-bold mt-6 cursor-pointer
             shadow-md hover:bg-emerald-600 hover:scale-105 transition-all duration-300"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            Get Funded <FaHandPointRight className="text-white" size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default TvSection;
