/**
 * BizBuilt Cloud — optional Google Sign-In + API sync.
 * Loads when BIZBUILT_CONFIG.apiUrl is set.
 */
(function (global) {
  var TOKEN_KEY = "bizbuilt-cloud-token";
  var cfg = global.BIZBUILT_CONFIG || {};
  var apiUrl = (cfg.apiUrl || "").replace(/\/$/, "");
  var state = {
    enabled: Boolean(apiUrl),
    connected: false,
    user: null,
    company: null,
    googleClientId: cfg.googleClientId || "",
    saveTimer: null,
  };

  function headers() {
    var h = { "Content-Type": "application/json" };
    var token = sessionStorage.getItem(TOKEN_KEY);
    if (token) h.Authorization = "Bearer " + token;
    return h;
  }

  function apiFetch(path, opts) {
    return fetch(apiUrl + path, opts).then(function (res) {
      return res.json().then(function (body) {
        if (!res.ok) throw new Error(body.error || "Request failed");
        return body;
      });
    });
  }

  function isEnabled() {
    return state.enabled;
  }

  function isConnected() {
    return state.connected && Boolean(sessionStorage.getItem(TOKEN_KEY));
  }

  function getUser() {
    return state.user;
  }

  function getCompany() {
    return state.company;
  }

  function setConnected(payload) {
    sessionStorage.setItem(TOKEN_KEY, payload.token);
    state.user = payload.user;
    state.company = payload.company;
    state.connected = true;
  }

  function signOut() {
    sessionStorage.removeItem(TOKEN_KEY);
    state.user = null;
    state.company = null;
    state.connected = false;
  }

  function init() {
    if (!state.enabled) {
      return Promise.resolve(null);
    }

    return apiFetch("/api/config")
      .then(function (config) {
        if (config.googleClientId) state.googleClientId = config.googleClientId;
        var token = sessionStorage.getItem(TOKEN_KEY);
        if (!token) return null;
        return apiFetch("/api/me", { headers: headers() })
          .then(function (me) {
            state.user = { email: me.email, name: me.name, picture: "" };
            state.company = me.company;
            state.connected = true;
            return loadData();
          })
          .catch(function () {
            signOut();
            return null;
          });
      })
      .catch(function () {
        return null;
      });
  }

  function loadData() {
    if (!isConnected()) return Promise.resolve(null);
    return apiFetch("/api/data", { headers: headers() }).then(function (res) {
      return res.data;
    });
  }

  function saveData(data) {
    if (!isConnected()) return Promise.resolve();
    clearTimeout(state.saveTimer);
    state.saveTimer = setTimeout(function () {
      apiFetch("/api/data", {
        method: "PUT",
        headers: headers(),
        body: JSON.stringify({ data: data }),
      }).catch(function (err) {
        console.warn("BizBuilt cloud save failed:", err.message);
      });
    }, 400);
    return Promise.resolve();
  }

  function handleGoogleCredential(response) {
    return apiFetch("/api/auth/google", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ credential: response.credential }),
    }).then(function (payload) {
      setConnected(payload);
      return loadData();
    });
  }

  function mountSignIn(container) {
    if (!container || !state.enabled) return;
    if (isConnected() && state.user) {
      container.innerHTML =
        '<div class="bb-cloud-user">' +
        (state.user.picture ? '<img src="' + state.user.picture + '" alt="">' : "") +
        "<span><strong>" + esc(state.user.name) + "</strong><br><small>" + esc(state.user.email) + "</small></span>" +
        '<button type="button" class="bb-btn" id="bb-cloud-signout">Sign out</button></div>';
      var btn = document.getElementById("bb-cloud-signout");
      if (btn) btn.onclick = function () {
        signOut();
        global.location.reload();
      };
      return;
    }

    if (!state.googleClientId) {
      container.innerHTML = '<div class="bb-cloud-banner warn">Cloud API configured but Google Client ID missing. Set GOOGLE_CLIENT_ID on server &amp; bizbuilt-config.js.</div>';
      return;
    }

    container.innerHTML = '<div id="bb-google-btn"></div>';
    if (typeof google === "undefined" || !google.accounts) {
      container.innerHTML += '<p style="font-size:13px;margin:8px 0 0">Loading Google Sign-In…</p>';
      setTimeout(function () { mountSignIn(container); }, 500);
      return;
    }

    google.accounts.id.initialize({
      client_id: state.googleClientId,
      callback: function (res) {
        handleGoogleCredential(res).then(function (data) {
          if (global.BizBuiltApp && global.BizBuiltApp.onCloudLogin) {
            global.BizBuiltApp.onCloudLogin(data);
          } else {
            global.location.reload();
          }
        }).catch(function (err) {
          alert(err.message || "Sign-in failed");
        });
      },
    });
    google.accounts.id.renderButton(document.getElementById("bb-google-btn"), {
      theme: "outline",
      size: "medium",
      text: "signin_with",
      shape: "rectangular",
    });
  }

  function renderBanner(container) {
    if (!container || !state.enabled) return;
    if (isConnected()) {
      container.className = "bb-cloud-banner ok";
      container.innerHTML = "☁️ Connected to <strong>" + esc((state.company && state.company.name) || "your cloud") + "</strong> — data saved securely in your database.";
    } else {
      container.className = "bb-cloud-banner warn";
      container.innerHTML = "☁️ Cloud mode — sign in with Google to load &amp; save your company data.";
    }
  }

  function esc(s) {
    var d = document.createElement("div");
    d.textContent = s == null ? "" : String(s);
    return d.innerHTML;
  }

  global.BizBuiltCloud = {
    isEnabled: isEnabled,
    isConnected: isConnected,
    getUser: getUser,
    getCompany: getCompany,
    init: init,
    loadData: loadData,
    saveData: saveData,
    mountSignIn: mountSignIn,
    renderBanner: renderBanner,
    signOut: signOut,
    apiUrl: apiUrl,
  };
})(window);
