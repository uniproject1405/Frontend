/*
  تنها جایی که توکن و کاربر در مرورگر ذخیره/خوانده/پاک می‌شود.
  «مرا به خاطر بسپار» → localStorage، در غیر این صورت sessionStorage (تا بستن تب).
*/
const stores = () => [localStorage, sessionStorage];

export function getToken() {
  return localStorage.getItem("token") || sessionStorage.getItem("token");
}

export function readStored() {
  const store = localStorage.getItem("token") ? localStorage : sessionStorage;
  let user = null;
  try {
    user = JSON.parse(store.getItem("user"));
  } catch {
    /* نامعتبر */
  }
  return { token: store.getItem("token"), user };
}

export function saveStored({ token, user }, remember = true) {
  clearStored();
  const store = remember ? localStorage : sessionStorage;
  store.setItem("token", token);
  store.setItem("user", JSON.stringify(user));
}

export function clearStored() {
  for (const store of stores()) {
    store.removeItem("token");
    store.removeItem("user");
  }
}
