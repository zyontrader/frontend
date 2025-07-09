import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Button } from 'antd';
import { addWatchlist } from '../../api/apis';
import { showErrorToast } from '../../utils/utils';
import WatchlistWidget from './WatchlistWidget';
import * as watchlistsStore from '../../store/watchlistsStore';
import eventBus, { EVENT_TYPES } from '../../utils/eventBus';

const BoldPlusIcon = () => (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none">
        <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
);

const WatchlistsWidget = () => {
    const [watchlists, setWatchlists] = useState(() => watchlistsStore.getWatchlists());
    const [selectedWatchlistId, setSelectedWatchlistId] = useState(() => watchlistsStore.getSelectedWatchlistId());
    const [adding, setAdding] = useState(false);
    const [newName, setNewName] = useState('');
    const addContainerRef = useRef(null);

    useEffect(() => {
        const unsubscribeWatchlists = eventBus.on(EVENT_TYPES.WATCHLISTS_UPDATE, () => {
            setWatchlists(watchlistsStore.getWatchlists());
        });
        const unsubscribeSelected = eventBus.on(EVENT_TYPES.WATCHLIST_SELECTED, () => {
            setSelectedWatchlistId(watchlistsStore.getSelectedWatchlistId());
        });
        setWatchlists(watchlistsStore.getWatchlists());
        setSelectedWatchlistId(watchlistsStore.getSelectedWatchlistId());
        return () => {
            if (typeof unsubscribeWatchlists === 'function') unsubscribeWatchlists();
            if (typeof unsubscribeSelected === 'function') unsubscribeSelected();
        };
    }, []);

    const handleSelectWatchlist = (watchlistId) => {
        watchlistsStore.setSelectedWatchlistId(watchlistId);
    };

    const handleAddWatchlist = () => {
        setAdding(true);
        setNewName('');
    };

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        if (!newName.trim()) return;
        try {
            const res = await addWatchlist(newName.trim());
            if (res && res.watchlistId) {
                watchlistsStore.setSelectedWatchlistId(res.watchlistId);
            }
        } catch (err) {
            showErrorToast(err.message || 'Could not add watchlist');
        }
        setAdding(false);
        setNewName('');
    };

    // Click outside to close add input
    useEffect(() => {
        if (!adding) return;
        function handleClickOutside(e) {
            if (addContainerRef.current && !addContainerRef.current.contains(e.target)) {
                setAdding(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [adding]);

    const selectedWatchlist = useMemo(() => {
        return watchlists.find(wl => wl.watchlistId === selectedWatchlistId) || null;
    }, [selectedWatchlistId, watchlists]);

    return (
        <>
            <div className="flex-1 flex overflow-y-auto pr-3">
                <WatchlistWidget watchlist={selectedWatchlist} />
            </div>
            <div className="mt-4 flex items-center gap-2" ref={addContainerRef}>
                {watchlists.map(wl => (
                    <button
                        key={wl.watchlistId}
                        className={`px-4 py-1 rounded ${wl.watchlistId === selectedWatchlistId ? 'bg-blue-700 text-white' : 'bg-dark-bg-2 text-gray-300'}`}
                        onClick={() => handleSelectWatchlist(wl.watchlistId)}
                    >
                        {wl.watchlistName}
                    </button>
                ))}
                {watchlists.length < 3 && !adding && (
                    <Button type="dashed" shape="square" icon={<BoldPlusIcon />} onClick={handleAddWatchlist} />
                )}
                {adding && (
                    <form onSubmit={handleAddSubmit} className="flex items-center gap-2">
                        <input
                            type="text"
                            className="px-2 py-1 rounded border border-neutral-600 bg-neutral-800 text-white outline-none focus:border-blue-700"
                            placeholder="Watchlist name"
                            value={newName}
                            autoFocus
                            onChange={e => setNewName(e.target.value)}
                        />
                        <button
                            type="submit"
                            className="px-3 py-1 rounded bg-blue-700 text-white font-bold hover:bg-blue-800"
                        >
                            Add
                        </button>
                    </form>
                )}
            </div>
        </>
    );
};

export default WatchlistsWidget; 