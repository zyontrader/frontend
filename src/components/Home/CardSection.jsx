import React from "react";
import img from "../../assets/img.jpg";
import { FaClock, FaDotCircle } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import { TiTick } from "react-icons/ti";
function CardSection() {
  return (
    <div className="bg-black px-8 pt-8">
      <div className="flex flex-col sm:flex-row md:justify-between lg:justify-evenly">
        <div className="w-90 relative overflow-hidden rounded-sm ">
          <img src={img} alt="" className="object-contain w-full h-full" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black z-0" />
          <div className="absolute bottom-0 w-full text-white z-10 p-4">
            <div className="flex flex-col items-center gap-2">
              <img
                src="https://zyontech.in/wp-content/uploads/2025/06/rupee_5000-removebg-preview.png"
                className="w-70"
              />
              <p className="flex gap-x-3 items-center">
                <span className="text-green-300">
                  <FaClock />
                </span>
                Monthly Fees ₹499
              </p>
              <p className="flex gap-x-3 items-center">
                <span className="text-green-300">
                  <ImCross />
                </span>
                Profit Target ₹3000
              </p>
              <p className="flex gap-x-3 items-center">
                <span className="text-green-300">
                  <FaDotCircle />
                </span>
                Maximum Drawdown ₹2000
              </p>
              <p className="flex gap-x-3 items-center">
                <span className="text-green-300">
                  <TiTick />
                </span>
                Minimum trade 5
              </p>
            </div>
          </div>
        </div>
        <div className="w-90 relative overflow-hidden rounded-sm">
          <img src={img} alt="" className="object-contain w-full h-full" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black z-0" />
          <div className="absolute bottom-0 w-full text-white z-10 p-4">
            <div className="flex flex-col items-center gap-2">
              <img
                src="https://zyontech.in/wp-content/uploads/2025/06/rupee_5000-removebg-preview.png"
                className="w-70"
              />
              <p className="flex gap-x-3 items-center">
                <span className="text-green-300">
                  <FaClock />
                </span>
                Monthly Fees ₹499
              </p>
              <p className="flex gap-x-3 items-center">
                <span className="text-green-300">
                  <ImCross />
                </span>
                Profit Target ₹3000
              </p>
              <p className="flex gap-x-3 items-center">
                <span className="text-green-300">
                  <FaDotCircle />
                </span>
                Maximum Drawdown ₹2000
              </p>
              <p className="flex gap-x-3 items-center">
                <span className="text-green-300">
                  <TiTick />
                </span>
                Minimum trade 5
              </p>
            </div>
          </div>
        </div>
        <div className="w-90 relative overflow-hidden rounded-sm">
          <img src={img} alt="" className="object-contain w-full h-full" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black z-0" />
          <div className="absolute bottom-0 w-full text-white z-10 p-4">
            <div className="flex flex-col items-center gap-2">
              <img
                src="https://zyontech.in/wp-content/uploads/2025/06/rupee_5000-removebg-preview.png"
                className="w-70"
              />
              <p className="flex gap-x-3 items-center">
                <span className="text-green-300">
                  <FaClock />
                </span>
                Monthly Fees ₹499
              </p>
              <p className="flex gap-x-3 items-center">
                <span className="text-green-300">
                  <ImCross />
                </span>
                Profit Target ₹3000
              </p>
              <p className="flex gap-x-3 items-center">
                <span className="text-green-300">
                  <FaDotCircle />
                </span>
                Maximum Drawdown ₹2000
              </p>
              <p className="flex gap-x-3 items-center">
                <span className="text-green-300">
                  <TiTick />
                </span>
                Minimum trade 5
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CardSection;
