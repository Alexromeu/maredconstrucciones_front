const URL =
  import.meta.env.VITE_API_URL ||
  "https://maredconstrucciones-back.onrender.com";

export default function convert_url(endpoint = "") {
  return `${URL}${endpoint}`;
}
