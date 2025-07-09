import { PlusOutlined } from "@ant-design/icons";
import { Collapse } from "antd";
import { FaRegQuestionCircle } from "react-icons/fa";
import { useInView } from "react-intersection-observer";
function Faq() {
  const { ref: faqRef, inView: isFaqInView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });
  const text = `
  You’ll receive access to a funded account to trade with real capital.
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
      <div
        ref={faqRef}
        className={`flex justify-center items-center gap-3 mx-auto ${
          isFaqInView
            ? "animate__animated animate__slideInUp animate__slow"
            : ""
        }`}
      >
        <FaRegQuestionCircle className="text-5xl text-white mt-1" />
        <div className="h-10 content-center">
          <h1 className="text-4xl !font-extrabold text-white leading-none">
            FAQs
          </h1>
        </div>
      </div>

      <div className="mt-8 px-6 lg:px-10 w-[100%] md:w-[70%] xl:w-[60%] mx-auto">
        <Collapse
          accordion
          items={items}
          bordered={false}
          expandIcon={({ isActive }) => (
            <PlusOutlined
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
