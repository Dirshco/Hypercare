import { CONFIG } from "./config.js";

export async function register(username) {
  const res = await fetch(`${CONFIG.API_BASE}/auth/register-challenge`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username })
  });

  const { challenge } = await res.json();

  const credential = await navigator.credentials.create({
    publicKey: {
      challenge: Uint8Array.from(atob(challenge), c => c.charCodeAt(0)),
      rp: { name: "HyperCare" },
      user: {
        id: Uint8Array.from(username, c => c.charCodeAt(0)),
        name: username,
        displayName: username
      },
      pubKeyCredParams: [{ type: "public-key", alg: -7 }]
    }
  });

  await fetch(`${CONFIG.API_BASE}/auth/verify-register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, credential })
  });
}

export async function login(username) {
  const res = await fetch(`${CONFIG.API_BASE}/auth/login-challenge`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username })
  });

  const { challenge } = await res.json();

  const assertion = await navigator.credentials.get({
    publicKey: {
      challenge: Uint8Array.from(atob(challenge), c => c.charCodeAt(0))
    }
  });

  const verify = await fetch(`${CONFIG.API_BASE}/auth/verify-login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, assertion })
  });

  const data = await verify.json();
  localStorage.setItem(CONFIG.JWT_STORAGE_KEY, data.token);
}
