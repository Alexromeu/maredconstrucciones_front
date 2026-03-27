const URL = "http://localhost:3000";

export default function convert_url(endpoint = "") {
    return `${URL}${endpoint}`;
}