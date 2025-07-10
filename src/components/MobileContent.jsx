import React, { useRef, useEffect } from "react";
import MarketAnalyticsWidget from "./Analysis/MarketAnalyticsWidget";
import BasketsComponent from "./Baskets/BasketsComponent";
import OptionChainAnalysisWidget from "./OptionChain/OptionChainAnalysisWidget";
import OptionChainDisplayWidget from "./OptionChain/OptionChainDisplayWidget";
import OptionStrategyBuilderWidget from "./StrategyBuilder/OptionStrategyBuilderWidget";
import {
  LineChartOutlined,
  HomeOutlined,
  BarChartOutlined,
  MoreOutlined,
  BranchesOutlined,
  BuildOutlined,
  ShoppingOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import MobileHomeWidget from "./Mobile/MobileHomeWidget";
import MobileBottomDrawerWidget from "./Mobile/MobileBottomDrawerWidget";
import { useState } from "react";
import eventBus, { EVENT_TYPES } from "../utils/eventBus";
import WatchlistsWidget from "./Watchlists/WatchlistsWidget";

const MobileContent = () => {
  const [activeTab, setActiveTab] = useState("Home");
  const [showOverflowMenu, setShowOverflowMenu] = useState(false);

  const marketRef = useRef();
  const overflowMenuRef = useRef();

  // Reset activeTab on account change
  useEffect(() => {
    const unsubAccount = eventBus.on(EVENT_TYPES.USER_ACCOUNT_ID_UPDATE, () => {
      setActiveTab("Home");
    });
    return () => {
      if (typeof unsubAccount === "function") unsubAccount();
    };
  }, []);

  // Close overflow menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showOverflowMenu &&
        overflowMenuRef.current &&
        !overflowMenuRef.current.contains(event.target)
      ) {
        setShowOverflowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showOverflowMenu]);

  const renderContent = () => {
    switch (activeTab) {
      case "Watchlists":
        return (
          <div className="flex pt-2 flex-1 flex-col overflow-y-auto">
            <WatchlistsWidget />
          </div>
        );
      case "Baskets":
        return <BasketsComponent />;
      case "Analysis":
        return <MarketAnalyticsWidget ref={marketRef} />;
      case "OptionAnalysis":
        return <OptionChainAnalysisWidget />;
      case "OptionChains":
        return <OptionChainDisplayWidget />;
      case "StrategyBuilder":
        return <OptionStrategyBuilderWidget />;
      default:
        return <MobileHomeWidget />;
    }
  };

  return (
    <div className="bg-dark-bg rounded-lg p-1 pl-2 pr-3 pt-1 flex flex-col flex-1 overflow-y-auto font-family-roboto relative">
      <div className="flex flex-1 flex-col overflow-y-auto">
        {renderContent()}
      </div>
      <div className="flex justify-between mt-2 border-t border-neutral-700 pt-2">
        <div
          className={`flex-1 flex justify-center cursor-pointer py-2 rounded ${
            activeTab === "Watchlists"
              ? "bg-green-500 text-neutral-800"
              : "text-neutral-400"
          }`}
          onClick={() => setActiveTab("Watchlists")}
        >
          <UnorderedListOutlined
            style={{ fontSize: 24, fontWeight: 700, strokeWidth: 2 }}
          />
        </div>
        <div
          className={`flex-1 flex justify-center cursor-pointer py-2 rounded ${
            activeTab === "Home"
              ? "bg-green-500 text-neutral-800"
              : "text-neutral-400"
          }`}
          onClick={() => setActiveTab("Home")}
        >
          <HomeOutlined
            style={{ fontSize: 24, fontWeight: 700, strokeWidth: 2 }}
          />
        </div>
        <div
          className={`flex-1 flex justify-center cursor-pointer py-2 rounded ${
            activeTab === "Analysis"
              ? "bg-green-500 text-neutral-800"
              : "text-neutral-400"
          }`}
          onClick={() => setActiveTab("Analysis")}
        >
          <LineChartOutlined
            style={{ fontSize: 24, fontWeight: 700, strokeWidth: 2 }}
          />
        </div>
        <div
          className={`flex-1 flex justify-center cursor-pointer py-2 rounded ${
            activeTab === "OptionAnalysis"
              ? "bg-green-500 text-neutral-800"
              : "text-neutral-400"
          }`}
          onClick={() => setActiveTab("OptionAnalysis")}
        >
          <BarChartOutlined
            style={{ fontSize: 24, fontWeight: 700, strokeWidth: 2 }}
          />
        </div>
        <div
          ref={overflowMenuRef}
          className={`flex justify-center cursor-pointer py-2 px-3 rounded relative ${
            showOverflowMenu
              ? "bg-green-500 text-neutral-800"
              : "text-neutral-400"
          }`}
          onClick={() => setShowOverflowMenu(!showOverflowMenu)}
        >
          <MoreOutlined
            style={{ fontSize: 24, fontWeight: 700, strokeWidth: 2 }}
          />

          {/* Overflow Menu */}
          {showOverflowMenu && (
            <div className="absolute bottom-full right-0 mb-2 bg-dark-bg-2 border border-neutral-700 rounded-lg shadow-lg z-50 min-w-48">
              <div
                className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-neutral-700 transition-colors"
                onClick={() => {
                  setActiveTab("OptionChains");
                  setShowOverflowMenu(false);
                }}
              >
                <BranchesOutlined style={{ fontSize: 18, color: "#9ca3af" }} />
                <span className="text-sm text-neutral-300">Option Chains</span>
              </div>
              <div
                className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-neutral-700 transition-colors"
                onClick={() => {
                  setActiveTab("StrategyBuilder");
                  setShowOverflowMenu(false);
                }}
              >
                <BuildOutlined style={{ fontSize: 18, color: "#9ca3af" }} />
                <span className="text-sm text-neutral-300">
                  Strategy Builder
                </span>
              </div>
              <div
                className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-neutral-700 transition-colors"
                onClick={() => {
                  setActiveTab("Baskets");
                  setShowOverflowMenu(false);
                }}
              >
                <ShoppingOutlined style={{ fontSize: 18, color: "#9ca3af" }} />
                <span className="text-sm text-neutral-300">Baskets</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <MobileBottomDrawerWidget />
    </div>
  );
};

export default MobileContent;
