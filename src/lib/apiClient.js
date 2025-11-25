const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";
const debug = process.env.NODE_ENV === 'development';

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

export async function apiUpload(path, formData) {
    const url = buildUrl(path);
    let res;

    console.log('=== File Upload Debug ===');
    console.log('Upload URL:', url);
    console.log('FormData entries:');

    for (let [key, value] of formData.entries()) {
        if (value instanceof File) {
            console.log(`- ${key}:`, {
                name: value.name,
                type: value.type,
                size: value.size,
                lastModified: new Date(value.lastModified).toISOString()
            });
        } else {
            console.log(`- ${key}:`, value);
        }
    }

    try {
        console.log('Sending upload request...');
        const startTime = Date.now();

        res = await fetch(url, {
            method: 'POST',
            credentials: 'include',
            body: formData,
            // Не устанавливаем Content-Type - браузер сам установит с boundary
        });

        const endTime = Date.now();
        console.log(`Request completed in ${endTime - startTime}ms`);
        console.log('Response status:', res.status, res.statusText);

        // Обработка 401 и refresh token
        if (res.status === 401) {
            try {
                console.log('Attempting token refresh...');
                await authRequest('/refresh', {});
                console.log('Token refreshed, retrying upload...');

                res = await fetch(url, {
                    method: 'POST',
                    credentials: 'include',
                    body: formData,
                });

                console.log('Retry response status:', res.status, res.statusText);
            } catch (error) {
                console.error('Failed to refresh token:', error);
                throw new Error('Authentication failed');
            }
        }

        if (!res.ok) {
            let errorMessage = `Upload failed: ${res.status} ${res.statusText}`;

            try {
                const errorText = await res.text();
                console.log('Raw error response:', errorText);

                if (errorText) {
                    try {
                        const errorData = JSON.parse(errorText);
                        errorMessage = errorData.message || errorData.error || errorMessage;
                    } catch {
                        errorMessage = errorText || errorMessage;
                    }
                }
            } catch (e) {
                console.error('Error reading error response:', e);
            }

            throw new Error(errorMessage);
        }

        return handleJsonResponse(res);
    } catch (error) {
        console.error('Error in apiUpload:', error);
        throw error;
    }
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
