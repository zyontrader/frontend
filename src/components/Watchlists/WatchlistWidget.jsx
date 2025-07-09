import React, { useState, useEffect } from 'react';
import WatchlistItemWidget from './WatchlistItemWidget';
import ScriptsSearchWidget from '../Common/ScriptsSearchWidget';
import { addItemToWatchlist, deleteWatchlistItem } from '../../api/apis';
import { showErrorToast } from '../../utils/utils';

const WatchlistEmptyState = () => (
  <div className="text-gray-400 flex flex-1 text-lg justify-center italic self-stretch items-center p-4">No watchlist selected.</div>
);

const WatchlistItemsList = ({ watchlist }) => {
  const [processingScriptIds, setProcessingScriptIds] = useState(new Set());
  const [localItems, setLocalItems] = useState(watchlist.watchlistItems);

  useEffect(() => {
    setLocalItems(watchlist.watchlistItems);
  }, [watchlist.watchlistItems]);

  const handleScriptSelected = async (scriptId) => {
    setProcessingScriptIds(prev => new Set(prev).add(scriptId));
    try {
      await addItemToWatchlist(watchlist.watchlistId, scriptId);
    } catch (err) {
      showErrorToast(err.message || 'Could not add item to watchlist');
    }

    setProcessingScriptIds(prev => {
      const next = new Set(prev);
      next.delete(scriptId);
      return next;
    });
    return false;
  };

  const handleDelete = (scriptId) => {
    setLocalItems(items => items.filter(item => item.scriptId !== scriptId));
    deleteWatchlistItem({ watchlistId: watchlist.watchlistId, scriptId });
  };

  return (
    <div className="flex flex-col flex-1">
      <ScriptsSearchWidget onScriptSelected={handleScriptSelected} showBuySell={true} processingScriptIds={processingScriptIds} />
      <div className="flex flex-col gap-2">
        {localItems.map(item => (
          <WatchlistItemWidget
            key={item.itemId}
            scriptId={item.scriptId}
            onDelete={() => handleDelete(item.scriptId)}
          />
        ))}
      </div>
    </div>
  );
};

const WatchlistWidget = ({ watchlist }) => {
  if (!watchlist) {
    return <WatchlistEmptyState />;
  }
  return <WatchlistItemsList watchlist={watchlist} />;
};

export default WatchlistWidget; 