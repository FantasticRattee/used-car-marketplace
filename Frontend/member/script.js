import { initPage, el } from "/shared/app.js";

initPage();

// Names only: the earlier version also listed student ID numbers, which are private.
const TEAM = ["Rattee Watperatam", "Naruebordint Veangnont", "Nichakan Ninhusrungsri", "Nattapat Krisanasamit"];

const initials = (name) =>
  name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

document.getElementById("team-grid").replaceChildren(
  ...TEAM.map((name) =>
    el(
      "li",
      { class: "member" },
      el("span", { class: "plate plate--sm", "aria-hidden": "true" }, el("span", { class: "plate__main", text: initials(name) })),
      el("h2", { class: "member__name", text: name })
    )
  )
);
