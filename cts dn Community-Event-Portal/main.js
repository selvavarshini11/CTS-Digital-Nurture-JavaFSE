// =============================================
// CityPulse — main.js
// =============================================

// JS Exercise 1: console.log + alert
console.log("Welcome to the Community Portal");
window.addEventListener("load", () => {
  console.log("Page fully loaded.");
  initApp();
});

// JS Exercise 2: const, let, template literals, ++/--
const PORTAL_NAME = "CityPulse Community Portal";
const LAUNCH_DATE = "2024-01-15";
let totalSeats = 500;
console.log(`${PORTAL_NAME} launched on ${LAUNCH_DATE}. Seats: ${totalSeats}`);
function decrementSeats() { if (totalSeats > 0) totalSeats--; }

// JS Exercise 5: Class + Prototype
class CommunityEvent {
  constructor(id, name, category, date, location, seats, fee, img) {
    this.id = id; this.name = name; this.category = category;
    this.date = date; this.location = location; this.seats = seats;
    this.fee = fee; this.img = img;
  }
  checkAvailability() {
    if (this.seats === 0) return "full";
    if (this.seats <= 10) return "limited";
    return "available";
  }
  toCardHTML() {
    const avail = this.checkAvailability();
    const seatClass = { available:"seats-ok", limited:"seats-low", full:"seats-full" }[avail];
    const seatLabel = avail === "full" ? "Sold Out" : avail === "limited" ? `⚠ Only ${this.seats} left` : `${this.seats} seats`;
    return `
      <article class="eventCard" data-category="${this.category}" data-location="${this.location}" data-id="${this.id}">
        <img src="${this.img}" alt="${this.name}" class="card-thumb" loading="lazy">
        <div class="card-body">
          <span class="card-tag">${this.category}</span>
          <h3>${this.name}</h3>
          <div class="card-meta">
            <span>📅 ${formatDate(this.date)}</span>
            <span>📍 ${this.location.replace(/-/g," ")}</span>
            <span>💰 ${this.fee}</span>
          </div>
          <div class="card-footer">
            <span class="seats-badge ${seatClass}">${seatLabel}</span>
            ${avail !== "full"
              ? `<button class="btn btn-primary" onclick="registerForEvent(${this.id},'${this.name}')">Register</button>`
              : `<button class="btn btn-outline" disabled>Full</button>`}
          </div>
        </div>
      </article>`;
  }
}

// JS Exercise 6: Array of events
const allEvents = [
  new CommunityEvent(1,"Summer Music Concert","music","2025-08-15","central-park",48,"₹200","https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=220&fit=crop"),
  new CommunityEvent(2,"Baking Workshop","workshop","2025-08-20","community-center",8,"₹500","https://images.unsplash.com/photo-1556217477-d325251ece38?w=400&h=220&fit=crop"),
  new CommunityEvent(3,"Community Sports Day","sports","2025-08-25","riverside",62,"Free","https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=220&fit=crop"),
  new CommunityEvent(4,"Street Food Festival","food","2025-09-01","central-park",35,"₹150","https://images.unsplash.com/photo-1555244162-803834f70033?w=400&h=220&fit=crop"),
  new CommunityEvent(5,"Local Art Exhibition","art","2025-09-05","town-hall",0,"₹100","https://images.unsplash.com/photo-1536924430914-91f9e2041b83?w=400&h=220&fit=crop"),
  new CommunityEvent(6,"Jazz Night","music","2025-09-10","riverside",22,"₹300","https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=400&h=220&fit=crop"),
  new CommunityEvent(7,"Photography Workshop","workshop","2025-09-15","community-center",15,"₹600","https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=400&h=220&fit=crop"),
  new CommunityEvent(8,"5K Charity Run","sports","2025-09-20","central-park",90,"Free","https://images.unsplash.com/photo-1461897104016-0b3b00cc81ee?w=400&h=220&fit=crop"),
  new CommunityEvent(9,"Vegan Food Fair","food","2025-09-22","town-hall",42,"₹100","https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=400&h=220&fit=crop"),
];

// JS Exercise 4: Closure — registration tracker
function makeRegistrationTracker() {
  const counts = {};
  return {
    register(cat) { counts[cat] = (counts[cat] || 0) + 1; },
    getAll() { return { ...counts }; }
  };
}
const tracker = makeRegistrationTracker();

// JS Exercise 4: Higher-order filter function
function filterEventsByCategory(events, predicate) {
  return events.filter(predicate);
}

// JS Exercise 3: try-catch registration
function registerForEvent(id, name) {
  try {
    const event = allEvents.find(e => e.id === id);
    if (!event) throw new Error("Event not found!");
    if (event.seats === 0) throw new Error("This event is fully booked.");
    event.seats--;
    decrementSeats();
    tracker.register(event.category);
    $(`[data-id="${id}"]`).fadeOut(200, function () {
      $(this).find(".card-footer").html(
        `<span class="seats-badge seats-ok">✅ Registered!</span>
         <span style="font-size:0.82rem;color:var(--clr-muted)">${event.seats} left</span>`
      );
      $(this).fadeIn(400);
    });
    showNotification(`Registered for "${name}"! 🎉`, "success");
  } catch (err) {
    console.error("Registration error:", err.message);
    showNotification(`Error: ${err.message}`, "error");
  }
}

// JS Exercise 7: DOM Manipulation — render events
function renderEvents(events) {
  const grid = document.querySelector("#eventGrid");
  if (!grid) return;
  if (events.length === 0) {
    grid.innerHTML = `<div style="text-align:center;padding:3rem;color:var(--clr-muted);grid-column:1/-1;">No events found.</div>`;
    return;
  }
  grid.innerHTML = events.map(e => e.toCardHTML()).join("");
}

// JS Exercise 8: Filter state
let currentFilter = { category: "all", location: "all", search: "" };

function applyFilters() {
  let filtered = [...allEvents];
  if (currentFilter.category !== "all")
    filtered = filtered.filter(e => e.category === currentFilter.category);
  if (currentFilter.location !== "all")
    filtered = filtered.filter(e => e.location === currentFilter.location);
  if (currentFilter.search)
    filtered = filtered.filter(e => e.name.toLowerCase().includes(currentFilter.search.toLowerCase()));
  renderEvents(filtered);
}

// HTML Exercise 6: onblur phone validation
function validatePhone(input) {
  const val = input.value.trim();
  const errEl = document.getElementById("err-phone");
  if (val && !/^[6-9]\d{9}$/.test(val)) {
    input.classList.add("is-invalid");
    errEl.textContent = "Enter a valid 10-digit Indian mobile number";
  } else {
    input.classList.remove("is-invalid");
    errEl.textContent = "";
  }
}

// HTML Exercise 6: onchange fee display
function showEventFee(value) {
  const feeMap = { music:"₹200", workshop:"₹500", sports:"Free", food:"₹150", art:"₹100" };
  const feeDisplay = document.getElementById("feeDisplay");
  const feeBadge   = document.getElementById("feeBadge");
  if (value && feeMap[value]) {
    feeBadge.textContent = feeMap[value];
    feeDisplay.style.display = "block";
    const saveChk = document.getElementById("savePrefs");
    if (saveChk && saveChk.checked) localStorage.setItem("preferredEventType", value);
  } else {
    feeDisplay.style.display = "none";
  }
}

function showSelectedFee(select) {
  const fee = select.options[select.selectedIndex].dataset.fee || "";
  const info = document.getElementById("selectedFeeInfo");
  info.textContent = fee ? `Event fee paid: ${fee}` : "";
}

// HTML Exercise 6: onkeyup char counter
function countChars(textarea) {
  const max = 300, len = textarea.value.length;
  const el = document.getElementById("charCount");
  if (len > max) textarea.value = textarea.value.substring(0, max);
  el.textContent = `${Math.min(len,max)} / ${max} characters`;
  el.style.color = len >= max ? "var(--clr-danger)" : "var(--clr-muted)";
}
function countFeedbackChars(textarea) {
  const max = 500, len = textarea.value.length;
  const el = document.getElementById("fbCharCount");
  if (len > max) textarea.value = textarea.value.substring(0, max);
  el.textContent = `${Math.min(len,max)} / ${max} characters`;
  el.style.color = len >= max ? "var(--clr-danger)" : "var(--clr-muted)";
}

// JS Exercise 11: Form handling with validation
function handleSubmit(e) {
  e.preventDefault();
  const form = document.getElementById("registrationForm");
  const name      = form.elements["fullName"].value.trim();
  const email     = form.elements["email"].value.trim();
  const date      = form.elements["eventDate"].value;
  const eventType = form.elements["eventType"].value;
  let isValid = true;
  if (!name)  { showFieldError("fullName","Name is required."); isValid = false; }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showFieldError("email","Enter a valid email."); isValid = false; }
  if (!date)  { showFieldError("eventDate","Please select a date."); isValid = false; }
  if (!eventType) { showFieldError("eventType","Please select an event type."); isValid = false; }
  if (!isValid) return;

  const output = document.getElementById("formOutput");
  output.className = "form-output success";
  output.textContent = `✅ Registration confirmed! Thank you, ${name}. You're registered for ${eventType} on ${formatDate(date)}. Confirmation sent to ${email}.`;
  output.scrollIntoView({ behavior:"smooth", block:"center" });

  // JS Exercise 12: fetch POST
  submitToAPI({ name, email, date, eventType });

  const saveChk = document.getElementById("savePrefs");
  if (saveChk && saveChk.checked) localStorage.setItem("preferredEventType", eventType);
}

function showFieldError(fieldId, msg) {
  const field = document.getElementById(fieldId);
  const errEl = document.getElementById(`err-${fieldId}`);
  if (field) field.classList.add("is-invalid");
  if (errEl) errEl.textContent = msg;
}
function clearError(fieldId) {
  const field = document.getElementById(fieldId);
  const errEl = document.getElementById(`err-${fieldId}`);
  if (field) field.classList.remove("is-invalid");
  if (errEl) errEl.textContent = "";
}

// HTML Exercise 8: localStorage
function loadSavedPreferences() {
  const saved = localStorage.getItem("preferredEventType");
  if (saved) {
    const select = document.getElementById("eventType");
    if (select) { select.value = saved; showEventFee(saved); }
  }
}
function clearPreferences() {
  localStorage.clear(); sessionStorage.clear();
  const output = document.getElementById("formOutput");
  if (output) { output.className = "form-output success"; output.textContent = "✅ All preferences cleared."; }
  const select = document.getElementById("eventType");
  if (select) select.value = "";
  const feeDisplay = document.getElementById("feeDisplay");
  if (feeDisplay) feeDisplay.style.display = "none";
}

// JS Exercise 12: Fetch API + async/await
async function submitToAPI(data) {
  const btn = document.getElementById("submitBtn");
  if (btn) { btn.disabled = true; btn.textContent = "⏳ Submitting..."; }
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const result = await response.json();
    setTimeout(() => {
      console.log("✅ API:", result);
      showNotification("Data synced with server! 🎉", "success");
      if (btn) { btn.disabled = false; btn.textContent = "✅ Register Now"; }
    }, 1200);
  } catch (err) {
    console.error("Fetch error:", err);
    showNotification("Saved locally (network error).", "error");
    if (btn) { btn.disabled = false; btn.textContent = "✅ Register Now"; }
  }
}

// JS Exercise 9: Async event loading with spinner
async function fetchMockEvents() {
  document.querySelector("#eventGrid").innerHTML = `
    <div class="loading-cards">
      <div class="skeleton-card"></div>
      <div class="skeleton-card"></div>
      <div class="skeleton-card"></div>
    </div>`;
  await new Promise(resolve => setTimeout(resolve, 900));
  renderEvents(allEvents);
  populateAdminTable(allEvents);
}

// HTML Exercise 4/6: Gallery lightbox (ondblclick)
function enlargeImage(img) {
  const lb = document.getElementById("lightbox");
  const lbImg = document.getElementById("lightboxImg");
  lbImg.src = img.src;
  lbImg.alt = img.alt;
  lb.classList.add("active");
  document.body.style.overflow = "hidden";
}
function closeLightbox() {
  document.getElementById("lightbox").classList.remove("active");
  document.body.style.overflow = "";
}

// HTML Exercise 7: Video events (replaced with promo animation)
function videoReady()   { }
function videoPlaying() { }
function videoPaused()  { }

// ---- PROMO ANIMATION ----
const promoEvents = [
  { emoji: "🎵", title: "Summer Music Concert", sub: "Central Park • Aug 15", color: "#f59e0b" },
  { emoji: "🛠",  title: "Baking Workshop",       sub: "Community Center • Aug 20", color: "#06b6d4" },
  { emoji: "⚽", title: "Community Sports Day",  sub: "Riverside • Aug 25", color: "#22c55e" },
  { emoji: "🍕", title: "Street Food Festival",  sub: "Central Park • Sep 1",  color: "#ef4444" },
  { emoji: "🎨", title: "Local Art Exhibition",  sub: "Town Hall • Sep 5",    color: "#a855f7" },
  { emoji: "🎷", title: "Jazz Night",            sub: "Riverside • Sep 10",   color: "#f59e0b" },
  { emoji: "📸", title: "Photography Workshop",  sub: "Community Center • Sep 15", color: "#06b6d4" },
  { emoji: "🏃", title: "5K Charity Run",        sub: "Central Park • Sep 20", color: "#22c55e" },
  { emoji: "🥗", title: "Vegan Food Fair",       sub: "Town Hall • Sep 22",   color: "#ef4444" },
];

let promoIndex = 0;
let promoTimer = null;
let promoRunning = false;
let promoParticles = [];

function initPromo() {
  const canvas = document.getElementById("promoCanvas");
  if (!canvas) return;

  // Build dots
  const dotsEl = document.getElementById("promoDots");
  if (dotsEl) {
    dotsEl.innerHTML = promoEvents.map((_, i) =>
      `<span class="promo-dot" id="dot-${i}" onclick="goToPromo(${i})" style="
        width:8px;height:8px;border-radius:50%;background:rgba(255,255,255,0.3);
        cursor:pointer;transition:all 0.3s;display:inline-block;"></span>`
    ).join("");
  }

  // Init particle canvas
  const pc = document.getElementById("particleCanvas");
  if (pc) {
    pc.width  = canvas.offsetWidth;
    pc.height = canvas.offsetHeight;
    for (let i = 0; i < 60; i++) {
      promoParticles.push({
        x: Math.random() * pc.width,
        y: Math.random() * pc.height,
        r: Math.random() * 2 + 0.5,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        alpha: Math.random() * 0.5 + 0.1
      });
    }
    animateParticles(pc);
  }

  showPromoSlide(0);
  startPromo();
}

function animateParticles(pc) {
  const ctx = pc.getContext("2d");
  function draw() {
    ctx.clearRect(0, 0, pc.width, pc.height);
    promoParticles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${p.alpha})`;
      ctx.fill();
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = pc.width;
      if (p.x > pc.width) p.x = 0;
      if (p.y < 0) p.y = pc.height;
      if (p.y > pc.height) p.y = 0;
    });
    requestAnimationFrame(draw);
  }
  draw();
}

function showPromoSlide(index) {
  const ev = promoEvents[index];
  const titleEl = document.getElementById("promoTitle");
  const subEl   = document.getElementById("promoSub");
  const emojiEl = document.getElementById("promoEmoji");

  // Fade out
  [titleEl, subEl, emojiEl].forEach(el => { if(el) { el.style.opacity = "0"; el.style.transform = "translateY(20px)"; } });

  setTimeout(() => {
    if (emojiEl) emojiEl.textContent = ev.emoji;
    if (titleEl) {
      titleEl.textContent = ev.title;
      titleEl.style.textShadow = `0 0 40px ${ev.color}cc, 0 4px 20px rgba(0,0,0,0.5)`;
      titleEl.style.color = "#ffffff";
    }
    if (subEl) subEl.textContent = ev.sub;

    // Update canvas bg gradient color
    const canvas = document.getElementById("promoCanvas");
    if (canvas) canvas.style.background = `linear-gradient(135deg, #0f172a 0%, ${ev.color}33 50%, #0f172a 100%)`;

    // Fade in
    [titleEl, subEl, emojiEl].forEach(el => {
      if (el) { el.style.transition = "all 0.5s ease"; el.style.opacity = "1"; el.style.transform = "translateY(0)"; }
    });

    // Update dots
    document.querySelectorAll(".promo-dot").forEach((d, i) => {
      d.style.background = i === index ? ev.color : "rgba(255,255,255,0.3)";
      d.style.transform  = i === index ? "scale(1.4)" : "scale(1)";
    });
  }, 300);
}

function startPromo() {
  promoRunning = true;
  const btn = document.getElementById("promoToggleBtn");
  if (btn) btn.textContent = "⏸";
  promoTimer = setInterval(() => {
    promoIndex = (promoIndex + 1) % promoEvents.length;
    showPromoSlide(promoIndex);
  }, 2500);
}

function stopPromo() {
  promoRunning = false;
  clearInterval(promoTimer);
  const btn = document.getElementById("promoToggleBtn");
  if (btn) btn.textContent = "▶";
}

function togglePromo() {
  promoRunning ? stopPromo() : startPromo();
}

function goToPromo(index) {
  promoIndex = index;
  showPromoSlide(index);
  if (promoRunning) { clearInterval(promoTimer); startPromo(); }
}

// HTML Exercise 7: onbeforeunload
window.onbeforeunload = function () {
  const form = document.getElementById("registrationForm");
  if (form) {
    const name = form.elements["fullName"]?.value;
    const email = form.elements["email"]?.value;
    if (name || email) return "You have unsaved details. Leave page?";
  }
};

// HTML Exercise 9: Geolocation
function initGeolocation() {
  const btn    = document.getElementById("geoBtn");
  const result = document.getElementById("geoResult");
  if (!btn) return;
  btn.addEventListener("click", () => {
    result.textContent = "📡 Locating you...";
    result.classList.add("visible");
    if (!navigator.geolocation) { result.textContent = "❌ Geolocation not supported."; return; }
    navigator.geolocation.getCurrentPosition(
      pos => {
        const { latitude, longitude, accuracy } = pos.coords;
        result.textContent = `📍 Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)} (±${Math.round(accuracy)}m)`;
      },
      err => {
        const msgs = { 1:"❌ Permission denied.", 2:"❌ Unavailable.", 3:"⏰ Timed out." };
        result.textContent = msgs[err.code] || "❌ Error.";
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
    );
  });
}

// Feedback star rating
let currentRating = 0;
function setRating(val) {
  currentRating = val;
  document.querySelectorAll(".star").forEach((s, i) => s.classList.toggle("active", i < val));
}
function submitFeedback() {
  const event = document.getElementById("feedbackEvent").value;
  const text  = document.getElementById("feedbackText").value.trim();
  const out   = document.getElementById("feedbackOutput");
  if (!event)         { out.className="form-output error"; out.textContent="Please select an event."; return; }
  if (!text)          { out.className="form-output error"; out.textContent="Please write feedback."; return; }
  if (!currentRating) { out.className="form-output error"; out.textContent="Please give a star rating."; return; }
  out.className = "form-output success";
  out.textContent = `✅ Thank you! Rating: ${"★".repeat(currentRating)}`;
  document.getElementById("feedbackText").value = "";
  document.getElementById("feedbackEvent").value = "";
  setRating(0);
}

// Admin table (JS Exercise 5: Object.entries)
function populateAdminTable(events) {
  const tbody = document.getElementById("adminTableBody");
  if (!tbody) return;
  tbody.innerHTML = events.map((evt, i) => {
    const avail = evt.checkAvailability();
    const cls   = { available:"status-open", limited:"status-limited", full:"status-full" }[avail];
    const label = { available:"Open", limited:"Limited", full:"Full" }[avail];
    console.log("Event entries:", Object.entries(evt).map(([k,v]) => `${k}:${v}`).join(", "));
    return `<tr>
      <td>${i+1}</td>
      <td style="text-align:left;font-weight:600;color:var(--clr-heading)">${evt.name}</td>
      <td>${evt.category}</td>
      <td>${formatDate(evt.date)}</td>
      <td>${evt.location.replace(/-/g," ")}</td>
      <td>${evt.seats}</td>
      <td style="color:var(--clr-accent)">${evt.fee}</td>
      <td class="${cls}">${label}</td>
    </tr>`;
  }).join("");
}

// JS Exercise 10: Destructuring, spread, default params
function getEventSummary({ name, category, date, fee }) {
  return `${name} (${category}) on ${formatDate(date)} — ${fee}`;
}
function getSafeFiltered(category = "all") {
  const cloned = [...allEvents];
  return category === "all" ? cloned : cloned.filter(e => e.category === category);
}
console.log("Music:", getSafeFiltered("music").map(e => getEventSummary(e)));

// Animated counters
function animateCounter(el, target, suffix = "") {
  let cur = 0; const step = Math.ceil(target / 60);
  const t = setInterval(() => {
    cur = Math.min(cur + step, target);
    el.textContent = cur + suffix;
    if (cur >= target) clearInterval(t);
  }, 25);
}

// Toast notification
function showNotification(msg, type = "success") {
  const old = document.getElementById("toast");
  if (old) old.remove();
  const t = document.createElement("div");
  t.id = "toast";
  t.style.cssText = `position:fixed;bottom:2rem;right:2rem;padding:1rem 1.5rem;border-radius:8px;
    font-family:var(--font-body,sans-serif);font-size:0.9rem;font-weight:500;z-index:9999;
    max-width:380px;box-shadow:0 8px 32px rgba(0,0,0,0.15);
    background:${type==="success"?"rgba(22,163,74,0.10)":"rgba(220,38,38,0.10)"};
    border:1px solid ${type==="success"?"rgba(22,163,74,0.4)":"rgba(220,38,38,0.4)"};
    color:${type==="success"?"#15803d":"#dc2626"};
    animation:toastIn 0.3s ease;`;
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 4000);
}
const toastStyle = document.createElement("style");
toastStyle.textContent = `@keyframes toastIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}`;
document.head.appendChild(toastStyle);

// Utility
function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" });
}

// JS Exercise 14: jQuery
$(document).ready(function () {
  $(window).on("scroll", function () {
    $("#navbar").toggleClass("scrolled", $(this).scrollTop() > 60);
  });
  $("#hamburger").on("click", function () {
    $("#navLinks").toggleClass("open");
  });
  $(".nav-links a[href^='#']").on("click", function (e) {
    const target = $(this.getAttribute("href"));
    if (target.length) {
      e.preventDefault();
      $("html,body").animate({ scrollTop: target.offset().top - 70 }, 500);
      $("#navLinks").removeClass("open");
    }
  });
  // onchange category filter
  $("#categoryFilter").on("change", function () {
    currentFilter.category = $(this).val(); applyFilters();
  });
  $("#locationFilter").on("change", function () {
    currentFilter.location = $(this).val(); applyFilters();
  });
  // keydown search
  $("#searchInput").on("keydown keyup", function () {
    currentFilter.search = $(this).val().trim(); applyFilters();
  });
  // jQuery fadeIn/fadeOut on load more
  $("#loadMoreBtn").on("click", function () {
    $(this).fadeOut(200, function () {
      showNotification("All events displayed!", "success");
      $(this).fadeIn(300);
    });
  });
});

// Init
function initApp() {
  fetchMockEvents();
  loadSavedPreferences();
  const dateInput = document.getElementById("eventDate");
  if (dateInput) dateInput.min = new Date().toISOString().split("T")[0];
  initGeolocation();
  initPromo();
  const evtEl = document.getElementById("statEvents");
  const resEl = document.getElementById("statResidents");
  const catEl = document.getElementById("statCategories");
  if (evtEl) animateCounter(evtEl, allEvents.length, "+");
  if (resEl) animateCounter(resEl, 1200, "+");
  if (catEl) animateCounter(catEl, 5, "");
  console.log("%c🏙️ CityPulse Ready", "color:#f59e0b;font-size:16px;font-weight:bold;");
}