import { toast } from 'react-toastify';
import * as scriptsStore from '../store/scriptsStore';

export function showSuccessToast(msg) {
  const SuccessIcon = () => (
    <span style={{
      display: 'flex',
      flex: '0 0 auto',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#6D6',
      color: '#fff',
      borderRadius: '50%',
      width: 24,
      height: 24,
      marginRight: 8
    }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M6 13.5L11 18L18 7" stroke="#fff" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </span>
  );
  toast.info(
    <span style={{ display: 'flex', alignItems: 'center' }}>
      <SuccessIcon /> {msg}
    </span>,
    { className: 'custom-toast-success' }
  );
}

export function showErrorToast(msg) {
  const ErrorIcon = () => (
    <span style={{
      display: 'flex',
      flex: '0 0 auto',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#F66',
      color: '#fff',
      borderRadius: '50%',
      width: 24,
      height: 24,
      marginRight: 8
    }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M7 7L17 17" stroke="#fff" strokeWidth="4.5" strokeLinecap="round"/>
        <path d="M17 7L7 17" stroke="#fff" strokeWidth="4.5" strokeLinecap="round"/>
      </svg>
    </span>
  );
  toast.error(
    <span style={{ display: 'flex', alignItems: 'center' }}>
      <ErrorIcon /> {msg}
    </span>,
    { className: 'custom-toast-error' }
  );
}

// PnL calculation for a position
export function calculatePositionPnL(position, quote) {
  return position.realizedProfit + (position.netQuantity * ((quote?.price || 0) - position.averagePrice));
}

// Checks if a value is null or undefined
export function isNil(value) {
  return value === null || value === undefined;
}

// Creates an editOrder object
export function createEditOrder(scriptId, orderType, legType, qty) {
  if (!scriptId || !scriptsStore.scriptsStore.scripts[scriptId]) {
    return null;
  }
  const script = scriptsStore.scriptsStore.scripts[scriptId];
  const lotSize = script?.lot || 1;
  const orderQuantity = (!qty || qty === 0) ? lotSize : qty;
  const kind = "MARKET"; 
  const limitPrice = 0.0; 
  const triggerPrice = 0.0; 
  const chips = [];

  if (script.type === 'OPTION_STOCK' || script.type === 'OPTION_INDEX') {
    chips.push(lotSize * 10);
    chips.push(lotSize * 20);
    chips.push(lotSize * 25);
  } else {
    chips.push(lotSize * 1);
    chips.push(lotSize * 5);
    chips.push(lotSize * 10);
  }

  return {
    scriptId,
    orderType, // 'BUY' or 'SELL'
    kind, // 'MARKET', 'LIMIT' or 'SL'
    legType, // 'OPEN' or 'CLOSE'
    orderQuantity,
    limitPrice,
    triggerPrice,
    chips,
    lotSize
  };
}

// Show toast for order status
export function showOrderStatusToast(response) {
  const opStatus = response?.orderStatus?.[0]?.operationStatus;
  const isSuccess = opStatus?.success;
  const msg = opStatus?.description || (isSuccess ? 'Success' : 'Failed');
  if (isSuccess) {
    showSuccessToast(msg);
  } else {
    showErrorToast(msg);
  }
} 