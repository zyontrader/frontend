import { submitOrders } from '../api/apis';
import { setLiveOrders } from '../store/ordersStore';

// Utility functions for order operations

/**
 * Repeats the given order by placing a new order with the same parameters.
 * @param {Object} order - The original order object.
 */
export function repeatOrder(order) {
  const orderUpdationData = {
    scriptId: order.scriptId,
    orderType: order.orderType,
    legType: order.legType,
    orderQuantity: Math.abs(order.orderQuantity) || 0,
    limitPrice: order.kind !== 'MARKET' ? (order.limitPrice || 0) : 0,
    triggerPrice: order.kind !== 'MARKET' ? (order.triggerPrice || 0) : 0,
    kind: order.kind,
  };
  submitOrders([orderUpdationData]);
}

/**
 * Reverses (undoes) the given order by placing a new order with reversed parameters.
 * @param {Object} order - The original order object.
 */
export function reverseOrder(order) {
  const orderUpdationData = {
    scriptId: order.scriptId,
    orderType: order.orderType === 'BUY' ? 'SELL' : 'BUY',
    legType: order.legType === 'OPEN' ? 'CLOSE' : 'OPEN',
    orderQuantity: Math.abs(order.orderQuantity) || 0,
    limitPrice: order.kind !== 'MARKET' ? (order.limitPrice || 0) : 0,
    triggerPrice: order.kind !== 'MARKET' ? (order.triggerPrice || 0) : 0,
    kind: order.kind,
  };
  submitOrders([orderUpdationData]);
}

export function placeMultiple(orders) {
  setLiveOrders(orders);
  return submitOrders(orders, (response) => {
    const orderStatus = response.orderStatus || [];
    let shouldDismiss = true;
    const orderWithStatus = orderStatus.map((os) => {
      const order = os.order;
      order.success = !!os?.operationStatus?.success;
      if (!order.success) {
        shouldDismiss = false;
      }
      return order;
    });
    
    setLiveOrders(orderWithStatus);
    if (shouldDismiss) {
      window.setTimeout(() => {
        setLiveOrders([]);
      }, 5000);
    }
  });
}

/**
 * Places all orders in a basket object as a basket order (BUYs first, SELLs after).
 * @param {Object} basket - The basket object containing basketOrders.
 * @returns {Promise} - The result of orderBasket.
 */
export function orderBasket(basket) {
  let orders = [];
  for (let i = 0; i < basket.basketOrders.length; i++) {
    const bo = { ...basket.basketOrders[i] };
    delete bo.success;
    const orderData = {
      scriptId: bo.scriptId,
      orderType: !!bo.isBuy ? "BUY" : "SELL",
      legType: "OPEN",
      orderQuantity: Math.abs(bo.quantity) || 0,
      limitPrice: 0,
      triggerPrice: 0,
      kind: "MARKET"
    };
    if (bo.isBuy) {
      orders = [orderData, ...orders];
    } else {
      orders.push(orderData);
    }
  }
  return placeMultiple(orders);
}

/**
 * Places SELL orders for all items in a basket object.
 * @param {Object} basket - The basket object containing basketOrders.
 * @returns {Promise} - The result of submitOrders.
 */
export function exitBasket(basket) {
  let orders = [];
  for (let i = 0; i < basket.basketOrders.length; i++) {
    const bo = { ...basket.basketOrders[i] };
    const orderData = {
      scriptId: bo.scriptId,
      orderType: !bo.isBuy ? "BUY" : "SELL",
      legType: "CLOSE",
      orderQuantity: Math.abs(bo.quantity) || 0,
      limitPrice: 0,
      triggerPrice: 0,
      kind: "MARKET"
    };
    if (!bo.isBuy) {
      orders = [orderData, ...orders];
    } else {
      orders.push(orderData);
    }
  }
  return placeMultiple(orders);
}
