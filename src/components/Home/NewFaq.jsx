import { PlusOutlined } from "@ant-design/icons";
import { Collapse } from "antd";
import React from "react";
import { FaRegQuestionCircle } from "react-icons/fa";
import { useInView } from "react-intersection-observer";

function NewFaq() {
  const { ref: faqRef, inView: isFaqInView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });
  const items = [
    {
      topic: "Real-Time Paper Trading",
      qna: [
        {
          question: "Is this real trading or simulated?",
          answer:
            "This is simulated trading using real-time market data. No real money is used or at risk.",
        },
        {
          question: "Can I practice options, futures, and stocks?",
          answer:
            "Yes, you can trade across multiple segments — including index options, stock futures, and more.",
        },
        {
          question:
            "Does it reflect actual market conditions like slippage and spread?",
          answer:
            "Yes, we use real-time bid/ask data to simulate realistic execution.",
        },
        {
          question: "Do I need a broker account to use this?",
          answer:
            "No broker account is needed. You just sign up and start trading with virtual funds.",
        },
      ],
    },
    {
      topic: "Trading Competition",
      qna: [
        {
          question: "What is the entry fee and prize?",
          answer:
            "Entry is ₹500. The winner receives ₹10,000 worth of Zyon Coins, which can be redeemed to a bank account.",
        },
        {
          question: "How is the winner decided?",
          answer:
            "Based on portfolio performance at the end of the competition — leaderboard is live.",
        },
        {
          question: "Is this legal and SEBI-compliant?",
          answer:
            "Yes, since this is a skill-based simulation and not real-money trading or gambling, it’s SEBI-compliant.",
        },
        {
          question: "Can anyone join or only students?",
          answer: "Anyone above 18 years can participate — student or not.",
        },
      ],
    },
    {
      topic: "Funded Trading Program",
      qna: [
        {
          question: "How can I get funded by Zyon?",
          answer:
            "Consistently profitable traders on our platform are shortlisted and evaluated for a funded account.",
        },
        {
          question: "What is the profit split?",
          answer:
            "Typically 70% to the trader and 30% to Zyon — subject to performance tiers.",
        },
        {
          question: "Do I need to pay upfront for a funded account?",
          answer:
            "No upfront payment. Just perform well on our free or competition paper trading accounts.",
        },
        {
          question: "Is there a drawdown or risk limit?",
          answer:
            "Yes, we define clear max loss and drawdown rules. These are shared before you get funded.",
        },
      ],
    },
    {
      topic: "Algo Forward Testing",
      qna: [
        {
          question: "Can I test my own trading algorithm?",
          answer:
            "Yes. You can deploy your custom-built algos in a real-time simulated environment.",
        },
        {
          question: "What language and API does it support?",
          answer:
            "Currently, we support REST-based integration. Python SDK and webhook-based setups are available.",
        },
        {
          question: "Is there a cost to test algos?",
          answer:
            "Basic tier is free. Advanced metrics and extended usage may require a paid subscription.",
        },
        {
          question: "Can I see real-time PnL and metrics of my algo?",
          answer:
            "Yes, all trades are logged with performance, slippage, and market context.",
        },
      ],
    },
    {
      topic: "Zyon Market Data Dashboard",
      qna: [
        {
          question: "What kind of data is shown?",
          answer:
            "Real-time Open Interest charts, PCR, market breadth, heatmaps, synthetic futures, long/short buildup, and more.",
        },
        {
          question: "Is the data delayed or live?",
          answer: "It’s live, pulled from premium market feeds in real-time.",
        },
        {
          question: "Is this data included in free accounts?",
          answer:
            "Some basic analytics are free. Pro-level charts and tools are part of our advanced plan.",
        },
        {
          question: "Can I export or integrate this data elsewhere?",
          answer:
            "Export features are planned; currently, dashboard is web-only with API under development for select partners.",
        },
      ],
    },
    {
      topic: "Career at Zyon Trading Desk",
      qna: [
        {
          question: "What is Zyon Trading Desk?",
          answer:
            "It’s our internal team of funded traders who manage proprietary capital with a profit-sharing model.",
        },
        {
          question: "How do I qualify to join?",
          answer:
            "Perform consistently on our platform — we monitor your risk, consistency, and discipline.",
        },
        {
          question: "Is this a job or freelancing opportunity?",
          answer:
            "It’s a performance-based funded opportunity — with optional full-time contracts for top performers.",
        },
        {
          question: "Can I work remotely?",
          answer:
            "Yes. Our desk supports both remote and in-office models, depending on your profile and volume.",
        },
      ],
    },
  ];

  return (
    <div className="bg-black text-white py-10 flex flex-col px-2">
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

      <div className=" mt-16 px-6 lg:px-10 w-[100%] md:w-[70%] xl:w-[60%] mx-auto">
        {items.map(({ topic, qna }, index) => (
          <div key={index} className="mb-6">
            <h2 className="text-3xl font-bold mb-2 text-center !text-emerald-500">
              {index + 1}. {topic}
            </h2>
            <Collapse
              accordion
              bordered={true}
              expandIcon={({ isActive }) => (
                <PlusOutlined
                  rotate={isActive ? 90 : 0}
                  style={{
                    color: "white",
                    fontSize: 20,
                  }}
                />
              )}
              className="bg-black !text-white"
              style={{ transition: "all 0.3s ease-in-out" }}
              items={qna.map((item, idx) => ({
                key: idx,
                label: (
                  <span className="text-white lg:text-xl font-semibold hover:text-green-300">
                    {item.question}
                  </span>
                ),
                children: (
                  <p className="text-emerald-500 lg:text-lg">{item.answer}</p>
                ),
              }))}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default NewFaq;
