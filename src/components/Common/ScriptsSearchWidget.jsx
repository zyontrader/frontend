import React, { useState, useRef, useEffect } from "react";
import { SearchOutlined } from "@ant-design/icons";
import { createEditOrder } from "../../utils/utils";
import { addToTempWatchlist, searchScripts } from "../../api/apis";
import * as editOrderStore from "../../store/editOrderStore";

const Spinner = () => (
  <svg className="animate-spin h-5 w-5 text-blue-400" viewBox="0 0 24 24">
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
      fill="none"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
    />
  </svg>
);

// Buy Icon
const BuyIcon = () => <span className="font-bold text-base">B</span>;
// Sell Icon
const SellIcon = () => <span className="font-bold text-base">S</span>;

const ScriptsSearchWidget = ({
  onScriptSelected,
  showBuySell = true,
  processingScriptIds,
}) => {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchResultsLoading, setSearchResultsLoading] = useState(false);
  const containerRef = useRef(null);

  function reset() {
    setQuery("");
    setSearchResults([]);
    setSearchResultsLoading(false);
    setOpen(false);
  }

  // Show dropdown when we have a query of 3+ characters
  useEffect(() => {
    if (query.length >= 3) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [query]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        reset();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = async (scriptId) => {
    if (onScriptSelected) {
      // Await the result if onScriptSelected is async
      const shouldClose = await onScriptSelected(scriptId);
      if (shouldClose) {
        setOpen(false);
        setQuery("");
        setSearchResults([]);
        setSearchResultsLoading(false);
      }
    }
  };

  const handleInputChange = async (e) => {
    const value = e.target.value || "";
    setQuery(value);
    // Clear results if query is too short
    if (value.length >= 3) {
      setSearchResultsLoading(true);
      const res = await searchScripts(value);
      setSearchResults(res.searchScripts);
      setSearchResultsLoading(false);
    } else {
      setSearchResults([]);
      setSearchResultsLoading(false);
    }
  };

  // Helper to check if a script is processing
  const isProcessing = (id) => {
    if (!processingScriptIds) return false;
    if (Array.isArray(processingScriptIds))
      return processingScriptIds.includes(id);
    if (processingScriptIds instanceof Set) return processingScriptIds.has(id);
    return false;
  };

  // Icon click handlers (can be replaced with real logic or callback props)
  const handleBuy = async (script, e) => {
    e.stopPropagation();
    addToTempWatchlist(script.id);
    editOrderStore.setEditOrder(createEditOrder(script.id, "BUY", "OPEN", 0));
    reset();
  };
  const handleSell = async (script, e) => {
    e.stopPropagation();
    addToTempWatchlist(script.id);
    editOrderStore.setEditOrder(createEditOrder(script.id, "SELL", "OPEN", 0));
    reset();
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      <div className="flex items-center border-b border-gray-400">
        <input
          type="text"
          className="w-full px-2 py-1 rounded-none border-0 focus:outline-none bg-transparent !text-neutral-400 placeholder:!text-neutral-400 !text-base "
          placeholder="Search scripts..."
          value={query}
          onChange={handleInputChange}
          onFocus={() => query.length >= 3 && setOpen(true)}
        />
        <SearchOutlined className="!text-gray-400 mr-2" />
      </div>
      {open && (
        <div className="absolute z-10 left-0 right-0 bg-neutral-800 border border-neutral-600 rounded shadow mt-1 max-h-64 overflow-y-auto">
          {searchResultsLoading ? (
            <div className="p-3 text-neutral-400">Loading...</div>
          ) : searchResults.length === 0 ? (
            <div className="p-3 text-neutral-400">No results found</div>
          ) : (
            searchResults.map((script) => (
              <div
                key={script.id}
                className={`px-4 py-2 flex items-center group cursor-pointer hover:bg-neutral-700 border-b border-neutral-600 last:border-none`}
                onClick={() => handleSelect(script.id)}
              >
                <div className="flex-1 min-w-0 py-1">
                  <div className="text-sm md:text-base font-medium text-neutral-300 truncate">
                    {script.id}
                  </div>
                  {script.fullName && script.fullName !== script.id && (
                    <div className="text-xs text-neutral-400 truncate">
                      {script.fullName}
                    </div>
                  )}
                </div>
                {/* Buy/Sell icons (only on hover if showBuySell) and spinner if processing */}
                {showBuySell && (
                  <div className="ml-2 flex items-center gap-1">
                    {isProcessing(script.id) && (
                      <span className="flex items-center">
                        <Spinner />
                      </span>
                    )}
                    <div className="hidden md:flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        className="w-8 h-8 flex items-center justify-center rounded bg-button-blue active:bg-blue-300 !text-white shadow cursor-pointer"
                        title="Buy"
                        onClick={(e) => handleBuy(script, e)}
                      >
                        <BuyIcon />
                      </button>
                      <button
                        className="w-8 h-8 flex items-center justify-center rounded bg-red-600 !text-white active:bg-red-500 shadow cursor-pointer"
                        title="Sell"
                        onClick={(e) => handleSell(script, e)}
                      >
                        <SellIcon />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default ScriptsSearchWidget;
