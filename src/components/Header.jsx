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
      currentState: isCompetitionOpen,
      setCurrentState: setIsCompetitionOpen,
      subLinks: [{ label: "Funding Program", path: "/funding-program" }],
    },
    {
      label: "Zyon Platform",
      currentState: isZyonOpen,
      setCurrentState: setIsZyonOpen,
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
    { label: "Trader Portal", path: "/trader" },
  ];

  return (
    <div className="sticky top-0 z-50 bg-[linear-gradient(rgb(0,0,0)_70%,rgba(30,41,59,1)_100%)]">
      <div className="h-20 w-full px-6 lg:px-4  text-white relative">
        <Flex justify="space-between" align="center" className="h-full">
          {/* Hamburger */}
          <div
            className="xl:hidden cursor-pointer "
            onClick={() => setIsMenuOpen((prev) => !prev)}
          >
            {isMenuOpen ? (
              <CloseOutlined className="text-2xl xl:text-3xl " />
            ) : (
              <MenuOutlined className="text-2xl xl:text-3xl " />
            )}
          </div>
          {/* Desktop Menu */}
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

        {/* Mobile Menu */}
        {
          <div
            className={`absolute xl:hidden py-8 ${
              isMenuOpen ? "left-0" : "-left-500"
            } transition-all duration-500 ease-in-out w-full bg-black flex flex-col items-center z-50`}
          >
            {navLinks.map(
              ({ label, path, subLinks, currentState, setCurrentState }) => (
                <div key={label} className="w-full flex flex-col items-center">
                  {/* Parent link */}
                  <Link
                    to={path || "#"}
                    className="w-full h-10 flex justify-center items-center text-white hover:text-emerald-500"
                    onClick={() => {
                      if (setCurrentState) {
                        setCurrentState((prev) => !prev);
                      }
                      if (!subLinks) {
                        setIsMenuOpen(false); // close menu on direct link
                      }
                    }}
                  >
                    {label}
                    {subLinks && (
                      <>
                        {currentState ? (
                          <UpOutlined className="ml-2" />
                        ) : (
                          <DownOutlined className="ml-2" />
                        )}
                      </>
                    )}
                  </Link>

                  {/* Sublinks */}
                  {currentState && subLinks && (
                    <div className="w-full bg-gray-900 flex flex-col items-center">
                      {subLinks.map((sublink, i) => (
                        <Link
                          key={i}
                          to={sublink.path}
                          className="w-full h-10 flex justify-center items-center text-white hover:!text-emerald-500"
                          onClick={() => {
                            if (setCurrentState) {
                              setCurrentState((prev) => !prev);
                            }

                            setIsMenuOpen(false);
                          }}
                        >
                          {sublink.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )
            )}
          </div>
        }
      </div>
      <LoginModal open={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </div>
  );
}

export default Header;
