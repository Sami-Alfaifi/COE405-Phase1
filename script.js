import http from "k6/http";
import { check, sleep } from "k6";

export default function () {
  const data = {
    _id: "645f9d5a1ea1c816d5e68230",
    name: "xxxxxxxxxxxxxxxx",
    from: "password",
    to: "xxxxxxxxxxxx",
    date: "xxxxxxx",
    riders: [],
  };
  let res = http.del("https://ms1-yvaqtnmqaq-uc.a.run.app/delete", data);

  check(res, { done: (r) => r.status === 200 });

  sleep(0.3);
}
