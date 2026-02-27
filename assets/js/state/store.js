const AUTH_KEY = "mts_finance_auth";

const state = {
  auth: loadAuth(),
};

function loadAuth() {
  try {
    const raw = sessionStorage.getItem(AUTH_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (err) {
    return null;
  }
}

function saveAuth(auth) {
  state.auth = auth;
  if (auth) {
    sessionStorage.setItem(AUTH_KEY, JSON.stringify(auth));
  } else {
    sessionStorage.removeItem(AUTH_KEY);
  }
}

function getAuth() {
  return state.auth;
}

export { getAuth, saveAuth };
