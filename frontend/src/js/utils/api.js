
const jsonHeader = new Headers();
jsonHeader.append("Content-Type", "application/json");
   
export const PUT = (url, object) => callApi(url, "PUT", JSON.stringify(object));
export const POST = (url, object) => callApi(url, "POST", JSON.stringify(object));
export const GET = (url) => callApi(url, "GET");
export const DELETE = (url) => callApi(url, "DELETE");

const callApi = (path, method, body) =>
    fetch("/api"+path, {method, body, headers: jsonHeader, credentials: "include"})
    .then(res => {
        if (!res.ok) {
            return res.text().then(message => Promise.reject(message));
        }
        return res;
    });
