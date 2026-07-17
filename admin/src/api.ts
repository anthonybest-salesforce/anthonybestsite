export interface Me {
  email: string | null;
  admin: boolean;
}

async function request(path: string, options: RequestInit = {}) {
  const res = await fetch(path, {
    ...options,
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
  });
  if (res.status === 401) {
    // Cloudflare Access already gates /admin, so a 401 here means the
    // signed-in account just isn't on the admin allowlist.
    throw new Error("Administrator access required.");
  }
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed: ${res.status}`);
  }
  return res.json();
}

export function getMe(): Promise<Me> {
  return request("/api/me");
}

export function listItems(resource: string, status?: string) {
  const qs = status ? `?status=${encodeURIComponent(status)}` : "";
  return request(`/api/admin/${resource}${qs}`).then((r) => r.items);
}

export function createItem(resource: string, data: Record<string, unknown>) {
  return request(`/api/admin/${resource}`, { method: "POST", body: JSON.stringify(data) }).then((r) => r.item);
}

export function updateItem(resource: string, id: string, patch: Record<string, unknown>) {
  return request(`/api/admin/${resource}/${id}`, { method: "PATCH", body: JSON.stringify(patch) }).then(
    (r) => r.item
  );
}

export function deleteItem(resource: string, id: string) {
  return request(`/api/admin/${resource}/${id}`, { method: "DELETE" });
}
