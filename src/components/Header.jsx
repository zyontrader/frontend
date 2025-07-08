import {
  CloseOutlined,
  DownOutlined,
  MenuOutlined,
  UpOutlined,
} from "@ant-design/icons";
import { Flex } from "antd";
import { useState } from "react";
import { Link } from "react-router";
import LoginModal from "./LoginModal";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCompetitionOpen, setIsCompetitionOpen] = useState(false);
  const [isZyonOpen, setIsZyonOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const navLinks = [
    { label: "Home", path: "/" },
    {
      label: "Competition",
      subLinks: [{ label: "Funding Program", path: "/funding-program" }],
    },
    {
      label: "Zyon Platform",
      subLinks: [
        { label: "Paper Trading", path: "/paper-trading" },
        { label: "Options Trading", path: "/options-trading" },
        { label: "Market Data", path: "/market-data" },
        { label: "News", path: "/news" },
      ],
    },
    { label: "Algo Trading", path: "/algo-trading" },
    { label: "Forward Testing", path: "/forward-testing" },
    { label: "Developer Forum", path: "/developer-forum" },
  ];

  return (
    <div className="sticky top-0 z-50 bg-[linear-gradient(rgb(0,0,0)_70%,rgba(30,41,59,1)_100%)]">
      <div className="h-20 w-full px-6 lg:px-4  text-white relative">
        <Flex justify="space-between" align="center" className="h-full">
          <div
            className="xl:hidden  "
            onClick={() => setIsMenuOpen((prev) => !prev)}
          >
            {isMenuOpen ? (
              <CloseOutlined className="text-2xl xl:text-3xl " />
            ) : (
              <MenuOutlined className="text-2xl xl:text-3xl " />
            )}
          </div>
          <div className="h-full">
            <Link to={"/"}>
              <img
                className="h-20"
                src="https://zyontech.in/wp-content/uploads/2025/06/Screenshot_2025-06-20_034647-removebg-preview.png"
                alt=""
              />
            </Link>
          </div>
          <Flex
            align="center"
            className="!hidden xl:!flex h-full text-md"
            gap={30}
          >
            {navLinks.map(({ label, path, subLinks }) => (
              <div key={label} className={subLinks ? "relative group" : ""}>
                {path ? (
                  <Link
                    to={path}
                    className="!text-white hover:!text-emerald-500"
                  >
                    {label}
                  </Link>
                ) : (
                  <span className="!text-white hover:!text-emerald-500 cursor-pointer">
                    {label}
                  </span>
                )}

                {subLinks && (
                  <div className="hidden absolute top-4 -right-[50px] bg-black text-white w-[200px] text-center text-sm group-hover:block">
                    <Flex className="w-full" vertical>
                      {subLinks.map((sublink, i) => (
                        <Link
                          key={i}
                          to={sublink.path}
                          className="!text-white hover:!text-emerald-500 !h-10 content-center"
                        >
                          {sublink.label}
                        </Link>
                      ))}
                    </Flex>
                  </div>
                )}
              </div>
            ))}
          </Flex>

          <div className="hidden md:block text-black text-xl leading-4.5 items-center">
            <LoginModal
              open={isLoginOpen}
              onClose={() => setIsLoginOpen(false)}
            />
            <button
              className="bg-white h-10 w-40 px-2 cursor-pointer hover:bg-emerald-300 transition duration-500 rounded"
              onClick={() => setIsLoginOpen(true)}
            >
              Login/Register
            </button>
          </div>
        </Flex>
        {
          <div
            className={`absolute xl:hidden py-8 ${
              isMenuOpen ? "left-0" : "-left-500"
            } transition-all duration-500 ease-in-out  w-full bg-black flex flex-col items-center`}
          >
            <Link
              to="/"
              className="w-full h-10 flex justify-center items-center active:text-emerald-500 hover:text-emerald-500 text-white"
            >
              Home
            </Link>
            <Link
              className="w-full h-10 flex justify-center items-center active:text-emerald-500 hover:text-emerald-500 text-white"
              onClick={() => setIsCompetitionOpen((prev) => !prev)}
            >
              Competition{" "}
              {isCompetitionOpen ? (
                <UpOutlined className="ml-2" />
              ) : (
                <DownOutlined className="ml-2" />
              )}
            </Link>
            {isCompetitionOpen && (
              <div className=" w-full bg-gray-900  flex flex-col items-center">
                <Link
                  to="/funding-program"
                  className="w-full h-10 flex justify-center items-center active:text-emerald-500 hover:!text-emerald-500 text-white"
                >
                  Funding Program
                </Link>
              </div>
            )}
            <Link
              className="w-full h-10 flex justify-center items-center active:text-emerald-500 hover:text-emerald-500 text-white"
              onClick={() => setIsZyonOpen((prev) => !prev)}
            >
              Zyon Platform{" "}
              {isZyonOpen ? (
                <UpOutlined className="ml-2" />
              ) : (
                <DownOutlined className="ml-2" />
              )}
            </Link>
            {isZyonOpen && (
              <div className=" w-full bg-gray-900 flex flex-col items-center">
                <Link
                  to="paper-trading"
                  className="w-full h-10 flex justify-center items-center active:text-emerald-500 hover:text-emerald-500 text-white"
                >
                  Paper Trading
                </Link>
                <Link
                  to="options-trading"
                  className="w-full h-10 flex justify-center items-center active:text-emerald-500 hover:text-emerald-500 text-white"
                >
                  Options Trading
                </Link>
                <Link
                  to="market-data"
                  className="w-full h-10 flex justify-center items-center active:text-emerald-500 hover:text-emerald-500 text-white"
                >
                  Market Data
                </Link>
                <Link
                  to="news"
                  className="w-full h-10 flex justify-center items-center active:text-emerald-500 hover:text-emerald-500 text-white"
                >
                  News
                </Link>
              </div>
            )}
            <Link
              to="algo-trading"
              className="w-full h-10 flex justify-center items-center active:text-emerald-500 hover:text-emerald-500 text-white"
            >
              Algo Trading
            </Link>
            <Link
              to="/forward-testing"
              className="w-full h-10 flex justify-center items-center active:text-emerald-500 hover:text-emerald-500 text-white"
            >
              Forward Testing
            </Link>
            <Link
              to="/developer-forum"
              className="w-full h-10 flex justify-center items-center active:text-emerald-500 hover:text-emerald-500 text-white"
            >
              Developer Forum
            </Link>
          </div>
        }
      </div>
      <LoginModal open={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </div>
  );
}

export default Header;
