import React, { useRef, useEffect, useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const StrategyBuilderCarousel = ({ data , onSelect }) => {
  const containerRef = useRef(null);
  const [slidesToShow, setSlidesToShow] = useState(2);

  useEffect(() => {
    function updateSlides() {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        setSlidesToShow(width / 150);
      }
    }
    updateSlides();
    window.addEventListener('resize', updateSlides);
    return () => window.removeEventListener('resize', updateSlides);
  }, []);

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow,
    slidesToScroll: slidesToShow / 1.8,
    arrows: true,
  };

  return (
    <div ref={containerRef} className="overflow-x-hidden w-full px-[25px]">
      <Slider {...settings}>
        {data.map((item, idx) => (
          <div key={item.id || idx} onClick={() => onSelect && onSelect(item)}>
            <div className="cursor-pointer w-[120px] h-[120px] bg-gradient-to-b from-[#232526] to-[#000000] rounded-xl p-[5px] m-[5px] flex flex-col items-center justify-center shadow-lg border border-neutral-700 hover:border-blue-500 transition-all duration-200">
              <div className="flex-1 flex items-center justify-center">
                <img
                  src={`${process.env.PUBLIC_URL}/strategies/${item.image}`}
                  alt={item.label}
                  className="w-full object-contain drop-shadow-lg"
                  style={{ background: 'transparent' }}
                />
              </div>
              <div className="mt-1 text-sm font-semibold text-neutral-400 text-center">{item.label}</div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default StrategyBuilderCarousel; 