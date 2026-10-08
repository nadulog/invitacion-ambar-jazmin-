const EVENT_START = new Date("2026-11-14T21:20:00-03:00");
const EVENT_END = new Date("2026-11-15T05:00:00-03:00");

const countdownFields = {
  days: document.querySelector("#days"),
  hours: document.querySelector("#hours"),
  minutes: document.querySelector("#minutes"),
  seconds: document.querySelector("#seconds"),
};

const countdownButterflies = document.querySelector("#countdownButterflies");
const countdownRoutes = [
  ["-12%", "18%", "42%", "10%", "108%", "28%", "62deg", "78deg", "70deg"],
  ["108%", "34%", "58%", "25%", "-12%", "14%", "-64deg", "-78deg", "-68deg"],
  ["12%", "104%", "34%", "62%", "74%", "-10%", "18deg", "28deg", "20deg"],
  ["86%", "102%", "66%", "58%", "24%", "-12%", "-20deg", "-30deg", "-22deg"],
  ["-10%", "72%", "36%", "52%", "108%", "78%", "82deg", "96deg", "86deg"],
  ["108%", "68%", "64%", "46%", "-12%", "82%", "-86deg", "-98deg", "-88deg"],
  ["4%", "40%", "48%", "32%", "96%", "8%", "48deg", "62deg", "52deg"],
  ["96%", "12%", "52%", "38%", "2%", "56%", "-42deg", "-58deg", "-46deg"],
  ["28%", "108%", "44%", "70%", "18%", "-10%", "8deg", "-16deg", "-8deg"],
  ["72%", "-10%", "58%", "36%", "82%", "108%", "172deg", "156deg", "166deg"],
];

countdownRoutes.forEach((route, index) => {
  const butterfly = document.createElement("span");
  butterfly.className = "countdown-butterfly";

  const image = document.createElement("img");
  image.src = "assets/butterfly-main.png";
  image.alt = "";

  const values = {
    "--start-x": route[0],
    "--start-y": route[1],
    "--middle-x": route[2],
    "--middle-y": route[3],
    "--end-x": route[4],
    "--end-y": route[5],
    "--start-rotation": route[6],
    "--middle-rotation": route[7],
    "--end-rotation": route[8],
    "--size": `${38 + (index % 4) * 9}px`,
    "--scale": 0.82 + (index % 3) * 0.09,
    "--duration": `${9.5 + (index % 5) * 1.15}s`,
    "--delay": `${-index * 1.37}s`,
    "--flap-duration": `${560 + (index % 4) * 90}ms`,
  };

  Object.entries(values).forEach(([key, value]) => butterfly.style.setProperty(key, value));
  butterfly.append(image);
  countdownButterflies.append(butterfly);
});

function updateCountdown() {
  const remaining = Math.max(0, EVENT_START.getTime() - Date.now());
  const totalSeconds = Math.floor(remaining / 1000);

  countdownFields.days.textContent = String(Math.floor(totalSeconds / 86400)).padStart(2, "0");
  countdownFields.hours.textContent = String(Math.floor((totalSeconds % 86400) / 3600)).padStart(2, "0");
  countdownFields.minutes.textContent = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
  countdownFields.seconds.textContent = String(totalSeconds % 60).padStart(2, "0");
}

function toIcsDate(date) {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

function downloadCalendarEvent() {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Ambar Jazmin//Invitacion XV//ES",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `DTSTAMP:${toIcsDate(new Date())}`,
    `DTSTART:${toIcsDate(EVENT_START)}`,
    `DTEND:${toIcsDate(EVENT_END)}`,
    "SUMMARY:XV de Ámbar Jazmín",
    "LOCATION:Essence Palace Eventos\, Mendoza 1215\, San Justo\, Buenos Aires",
    "DESCRIPTION:Celebramos los XV años de Ámbar Jazmín.",
    "END:VEVENT",
    "END:VCALENDAR",
  ];

  const file = new Blob([lines.join("\r\n")], { type: "text/calendar;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(file);
  link.download = "xv-ambar-jazmin.ics";
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(link.href);
}

updateCountdown();
window.setInterval(updateCountdown, 1000);
document.querySelector("#calendarButton").addEventListener("click", downloadCalendarEvent);

const mapModal = document.querySelector("#mapModal");
const giftsModal = document.querySelector("#giftsModal");

function openModal(modal) {
  modal.showModal();
  document.body.classList.add("modal-open");
}

function closeModal(modal) {
  modal.close();
}

function syncModalState() {
  document.body.classList.toggle("modal-open", Boolean(document.querySelector("dialog[open]")));
}

function showCopyMessage(button, message) {
  const toast = button.closest(".modal-art").querySelector(".modal-toast");
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(toast.hideTimer);
  toast.hideTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 1800);
}

async function copyText(button) {
  const text = button.dataset.copy;

  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const input = document.createElement("textarea");
    input.value = text;
    input.setAttribute("readonly", "");
    input.style.position = "fixed";
    input.style.opacity = "0";
    document.body.append(input);
    input.select();
    document.execCommand("copy");
    input.remove();
  }

  showCopyMessage(button, button.dataset.copyMessage);
}

document.querySelector("#openMapModal").addEventListener("click", () => openModal(mapModal));
document.querySelector("#openGiftsModal").addEventListener("click", () => openModal(giftsModal));

document.querySelectorAll("[data-close-modal]").forEach((button) => {
  button.addEventListener("click", () => closeModal(button.closest("dialog")));
});

document.querySelectorAll("[data-copy]").forEach((button) => {
  button.addEventListener("click", () => copyText(button));
});

[mapModal, giftsModal].forEach((modal) => {
  modal.addEventListener("close", syncModalState);
  modal.addEventListener("click", (event) => {
    if (event.target === modal) closeModal(modal);
  });
});
