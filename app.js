window.AVALON = true;
(function () {
try {
  const $ = (id) => document.getElementById(id);
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = matchMedia("(hover:hover) and (pointer:fine)").matches;
  const page = document.body.dataset.page || "";

  const nav = $("nav");
  const menu = $("menu");
  const burger = $("burger");
  if (nav) {
    addEventListener("scroll", () => nav.classList.toggle("scrolled", scrollY > 40), { passive: true });
  }

  if (menu && burger) {
    burger.setAttribute("aria-controls", "menu");
    burger.setAttribute("aria-expanded", "false");
    if (!burger.querySelector("span")) burger.innerHTML = "<span></span><span></span><span></span>";
    if (!menu.querySelector(".menu-foot")) {
      const foot = document.createElement("div");
      foot.className = "menu-foot";
      foot.innerHTML = '<a href="tel:+48533015018"><span class="ic" aria-hidden="true">☎</span><span>533 015 018<small>Zadzwoń</small></span></a><a href="mailto:kdec@bravalon.pl"><span class="ic" aria-hidden="true">✉</span><span>kdec@bravalon.pl<small>Napisz e-mail</small></span></a>';
      menu.appendChild(foot);
    }
    let bg = document.querySelector(".menu-bg");
    if (!bg) {
      bg = document.createElement("div");
      bg.className = "menu-bg";
      document.body.appendChild(bg);
    }
    function setMenu(open) {
      menu.classList.toggle("open", open);
      document.body.classList.toggle("menu-open", open);
      burger.setAttribute("aria-expanded", open ? "true" : "false");
      if (open) {
        const first = menu.querySelector("a");
        if (first) first.focus();
      }
    }
    burger.addEventListener("click", (e) => {
      e.preventDefault();
      setMenu(!menu.classList.contains("open"));
    });
    bg.addEventListener("click", () => setMenu(false));
    menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && menu.classList.contains("open")) {
        setMenu(false);
        burger.focus();
      }
    });
    addEventListener("resize", () => {
      if (innerWidth > 720) setMenu(false);
    });
  }

  function countUp(el) {
    const target = +el.dataset.count;
    if (!target || reduce) return;
    const from = target > 1000 ? target - 40 : 0;
    const dur = 1200;
    const st = performance.now();
    (function frame(now) {
      const p = Math.min((now - st) / dur, 1);
      el.textContent = String(Math.round(from + (target - from) * (1 - Math.pow(1 - p, 3))));
      if (p < 1) requestAnimationFrame(frame);
    })(st);
  }

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add("in");
        e.target.querySelectorAll("[data-count]").forEach(countUp);
        io.unobserve(e.target);
      });
    }, { threshold: 0.15 });
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
  } else {
    document.querySelectorAll(".reveal").forEach((el) => el.classList.add("in"));
  }

  const sections = [...document.querySelectorAll("main section[id], main header[id]")];
  const navLinks = menu ? [...menu.querySelectorAll('a[href^="#"]')] : [];
  if (sections.length && navLinks.length && "IntersectionObserver" in window) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        const id = en.target.id;
        navLinks.forEach((a) => a.classList.toggle("is-active", a.getAttribute("href") === "#" + id));
      });
    }, { rootMargin: "-40% 0px -50% 0px", threshold: 0.01 });
    sections.forEach((s) => spy.observe(s));
  }

  document.querySelectorAll(".faq-item").forEach((item) => {
    const q = item.querySelector(".faq-q");
    const a = item.querySelector(".faq-a");
    if (!q || !a) return;
    if (!a.id) a.id = "faq-a-" + Math.random().toString(36).slice(2, 7);
    q.setAttribute("aria-expanded", "false");
    q.setAttribute("aria-controls", a.id);
    q.addEventListener("click", () => {
      const open = item.classList.contains("open");
      document.querySelectorAll(".faq-item").forEach((other) => {
        other.classList.remove("open");
        const oq = other.querySelector(".faq-q");
        const oa = other.querySelector(".faq-a");
        if (oq) oq.setAttribute("aria-expanded", "false");
        if (oa) oa.style.maxHeight = "0px";
      });
      if (!open) {
        item.classList.add("open");
        q.setAttribute("aria-expanded", "true");
        a.style.maxHeight = a.scrollHeight + "px";
      }
    });
  });
  addEventListener("resize", () => {
    document.querySelectorAll(".faq-item.open .faq-a").forEach((a) => {
      a.style.maxHeight = a.scrollHeight + "px";
    });
  });

  const SERVICES = {
    ksiegi: { e: "Spółki i firmy na pełnej księgowości", t: "Pełna księgowość", d: "Prowadzimy i przechowujemy księgi handlowe zgodnie z ustawą o rachunkowości i przepisami podatkowymi.", l: ["Ewidencja syntetyczna i analityczna", "Badanie dokumentów pod względem formalnym i rachunkowym", "Kwalifikacja dokumentów w świetle prawa bilansowego i podatkowego", "Zamknięcia miesięcy i roku obrotowego", "Sprawozdanie finansowe: bilans, rachunek zysków i strat"] },
    kpir: { e: "JDG i spółki osobowe", t: "KPiR i ryczałt", d: "Prowadzimy księgę przychodów i rozchodów oraz ewidencje dla firm rozliczających się w uproszczony sposób.", l: ["Księga przychodów i rozchodów", "Ewidencje przychodów dla ryczałtu", "Zaliczki na podatek dochodowy", "Roczne zeznanie PIT", "Dodatkowy PIT roczny dla członków rodziny"] },
    vat: { e: "Rozliczenia z urzędem skarbowym", t: "VAT, JPK i podatki", d: "Liczymy podatki, wypełniamy deklaracje, podpisujemy je i składamy w urzędzie skarbowym właściwym dla siedziby firmy.", l: ["Ewidencje sprzedaży i zakupu dla celów VAT", "Pliki JPK_V7", "Zaliczki na podatek dochodowy (PIT i CIT)", "Roczne zeznania podatkowe", "Mailowa informacja o kwotach i terminach płatności"] },
    kadry: { e: "Obsługa pracowników", t: "Kadry i płace", d: "Prowadzimy sprawy kadrowo-płacowe w systemie Comarch ERP Optima – od umowy o pracę po roczne rozliczenie pracownika.", l: ["Umowy o pracę, listy płac, kartoteki wynagrodzeń", "Deklaracje ZUS, PIT-4 i PIT-11", "Ewidencja urlopów, zwolnień lekarskich i nieobecności", "Umowy cywilnoprawne i ich rozliczanie"] },
    srodki: { e: "Majątek firmy", t: "Środki trwałe i wyposażenie", d: "Prowadzimy ewidencje majątku na podstawie przekazanej dokumentacji źródłowej i naliczamy amortyzację.", l: ["Ewidencja środków trwałych", "Wartości niematerialne i prawne", "Ewidencja wyposażenia", "Plany amortyzacji"] },
    sprawozdania: { e: "Dokumenty dla instytucji", t: "Sprawozdania i pisma", d: "Przygotowujemy dokumenty, o które proszą urzędy, banki i instytucje finansujące.", l: ["Sprawozdania do GUS", "Bilans oraz rachunek zysków i strat", "Zestawienia dla banku i firmy leasingowej", "Dokumenty do rozliczenia umów o dofinansowanie", "Pomoc w przygotowaniu pism urzędowych w sprawach podatkowych"] }
  };

  const modal = $("modal");
  let lastFocus = null;
  if (modal) modal.setAttribute("inert", "");
  function focusable(root) {
    return [...root.querySelectorAll('a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])')].filter((el) => el.offsetParent !== null || el === document.activeElement);
  }
  function openModal(key) {
    const s = SERVICES[key];
    if (!s || !modal) return;
    lastFocus = document.activeElement;
    $("m-eyebrow").textContent = s.e;
    $("m-title").textContent = s.t;
    $("m-desc").textContent = s.d;
    $("m-list").innerHTML = s.l.map((x) => "<li>" + x + "</li>").join("");
    modal.classList.add("open");
    modal.removeAttribute("inert");
    document.body.classList.add("modal-open");
    document.body.style.overflow = "hidden";
    const closeBtn = modal.querySelector(".modal-close");
    if (closeBtn) closeBtn.focus();
  }
  function closeModal() {
    if (!modal || !modal.classList.contains("open")) return;
    modal.classList.remove("open");
    modal.setAttribute("inert", "");
    document.body.classList.remove("modal-open");
    document.body.style.overflow = "";
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  document.querySelectorAll("[data-modal]").forEach((b) => b.addEventListener("click", () => openModal(b.dataset.modal)));
  if (modal) {
    modal.querySelectorAll("[data-close]").forEach((b) => b.addEventListener("click", closeModal));
    modal.addEventListener("keydown", (e) => {
      if (e.key === "Escape") { closeModal(); return; }
      if (e.key !== "Tab") return;
      const list = focusable(modal);
      if (!list.length) return;
      const first = list[0];
      const last = list[list.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
  }
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });

  function toast(message, kind) {
    const t = $("toast");
    if (!t) return;
    t.textContent = message;
    t.classList.remove("ok", "err");
    if (kind) t.classList.add(kind);
    t.classList.add("show");
    document.body.classList.add("toast-on");
    clearTimeout(toast._t);
    toast._t = setTimeout(() => {
      t.classList.remove("show");
      document.body.classList.remove("toast-on");
    }, 4200);
  }
  window.avalonToast = toast;

  const form = $("form");
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const data = new FormData(form);
      if (String(data.get("_honey") || "").trim()) {
        toast("Dziękujemy. Wiadomość została przekazana.", "ok");
        form.reset();
        return;
      }
      const name = String(data.get("Imię i nazwisko") || "").trim();
      const email = String(data.get("E-mail") || "").trim();
      const ok = form.querySelector("#f-ok");
      if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        toast("Podaj imię i nazwisko oraz poprawny e-mail.", "err");
        return;
      }
      if (ok && !ok.checked) {
        toast("Zaznacz zgodę na przetwarzanie danych.", "err");
        return;
      }
      const btn = form.querySelector('[type="submit"]');
      if (btn) btn.disabled = true;
      const payload = {
        _subject: form.dataset.subject || "Zapytanie ze strony BR AVALON",
        _template: "table",
        _captcha: "false",
        _replyto: email
      };
      for (const [key, value] of data.entries()) {
        if (key.startsWith("_") || key === "consent") continue;
        payload[key] = String(value).trim();
      }
      try {
        const res = await fetch("https://formsubmit.co/ajax/kdec@bravalon.pl", {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(payload)
        });
        const json = await res.json().catch(() => ({}));
        const success = json.success === true || json.success === "true";
        if (!res.ok || !success) {
          const msg = String(json.message || "");
          if (/activat/i.test(msg)) {
            toast("Formularz czeka na jednorazowe potwierdzenie skrzynki kdec@bravalon.pl. Do tego czasu napisz bezpośrednio na ten adres.", "err");
          } else {
            toast("Nie udało się wysłać. Napisz na kdec@bravalon.pl albo zadzwoń: 533 015 018.", "err");
          }
          return;
        }
        form.reset();
        toast("Dziękujemy. Wiadomość jest w drodze do biura.", "ok");
      } catch (err) {
        toast("Brak połączenia. Napisz na kdec@bravalon.pl albo zadzwoń: 533 015 018.", "err");
      } finally {
        if (btn) btn.disabled = false;
      }
    });
  }

  if (location.search.indexOf("wyslano=1") !== -1) {
    toast("Dziękujemy. Wiadomość została wysłana.", "ok");
    try { history.replaceState(null, "", location.pathname + location.hash); } catch (e) {}
  }

  if ($("yr")) $("yr").textContent = String(new Date().getFullYear());

  if (fine && !reduce) {
    document.querySelectorAll(".btn-gold").forEach((btn) => {
      if (btn.closest("form") || btn.closest(".menu") || btn.closest(".map")) return;
      btn.addEventListener("pointermove", (e) => {
        const r = btn.getBoundingClientRect();
        const x = Math.max(-8, Math.min(8, (e.clientX - (r.left + r.width / 2)) / 8));
        const y = Math.max(-6, Math.min(6, (e.clientY - (r.top + r.height / 2)) / 8));
        btn.style.transform = "translate(" + x.toFixed(1) + "px," + y.toFixed(1) + "px)";
      });
      btn.addEventListener("pointerleave", () => { btn.style.transform = ""; });
    });
    document.querySelectorAll(".svc, .partner").forEach((card) => {
      card.addEventListener("pointermove", (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        const lift = card.classList.contains("partner") ? -8 : -6;
        card.style.transform = "translateY(" + lift + "px) rotateX(" + (-py * 7).toFixed(2) + "deg) rotateY(" + (px * 8).toFixed(2) + "deg)";
      });
      card.addEventListener("pointerleave", () => { card.style.transform = ""; });
    });
  }

  initCalendar();
  initFolder();
  initRhythm();
  initVideo();
  if (page === "home") initPricing();
  if (page === "leasing") initLeasing();
  if (page === "siedziba") initSiedziba();

  const cmp = $("cmp");
  if (cmp) {
    const heads = [...cmp.querySelectorAll("thead th")].map((x) => x.textContent.trim());
    cmp.querySelectorAll("tbody tr").forEach((tr) => {
      [...tr.children].forEach((td, i) => { if (i) td.dataset.l = heads[i]; });
    });
    cmp.querySelectorAll("thead th[data-col]").forEach((th) => {
      th.setAttribute("tabindex", "0");
      th.setAttribute("role", "button");
      const toggle = () => {
        const col = +th.dataset.col;
        const on = th.classList.contains("hl");
        cmp.querySelectorAll(".hl").forEach((x) => x.classList.remove("hl"));
        if (!on) cmp.querySelectorAll("tr").forEach((tr) => { if (tr.children[col]) tr.children[col].classList.add("hl"); });
      };
      th.addEventListener("click", toggle);
      th.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(); }
      });
    });
  }

  function initCalendar() {
    const box = $("deadlines");
    if (!box) return;
    const items = [
      { day: 10, shift: false, title: "Dokumenty do biura", desc: "za poprzedni miesiąc" },
      { day: 15, shift: true, title: "Składki ZUS", desc: "termin płatności dla firm" },
      { day: 20, shift: true, title: "PIT i CIT", desc: "zaliczki na podatek dochodowy, PIT-4" },
      { day: 25, shift: true, title: "VAT i JPK_V7", desc: "deklaracja i płatność VAT" }
    ];
    const monthNom = ["Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec", "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień"];
    const monthOf = ["stycznia", "lutego", "marca", "kwietnia", "maja", "czerwca", "lipca", "sierpnia", "września", "października", "listopada", "grudnia"];
    const monthShort = ["sty", "lut", "mar", "kwi", "maj", "cze", "lip", "sie", "wrz", "paź", "lis", "gru"];
    const now = new Date();
    let view = new Date(now.getFullYear(), now.getMonth(), 1);

    function easter(year) {
      const a = year % 19;
      const b = Math.floor(year / 100);
      const c = year % 100;
      const d = Math.floor(b / 4);
      const e = b % 4;
      const f = Math.floor((b + 8) / 25);
      const g = Math.floor((b - f + 1) / 3);
      const h = (19 * a + b - d - g + 15) % 30;
      const i = Math.floor(c / 4);
      const k = c % 4;
      const l = (32 + 2 * e + 2 * i - h - k) % 7;
      const m = Math.floor((a + 11 * h + 22 * l) / 451);
      const month = Math.floor((h + l - 7 * m + 114) / 31);
      const day = ((h + l - 7 * m + 114) % 31) + 1;
      return new Date(year, month - 1, day);
    }
    function iso(d) {
      return d.getFullYear() + "-" + d.getMonth() + "-" + d.getDate();
    }
    const holidayCache = {};
    function holidaySet(year) {
      if (holidayCache[year]) return holidayCache[year];
      const set = new Set();
      [[0, 1], [0, 6], [4, 1], [4, 3], [7, 15], [10, 1], [10, 11], [11, 25], [11, 26]].forEach(([m, d]) => set.add(iso(new Date(year, m, d))));
      const ea = easter(year);
      set.add(iso(ea));
      const mon = new Date(ea); mon.setDate(ea.getDate() + 1); set.add(iso(mon));
      const cc = new Date(ea); cc.setDate(ea.getDate() + 60); set.add(iso(cc));
      holidayCache[year] = set;
      return set;
    }
    function isOff(d) {
      return d.getDay() === 0 || d.getDay() === 6 || holidaySet(d.getFullYear()).has(iso(d));
    }
    function roll(date) {
      const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      let guard = 0;
      while (isOff(d) && guard < 14) { d.setDate(d.getDate() + 1); guard++; }
      return d;
    }
    function startOfDay(d) { return new Date(d.getFullYear(), d.getMonth(), d.getDate()); }
    function dueFor(year, month, item) {
      const nominal = new Date(year, month, item.day);
      const actual = item.shift ? roll(nominal) : nominal;
      return { nominal, actual, shifted: actual.getTime() !== nominal.getTime() };
    }
    function upcoming(from) {
      const list = [];
      for (let i = 0; i < 4; i++) {
        const base = new Date(from.getFullYear(), from.getMonth() + i, 1);
        items.forEach((item) => {
          const due = dueFor(base.getFullYear(), base.getMonth(), item);
          list.push(Object.assign({ item }, due));
        });
      }
      const today = startOfDay(from);
      return list
        .filter((x) => startOfDay(x.actual).getTime() >= today.getTime())
        .sort((a, b) => a.actual - b.actual)[0] || null;
    }
    function dayWord(n) { return n === 1 ? "1 dzień" : "za " + n + " dni"; }
    function whenText(actual) {
      const today = startOfDay(new Date());
      const due = startOfDay(actual);
      const diff = Math.round((due - today) / 86400000);
      if (diff < 0) return "termin minął";
      if (diff === 0) return "dziś";
      if (diff === 1) return "jutro";
      return dayWord(diff);
    }
    function render() {
      const y = view.getFullYear();
      const m = view.getMonth();
      const sub = $("cal-sub");
      if (sub) sub.textContent = monthNom[m] + " " + y;
      const next = upcoming(new Date());
      const rows = items.map((item) => {
        const due = dueFor(y, m, item);
        const isNext = next && next.item.title === item.title && startOfDay(next.actual).getTime() === startOfDay(due.actual).getTime();
        const note = due.shifted ? " · " + due.actual.getDate() + " " + monthOf[due.actual.getMonth()] + " (przesunięty)" : "";
        return '<div class="deadline' + (isNext ? " next" : "") + '"><div class="day">' + due.actual.getDate() + '</div><div><b>' + item.title + '</b><span>' + item.desc + note + '</span></div></div>';
      }).join("");
      box.innerHTML = rows;
      const countN = $("cal-count-n");
      const countT = $("cal-count-t");
      const countD = $("cal-count-d");
      if (next && countN && countT && countD) {
        const today = startOfDay(new Date());
        const diff = Math.round((startOfDay(next.actual) - today) / 86400000);
        countN.textContent = diff === 0 ? "dziś" : diff === 1 ? "1" : String(diff);
        countT.textContent = next.item.title;
        countD.textContent = next.actual.getDate() + " " + monthOf[next.actual.getMonth()] + " · " + whenText(next.actual);
      }
      const pill = $("next-pill");
      if (pill && next) {
        const label = pill.querySelector("strong");
        const when = pill.querySelector("em");
        if (label) label.textContent = next.item.title + " · " + next.actual.getDate() + " " + monthShort[next.actual.getMonth()];
        if (when) when.textContent = whenText(next.actual);
      }
      const note = $("cal-note");
      if (note) {
        const same = view.getFullYear() === now.getFullYear() && view.getMonth() === now.getMonth();
        note.textContent = same ? "Dni płatności wypadające w weekend lub święto pokazujemy w najbliższym dniu roboczym. 10. to termin przekazania dokumentów do biura." : "Oglądasz inny miesiąc. Odliczanie u góry dotyczy najbliższego terminu.";
      }
    }
    const prev = $("cal-prev");
    const nextBtn = $("cal-next");
    if (prev) prev.addEventListener("click", () => { view.setMonth(view.getMonth() - 1); render(); });
    if (nextBtn) nextBtn.addEventListener("click", () => { view.setMonth(view.getMonth() + 1); render(); });
    render();
    const pill = $("next-pill");
    if (pill) {
      const hero = document.querySelector(".hero");
      const onScroll = () => {
        const past = hero ? hero.getBoundingClientRect().bottom < 80 : scrollY > 520;
        pill.classList.toggle("is-on", past);
      };
      addEventListener("scroll", onScroll, { passive: true });
      onScroll();
    }
  }

  function initFolder() {
    const root = $("folder-app");
    if (!root) return;
    const zone = root.querySelector(".dropzone");
    const tiles = root.querySelector(".tax-tiles");
    const countEl = root.querySelector(".drop-count");
    const invoices = [...root.querySelectorAll(".invoice")];
    let suppress = false;
    function filed() { return invoices.filter((i) => i.classList.contains("is-in")).length; }
    function paint() {
      const n = filed();
      if (countEl) countEl.textContent = n + " / " + invoices.length;
      if (zone) zone.setAttribute("aria-label", "Folder Avalon. Wrzucone " + n + " z " + invoices.length + ". Kliknij, aby wrzucić kolejną przykładową fakturę.");
      if (n === invoices.length && tiles) {
        zone.classList.add("is-full");
        tiles.hidden = false;
        requestAnimationFrame(() => tiles.classList.add("is-on"));
      }
    }
    function accept(inv) {
      if (!inv || inv.classList.contains("is-in")) return;
      inv.classList.add("is-in");
      inv.setAttribute("aria-pressed", "true");
      paint();
    }
    function nextInv() { return invoices.find((i) => !i.classList.contains("is-in")); }
    invoices.forEach((inv) => {
      inv.addEventListener("click", () => {
        if (inv.dataset.dragged === "1") { inv.dataset.dragged = ""; return; }
        accept(inv);
      });
    });
    if (zone) {
      zone.addEventListener("click", () => { if (suppress) return; accept(nextInv()); });
      zone.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); accept(nextInv()); }
      });
    }
    let drag = null;
    invoices.forEach((inv) => {
      inv.addEventListener("pointerdown", (e) => {
        if (inv.classList.contains("is-in") || e.button > 0) return;
        drag = { inv, id: e.pointerId, x: e.clientX, y: e.clientY, moved: false, ghost: null };
      });
    });
    addEventListener("pointermove", (e) => {
      if (!drag || e.pointerId !== drag.id) return;
      const dx = e.clientX - drag.x;
      const dy = e.clientY - drag.y;
      if (!drag.moved && Math.hypot(dx, dy) < 8) return;
      if (!drag.moved) {
        drag.moved = true;
        const ghost = drag.inv.cloneNode(true);
        ghost.classList.add("invoice-ghost");
        ghost.removeAttribute("id");
        document.body.appendChild(ghost);
        drag.ghost = ghost;
        drag.inv.classList.add("is-dragging");
      }
      drag.ghost.style.left = e.clientX + "px";
      drag.ghost.style.top = e.clientY + "px";
      if (zone) {
        const r = zone.getBoundingClientRect();
        zone.classList.toggle("is-over", e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom);
      }
    }, { passive: true });
    addEventListener("pointerup", (e) => {
      if (!drag || e.pointerId !== drag.id) return;
      const current = drag;
      drag = null;
      if (zone) zone.classList.remove("is-over");
      current.inv.classList.remove("is-dragging");
      if (current.ghost) current.ghost.remove();
      if (!current.moved || !zone) return;
      current.inv.dataset.dragged = "1";
      const r = zone.getBoundingClientRect();
      const over = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
      if (over) {
        suppress = true;
        accept(current.inv);
        setTimeout(() => { suppress = false; }, 250);
      }
    });
    addEventListener("pointercancel", () => {
      if (!drag) return;
      drag.inv.classList.remove("is-dragging");
      if (drag.ghost) drag.ghost.remove();
      drag = null;
    });
    const reset = root.querySelector(".folder-reset");
    if (reset) {
      reset.addEventListener("click", () => {
        invoices.forEach((inv) => {
          inv.classList.remove("is-in", "is-dragging");
          inv.setAttribute("aria-pressed", "false");
          inv.dataset.dragged = "";
        });
        if (zone) zone.classList.remove("is-full", "is-over");
        if (tiles) { tiles.classList.remove("is-on"); tiles.hidden = true; }
        paint();
      });
    }
    paint();
  }

  function initRhythm() {
    const el = $("rhythm");
    if (!el) return;
    const steps = [...el.querySelectorAll(".rhythm-step")];
    if (reduce) {
      el.style.setProperty("--p", "1");
      steps.forEach((s) => s.classList.add("is-on"));
      return;
    }
    const draw = () => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight || 800;
      const total = r.height + vh * 0.45;
      const passed = vh * 0.82 - r.top;
      const p = Math.min(1, Math.max(0, passed / total));
      el.style.setProperty("--p", p.toFixed(3));
      steps.forEach((s, i) => s.classList.toggle("is-on", p > (i + 0.2) / steps.length));
    };
    addEventListener("scroll", draw, { passive: true });
    addEventListener("resize", draw);
    draw();
  }

  function initVideo() {
    const v = $("promo");
    if (!v) return;
    const card = v.closest(".vid-card") || v.parentNode;
    const play = $("vid-play");
    const snd = $("vid-sound");
    let loaded = false;
    function load() {
      if (loaded) return;
      v.querySelectorAll("source[data-src]").forEach((s) => { s.src = s.dataset.src; });
      v.load();
      loaded = true;
    }
    function setSound(on) {
      v.muted = !on;
      if (snd) snd.innerHTML = on ? "🔊 <em>Wycisz</em>" : "🔇 <em>Włącz dźwięk</em>";
    }
    function start(withSound) {
      load();
      setSound(withSound);
      const pr = v.play();
      if (pr && pr.catch) pr.catch(() => {});
      card.classList.add("playing");
    }
    if (play) play.addEventListener("click", () => { v.currentTime = 0; start(true); });
    if (snd) snd.addEventListener("click", (e) => { e.stopPropagation(); setSound(v.muted); });
    v.addEventListener("click", () => {
      if (v.paused) start(!v.muted);
      else { v.pause(); card.dataset.stopped = "1"; card.classList.remove("playing"); }
    });
    if ("IntersectionObserver" in window) {
      new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            load();
            if (!reduce && v.paused && !card.dataset.stopped) start(false);
          } else if (!v.paused) v.pause();
        });
      }, { rootMargin: "200px", threshold: 0.45 }).observe(v);
    }
  }

  function initPricing() {
    const docs = $("docs");
    if (!docs) return;
    const TIERS = [[20, 504], [50, 714], [100, 1155], [200, 1805], [350, 2857], [500, 4026], [750, 5571], [1000, 7207], [1500, 9350], [2000, 10649]];
    const EXTRA = 3, PER = 50, VAT = 0.23, SLIDER_MAX = 3000;
    const emp = $("emp"), docsNum = $("docs-num"), empNum = $("emp-num");
    const money = (n) => n.toLocaleString("pl-PL", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const toDocs = (v) => Math.round(SLIDER_MAX * Math.pow(v / 100, 2.2));
    const toSlider = (n) => Math.round(100 * Math.pow(Math.min(n, SLIDER_MAX) / SLIDER_MAX, 1 / 2.2));
    function price(n, e) {
      let i = TIERS.findIndex((t) => n <= t[0]);
      if (i < 0) i = TIERS.length - 1;
      const base = TIERS[i][1];
      const extra = Math.max(0, n - 2000);
      const from = i === 0 ? 0 : TIERS[i - 1][0] + 1;
      const label = i === 0 ? "do 20" : from + "–" + TIERS[i][0];
      const rows = [["Usługi księgowe – pakiet " + label + " dokumentów", 1, base, base]];
      if (extra) rows.push(["Dokumenty powyżej 2000 szt.", extra, EXTRA, extra * EXTRA]);
      if (e) rows.push(["Obsługa kadrowo-płacowa pracownika", e, PER, e * PER]);
      const net = rows.reduce((s, r) => s + r[3], 0);
      const vat = Math.round(net * VAT * 100) / 100;
      return { label, extra, rows, net, vat, gross: net + vat };
    }
    function render() {
      const n = Math.max(0, Math.floor(+docsNum.value || 0));
      const e = Math.max(0, Math.floor(+empNum.value || 0));
      const r = price(n, e);
      $("price").innerHTML = money(r.net) + " <small>zł netto / mies.</small>";
      $("tier").innerHTML = "pakiet " + r.label + " dokumentów" + (r.extra ? "<br>+ " + r.extra + " × 3,00 zł za dokumenty powyżej 2000" : "") + (e ? "<br>+ " + e + " × 50,00 zł za pracownika" : "");
      $("inv-rows").innerHTML = r.rows.map((x) => "<tr><td>" + x[0] + "</td><td>" + x[1] + "</td><td>" + money(x[2]) + "</td><td>" + money(x[3]) + "</td></tr>").join("");
      $("inv-net").textContent = money(r.net) + " zł";
      $("inv-vat").textContent = money(r.vat) + " zł";
      $("inv-gross").textContent = money(r.gross) + " zł";
    }
    docs.addEventListener("input", () => { docsNum.value = toDocs(+docs.value); render(); });
    emp.addEventListener("input", () => { empNum.value = emp.value; render(); });
    docsNum.addEventListener("input", () => { docs.value = toSlider(+docsNum.value || 0); render(); });
    empNum.addEventListener("input", () => { emp.value = Math.min(50, +empNum.value || 0); render(); });
    const invToggle = $("inv-toggle");
    invToggle.addEventListener("click", function () {
      const open = $("inv").classList.toggle("open");
      this.setAttribute("aria-expanded", open ? "true" : "false");
      this.classList.toggle("open", open);
    });
    render();
  }

  function initLeasing() {
    const box = $("offers");
    if (box) {
      const offers = [...box.querySelectorAll(".offer")];
      const tag = $("best-tag");
      if (reduce) {
        offers.forEach((el) => el.classList.add("show"));
        if (tag) tag.classList.add("show");
      } else {
        offers.forEach((el, i) => setTimeout(() => el.classList.add("show"), 280 + i * 280));
        if (tag) setTimeout(() => tag.classList.add("show"), 280 + offers.length * 280 + 280);
      }
    }
    const CATS = [
      { k: "Samochody osobowe", d: "Najczęściej leasingowany przedmiot w firmach. Porównujemy oferty dla aut nowych i używanych, z ubezpieczeniem lub bez.", l: ["Auta nowe i używane, także elektryczne i hybrydowe", "Wpłata własna od 0% w części ofert", "Pakiety serwisowe i opony w racie – na życzenie", "Wykup na firmę lub na osobę prywatną"], t: "Przy autach osobowych sprawdzamy limity zaliczania rat do kosztów i zasady odliczania VAT (50% lub 100%). Od tego zależy realny koszt." },
      { k: "Dostawcze i ciężarowe", d: "Pojazdy do pracy: dostawczaki, ciężarówki, ciągniki siodłowe i naczepy. Dobieramy okres do planowanego przebiegu.", l: ["Pojazdy do 3,5 t i powyżej", "Naczepy, przyczepy, zabudowy specjalistyczne", "Pełne odliczenie VAT przy spełnieniu warunków", "Finansowanie floty kilku pojazdów naraz"], t: "Przy flocie opłaca się zapytać kilku leasingodawców o ofertę zbiorczą – różnice w koszcie całkowitym bywają znaczące." },
      { k: "Maszyny i urządzenia", d: "Maszyny produkcyjne, budowlane, rolnicze i linie technologiczne – nowe i używane.", l: ["Maszyny CNC, prasy, wtryskarki, linie produkcyjne", "Koparki, ładowarki, wózki widłowe", "Harmonogram rat dopasowany do sezonowości", "Możliwość połączenia z dotacją lub ulgą"], t: "Jeśli firma stara się o dotację na maszynę, warto sprawdzić zasady naboru przed podpisaniem leasingu – nie każdy program uznaje go za koszt." },
      { k: "Sprzęt IT i biurowy", d: "Komputery, serwery, oprogramowanie z licencją i wyposażenie biura – często przy niewielkiej wpłacie.", l: ["Laptopy, serwery, sieć, drukarki", "Oprogramowanie i licencje w pakiecie ze sprzętem", "Krótkie okresy – łatwa wymiana na nowszy sprzęt", "Uproszczone procedury przy mniejszych kwotach"], t: "Przy sprzęcie IT liczy się elastyczność – krótszy okres i niski wykup ułatwiają regularną wymianę." },
      { k: "Sprzęt medyczny", d: "Wyposażenie gabinetów, klinik i laboratoriów: aparatura diagnostyczna, stomatologiczna i estetyczna.", l: ["USG, RTG, unity stomatologiczne, lasery", "Aparatura laboratoryjna", "Oferty dedykowane dla lekarzy i gabinetów", "Finansowanie także dla nowo otwieranych praktyk"], t: "Część leasingodawców ma specjalne programy dla branży medycznej z łagodniejszymi wymaganiami dla młodych praktyk." },
      { k: "Nieruchomości i leaseback", d: "Leasing lokali, hal i biur oraz leaseback, czyli odsprzedaż posiadanego majątku firmie leasingowej, żeby uwolnić gotówkę.", l: ["Hale, magazyny, lokale usługowe i biura", "Leaseback maszyn, pojazdów i nieruchomości", "Dłuższe okresy finansowania", "Uwolnienie kapitału na rozwój firmy"], t: "Leaseback to sposób na szybką gotówkę bez sprzedaży majątku – ale ma skutki w VAT i podatku dochodowym, które liczymy przed decyzją." }
    ];
    const tabs = $("tabs");
    const panel = $("tab-panel");
    function showCat(i) {
      [...tabs.children].forEach((t, j) => {
        t.classList.toggle("on", i === j);
        t.setAttribute("aria-selected", i === j ? "true" : "false");
      });
      const c = CATS[i];
      panel.innerHTML = '<div class="tab-panel"><div><h3>' + c.k + '</h3><p>' + c.d + '</p><ul>' + c.l.map((x) => "<li>" + x + "</li>").join("") + '</ul></div><div class="tip"><span class="eyebrow">Wskazówka księgowego</span><p>' + c.t + '</p><a href="#kontakt" class="btn btn-dark" style="margin-top:20px">Zapytaj o ofertę →</a></div></div>';
    }
    if (tabs && panel) {
      CATS.forEach((c, i) => {
        const b = document.createElement("button");
        b.className = "tab";
        b.type = "button";
        b.textContent = c.k;
        b.setAttribute("role", "tab");
        b.setAttribute("aria-selected", "false");
        b.addEventListener("click", () => showCat(i));
        tabs.appendChild(b);
      });
      tabs.setAttribute("role", "tablist");
      showCat(0);
    }
    if ($("v")) {
      const zl = (n) => Math.round(n).toLocaleString("pl-PL") + " zł";
      function calc() {
        const V = +$("v").value, wp = +$("w").value / 100, n = +$("n").value, bp = +$("b").value / 100, r = 0.08 / 12;
        const W = V * wp, B = V * bp;
        const pv = V - W - B / Math.pow(1 + r, n);
        const rate = pv * r / (1 - Math.pow(1 + r, -n));
        const sum = W + rate * n + B;
        $("v-val").textContent = zl(V);
        $("w-val").textContent = Math.round(wp * 100) + "% · " + zl(W);
        $("n-val").textContent = n + " mies.";
        $("b-val").textContent = Math.round(bp * 100) + "% · " + zl(B);
        $("rate").innerHTML = "ok. " + zl(rate).replace(" zł", "") + " <small>zł netto / mies.</small>";
        $("r-w").textContent = zl(W);
        $("r-b").textContent = zl(B);
        $("r-sum").textContent = zl(sum);
        $("r-pct").textContent = (sum / V * 100).toFixed(1).replace(".", ",") + "%";
      }
      ["v", "w", "n", "b"].forEach((id) => $(id).addEventListener("input", calc));
      calc();
    }
  }

  function initSiedziba() {
    function setTab(k) {
      document.querySelectorAll(".opt-tab").forEach((t) => {
        const on = t.dataset.tab === k;
        t.classList.toggle("on", on);
        t.setAttribute("aria-selected", on ? "true" : "false");
      });
      document.querySelectorAll(".opt-panel").forEach((p) => p.classList.toggle("on", p.id === "p-" + k));
      const sel = $("f-service");
      if (sel) sel.selectedIndex = { siedziba: 0, adres: 1, pakiet: 2 }[k] || 0;
      try { if (location.hash !== "#" + k) history.replaceState(null, "", "#" + k); } catch (e) {}
    }
    document.querySelectorAll(".opt-tab").forEach((t) => t.addEventListener("click", () => setTab(t.dataset.tab)));
    document.querySelectorAll("[data-go]").forEach((a) => a.addEventListener("click", () => setTab(a.dataset.go)));
    const h = location.hash.slice(1);
    if (["siedziba", "adres", "pakiet"].includes(h)) {
      setTab(h);
      setTimeout(() => { const el = $("opcje"); if (el) el.scrollIntoView(); }, 50);
    }

    const flow = $("flow");
    if (flow) {
      const steps = [...flow.children];
      if (reduce) steps.forEach((x) => x.classList.add("on"));
      else {
        let i = 0;
        const tick = () => {
          steps.forEach((x, j) => x.classList.toggle("on", j <= i));
          i = (i + 1) % (steps.length + 1);
        };
        tick();
        setInterval(tick, 1200);
      }
    }
    document.querySelectorAll(".get").forEach((g) => {
      g.setAttribute("aria-expanded", "false");
      g.addEventListener("click", () => {
        const open = g.classList.toggle("open");
        g.setAttribute("aria-expanded", open ? "true" : "false");
      });
    });
    const boxes = [...document.querySelectorAll("#checklist input")];
    function chk() {
      const n = boxes.filter((b) => b.checked).length;
      if ($("prog")) $("prog").style.width = (n / boxes.length * 100) + "%";
      const miss = boxes.filter((b) => !b.checked).map((b) => b.parentNode.textContent.trim());
      const ours = miss.filter((m) => /Adres siedziby|Biuro rachunkowe/.test(m));
      if ($("check-msg")) {
        $("check-msg").textContent = n === boxes.length
          ? "Masz wszystko – możesz rejestrować firmę."
          : (ours.length ? "W tym pomożemy: " + ours.join(", ").toLowerCase() + "." : "Brakuje: " + miss.join(", ").toLowerCase() + ".");
      }
    }
    boxes.forEach((b) => b.addEventListener("change", chk));
    if (boxes.length) chk();

    if ($("m2")) {
      const zl = (n) => Math.round(n).toLocaleString("pl-PL") + " zł";
      function cost() {
        const m = +$("m2").value, s = +$("st").value, md = +$("md").value;
        $("m2-val").textContent = m + " m²";
        $("st-val").textContent = s + " zł";
        $("md-val").textContent = zl(md);
        $("year-val").textContent = zl((m * s + md) * 12);
      }
      ["m2", "st", "md"].forEach((id) => $(id).addEventListener("input", cost));
      cost();
    }
    const items = [...document.querySelectorAll(".cfg-item")];
    function sum() {
      const on = items.filter((i) => i.classList.contains("on")).map((i) => i.dataset.k);
      if ($("sum")) $("sum").innerHTML = on.map((x) => "<li>" + x + "</li>").join("");
      if ($("badge")) $("badge").style.display = on.includes("Księgowość BR AVALON") ? "inline-block" : "none";
    }
    items.forEach((i) => i.addEventListener("click", () => {
      if (i.classList.contains("locked")) { toast("Adres siedziby jest podstawą każdego pakietu."); return; }
      i.classList.toggle("on");
      i.setAttribute("aria-pressed", i.classList.contains("on") ? "true" : "false");
      sum();
    }));
    if (items.length) {
      items.forEach((i) => i.setAttribute("aria-pressed", i.classList.contains("on") ? "true" : "false"));
      sum();
    }
    if ($("send-pkg")) {
      $("send-pkg").addEventListener("click", () => {
        if ($("f-service")) $("f-service").selectedIndex = 2;
        const on = items.filter((i) => i.classList.contains("on")).map((i) => "– " + i.dataset.k).join("\n");
        if ($("f-msg")) $("f-msg").value = "Proszę o wycenę pakietu:\n" + on;
      });
    }
  }
} catch (err) {
  console.error(err);
  document.querySelectorAll(".reveal").forEach((el) => el.classList.add("in"));
}
})();
