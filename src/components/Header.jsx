import { CloseOutlined, MenuOutlined } from "@ant-design/icons";
import { Flex } from "antd";
import { useState } from "react";
import { Link } from "react-router";
import LoginModal from "./LoginModal";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isOurProgramOpen, setIsOurProgramOpen] = useState(false);
  const [isResourcesOpen, setIsResourcesOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  return (
    <div className="sticky top-0 z-50 bg-[linear-gradient(rgb(0,0,0)_70%,rgba(30,41,59,0.6)_100%)]">
      <div className="h-20 w-full px-6 lg:px-15  text-white relative">
        <Flex justify="space-between" align="center" className="h-full">
          <div>
            <Link to={"/"}>
              <h1 className="text-2xl !font-black !text-white">ZYONTRADER</h1>
            </Link>
          </div>
          <Flex
            align="center"
            className="!hidden lg:!flex h-full text-lg"
            gap={60}
          >
            <div className="h-10">
              <Link to={"/"} className="!text-white">
                HOME
              </Link>
            </div>
            <div className="relative group h-10">
              <Link className="!text-white">OUR PROGRAM</Link>
              <div className="hidden absolute top-8 bg-black text-white w-[200px] text-center text-sm group-hover:block">
                <Flex className="w-full" vertical>
                  <Link
                    to={"/how-it-works"}
                    className="!text-white hover:!bg-gray-600 !h-10 content-center"
                  >
                    HOW IT WORKS
                  </Link>
                  <Link
                    to={"/future-trading-101"}
                    className="!text-white hover:!bg-gray-600 !h-10 content-center"
                  >
                    FUTURE TRADING 101
                  </Link>
                  <Link
                    to={"/forex-to-future"}
                    className="!text-white hover:!bg-gray-600 !h-10 content-center"
                  >
                    FOREX TO FUTURE
                  </Link>
                </Flex>
              </div>
            </div>
            <div className="h-10">
              <Link to={"/trade-zyontrader"} className="!text-white">
                TRADE ZYONTRADER
              </Link>
            </div>
            <div className="h-10">
              <Link to={"/free-coaching"} className="!text-white">
                FREE COACHING
              </Link>
            </div>
            <div className="relative group h-10">
              <Link className="!text-white">RESOURCES</Link>
              <div className="hidden absolute top-8 bg-black text-white w-[200px] text-center text-sm group-hover:block">
                <Flex className="w-full" vertical>
                  <Link
                    to={"/help-center"}
                    className="!text-white hover:!bg-gray-600 !h-10 content-center"
                  >
                    HELP CENTER
                  </Link>
                  <Link
                    to={"/zyontradertv"}
                    className="!text-white hover:!bg-gray-600 !h-10 content-center"
                  >
                    ZYONTRADERTV
                  </Link>
                  <Link
                    to={"/blog"}
                    className="!text-white hover:!bg-gray-600 !h-10 content-center"
                  >
                    BLOG
                  </Link>
                  <Link
                    to={"/trader-success-stories"}
                    className="!text-white hover:!bg-gray-600 !h-10 content-center"
                  >
                    TRADER SUCCESS STORIES
                  </Link>
                  <Link
                    to={"/weekly-levels"}
                    className="!text-white hover:!bg-gray-600 !h-10 content-center"
                  >
                    WEEKLY LEVELS
                  </Link>
                  <Link
                    to={"/join-our-community"}
                    className="!text-white hover:!bg-gray-600 !h-10 content-center"
                  >
                    JOIN OUR COMMUNITY
                  </Link>
                  <Link
                    to={"/contact-us"}
                    className="!text-white hover:!bg-gray-600 !h-10 content-center"
                  >
                    CONTACT US
                  </Link>
                </Flex>
              </div>
            </div>
          </Flex>
          <div className="hidden lg:block text-black text-xl leading-4.5 items-center">
            <LoginModal
              open={isLoginOpen}
              onClose={() => setIsLoginOpen(false)}
            />
            <button
              className="bg-white h-15 w-40 px-3 cursor-pointer hover:bg-amber-100"
              onClick={() => setIsLoginOpen(true)}
            >
              EARN FUNDING
            </button>
          </div>

          <div
            className="lg:hidden h-10 "
            onClick={() => setIsMenuOpen((prev) => !prev)}
          >
            {isMenuOpen ? (
              <CloseOutlined className="text-3xl " />
            ) : (
              <MenuOutlined className="text-3xl " />
            )}
          </div>
        </Flex>
        {isMenuOpen && (
          <div className=" w-full bg-black flex flex-col items-center">
            <Link className="w-full h-10 flex justify-center items-center active:bg-gray-500 text-white">
              HOME
            </Link>
            <Link
              className="w-full h-10 flex justify-center items-center active:bg-gray-500 text-white"
              onClick={() => setIsOurProgramOpen((prev) => !prev)}
            >
              OUR PROGRAM
            </Link>
            {isOurProgramOpen && (
              <div className=" w-full bg-black flex flex-col items-center">
                <Link className="w-full h-10 flex justify-center items-center active:bg-gray-500 text-white">
                  HOW IT WORKS
                </Link>
                <Link className="w-full h-10 flex justify-center items-center active:bg-gray-500 text-white">
                  FUTURE TRADING 101
                </Link>
                <Link className="w-full h-10 flex justify-center items-center active:bg-gray-500 text-white">
                  FOREX TO FUTURE
                </Link>
              </div>
            )}
            <Link className="w-full h-10 flex justify-center items-center active:bg-gray-500 text-white">
              TRADE ZYONTRADER
            </Link>
            <Link className="w-full h-10 flex justify-center items-center active:bg-gray-500 text-white">
              FREE COACHING
            </Link>
            <Link
              className="w-full h-10 flex justify-center items-center active:bg-gray-500 text-white"
              onClick={() => setIsResourcesOpen((prev) => !prev)}
            >
              RESOURCES
            </Link>
            {isResourcesOpen && (
              <div className=" w-full bg-black flex flex-col items-center">
                <Link className="w-full h-10 flex justify-center items-center active:bg-gray-500 text-white">
                  HELP CENTER
                </Link>
                <Link className="w-full h-10 flex justify-center items-center active:bg-gray-500 text-white">
                  ZYRONTRADERTV
                </Link>
                <Link className="w-full h-10 flex justify-center items-center active:bg-gray-500 text-white">
                  BLOG
                </Link>
                <Link className="w-full h-10 flex justify-center items-center active:bg-gray-500 text-white">
                  TRADER SUCCESS STORIES
                </Link>
                <Link className="w-full h-10 flex justify-center items-center active:bg-gray-500 text-white">
                  WEEKLY LEVELS
                </Link>
                <Link className="w-full h-10 flex justify-center items-center active:bg-gray-500 text-white">
                  JOIN OUR COMMUNITY
                </Link>
                <Link className="w-full h-10 flex justify-center items-center active:bg-gray-500 text-white">
                  CONTACT US
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
      <LoginModal open={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </div>
  );
}

export default Header;
