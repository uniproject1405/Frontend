import { fa } from './fa';

// ISO date -> «۲ ساعت پیش» / «دیروز» / «۳ روز پیش»
export function timeAgo(iso) {
  const minutes = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
  if (minutes < 1) return 'همین حالا';
  if (minutes < 60) return `${fa(minutes)} دقیقه پیش`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${fa(hours)} ساعت پیش`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'دیروز';
  if (days < 30) return `${fa(days)} روز پیش`;
  return `${fa(Math.floor(days / 30))} ماه پیش`;
}
