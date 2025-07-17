// generic api client for the app
export async function api<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
    const res = await fetch(input, {
        ...init,
    })
    if (!res.ok) throw new Error(`HTTP error! ${res.status}`)
    return res.json()
}