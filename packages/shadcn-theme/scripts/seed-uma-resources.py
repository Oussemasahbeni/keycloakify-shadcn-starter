"""
Seed UMA (User-Managed Access) data into the local dev Keycloak so the account
console's "Resources" page has something to show.

Creates (idempotently):
  - users alice / bob (password: password123)
  - confidential clients photo-app / docs-app with Authorization Services on
  - resources owned by testuser (9 -> spans two pages at 5/page), some shared
    with alice / bob, with pending permission requests from them
  - resources owned by alice / bob shared with testuser ("Shared with me" tab)

Run while `keycloakify start-keycloak` is up:  python scripts/seed-uma-resources.py
The dev container is ephemeral, so re-run after every Keycloak restart.
"""

import json
import urllib.error
import urllib.parse
import urllib.request

BASE = "http://localhost:8080"
REALM = "myrealm"
ADMIN = ("admin", "admin")
PASSWORD = "password123"
OWNER = "testuser"

USERS = [
    ("alice", "Alice", "Martin", "alice@example.com"),
    ("bob", "Bob", "Chen", "bob@example.com"),
]
CLIENTS = [
    ("photo-app", "Photo Album"),
    ("docs-app", "Document Vault"),
]
SCOPES = ["view", "edit", "delete"]

# (client, name, type, scopes)  -- owned by testuser
OWN_RESOURCES = [
    ("photo-app", "Summer holidays 2025", "album", SCOPES),
    ("photo-app", "Family portraits", "album", SCOPES),
    ("photo-app", "Conference talks", "album", ["view", "edit"]),
    ("photo-app", "Screenshots", "album", ["view"]),
    ("photo-app", "Very long album name to check how the table wraps on narrow viewports", "album", SCOPES),
    ("photo-app", "Archive 2019", "album", SCOPES),
    ("photo-app", "Archive 2020", "album", SCOPES),
    ("docs-app", "Tax return 2025", "document", ["view", "edit"]),
    ("docs-app", "Lease agreement", "document", SCOPES),
]
# resource name -> [(username, scopes)]   -- shares granted by testuser
OWN_SHARES = {
    "Summer holidays 2025": [("alice", ["view"])],
    "Family portraits": [("alice", ["view", "edit"]), ("bob", ["view"])],
    "Conference talks": [("bob", ["view", "edit"])],
    "Tax return 2025": [("alice", ["view", "edit"])],
}
# (requester, resource name, scopes)   -- pending permission requests to testuser
REQUESTS = [
    ("bob", "Summer holidays 2025", ["edit"]),
    ("alice", "Lease agreement", ["view"]),
    ("bob", "Lease agreement", ["view", "delete"]),
]
# (owner, client, name, type, scopes, scopes shared with testuser)
OTHERS_RESOURCES = [
    ("alice", "photo-app", "Alice wedding", "album", SCOPES, ["view"]),
    ("alice", "docs-app", "Shared budget", "document", ["view", "edit"], ["view", "edit"]),
    ("bob", "photo-app", "Bob hiking trip", "album", SCOPES, ["view", "edit", "delete"]),
]


def http(method, url, body=None, token=None, form=False, ok=(200, 201, 204)):
    headers = {"Accept": "application/json"}
    data = None
    if body is not None:
        if form:
            data = urllib.parse.urlencode(body).encode()
            headers["Content-Type"] = "application/x-www-form-urlencoded"
        else:
            data = json.dumps(body).encode()
            headers["Content-Type"] = "application/json"
    if token:
        headers["Authorization"] = f"Bearer {token}"
    req = urllib.request.Request(url, data=data, method=method, headers=headers)
    try:
        with urllib.request.urlopen(req) as res:
            raw = res.read()
            return res.status, (json.loads(raw) if raw else None), res.headers
    except urllib.error.HTTPError as e:
        raw = e.read()
        try:
            payload = json.loads(raw)
        except Exception:
            payload = raw.decode(errors="replace")
        if e.code in ok:
            return e.code, payload, e.headers
        raise RuntimeError(f"{method} {url} -> {e.code}: {payload}") from None


def token(realm, client_id, secret=None, username=None, password=None):
    form = {"client_id": client_id}
    if secret:
        form["client_secret"] = secret
    if username:
        form.update(grant_type="password", username=username, password=password)
    else:
        form["grant_type"] = "client_credentials"
    _, body, _ = http("POST", f"{BASE}/realms/{realm}/protocol/openid-connect/token", form, form=True)
    return body["access_token"]


admin_token = token("master", "admin-cli", username=ADMIN[0], password=ADMIN[1])
ADMIN_URL = f"{BASE}/admin/realms/{REALM}"


def admin(method, path, body=None, **kw):
    return http(method, f"{ADMIN_URL}{path}", body, token=admin_token, **kw)


# --- realm -----------------------------------------------------------------
_, realm, _ = admin("GET", "")
if not realm.get("userManagedAccessAllowed"):
    admin("PUT", "", {**realm, "userManagedAccessAllowed": True})
    print("realm: enabled user-managed access")

# --- users -----------------------------------------------------------------
user_ids = {}
for username, first, last, email in [(OWNER, None, None, None), *USERS]:
    _, found, _ = admin("GET", f"/users?username={username}&exact=true")
    if found:
        user_ids[username] = found[0]["id"]
        if username != OWNER and found[0].get("requiredActions"):
            # the realm stamps TERMS_AND_CONDITIONS on new users, which blocks the password grant
            admin("PUT", f"/users/{found[0]['id']}", {"requiredActions": []})
        continue
    _, _, headers = admin(
        "POST",
        "/users",
        {
            "username": username,
            "firstName": first,
            "lastName": last,
            "email": email,
            "enabled": True,
            "emailVerified": True,
            # the realm's user profile marks favourite_pet as required (cat | dog | bird)
            "attributes": {"favourite_pet": ["dog"]},
            "credentials": [{"type": "password", "value": PASSWORD, "temporary": False}],
        },
    )
    user_ids[username] = headers["Location"].rsplit("/", 1)[-1]
    admin("PUT", f"/users/{user_ids[username]}", {"requiredActions": []})
    print(f"user: created {username}")

# --- clients ---------------------------------------------------------------
clients = {}  # clientId -> (uuid, secret)
for client_id, name in CLIENTS:
    _, found, _ = admin("GET", f"/clients?clientId={client_id}")
    if not found:
        admin(
            "POST",
            "/clients",
            {
                "clientId": client_id,
                "name": name,
                "enabled": True,
                "publicClient": False,
                "protocol": "openid-connect",
                "serviceAccountsEnabled": True,
                "authorizationServicesEnabled": True,
                "directAccessGrantsEnabled": True,
                "standardFlowEnabled": True,
                "rootUrl": f"{BASE}/{client_id}",
                # absolute on purpose: the account resources API returns baseUrl unresolved
                "baseUrl": f"{BASE}/{client_id}/",
                "redirectUris": ["/*"],
            },
        )
        _, found, _ = admin("GET", f"/clients?clientId={client_id}")
        print(f"client: created {client_id}")
    uuid = found[0]["id"]
    wanted = {"baseUrl": f"{BASE}/{client_id}/", "authorizationServicesEnabled": True}
    if any(found[0].get(k) != v for k, v in wanted.items()):
        # always PUT the full representation: a partial one without
        # authorizationServicesEnabled makes Keycloak drop the whole resource server
        admin("PUT", f"/clients/{uuid}", {**found[0], **wanted})
        print(f"client: updated {client_id} ({', '.join(wanted)})")
    _, secret, _ = admin("GET", f"/clients/{uuid}/client-secret")
    clients[client_id] = (uuid, secret["value"])


# --- resources -------------------------------------------------------------
def ensure_resource(client_id, owner, name, rtype, scopes):
    uuid, _ = clients[client_id]
    _, found, _ = admin(
        "GET",
        f"/clients/{uuid}/authz/resource-server/resource?name={urllib.parse.quote(name)}&exactName=true",
    )
    found = [r for r in found if r.get("owner", {}).get("id") == user_ids[owner]]
    if found:
        return found[0]["_id"]
    _, created, _ = admin(
        "POST",
        f"/clients/{uuid}/authz/resource-server/resource",
        {
            "name": name,
            "displayName": name,
            "type": f"urn:{client_id}:resources:{rtype}",
            "ownerManagedAccess": True,
            "owner": {"id": user_ids[owner]},
            "scopes": [{"name": s} for s in scopes],
            "uris": [f"/{rtype}s/{urllib.parse.quote(name)}"],
        },
    )
    print(f"resource: created '{name}' ({client_id}, owner {owner})")
    return created["_id"]


resource_ids = {}
for client_id, name, rtype, scopes in OWN_RESOURCES:
    resource_ids[(OWNER, name)] = ensure_resource(client_id, OWNER, name, rtype, scopes)
for owner, client_id, name, rtype, scopes, _ in OTHERS_RESOURCES:
    resource_ids[(owner, name)] = ensure_resource(client_id, owner, name, rtype, scopes)


# --- shares (same call the account console makes) ---------------------------
def share(owner, name, grants):
    # any client with direct-access grants works; the token gets the `account` audience via default roles
    user_token = token(REALM, "photo-app", clients["photo-app"][1], owner, PASSWORD)
    http(
        "PUT",
        f"{BASE}/realms/{REALM}/account/resources/{resource_ids[(owner, name)]}/permissions",
        [{"username": u, "scopes": s} for u, s in grants],
        token=user_token,
    )
    print(f"share: {owner}/'{name}' -> " + ", ".join(f"{u}:{'+'.join(s)}" for u, s in grants))


for name, grants in OWN_SHARES.items():
    share(OWNER, name, grants)
for owner, _, name, _, _, scopes in OTHERS_RESOURCES:
    share(owner, name, [(OWNER, scopes)])


# --- pending permission requests (UMA ticket flow with submit_request) -------
def request_access(requester, name, scopes):
    client_id = next(c for c, n, *_ in OWN_RESOURCES if n == name)
    _, secret = clients[client_id]
    pat = token(REALM, client_id, secret)
    _, ticket, _ = http(
        "POST",
        f"{BASE}/realms/{REALM}/authz/protection/permission",
        [{"resource_id": resource_ids[(OWNER, name)], "resource_scopes": scopes}],
        token=pat,
    )
    requester_token = token(REALM, client_id, secret, requester, PASSWORD)
    status, body, _ = http(
        "POST",
        f"{BASE}/realms/{REALM}/protocol/openid-connect/token",
        {
            "grant_type": "urn:ietf:params:oauth:grant-type:uma-ticket",
            "ticket": ticket["ticket"],
            "submit_request": "true",
            "client_id": client_id,
            "client_secret": secret,
        },
        token=requester_token,
        form=True,
        ok=(200, 403),
    )
    outcome = "already granted" if status == 200 else body.get("error", body)
    print(f"request: {requester} asks {'+'.join(scopes)} on '{name}' -> {outcome}")


for requester, name, scopes in REQUESTS:
    request_access(requester, name, scopes)

# --- summary as seen by the account console ---------------------------------
owner_token = token(REALM, "photo-app", clients["photo-app"][1], OWNER, PASSWORD)
_, mine, _ = http("GET", f"{BASE}/realms/{REALM}/account/resources?first=0&max=50", token=owner_token)
_, shared, _ = http(
    "GET", f"{BASE}/realms/{REALM}/account/resources/shared-with-me?first=0&max=50", token=owner_token
)
print(f"\n{OWNER}: {len(mine)} own resources, {len(shared)} shared with me")
print(f"Login: {BASE}/realms/{REALM}/account/#/resources  (testuser / alice / bob, password {PASSWORD})")
