import Calendar from "../src";
import "./style/index.scss";

const calendarEl = document.getElementById("calendar");
const resultEl = document.getElementById("result");

const calendar = new Calendar(calendarEl, {
  locale: "en",
  multidate: true,
}).init();

calendar.on("addDate", (data) => {
  const res = document.createElement("div");
  res.innerHTML = `Add date: ${data}`;
  resultEl.append(res);
  resultEl.scrollTo({ behavior: "smooth", top: resultEl.scrollHeight });
});

calendar.on("removeDate", (data) => {
  const res = document.createElement("div");
  res.innerHTML = `Remove date: ${data}`;
  resultEl.append(res);
  resultEl.scrollTo({ behavior: "smooth", top: resultEl.scrollHeight });
});
