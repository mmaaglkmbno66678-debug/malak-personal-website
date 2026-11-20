/* =========================================================
   Personal Portfolio — ملك
   بيانات التواصل + تفاعلات الصفحة
   ========================================================= */

/* ---------------------------------------------------------
   1) بيانات الموقع — عدّل هنا فقط
   ---------------------------------------------------------
   • البريد الإلكتروني ورقم الجوال هما قناتا التواصل الحاليتان.
   --------------------------------------------------------- */
const SITE = {
  name: "ملك",
  fullName: "ملك عبدالسلام زايدة",
  email: "ooplooqalm19854@gmail.com",
  phone: "+966 57 060 3491",
  phoneHref: "tel:+966570603491",
};

(() => {
  "use strict";

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const root = document.documentElement;

  /* ---------- الوضع الليلي / النهاري ---------- */
  const themeToggle = $("[data-theme-toggle]");
  const themeTip = $("[data-theme-tip]");
  const themeMeta = $('meta[name="theme-color"]');
  let themeTimer;

  const applyTheme = (theme, persist = true, animate = true) => {
    root.setAttribute("data-theme", theme);

    if (persist) {
      try {
        localStorage.setItem("malak-theme", theme);
      } catch (error) {
        /* التخزين غير متاح — نكمل بدون حفظ */
      }
    }

    if (animate) {
      root.classList.add("theme-changing");
      window.clearTimeout(themeTimer);
      themeTimer = window.setTimeout(() => root.classList.remove("theme-changing"), 520);
    }

    const isLight = theme === "light";
    if (themeMeta) themeMeta.setAttribute("content", isLight ? "#F8F5FA" : "#0D0B12");
    if (themeToggle) {
      themeToggle.setAttribute(
        "aria-label",
        isLight ? "التبديل إلى الوضع الليلي" : "التبديل إلى الوضع النهاري"
      );
      themeToggle.setAttribute("title", isLight ? "الوضع النهاري" : "الوضع الليلي");
    }
    if (themeTip) themeTip.textContent = isLight ? "الوضع النهاري" : "الوضع الليلي";
  };

  applyTheme(root.getAttribute("data-theme") || "dark", false, false);

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
      applyTheme(next);
    });
  }

  /* ---------- تطبيق بيانات التواصل ---------- */
  $$("[data-name]").forEach((el) => {
    el.textContent = SITE.name;
  });

  $$("[data-full-name]").forEach((el) => {
    el.textContent = SITE.fullName;
  });

  $$("[data-email]").forEach((el) => {
    const [user, domain] = SITE.email.split("@");
    el.textContent = "";
    el.append(document.createTextNode(user + "@"));
    el.append(document.createElement("wbr"));
    el.append(document.createTextNode(domain || ""));
  });

  $$("[data-email-link]").forEach((el) => {
    el.href = `mailto:${SITE.email}`;
  });

  const phoneHref = SITE.phoneHref || `tel:${SITE.phone.replace(/[^\d+]/g, "")}`;

  $$("[data-phone]").forEach((el) => {
    el.textContent = SITE.phone;
  });

  $$("[data-phone-link]").forEach((el) => {
    el.href = phoneHref;
  });

  /* ---------- نسخ البريد أو رقم الجوال ---------- */
  const copyStatus = $("[data-copy-status]");

  const fallbackCopy = (text) => {
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    try {
      document.execCommand("copy");
    } catch (error) {
      /* تجاهل — المتصفح لا يدعم النسخ */
    }
    area.remove();
  };

  const setupCopy = (button, getValue, label) => {
    if (!button) return;
    let timer;

    button.addEventListener("click", async () => {
      const value = getValue();

      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(value);
        } else {
          fallbackCopy(value);
        }
      } catch (error) {
        fallbackCopy(value);
      }

      button.classList.add("is-copied");
      button.setAttribute("aria-label", `تم نسخ ${label}`);
      if (copyStatus) copyStatus.textContent = `تم نسخ ${label}`;

      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        button.classList.remove("is-copied");
        button.setAttribute("aria-label", `نسخ ${label}`);
        if (copyStatus) copyStatus.textContent = "";
      }, 2400);
    });
  };

  setupCopy($("[data-copy-email]"), () => SITE.email, "البريد الإلكتروني");
  setupCopy($("[data-copy-phone]"), () => SITE.phone, "رقم الجوال");

  /* ---------- قائمة الهاتف ---------- */
  const nav = $("#nav");
  const toggle = $(".nav__toggle");
  const menu = $("#primary-menu");

  const setMenu = (open) => {
    if (!menu || !toggle) return;
    menu.classList.toggle("is-open", open);
    toggle.classList.toggle("is-active", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "إغلاق القائمة" : "فتح القائمة");
    document.body.classList.toggle("menu-open", open);
  };

  if (toggle) {
    toggle.addEventListener("click", () => {
      setMenu(!menu.classList.contains("is-open"));
    });
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setMenu(false);
  });

  document.addEventListener("click", (event) => {
    if (!menu || !menu.classList.contains("is-open")) return;
    if (menu.contains(event.target) || toggle.contains(event.target)) return;
    if (themeToggle && themeToggle.contains(event.target)) return;
    setMenu(false);
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 880) setMenu(false);
  });

  /* ---------- التمرير الناعم ---------- */
  $$('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const hash = link.getAttribute("href");
      if (!hash || hash === "#") return;

      const target = document.querySelector(hash);
      if (!target) return;

      event.preventDefault();
      setMenu(false);

      window.requestAnimationFrame(() => {
        target.scrollIntoView({
          behavior: prefersReducedMotion ? "auto" : "smooth",
          block: "start",
        });
      });

      try {
        history.replaceState(null, "", hash);
      } catch (error) {
        /* بعض المتصفحات تمنع تعديل السجل على file:// */
      }
    });
  });

  /* ---------- شريط التقدم + تمييز القسم + زر الأعلى ---------- */
  const progressBar = $(".scroll-progress");
  const toTop = $(".to-top");
  const navLinks = $$(".nav__link");
  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  let ticking = false;

  const onScroll = () => {
    const scrollY = window.scrollY || window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? Math.min(scrollY / docHeight, 1) : 0;

    if (progressBar) progressBar.style.transform = `scaleX(${progress})`;
    if (nav) nav.classList.toggle("is-scrolled", scrollY > 20);
    if (toTop) toTop.classList.toggle("is-visible", scrollY > 600);
    root.style.setProperty("--scroll-y", `${scrollY}px`);

    const navHeight = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--nav-h")) || 78;
    const marker = scrollY + navHeight + 130;
    let currentId = sections.length ? sections[0].id : "";

    sections.forEach((section) => {
      if (section.offsetTop <= marker) currentId = section.id;
    });

    document.body.dataset.section = currentId || "home";

    navLinks.forEach((link) => {
      const isActive = link.getAttribute("href") === `#${currentId}`;
      link.classList.toggle("is-active", isActive);
      if (isActive) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });

    ticking = false;
  };

  const requestScrollUpdate = () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(onScroll);
  };

  window.addEventListener("scroll", requestScrollUpdate, { passive: true });
  window.addEventListener("resize", requestScrollUpdate);
  onScroll();

  if (toTop) {
    toTop.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion ? "auto" : "smooth",
      });
    });
  }

  /* ---------- الظهور التدريجي عند التمرير ---------- */
  const revealElements = $$("[data-reveal]");

  if ("IntersectionObserver" in window && !prefersReducedMotion) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );

    revealElements.forEach((el) => observer.observe(el));
  } else {
    revealElements.forEach((el) => el.classList.add("is-visible"));
  }

  /* ---------- مؤثرات المؤشر — للأجهزة ذات المؤشر الدقيق فقط ---------- */
  const finePointer = window.matchMedia("(pointer: fine)").matches;
  const motion = {
    pointerX: 0,
    pointerY: 0,
    targetX: 0,
    targetY: 0,
    pixelX: window.innerWidth / 2,
    pixelY: window.innerHeight / 2,
  };

  const aura = $(".cursor-aura");
  let pointerRaf = null;
  let auraX = motion.pixelX;
  let auraY = motion.pixelY;

  const updatePointerMotion = () => {
    motion.pointerX += (motion.targetX - motion.pointerX) * 0.08;
    motion.pointerY += (motion.targetY - motion.pointerY) * 0.08;

    root.style.setProperty("--px", motion.pointerX.toFixed(3));
    root.style.setProperty("--py", motion.pointerY.toFixed(3));

    if (aura) {
      auraX += (motion.pixelX - auraX) * 0.16;
      auraY += (motion.pixelY - auraY) * 0.16;
      aura.style.transform = `translate3d(${auraX}px, ${auraY}px, 0)`;
    }

    const needsMore =
      Math.abs(motion.targetX - motion.pointerX) > 0.001 ||
      Math.abs(motion.targetY - motion.pointerY) > 0.001 ||
      Math.abs(motion.pixelX - auraX) > 0.5 ||
      Math.abs(motion.pixelY - auraY) > 0.5;

    pointerRaf = needsMore ? window.requestAnimationFrame(updatePointerMotion) : null;
  };

  if (finePointer && !prefersReducedMotion) {
    document.addEventListener(
      "pointermove",
      (event) => {
        if (event.pointerType && event.pointerType !== "mouse") return;
        motion.targetX = (event.clientX / window.innerWidth) * 2 - 1;
        motion.targetY = (event.clientY / window.innerHeight) * 2 - 1;
        motion.pixelX = event.clientX;
        motion.pixelY = event.clientY;
        if (aura) aura.classList.add("is-active");
        if (!pointerRaf) pointerRaf = window.requestAnimationFrame(updatePointerMotion);
      },
      { passive: true }
    );

    const releasePointer = () => {
      if (aura) aura.classList.remove("is-active");
      motion.targetX = 0;
      motion.targetY = 0;
      if (!pointerRaf) pointerRaf = window.requestAnimationFrame(updatePointerMotion);
    };

    document.documentElement.addEventListener("pointerleave", releasePointer);
    window.addEventListener("blur", releasePointer);
  }

  /* ---------- لمعة تتبع المؤشر داخل البطاقات والأزرار ---------- */
  const glowSelector = ".skill, .about__panel, .contact, .email-box, .phone-link, .btn, .tag";
  let glowEl = null;
  let glowRect = null;

  if (finePointer && !prefersReducedMotion) {
    document.addEventListener(
      "pointermove",
      (event) => {
        if (event.pointerType && event.pointerType !== "mouse") return;
        const el = event.target.closest ? event.target.closest(glowSelector) : null;

        if (el !== glowEl) {
          glowEl = el;
          glowRect = el ? el.getBoundingClientRect() : null;
        }
        if (!el) return;
        if (!glowRect) glowRect = el.getBoundingClientRect();
        if (!glowRect.width || !glowRect.height) return;

        const mx = ((event.clientX - glowRect.left) / glowRect.width) * 100;
        const my = ((event.clientY - glowRect.top) / glowRect.height) * 100;
        el.style.setProperty("--mx", `${mx.toFixed(2)}%`);
        el.style.setProperty("--my", `${my.toFixed(2)}%`);
      },
      { passive: true }
    );

    window.addEventListener("scroll", () => { glowRect = null; }, { passive: true });
  }

  /* ---------- ذرات المؤشر ---------- */
  const cursorCanvas = $(".cursor-canvas");
  const cursorCtx = cursorCanvas ? cursorCanvas.getContext("2d") : null;
  let cursorW = 0;
  let cursorH = 0;
  let cursorDpr = 1;
  let cursorParticles = [];
  let cursorRaf = null;
  let lastSpawn = 0;
  let lastX = 0;
  let lastY = 0;

  const resizeCursor = () => {
    if (!cursorCanvas || !cursorCtx) return;
    cursorW = window.innerWidth;
    cursorH = window.innerHeight;
    cursorDpr = Math.min(window.devicePixelRatio || 1, 2);
    cursorCanvas.width = Math.round(cursorW * cursorDpr);
    cursorCanvas.height = Math.round(cursorH * cursorDpr);
    cursorCtx.setTransform(cursorDpr, 0, 0, cursorDpr, 0, 0);
    cursorParticles = [];
    cursorCtx.clearRect(0, 0, cursorW, cursorH);
  };

  const spawnCursorParticle = (x, y, forceGold = false) => {
    if (cursorParticles.length >= 60) return;
    const isLight = root.getAttribute("data-theme") === "light";
    const gold = forceGold || Math.random() < 0.14;
    const purple = !gold && Math.random() < 0.58;
    const colors = isLight
      ? { gold: [179, 139, 39], purple: [108, 63, 160], white: [108, 63, 160] }
      : { gold: [212, 175, 55], purple: [167, 139, 200], white: [248, 245, 250] };
    const color = gold ? colors.gold : purple ? colors.purple : colors.white;

    cursorParticles.push({
      x,
      y,
      vx: (Math.random() - 0.5) * 0.55,
      vy: (Math.random() - 0.5) * 0.55 - 0.12,
      life: 1,
      decay: 0.016 + Math.random() * 0.018,
      size: gold ? 2.1 + Math.random() * 1.5 : 1 + Math.random() * 1.7,
      color,
      gold,
    });
  };

  const drawCursorParticles = () => {
    if (!cursorCtx) return;
    cursorCtx.clearRect(0, 0, cursorW, cursorH);

    const alive = [];
    cursorParticles.forEach((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.vx *= 0.99;
      particle.vy *= 0.99;
      particle.life -= particle.decay;

      if (particle.life <= 0) return;
      const alpha = Math.max(particle.life, 0);

      if (particle.gold) {
        const s = particle.size * 2.4;
        cursorCtx.beginPath();
        cursorCtx.moveTo(particle.x, particle.y - s);
        cursorCtx.lineTo(particle.x + s * 0.24, particle.y - s * 0.24);
        cursorCtx.lineTo(particle.x + s, particle.y);
        cursorCtx.lineTo(particle.x + s * 0.24, particle.y + s * 0.24);
        cursorCtx.lineTo(particle.x, particle.y + s);
        cursorCtx.lineTo(particle.x - s * 0.24, particle.y + s * 0.24);
        cursorCtx.lineTo(particle.x - s, particle.y);
        cursorCtx.lineTo(particle.x - s * 0.24, particle.y - s * 0.24);
        cursorCtx.closePath();
      } else {
        cursorCtx.beginPath();
        cursorCtx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      }

      cursorCtx.fillStyle = `rgba(${particle.color[0]}, ${particle.color[1]}, ${particle.color[2]}, ${alpha * 0.8})`;
      cursorCtx.fill();
      alive.push(particle);
    });

    cursorParticles = alive;
    cursorRaf = cursorParticles.length ? window.requestAnimationFrame(drawCursorParticles) : null;
  };

  if (cursorCanvas && cursorCtx && finePointer && !prefersReducedMotion) {
    resizeCursor();

    document.addEventListener(
      "pointermove",
      (event) => {
        if (event.pointerType && event.pointerType !== "mouse") return;
        const now = performance.now();
        const dx = event.clientX - lastX;
        const dy = event.clientY - lastY;

        if (now - lastSpawn < 18 && dx * dx + dy * dy < 36) return;
        lastSpawn = now;
        lastX = event.clientX;
        lastY = event.clientY;

        const count = Math.random() < 0.35 ? 2 : 1;
        for (let index = 0; index < count; index += 1) {
          spawnCursorParticle(
            event.clientX + (Math.random() - 0.5) * 8,
            event.clientY + (Math.random() - 0.5) * 8,
            Math.random() < 0.08
          );
        }

        if (!cursorRaf) cursorRaf = window.requestAnimationFrame(drawCursorParticles);
      },
      { passive: true }
    );
  }

  /* ---------- خلفية النجوم والمجرات ---------- */
  const starCanvas = $("[data-starfield]");
  const starCtx = starCanvas ? starCanvas.getContext("2d") : null;
  let starW = 0;
  let starH = 0;
  let starDpr = 1;
  let stars = [];
  let starRaf = null;
  let starPalette = null;
  let starTheme = null;
  let shooting = null;
  let lastShooting = 0;

  const getStarPalette = () => {
    const isLight = root.getAttribute("data-theme") === "light";
    return isLight
      ? {
          alpha: 0.58,
          colors: [
            [108, 63, 160],
            [179, 139, 39],
            [118, 111, 128],
          ],
        }
      : {
          alpha: 0.9,
          colors: [
            [248, 245, 250],
            [212, 175, 55],
            [167, 139, 200],
          ],
        };
  };

  const buildStars = () => {
    const count = Math.min(140, Math.max(45, Math.round((starW * starH) / 14000)));
    stars = Array.from({ length: count }, () => {
      const large = Math.random() > 0.82;
      return {
        x: Math.random() * starW,
        y: Math.random() * starH,
        size: large ? 1.5 + Math.random() * 1.5 : 0.5 + Math.random() * 1.1,
        color: Math.floor(Math.random() * 3),
        phase: Math.random() * Math.PI * 2,
        speed: 0.35 + Math.random() * 1.1,
        depth: 0.2 + Math.random() * 0.8,
        drift: (Math.random() - 0.5) * 0.04,
      };
    });
  };

  const drawStars = (time) => {
    if (!starCtx) return;

    if (starTheme !== root.getAttribute("data-theme")) {
      starTheme = root.getAttribute("data-theme");
      starPalette = getStarPalette();
    }

    starCtx.clearRect(0, 0, starW, starH);
    const seconds = time * 0.001;
    const scrollY = window.scrollY || window.pageYOffset || 0;

    stars.forEach((star) => {
      const twinkle = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(seconds * star.speed + star.phase));
      let x = star.x + motion.pointerX * 18 * star.depth;
      let y =
        star.y +
        motion.pointerY * 14 * star.depth -
        ((scrollY * 0.03 * star.depth) % starH);

      x += Math.sin(seconds * 0.1 + star.phase) * 2 * star.depth;
      y += Math.sin(seconds * 0.08 + star.phase) * 1.5 * star.depth;

      if (x < -10) x += starW + 20;
      if (x > starW + 10) x -= starW + 20;
      if (y < -10) y += starH + 20;
      if (y > starH + 10) y -= starH + 20;

      const color = starPalette.colors[star.color];
      const alpha = starPalette.alpha * twinkle;

      starCtx.beginPath();
      starCtx.arc(x, y, star.size, 0, Math.PI * 2);
      starCtx.fillStyle = `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${alpha})`;
      starCtx.fill();

      if (star.size > 2.2) {
        starCtx.beginPath();
        starCtx.arc(x, y, star.size * 2.6, 0, Math.PI * 2);
        starCtx.fillStyle = `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${alpha * 0.12})`;
        starCtx.fill();
      }
    });

    if (!prefersReducedMotion) {
      const now = performance.now();
      if (!shooting && now - lastShooting > 12000) {
        shooting = {
          x: Math.random() * starW * 0.7,
          y: Math.random() * starH * 0.35,
          len: 80 + Math.random() * 110,
          speed: 4 + Math.random() * 2.5,
          life: 1,
        };
        lastShooting = now;
      }

      if (shooting) {
        shooting.x += shooting.speed;
        shooting.y += shooting.speed * 0.35;
        shooting.life -= 0.012;

        const gold = starPalette.colors[1];
        const trail = starCtx.createLinearGradient(
          shooting.x,
          shooting.y,
          shooting.x - shooting.len,
          shooting.y - shooting.len * 0.35
        );
        trail.addColorStop(0, `rgba(${gold[0]}, ${gold[1]}, ${gold[2]}, ${Math.max(shooting.life, 0) * 0.8})`);
        trail.addColorStop(1, `rgba(${gold[0]}, ${gold[1]}, ${gold[2]}, 0)`);

        starCtx.strokeStyle = trail;
        starCtx.lineWidth = 1.2;
        starCtx.beginPath();
        starCtx.moveTo(shooting.x, shooting.y);
        starCtx.lineTo(shooting.x - shooting.len, shooting.y - shooting.len * 0.35);
        starCtx.stroke();

        if (shooting.life <= 0 || shooting.x > starW + 220) shooting = null;
      }

      starRaf = window.requestAnimationFrame(drawStars);
    }
  };

  const resizeStarfield = () => {
    if (!starCanvas || !starCtx) return;
    starW = window.innerWidth;
    starH = window.innerHeight;
    starDpr = Math.min(window.devicePixelRatio || 1, 2);
    starCanvas.width = Math.round(starW * starDpr);
    starCanvas.height = Math.round(starH * starDpr);
    starCtx.setTransform(starDpr, 0, 0, starDpr, 0, 0);
    buildStars();
    if (prefersReducedMotion) drawStars(performance.now());
  };

  if (starCanvas && starCtx) {
    resizeStarfield();
    lastShooting = performance.now();

    if (prefersReducedMotion) {
      drawStars(performance.now());
    } else {
      starRaf = window.requestAnimationFrame(drawStars);
    }

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        if (starRaf) window.cancelAnimationFrame(starRaf);
        starRaf = null;
      } else if (!prefersReducedMotion && !starRaf) {
        starRaf = window.requestAnimationFrame(drawStars);
      }
    });
  }

  let resizeTimer;
  window.addEventListener(
    "resize",
    () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        resizeStarfield();
        resizeCursor();
        glowRect = null;
      }, 150);
    },
    { passive: true }
  );
})();
