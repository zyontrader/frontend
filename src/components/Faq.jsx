import {
  QuestionCircleFilled,
  QuestionCircleOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { Collapse } from "antd";
import React from "react";
import { FaRegQuestionCircle } from "react-icons/fa";

function Faq() {
  const text = `
    A dog is a type of domesticated animal.
    Known for its loyalty and faithfulness,
    it can be found as a welcome guest in many households across the world.
  `;

  const items = [
    {
      key: "1",
      label: (
        <span className="text-white lg:text-2xl font-semibold hover:text-green-300">
          What happens after I pass the Alpha Challenge?
        </span>
      ),
      children: <p className="text-white lg:text-xl">{text}</p>,
    },
    {
      key: "2",
      label: (
        <span className="text-white lg:text-2xl font-semibold hover:text-green-300">
          What happens after I pass the Alpha Challenge?
        </span>
      ),
      children: <p className="text-white lg:text-xl">{text}</p>,
    },
    {
      key: "3",
      label: (
        <span className="text-white lg:text-2xl font-semibold hover:text-green-300">
          What happens after I pass the Alpha Challenge?
        </span>
      ),
      children: <p className="text-white lg:text-xl">{text}</p>,
    },
    {
      key: "4",
      label: (
        <span className="text-white lg:text-2xl font-semibold hover:text-green-300">
          What happens after I pass the Alpha Challenge?
        </span>
      ),
      children: <p className="text-white lg:text-xl">{text}</p>,
    },
  ];

  return (
    <div className="bg-black text-white py-30 flex flex-col px-2">
      <div className="flex justify-center items-center gap-3 mx-auto">
        <FaRegQuestionCircle className="text-5xl text-white mt-1" />
        <div className="h-10 content-center">
          <h1 className="text-4xl !font-extrabold text-white leading-none">
            FAQs
          </h1>
        </div>
      </div>

      <div className="mt-8 px-6 lg:px-10 w-[70%] mx-auto">
        <Collapse
          items={items}
          bordered={false}
          expandIcon={({ isActive }) => (
            <RightOutlined
              rotate={isActive ? 90 : 0}
              style={{ color: "white", fontSize: 20 }}
            />
          )}
          className="bg-black text-white"
          style={{
            transition: "all 0.3s ease-in-out",
          }}
        />
      </div>
    </div>
  );
}

export default Faq;
