export function formatPrice(value) {
  if (value === null || value === undefined || isNaN(value)) {
    return '--';
  }
  return Number(value).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function formatTime(ms) {
  const date = new Date(ms);
  let h = date.getHours();
  const m = date.getMinutes();
  const s = date.getSeconds();
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12;
  h = h ? h : 12;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')} ${ampm}`;
}

export function formatDateTimeDDMMYYHHmm(ms) {
  if (!ms) return '';
  const date = new Date(ms);
  const dd = String(date.getDate()).padStart(2, '0');
  const MM = String(date.getMonth() + 1).padStart(2, '0');
  const yy = String(date.getFullYear()).slice(-2);
  const HH = String(date.getHours()).padStart(2, '0');
  const mm = String(date.getMinutes()).padStart(2, '0');
  return `${dd}/${MM}/${yy} ${HH}:${mm}`;
} 