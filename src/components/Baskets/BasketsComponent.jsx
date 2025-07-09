import React, { useEffect, useState } from 'react';
import { Spin, Card } from 'antd';
import { getBaskets, updateBasket, deleteBasket } from '../../api/apis';
import { DeleteOutlined, LineChartOutlined, EditOutlined } from '@ant-design/icons';

import BasketOrderItemWidget from './BasketOrderItemWidget';
import ScriptsSearchWidget from '../Common/ScriptsSearchWidget';
import { getScript } from '../../store/scriptsStore';
import { showErrorToast } from '../../utils/utils';
import OptionsAnalyticsPopup from '../OptionsAnalytics/OptionsAnalyticsPopup';
import ConfirmDialog from '../Common/ConfirmDialog';
import { orderBasket, exitBasket } from '../../utils/order_utils';

const BasketsComponent = () => {
  const [baskets, setBaskets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [editBasketId, setEditBasketId] = useState(null);
  const [editOrders, setEditOrders] = useState({});
  const [showAnalyticsPopup, setShowAnalyticsPopup] = useState(false);
  const [analyticsBasketId, setAnalyticsBasketId] = useState(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [basketToDelete, setBasketToDelete] = useState(null);
  const [addingBasket, setAddingBasket] = useState(false);
  const [newBasketName, setNewBasketName] = useState("");

  useEffect(() => {
    setLoading(true);
    setError(false);
    getBaskets()
      .then(res => {
        setBaskets(res.baskets || []);
      })
      .catch(err => {
        setError(true);
      })
      .finally(() => setLoading(false));
  }, []);

  // Handlers (placeholders)
  const handleAnalyse = (basket) => {
    setAnalyticsBasketId(basket.basketId);
    setShowAnalyticsPopup(true);
  };
  const handleEdit = (basket) => {
    setEditOrders(
      Object.fromEntries(
        (basket.basketOrders || []).map(order => [
          order.basketItemId,
          { ...order, tempId: order.basketItemId }
        ])
      )
    );
    setEditBasketId(basket.basketId);
  };
  const handleOrderChange = (basketItemId, field, value) => {
    setEditOrders(prev => ({
      ...prev,
      [basketItemId]: {
        ...prev[basketItemId],
        [field]: value,
      },
    }));
  };
  const handleOrderDelete = (basketItemId) => {
    setEditOrders(prev => {
      const copy = { ...prev };
      delete copy[basketItemId];
      return copy;
    });
  };
  const handleEditCancel = () => {
    setEditBasketId(null);
    setEditOrders({});
  };

  const handleEditSave = async () => {
    const basket = baskets.find(b => b.basketId === editBasketId);
    if (!basket) return;
    const basketOrders = Object.values(editOrders).map(({ tempId, ...order }) => order);
    try {
      const res = await updateBasket({
        basketId: basket.basketId,
        basketName: basket.basketName,
        basketOrders,
      });
      setBaskets(res.baskets || []);
      setEditBasketId(null);
    } catch (err) {
      showErrorToast("Unable to update basket. Please try again later.");
    }
  };

  const handleDelete = (basketId) => {
    setBasketToDelete(basketId);
    setConfirmDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const res = await deleteBasket(basketToDelete);
      setBaskets(res.baskets || []);
    } catch (err) {
      showErrorToast('Unable to delete basket. Please try again later.');
    }
    setConfirmDeleteOpen(false);
    setBasketToDelete(null);
  };

  return (
    <div className="w-full bg-dark-bg mt-2flex flex-col flex-1 overflow-y-auto pr-4 pl-2">
      <div className="flex items-center justify-between mb-3">
        <h1 className="text-lg font-semibold text-blue-400">Baskets</h1>
        {addingBasket ? (
          <div className="flex flex-col md:flex-row gap-2 items-end md:items-center">
            <input
              type="text"
              className="px-2 py-1 rounded bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:border-blue-500"
              placeholder="Basket name"
              value={newBasketName}
              onChange={e => setNewBasketName(e.target.value)}
              autoFocus
            />
            <div className="flex gap-2 items-end">
              <button
                className="px-4 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
                onClick={async () => {
                  if (!newBasketName.trim()) return;
                  try {
                    await updateBasket({ basketName: newBasketName.trim() });
                    const res = await getBaskets();
                    setBaskets(res.baskets || []);
                    setAddingBasket(false);
                    setNewBasketName("");
                  } catch (err) {
                    showErrorToast("Unable to add basket. Please try again later.");
                  }
                }}
              >
                Save
              </button>
              <button
                className="px-3 py-2 rounded bg-neutral-600 text-white font-semibold hover:bg-neutral-700 transition"
                onClick={() => { setAddingBasket(false); setNewBasketName(""); }}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            className="px-4 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
            onClick={() => setAddingBasket(true)}
          >
            + Add Basket
          </button>
        )}
      </div>
      {loading ? (
        <div className="flex-1 flex items-center justify-center py-12"><Spin size="large" /></div>
      ) : error ? (
        <div className="flex-1 text-lg flex items-center justify-center py-12 text-red-400">Failed to load baskets. Please try again later.</div>
      ) : baskets.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-lg text-neutral-300 text-center py-12 border-2 border-dashed border-neutral-700 rounded-lg">
          No baskets yet. Create your first basket to get started!
        </div>
      ) : (
        <ul className="grid gap-4">
          {baskets.map(basket => (
            <li key={basket.basketId} className="flex">
              <Card
                title={basket.basketName || `Basket ${basket.basketId}`}
                extra={
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAnalyse(basket)}
                      className="w-8 h-8 flex items-center justify-center rounded bg-orange-500 hover:bg-orange-600 transition border-2 border-orange-400"
                      title="Analyse"
                    >
                      <LineChartOutlined style={{ fontSize: 20, fontWeight: 700, color: 'white', strokeWidth: 3 }} />
                    </button>
                    <button
                      onClick={() => handleEdit(basket)}
                      className="w-8 h-8 flex items-center justify-center rounded bg-blue-600 hover:bg-blue-700 transition border-2 border-blue-500"
                      title="Edit"
                    >
                      <EditOutlined style={{ fontSize: 20, fontWeight: 700, color: 'white', strokeWidth: 3 }} />
                    </button>
                    <button
                      onClick={() => handleDelete(basket.basketId)}
                      className="w-8 h-8 flex items-center justify-center rounded bg-red-600 hover:bg-red-700 transition border-2 border-red-500"
                      title="Delete"
                    >
                      <DeleteOutlined style={{ fontSize: 20, fontWeight: 700, color: 'white', strokeWidth: 3 }} />
                    </button>
                  </div>
                }
                classNames={{ body: '!p-2 flex-1 flex flex-col', header: '!border-none ' }}
                className="bg-dark-bg-2 border-none rounded-lg shadow flex-1 flex flex-col"
              >
                {(basket.basketOrders && basket.basketOrders.length > 0) || editBasketId === basket.basketId ? (
                  <>
                    {editBasketId === basket.basketId && (
                      <div className="mb-3">
                        <ScriptsSearchWidget
                          showBuySell={true}
                          onScriptSelected={scriptId => {
                            const script = getScript(scriptId);
                            if (!script) return false;
                            // Generate a unique basketItemId (timestamp + scriptId)
                            const tempId = `${scriptId}_${Date.now()}`;
                            setEditOrders(prev => ({
                              ...prev,
                              [tempId]: {
                                tempId,
                                scriptId,
                                isBuy: true,
                                quantity: script.lot || 1,
                              },
                            }));
                            return true; // close search
                          }}
                        />
                      </div>
                    )}
                    <ul className="divide-y divide-neutral-800 flex-1">
                      {(editBasketId === basket.basketId ? Object.values(editOrders) : basket.basketOrders)
                        .map((order, idx) => (
                          <BasketOrderItemWidget
                            key={order.tempId || order.basketItemId}
                            order={order}
                            isEditMode={editBasketId === basket.basketId}
                            onChange={handleOrderChange}
                            onDelete={handleOrderDelete}
                          />
                        ))}
                    </ul>
                    {editBasketId === basket.basketId ? (
                      <div className="flex justify-end gap-3 mt-4">
                        <button onClick={handleEditCancel} className="w-24 py-2 rounded bg-neutral-600 text-white font-semibold hover:bg-neutral-700 transition text-center">Cancel</button>
                        <button onClick={handleEditSave} className="w-24 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition text-center">Save</button>
                      </div>
                    ) : (
                      <div className="flex justify-end gap-3 mt-4">
                        <button
                          className="w-24 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition text-center"
                          onClick={async () => {
                            await orderBasket(basket);
                          }}
                        >
                          Execute
                        </button>
                        <button
                          className="w-24 py-2 rounded bg-red-600 text-white font-semibold hover:bg-red-700 transition text-center"
                          onClick={async () => {
                            await exitBasket(basket);
                          }}
                        >
                          Exit
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-neutral-300 text-center text-base">No orders in this basket.</div>
                )}
              </Card>
            </li>
          ))}
        </ul>
      )}
      <OptionsAnalyticsPopup
        visible={showAnalyticsPopup}
        onClose={() => setShowAnalyticsPopup(false)}
        basketId={analyticsBasketId}
      />
      <ConfirmDialog
        open={confirmDeleteOpen}
        title="Delete Basket"
        message="Are you sure you want to delete this basket? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmDeleteOpen(false)}
      />
    </div>
  );
};

export default BasketsComponent; 