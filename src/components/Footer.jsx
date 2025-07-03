import {
  DiscordFilled,
  FacebookFilled,
  InstagramOutlined,
  LinkedinFilled,
  TwitterOutlined,
  YoutubeFilled,
} from "@ant-design/icons";
import { Col, Row } from "antd";
import { useState } from "react";
import { FaPlus, FaRegHospital } from "react-icons/fa";
import { Link } from "react-router";

function Footer() {
  const [isResourcesOpen, setIsResourcesOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isNewsOpen, setIsNewsOpen] = useState(false);
  const [isExtrasOpen, setIsExtrasOpen] = useState(false);
  return (
    <div className="bg-black text-white px-10 py-10">
      {/* Upper Part */}
      <div>
        <Row>
          {/* First Column */}
          <Col span={0} lg={9}>
            <div className="w-full h-[530px] border-b-2 border-r-2  flex flex-col gap-4">
              {/* ➤ Top: 4 resource columns in a row */}
              <div className="flex flex-row gap-6">
                {/* Column 1 */}
                <div className="flex flex-col">
                  <h4>RESOURCES</h4>
                  <div className="mt-4 text-xs underline">
                    <p>ZYON TRADER</p>
                    <p>FREE COACHING</p>
                    <p>HELP CENTER</p>
                    <p>CONTACT SUPPORT</p>
                  </div>
                </div>

                {/* Column 2 */}
                <div className="flex flex-col">
                  <h4>RESOURCES</h4>
                  <div className="mt-4 text-xs underline">
                    <p>ABOUT US</p>
                    <p>OUR TEAM</p>
                    <p>FAQs</p>
                  </div>
                </div>

                {/* Column 3 */}
                <div className="flex flex-col">
                  <h4>RESOURCES</h4>
                  <div className="mt-4 text-xs underline">
                    <p>STATUS UPDATES</p>
                    <p>ECONOMIC CALENDAR</p>
                    <p>NEWSLETTER</p>
                  </div>
                </div>

                {/* Column 4 */}
                <div className="flex flex-col">
                  <h4>RESOURCES</h4>
                  <div className="mt-4 text-xs underline">
                    <p>CURRENT OPENINGS</p>
                    <p>ZYONTRADER GEAR</p>
                    <p>COMMUNITY</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-row flex-wrap gap-4 mt-4 text-xs underline w-full">
                <p className="border-r-2 pr-2"> ZYON TRADER</p>
                <p className="border-r-2 pr-2"> TERMS OF USE</p>
                <p className="border-r-2 pr-2"> RISK DISCLOSURE</p>
                <p className="border-r-2 pr-2"> MANAGE COOKIE PREFERENCES</p>
                <p> DO NOT SELL OR SHARE MY PERSONAL INFORMATION</p>
              </div>
            </div>
          </Col>

          {/* Second Column */}
          <Col span={24} lg={9}>
            <div className="w-full h-[530px] lg:border-b-2 lg:border-r-2 lg:px-8">
              <div className="flex justify-evenly">
                <FacebookFilled
                  style={{ fontSize: 30 }}
                  className="cursor-pointer hover:!text-blue-600 transition-colors duration-300"
                />
                <YoutubeFilled
                  style={{ fontSize: 30 }}
                  className="cursor-pointer hover:!text-red-600 transition-colors duration-300"
                />
                <InstagramOutlined
                  style={{ fontSize: 30 }}
                  className="cursor-pointer hover:!text-[#E4405F] transition-colors duration-300"
                />
                <TwitterOutlined
                  style={{ fontSize: 30 }}
                  className="cursor-pointer hover:!text-sky-400 transition-colors duration-300"
                />
                <LinkedinFilled
                  style={{ fontSize: 30 }}
                  className="cursor-pointer hover:!text-blue-600 transition-colors duration-300"
                />
                <DiscordFilled
                  style={{ fontSize: 30 }}
                  className="cursor-pointer hover:!text-[#5865F2] transition-colors duration-300"
                />
              </div>

              <div className="block lg:hidden mt-10  w-full pl-4 font-bold text-lg">
                <div
                  className="flex justify-start items-center gap-4 active:!bg-gray-500 border-b-3 mt-4 py-2"
                  onClick={() => setIsResourcesOpen((prev) => !prev)}
                >
                  <Link className="!text-white group">RESOURCES</Link>{" "}
                  <FaPlus size={18} />
                </div>
                {isResourcesOpen && (
                  <div className="flex flex-col gap-4 active:!bg-gray-500 mt-4 py-2">
                    <Link className="!text-white group">ZYONTRADERTV</Link>{" "}
                    <Link className="!text-white group">FREE COACHING</Link>{" "}
                    <Link className="!text-white group">HELP CENTER</Link>{" "}
                    <Link className="!text-white group">CONTACT SUPPORT</Link>{" "}
                  </div>
                )}

                <div
                  className="flex justify-start items-center gap-4 active:!bg-gray-500 border-b-3 mt-4 py-2"
                  onClick={() => setIsAboutOpen((prev) => !prev)}
                >
                  <Link className="!text-white group">ABOUT</Link>{" "}
                  <FaPlus size={18} />
                </div>
                {isAboutOpen && (
                  <div className="flex flex-col gap-4 active:!bg-gray-500 mt-4 py-2">
                    <Link className="!text-white group">ABOUT US</Link>{" "}
                    <Link className="!text-white group">OUR TEAM</Link>{" "}
                    <Link className="!text-white group">FAQS</Link>{" "}
                  </div>
                )}

                <div
                  className="flex justify-start items-center gap-4 active:!bg-gray-500 border-b-3 mt-4 py-2"
                  onClick={() => setIsNewsOpen((prev) => !prev)}
                >
                  <Link className="!text-white group">NEWS</Link>{" "}
                  <FaPlus size={18} />
                </div>
                {isNewsOpen && (
                  <div className="flex flex-col gap-4 active:!bg-gray-500  mt-4 py-2">
                    <Link className="!text-white group">STATUS UPDATES</Link>{" "}
                    <Link className="!text-white group">ECONOMIC CALENDAR</Link>{" "}
                    <Link className="!text-white group">NEWSLETTER</Link>{" "}
                  </div>
                )}

                <div
                  className="flex justify-start items-center gap-4 active:!bg-gray-500 border-b-3 mt-4 py-2"
                  onClick={() => setIsExtrasOpen((prev) => !prev)}
                >
                  <Link className="!text-white group">EXTRAS</Link>{" "}
                  <FaPlus size={18} />
                </div>
                {isExtrasOpen && (
                  <div className="flex flex-col gap-4 active:!bg-gray-500  mt-4 py-2">
                    <Link className="!text-white group">CURRENT OPENING</Link>{" "}
                    <Link className="!text-white group">ZYONTRADER GEAR</Link>{" "}
                    <Link className="!text-white group">COMMUNITY</Link>{" "}
                  </div>
                )}
              </div>

              <div className="mt-12 flex flex-col">
                <label
                  htmlFor="newsletter"
                  className="block text-lg font-medium text-white mb-2"
                >
                  Subscribe to our newsletter!
                  <sup className="text-red-600 text-xs ml-1">*</sup>
                </label>
                <input
                  id="newsletter"
                  type="text"
                  className="w-full bg-white h-12 px-4 !text-black outline-0 rounded-md text-xl"
                  placeholder="johndoe@gmail.com"
                  required
                />
              </div>

              <div className="mt-4">
                <input type="checkbox" name="agree" id="agree" />
                <p className="inline text-md leading-6 ">
                  I have read and hereby agree to the Terms of Use and Privacy
                  Policy, and by checking this box, I hereby direct Zyontrader
                  to share my personal information with all Topstep affiliated
                  entities and related entities.
                </p>

                <div className="mt-8 leading-6 text-justify">
                  By checking this box, you hereby agree that Topstep can use
                  your email address to send you marketing and promotional
                  communications. We're committed to your privacy. Topstep uses
                  the information you provide to us to contact you about our
                  relevant content, products, and services. You may unsubscribe
                  from these communications at any time.
                </div>
                <div className="mt-8">
                  <button className="rounded-full border-2 hover:border-emerald-500 hover:!text-emerald-500 p-4 w-full lg:w-[35%] font-bold text-xl cursor-pointer">
                    SUBMIT
                  </button>
                </div>
              </div>
            </div>
          </Col>

          {/* Third Column */}
          <Col span={24} lg={6}>
            {" "}
            <div className="mt-76 lg:mt-0 w-full h-[530px] px-8 border-b-2">
              <div className="flex flex-col">
                <img
                  className="lg:w-48 cursor-pointer"
                  onClick={() =>
                    window.scrollTo({ top: 0, behavior: "smooth" })
                  }
                  src="https://zyontech.in/wp-content/uploads/2025/06/Screenshot_2025-06-20_034647-removebg-preview.png"
                />

                <div className="mt-6 pl-4 flex">
                  <FaRegHospital size={70} />
                  <p className="text-2xl lg:text-xl font-bold text-green-300 pl-4 w-[80%]  lg:w-[129px]">
                    WE STARTED IN THE PITS
                  </p>
                </div>
                <div className="font-semibold  text-xs pl-4 text-center lg:text-left">
                  Topstep, LLC <br />
                  Chicago Board of Trade Building <br />
                  141 W Jackson Blvd <br />
                  #4240 <br /> Chicago, IL 60604
                </div>

                <div className="font-semibold pl-4 text-xs mt-6 text-center lg:text-left">
                  <p className="underline">SUPPORT HOURS</p>
                  <div>
                    Chat Support: M-F 7:00 AM – 8:00 PM CT <br />
                    Start a Support Chat
                    <br />
                    Phone Support: M-F 8:00 AM – 3:30 PM CT <br />
                    1-888-407-1611
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </div>

      {/* Lower Part */}
      <div className="mt-14 ">
        <Row>
          <Col span={24} lg={18}>
            <div className="flex flex-col text-justify">
              <p className="leading-5 text-[9px] lg:text-xs ">
                <span className="font-bold">Allowed Instruments: </span>
                Topstep traders are allowed to trade Futures products only,
                listed on the following exchanges: CME, COMEX, NYMEX & CBOT.
                Trading of Stocks, Options, Forex, Cryptocurrency and CFD’s are
                not permitted nor available in our program or platforms.
              </p>
              <p className="leading-5 text-[9px] lg:text-xs ">
                <span className="font-bold">
                  Trader Evaluation Disclaimer:{" "}
                </span>
                The Trading Combine is a realistic simulation of trading under
                actual market conditions and is difficult to pass even for
                experienced traders. The Trading Combine is not suggested for
                individuals with minimal trading experience.
              </p>
              <p className="leading-5 text-[9px] lg:text-xs ">
                <span className="font-bold">
                  2024 Trader Performance Statistics:{" "}
                </span>
                From January through December 2024, (a) 12.4% of all Trading
                Combines initiated were successfully completed and afforded the
                opportunity to advance to the Funded Level, (b) 46.6% of
                individual participants who entered a Trading Combine advanced
                to the Funded Level, (c) 28.3% of all individual participants at
                the Funded Level received a payout, and (d) 0.96% of individual
                participants trading in an Express Funded Account were called up
                to a Live Funded Account. The Funded Level includes both Express
                Funded Accounts and Live Funded Accounts, with the aggregate of
                such accounts used in the percentage determination. These
                statistics reflect performance in both a simulated trading
                environment and a live trading environment and are not
                indicative of future results
              </p>
              <p className="leading-5 text-[9px] lg:text-xs ">
                To promote responsible trading and mitigate Prohibited Conduct,
                such as exploiting the simulated environment, trading activity
                will be subject to review by our Risk and Compliance Teams. If
                Topstep identifies trading activity that, in its sole
                discretion, relates to Prohibited Conduct, Topstep reserves the
                right to, delete the trading day and all profits, restart the
                account, or close the account. Additionally, in its sole
                discretion, Topstep may ban the trader from using all or a
                portion of the Site and Services.
              </p>
              <p className="leading-5 text-[9px] lg:text-xs ">
                All content published and distributed by Topstep LLC and its
                affiliates (collectively, the “Company”) is to be treated as
                general information only. None of the information provided by
                the Company or contained herein is intended as (a) investment
                advice, (b) an offer or solicitation of an offer to buy or sell,
                or (c) a recommendation, endorsement, or sponsorship of any
                security, company, or fund. Testimonials appearing on the
                Company’s websites may not be representative of other clients or
                customers and is not a guarantee of future performance or
                success. Use of the information contained on the Company’s
                websites is at your own risk and the Company and its partners,
                representatives, agents, employees, and contractors assume no
                responsibility or liability for any use or misuse of such
                information.
              </p>
              <p className="leading-5 text-[9px] lg:text-xs ">
                {" "}
                Futures trading contains substantial risk and is not for every
                investor. An investor could potentially lose all or more than
                the investor’s initial investment. Only risk capital—money that
                can be lost without jeopardizing one’s financial security or
                lifestyle—should be used for trading and only those individuals
                with sufficient risk capital should consider trading. Nothing
                contained herein is a solicitation or an offer to buy or sell
                futures, options, or forex. Past performance is not necessarily
                indicative of future results.
              </p>
              <p className="leading-5 text-[9px] lg:text-xs ">
                CFTC Rule 4.41 – Hypothetical or Simulated performance results
                have certain limitations. Unlike an actual performance record,
                simulated results do not represent actual trading. Also, because
                the trades have not actually been executed, the results may have
                under-or-over compensated for the impact, if any, of certain
                market factors, such as lack of liquidity. Simulated trading
                programs, in general, are also subject to the fact that they are
                designed with the benefit of hindsight. No representation is
                being made that any account will or is likely to achieve profit
                or losses similar to those shown.
              </p>
              <p className="leading-5 text-[9px] lg:text-xs ">
                <span className="font-bold">TopstepTV Disclaimer: </span>
                All opinions expressed by TopstepTV LLC show participants,
                hosts, guests, and personalities (collectively, “Show
                Participants”) are solely those individual’s current opinions
                and do not reflect the opinions of TopstepTV LLC or its parent
                company, affiliates, or subsidiaries, or the companies with
                which the Show Participants are affiliated and may have been
                previously disseminated by them. The Show Participants’ opinions
                are based on information the Show Participants consider
                reliable, but none of TopstepTV LLC or its parent companies,
                affiliates, or subsidiaries, or the companies with which the
                Show Participants are affiliated represent, warrant, or
                otherwise guarantee its completeness or accuracy, and it should
                not be relied upon as such. No part of the Show Participants’
                compensation from TopstepTV LLC is related to the specific
                opinions they express.
              </p>
              <p className="leading-5 text-[9px] lg:text-xs ">
                Past performance is not indicative of future results. Neither
                the Show Participants nor TopstepTV LLC guarantee any specific
                outcome or profit in any manner. Further, you should be aware of
                the real risk of loss in following any advice, strategy or
                investment discussed on the shows. Such strategies or
                investments discussed can fluctuate in price or value, and such
                strategies or investments may not be suitable for you. You
                should make your own independent decision regarding any
                strategies or investments.
              </p>
              <p className="leading-5 text-[9px] lg:text-xs ">
                This material does not take into account your particular
                investment objectives, financial situation or needs, and the
                material is not intended as any form of recommendation
                appropriate for you. We strongly encourage you to consider
                seeking advice from your own investment advisor.
              </p>
            </div>
          </Col>

          <Col span={0} lg={6} className="px-6 hidden lg:block">
            <p className="leading-5 text-xs w-[60%] text-justify ml-6">
              © 2025 – Topstep LLC. All rights reserved. TopstepTrader, The
              Chevron Logo, Topstep, Trading Combine, and Funded Account are all
              trademarks of TopstepTechnologies LLC.
            </p>

            <p className="mt-5 ml-6">Site by Rule29</p>
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default Footer;
