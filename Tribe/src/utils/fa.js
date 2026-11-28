// Persian digits for numbers, e.g. 3 -> ۳
export const fa = n => Number(n).toLocaleString('fa-IR', { useGrouping: false });

// Badge count in Persian digits, capped like MUI's max={99}
export const faCount = n => (n > 99 ? '+۹۹' : fa(n));
