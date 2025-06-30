import { WhatsAppOutlined } from "@ant-design/icons";
import { Flex } from "antd";
import { useEffect, useState } from "react";
import { useLocation } from "react-router";

function Topbar() {
  const location = useLocation();
  const [url, setUrl] = useState("");
  useEffect(() => {
    if (location.pathname === "/") {
      setUrl("");
      return;
    }
    setUrl(
      location.pathname
        .replaceAll("/", " >> ")
        .replaceAll("-", " ")
        .toUpperCase()
    );
  }, [location]);
  return (
    <div className="hidden lg:block bg-black text-white h-12 w-full px-15 font-bold text-md border-b-2">
      <Flex align="center" className="h-full" gap={10}>
        <div className="font-bold w-[86%] text-sm">ZYONTRADER {url}</div>
        <Flex
          justify="space-between"
          align="center"
          className="w-[8%] border-l-2 h-full px-5 cursor-pointer"
        >
          <div className="px-2">
            <WhatsAppOutlined />
          </div>
          <div className="text-center leading-3.5">Chat With Us</div>
        </Flex>
        <Flex align="center" className="h-full border-l-2">
          <div className="w-[8%] px-5 cursor-pointer">Login</div>
        </Flex>
      </Flex>
    </div>
  );
}

export default Topbar;
