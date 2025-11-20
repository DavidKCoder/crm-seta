const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

export async function authRequest(path, options = {}) {
    const res = await fetch(`${API_BASE_URL}/api/auth${path}`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {}),
        },
        body: options.body ? JSON.stringify(options.body) : undefined,
    });

    let data = null;
    try {
        data = await res.json();
    } catch {
    }

    if (!res.ok) {
        const message = data?.message || data?.error || "Request failed";
        const error = new Error(message);
        error.status = res.status;
        error.data = data;
        throw error;
    }

    return data;
}

function buildUrl(path, params) {
    const url = new URL(`${API_BASE_URL}${path}`);
    if (params && typeof params === "object") {
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== "") {
                url.searchParams.append(key, String(value));
            }
        });
    }
    return url.toString();
}

async function handleJsonResponse(res) {
    let data = null;
    try {
        data = await res.json();
    } catch {
    }

    if (!res.ok) {
        const message = data?.message || data?.error || "Request failed";
        const error = new Error(message);
        error.status = res.status;
        error.data = data;
        throw error;
    }

    return data;
}

export async function apiGet(path, params) {
    const url = buildUrl(path, params);
    let res = await fetch(url, {
        method: "GET",
        credentials: "include",
    });

    if (res.status === 401) {
        try {
            await authRequest("/refresh", {});
            res = await fetch(url, {
                method: "GET",
                credentials: "include",
            });
        } catch {
            // fall through and let handleJsonResponse surface the original 401
        }
    }

    return handleJsonResponse(res);
}

export async function apiPost(path, body) {
    const url = buildUrl(path);
    let res = await fetch(url, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: body ? JSON.stringify(body) : undefined,
    });

    if (res.status === 401) {
        try {
            await authRequest("/refresh", {});
            res = await fetch(url, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: body ? JSON.stringify(body) : undefined,
            });
        } catch {
        }
    }

    return handleJsonResponse(res);
}

export async function apiPut(path, body) {
    const url = buildUrl(path);
    let res = await fetch(url, {
        method: "PUT",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: body ? JSON.stringify(body) : undefined,
    });

    if (res.status === 401) {
        try {
            await authRequest("/refresh", {});
            res = await fetch(url, {
                method: "PUT",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: body ? JSON.stringify(body) : undefined,
            });
        } catch {
        }
    }

    return handleJsonResponse(res);
}

export async function apiDelete(path) {
    const url = buildUrl(path);
    let res = await fetch(url, {
        method: "DELETE",
        credentials: "include",
    });

    if (res.status === 401) {
        try {
            await authRequest("/refresh", {});
            res = await fetch(url, {
                method: "DELETE",
                credentials: "include",
            });
        } catch {
        }
    }

    return handleJsonResponse(res);
}

export async function authGet(path) {
    const res = await fetch(`${API_BASE_URL}/api/auth${path}`, {
        method: "GET",
        credentials: "include",
    });

    let data = null;
    try {
        data = await res.json();
    } catch {
    }

    if (!res.ok) {
        const message = data?.message || data?.error || "Request failed";
        const error = new Error(message);
        error.status = res.status;
        error.data = data;
        throw error;
    }

    return data;
}
