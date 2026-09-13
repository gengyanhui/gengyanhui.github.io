(function () {
  const nav = document.querySelector(".nav-links");
  const toggle = document.querySelector(".menu-toggle");
  const filters = document.querySelectorAll(".filter");
  const list = document.getElementById("pub-list");
  const more = document.getElementById("pub-more");
  const year = document.getElementById("year");

  if (year) year.textContent = String(new Date().getFullYear());

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  const pubs = Array.isArray(window.PUBLICATIONS) ? window.PUBLICATIONS : [];
  let activeTag = "all";
  let expanded = false;

  function render() {
    const items = pubs.filter((pub) => activeTag === "all" || pub.tag === activeTag);
    const visible = expanded ? items : items.slice(0, 10);
    list.innerHTML = visible
      .map(
        (pub) => `
        <article class="pub${pub.featured ? " is-featured" : ""}" data-tag="${pub.tag}">
          <div class="pub-badge">${escapeHtml(pub.badge)}</div>
          <div>
            <h3>${escapeHtml(pub.title)}</h3>
            <p>${escapeHtml(pub.authors)} — ${escapeHtml(pub.venue)}</p>
          </div>
          <div class="pub-year">${pub.year}</div>
        </article>
      `
      )
      .join("");

    if (more) {
      const hidden = items.length - visible.length;
      more.hidden = items.length <= 10;
      more.textContent = expanded ? "Show fewer papers" : `Show all ${items.length} papers`;
      more.dataset.hiddenCount = String(hidden);
    }
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");
  }

  if (list) render();

  filters.forEach((button) => {
    button.addEventListener("click", () => {
      filters.forEach((item) => item.classList.remove("is-active"));
      button.classList.add("is-active");
      activeTag = button.dataset.filter;
      expanded = false;
      render();
    });
  });

  if (more) {
    more.addEventListener("click", () => {
      expanded = !expanded;
      render();
      if (!expanded) list.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }
})();
