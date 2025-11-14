import axios from "axios";
const BACKEND = process.env.REACT_APP_BACKEND || "http://localhost:5000";
export function uploadFile(file, onUploadProgress){
  const data = new FormData();
  data.append("file", file);
  return axios.post(`${BACKEND}/api/upload`, data, {
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress
  }).then(r=>r.data);
}
