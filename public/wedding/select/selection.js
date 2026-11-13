"use strict";

const API_ENDPOINT =
  "https://tamemj-support-ticket-mailer.ns9gctrd2t.workers.dev/wedding-selection";
const $ = (id) => document.getElementById(id);
const chapters = [
  { id: "all", start: 1, end: 1541 },
  { id: "getting-ready", start: 1, end: 225 },
  { id: "portraits", start: 226, end: 466 },
  { id: "family", start: 467, end: 559 },
  { id: "ceremony", start: 560, end: 777 },
  { id: "details", start: 778, end: 889 },
  { id: "celebration", start: 890, end: 1541 },
];
const access =
  new URLSearchParams(location.search).get("access") ||
  localStorage.getItem("wedding-selection-access") ||
  "";
const cacheKey = `wedding-selection-cache:${access.slice(0, 16)}`;
const pendingKey = `wedding-selection-pending:${access.slice(0, 16)}`;
const dialog = $("viewer");
const batchSize = 60;
let all = [];
let visible = [];
let shown = 0;
let current = 0;
let currentView = "mine";
let viewerRole = "tamem";
let selectedOnly = false;
let lastFocus = null;
let picks = { tamem: new Set(), wife: new Set() };
let pending = readJson(pendingKey, {});

function readJson(key, fallback) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || "");
    return value ?? fallback;
  } catch {
    return fallback;
  }
}

function mineRole() {
  return viewerRole;
}

function partnerRole() {
  return viewerRole === "tamem" ? "wife" : "tamem";
}

function bothPicks() {
  return new Set([...picks.tamem].filter((photoId) => picks.wife.has(photoId)));
}

function photoNumber(photo) {
  return Number(photo.id.slice(3));
}

function setSyncStatus(message, state = "ok") {
  $("sync-status").textContent = message;
  $("sync-status").dataset.state = state;
}

function saveCache() {
  localStorage.setItem(
    cacheKey,
    JSON.stringify({
      viewerRole,
      tamem: [...picks.tamem],
      wife: [...picks.wife],
    }),
  );
}

function restoreCache() {
  const cached = readJson(cacheKey, null);
  if (!cached) return;
  viewerRole = cached.viewerRole === "wife" ? "wife" : "tamem";
  picks.tamem = new Set(cached.tamem || []);
  picks.wife = new Set(cached.wife || []);
  applyPending();
}

function applyPending() {
  const mine = picks[mineRole()];
  for (const [photoId, selected] of Object.entries(pending)) {
    if (selected) mine.add(photoId);
    else mine.delete(photoId);
  }
}

function updateIdentity() {
  const partnerLabel = viewerRole === "tamem" ? "My wife’s picks" : "Tamem’s picks";
  $("identity").textContent =
    viewerRole === "tamem" ? "Tamem’s private link" : "Private link for Tamem’s wife";
  $("mine-label").textContent = "My picks";
  $("partner-label").textContent = partnerLabel;
}

function updateCounts() {
  const mine = picks[mineRole()].size;
  const partner = picks[partnerRole()].size;
  const both = bothPicks().size;
  $("mine-count").textContent = mine.toLocaleString();
  $("partner-count").textContent = partner.toLocaleString();
  $("both-count").textContent = both.toLocaleString();
  $("mutual-count").textContent = both.toLocaleString();
  $("progress-fill").style.width = `${Math.min(100, (both / 80) * 100)}%`;
  const progress = document.querySelector('[role="progressbar"]');
  progress.setAttribute("aria-valuenow", String(Math.min(80, both)));
  $("export").disabled = both === 0;

  if (both < 60) {
    $("target-copy").textContent = `${60 - both} more mutual ${60 - both === 1 ? "pick" : "picks"} to reach 60.`;
  } else if (both <= 80) {
    $("target-copy").textContent = "You’re inside the final 60–80 range.";
  } else {
    $("target-copy").textContent = `${both - 80} over the 80-photo target.`;
  }
}

function currentSet() {
  if (currentView === "mine") return picks[mineRole()];
  if (currentView === "partner") return picks[partnerRole()];
  return bothPicks();
}

function filterPhotos() {
  const query = $("search").value.trim().toLowerCase();
  const chapter = chapters.find((item) => item.id === $("chapter").value) || chapters[0];
  const viewSet = currentSet();

  visible = all.filter((photo) => {
    const number = photoNumber(photo);
    const matchesChapter = number >= chapter.start && number <= chapter.end;
    const matchesQuery = photo.id.toLowerCase().includes(query);
    const matchesView =
      currentView === "mine" && !selectedOnly ? true : viewSet.has(photo.id);
    return matchesChapter && matchesQuery && matchesView;
  });

  shown = 0;
  $("grid").replaceChildren();
  $("empty").hidden = visible.length > 0;
  $("view-summary").textContent =
    `${visible.length.toLocaleString()} ${visible.length === 1 ? "photograph" : "photographs"} in this view`;
  appendPhotos();
}

function selectionState(photoId) {
  const mine = picks[mineRole()].has(photoId);
  const partner = picks[partnerRole()].has(photoId);
  if (mine && partner) return "Picked by both";
  if (mine) return "In my picks";
  if (partner) return viewerRole === "tamem" ? "Picked by my wife" : "Picked by Tamem";
  return "Not selected";
}

function appendPhotos() {
  const end = Math.min(shown + batchSize, visible.length);
  const fragment = document.createDocumentFragment();

  for (let index = shown; index < end; index += 1) {
    const photo = visible[index];
    const item = document.createElement("article");
    const openButton = document.createElement("button");
    const image = document.createElement("img");
    const id = document.createElement("span");
    const action = document.createElement("button");
    const state = document.createElement("span");
    const mine = picks[mineRole()].has(photo.id);

    item.className = "selection-item";
    item.dataset.mine = String(mine);
    openButton.className = "photo-open";
    openButton.type = "button";
    openButton.setAttribute("aria-label", `Open wedding photo ${photo.id}`);
    openButton.addEventListener("click", (event) => openViewer(index, event.detail > 0));

    image.src = `../thumbs/${photo.id}.jpg`;
    image.alt = `Wedding photo ${photo.id}`;
    image.width = photo.width;
    image.height = photo.height;
    image.loading = "lazy";
    image.decoding = "async";
    id.className = "photo-id";
    id.textContent = photo.id;
    openButton.append(image, id);

    action.className = "pick-action";
    action.type = "button";
    action.textContent = mine ? "Remove from my picks" : "Add to my picks";
    action.setAttribute(
      "aria-label",
      `${mine ? "Remove" : "Add"} ${photo.id} ${mine ? "from" : "to"} my picks`,
    );
    action.addEventListener("click", () => togglePick(photo.id));
    state.className = "pick-state";
    state.textContent = selectionState(photo.id);
    item.append(openButton, action, state);
    fragment.append(item);
  }

  $("grid").append(fragment);
  shown = end;
  $("more").hidden = shown >= visible.length;
}

function chooseView(view) {
  currentView = ["mine", "partner", "both"].includes(view) ? view : "mine";
  document.querySelectorAll("[data-view]").forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.view === currentView));
  });
  $("selected-only").disabled = currentView !== "mine";
  if (currentView !== "mine") {
    selectedOnly = false;
    $("selected-only").setAttribute("aria-pressed", "false");
  }
  filterPhotos();
}

async function syncRoom(silent = false) {
  if (!access) {
    setSyncStatus("Open one of the two private invitation links.", "error");
    return false;
  }

  if (!silent) setSyncStatus("Syncing selections…");
  try {
    const response = await fetch(API_ENDPOINT, {
      headers: { Authorization: `Bearer ${access}` },
      cache: "no-store",
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Unable to load the room");

    viewerRole = data.viewerRole === "wife" ? "wife" : "tamem";
    picks.tamem = new Set(data.picks?.tamem || []);
    picks.wife = new Set(data.picks?.wife || []);
    applyPending();
    localStorage.setItem("wedding-selection-access", access);
    updateIdentity();
    updateCounts();
    saveCache();
    filterPhotos();
    if (Object.keys(pending).length > 0) {
      await flushPending();
    } else {
      setSyncStatus("Saved and synced");
    }
    return true;
  } catch (error) {
    setSyncStatus(error.message || "Offline — changes will retry", "error");
    return false;
  }
}

async function flushPending() {
  const changes = Object.entries(pending);
  if (changes.length === 0) return true;

  setSyncStatus(`Saving ${changes.length} pending ${changes.length === 1 ? "change" : "changes"}…`);
  for (const [photoId, selected] of changes) {
    try {
      const response = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${access}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ photoId, selected }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to save this pick");

      if (pending[photoId] === selected) delete pending[photoId];
    } catch (error) {
      localStorage.setItem(pendingKey, JSON.stringify(pending));
      setSyncStatus(error.message || "Offline — changes will retry", "error");
      return false;
    }
  }

  localStorage.setItem(pendingKey, JSON.stringify(pending));
  saveCache();
  setSyncStatus("Saved and synced");
  return true;
}

async function writePick(photoId, selected) {
  pending[photoId] = selected;
  localStorage.setItem(pendingKey, JSON.stringify(pending));
  setSyncStatus("Saving…");

  try {
    const response = await fetch(API_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${access}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ photoId, selected }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Unable to save this pick");

    if (pending[photoId] === selected) {
      delete pending[photoId];
      localStorage.setItem(pendingKey, JSON.stringify(pending));
    }
    setSyncStatus("Saved and synced");
    saveCache();
    window.setTimeout(() => syncRoom(true), 600);
  } catch (error) {
    setSyncStatus(error.message || "Offline — changes will retry", "error");
  }
}

function togglePick(photoId) {
  const openPhotoId = dialog.open ? $("viewer-pick").dataset.photoId : null;
  const mine = picks[mineRole()];
  const selected = !mine.has(photoId);
  if (selected) mine.add(photoId);
  else mine.delete(photoId);
  updateCounts();
  filterPhotos();
  if (dialog.open) {
    const nextIndex = visible.findIndex((photo) => photo.id === openPhotoId);
    if (nextIndex < 0) dialog.close();
    else {
      current = nextIndex;
      renderViewer();
    }
  }
  writePick(photoId, selected);
}

function renderViewer() {
  const photo = visible[current];
  if (!photo) return;
  const mine = picks[mineRole()].has(photo.id);
  $("large").src = `../photos/${photo.id}.jpg`;
  $("large").alt = `Wedding photo ${photo.id}`;
  $("caption").textContent = `${photo.id} · ${selectionState(photo.id)}`;
  $("viewer-pick").textContent = mine ? "Remove from my picks" : "Add to my picks";
  $("viewer-pick").dataset.photoId = photo.id;
  $("position").textContent = `${current + 1} of ${visible.length.toLocaleString()}`;
}

function openViewer(index, animate = false) {
  current = index;
  lastFocus = document.activeElement;
  renderViewer();
  dialog.showModal();
  document.body.classList.add("locked");
  if (animate && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    dialog.animate(
      [
        { opacity: 0, transform: "translateY(6px)" },
        { opacity: 1, transform: "translateY(0)" },
      ],
      { duration: 180, easing: "cubic-bezier(.22,1,.36,1)" },
    );
  }
}

function moveViewer(delta) {
  current = (current + delta + visible.length) % visible.length;
  renderViewer();
}

function exportBoth() {
  const rows = ["photo_id", ...[...bothPicks()].sort()];
  const blob = new Blob([rows.join("\n") + "\n"], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "our-wedding-both-picks.csv";
  link.click();
  URL.revokeObjectURL(url);
}

document.querySelectorAll("[data-view]").forEach((button) => {
  button.addEventListener("click", () => chooseView(button.dataset.view));
});
$("search").addEventListener("input", filterPhotos);
$("chapter").addEventListener("change", filterPhotos);
$("selected-only").addEventListener("click", () => {
  selectedOnly = !selectedOnly;
  $("selected-only").setAttribute("aria-pressed", String(selectedOnly));
  filterPhotos();
});
$("more").addEventListener("click", appendPhotos);
$("export").addEventListener("click", exportBoth);
$("viewer-pick").addEventListener("click", () => togglePick($("viewer-pick").dataset.photoId));
$("close").addEventListener("click", () => dialog.close());
$("previous").addEventListener("click", () => moveViewer(-1));
$("next").addEventListener("click", () => moveViewer(1));
dialog.addEventListener("close", () => {
  document.body.classList.remove("locked");
  lastFocus?.focus();
});
dialog.addEventListener("keydown", (event) => {
  if (event.key === "ArrowRight") {
    event.preventDefault();
    moveViewer(1);
  }
  if (event.key === "ArrowLeft") {
    event.preventDefault();
    moveViewer(-1);
  }
});

restoreCache();
updateIdentity();
updateCounts();
Promise.all([
  fetch("../manifest.json").then((response) => {
    if (!response.ok) throw new Error("Unable to load the photographs");
    return response.json();
  }),
  syncRoom(),
])
  .then(([manifest]) => {
    all = manifest;
    filterPhotos();
  })
  .catch((error) => {
    setSyncStatus(error.message || "The selection room could not load.", "error");
  });

window.setInterval(() => {
  if (!document.hidden) syncRoom(true);
}, 8000);
