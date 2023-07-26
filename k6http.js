import http from "k6/http";

export default function () {
  http.post("http://localhost:8000/api/add_room");
}
