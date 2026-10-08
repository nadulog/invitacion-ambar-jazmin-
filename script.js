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

const audioToggle = document.querySelector("#audioToggle");
const invitationAudio = document.querySelector("#invitationAudio");

function syncAudioControl(isPlaying) {
  audioToggle.classList.toggle("is-playing", isPlaying);
  audioToggle.setAttribute("aria-pressed", String(isPlaying));
  audioToggle.setAttribute("aria-label", isPlaying ? "Pausar música" : "Reproducir música");
}

let audioFadeFrame = 0;

function fadeAudioTo(targetVolume = 0.58, duration = 1800) {
  window.cancelAnimationFrame(audioFadeFrame);
  const startedAt = performance.now();
  const startingVolume = invitationAudio.volume;

  function step(now) {
    const progress = Math.min(1, (now - startedAt) / duration);
    const eased = 1 - Math.pow(1 - progress, 3);
    invitationAudio.volume = startingVolume + (targetVolume - startingVolume) * eased;
    if (progress < 1) audioFadeFrame = window.requestAnimationFrame(step);
  }

  audioFadeFrame = window.requestAnimationFrame(step);
}

async function startInvitationAudio() {
  window.cancelAnimationFrame(audioFadeFrame);
  invitationAudio.volume = 0.04;

  try {
    await invitationAudio.play();
    syncAudioControl(true);
    fadeAudioTo();
  } catch {
    syncAudioControl(false);
  }
}

function setupInvitationIntro() {
  const intro = document.querySelector(".invitation-intro");
  const flockRoot = intro?.querySelector(".invitation-intro__flock");
  const main = document.querySelector("#invitationMain");
  if (!intro || !flockRoot) return;

  const routeTemplates = [
    ["-16vw", "82vh", "44vw", "56vh", "116vw", "22vh", "62deg", "70deg", "66deg"],
    ["116vw", "72vh", "58vw", "48vh", "-18vw", "14vh", "-62deg", "-70deg", "-66deg"],
    ["8vw", "112vh", "38vw", "58vh", "72vw", "-20vh", "18deg", "24deg", "20deg"],
    ["88vw", "112vh", "62vw", "55vh", "28vw", "-20vh", "-18deg", "-24deg", "-20deg"],
    ["-18vw", "30vh", "46vw", "20vh", "116vw", "62vh", "98deg", "82deg", "108deg"],
    ["116vw", "24vh", "56vw", "34vh", "-18vw", "70vh", "-98deg", "-82deg", "-108deg"],
    ["22vw", "-22vh", "45vw", "40vh", "78vw", "112vh", "162deg", "154deg", "160deg"],
    ["78vw", "-22vh", "58vw", "42vh", "20vw", "112vh", "-162deg", "-154deg", "-160deg"],
    ["-18vw", "94vh", "42vw", "68vh", "112vw", "84vh", "82deg", "96deg", "86deg"],
  ];

  const paths = Array.from({ length: 18 }, (_, index) => {
    const route = routeTemplates[index % routeTemplates.length];
    const offset = Math.floor(index / routeTemplates.length) * 7;
    return {
      size: 74 + (index * 13) % 42,
      delay: (index % 6) * 105 + Math.floor(index / 6) * 70,
      duration: 4400 + (index * 137) % 1100,
      startX: route[0],
      startY: `calc(${route[1]} - ${offset}vh)`,
      middleX: route[2],
      middleY: `calc(${route[3]} + ${offset / 2}vh)`,
      endX: route[4],
      endY: route[5],
      startRotation: route[6],
      middleRotation: route[7],
      endRotation: route[8],
      scale: 0.9 + (index % 4) * 0.08,
      flapDuration: 760 + (index % 5) * 85,
    };
  });

  const count = window.innerWidth < 768 ? 12 : window.innerWidth < 1100 ? 15 : 18;
  paths.slice(0, count).forEach((path) => {
    const butterfly = document.createElement("span");
    butterfly.className = "intro-butterfly";

    const image = document.createElement("img");
    image.src = "assets/butterfly-main.png";
    image.alt = "";

    Object.entries({
      "--size": `${path.size}px`,
      "--delay": `${path.delay}ms`,
      "--duration": `${path.duration}ms`,
      "--flap-duration": `${path.flapDuration}ms`,
      "--start-x": path.startX,
      "--start-y": path.startY,
      "--middle-x": path.middleX,
      "--middle-y": path.middleY,
      "--end-x": path.endX,
      "--end-y": path.endY,
      "--start-rotation": path.startRotation,
      "--middle-rotation": path.middleRotation,
      "--end-rotation": path.endRotation,
      "--scale": path.scale,
    }).forEach(([key, value]) => butterfly.style.setProperty(key, value));

    butterfly.append(image);
    flockRoot.append(butterfly);
  });

  let transitioning = false;
  const enter = async (withMusic) => {
    if (transitioning) return;
    transitioning = true;
    intro.querySelectorAll("button").forEach((button) => { button.disabled = true; });

    if (withMusic) {
      await startInvitationAudio();
    } else {
      invitationAudio.pause();
      syncAudioControl(false);
    }

    intro.classList.add("is-leaving");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.setTimeout(() => {
      document.body.classList.remove("intro-is-open");
      intro.remove();
      window.scrollTo(0, 0);
      main?.focus({ preventScroll: true });
    }, reduced ? 280 : 5200);
  };

  intro.querySelector("#introWithMusic")?.addEventListener("click", () => enter(true));
  intro.querySelector("#introWithoutMusic")?.addEventListener("click", () => enter(false));
}

audioToggle.addEventListener("click", async () => {
  if (invitationAudio.paused) {
    await startInvitationAudio();
  } else {
    window.cancelAnimationFrame(audioFadeFrame);
    invitationAudio.pause();
    syncAudioControl(false);
  }
});

invitationAudio.addEventListener("play", () => syncAudioControl(true));
invitationAudio.addEventListener("pause", () => syncAudioControl(false));
setupInvitationIntro();

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
