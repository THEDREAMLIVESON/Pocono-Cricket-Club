(() => {
  // Footer year
  document.querySelectorAll("[data-year]").forEach(el => {
    el.textContent = new Date().getFullYear();
  });

  // Mobile nav toggle
  const navToggle = document.querySelector("[data-nav-toggle]");
  const nav = document.querySelector("[data-nav]");
  if (navToggle && nav) {
    navToggle.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(open));
    });
  }

  // Copy email button
  const copyBtn = document.querySelector("[data-copy-email]");
  const copyStatus = document.querySelector("[data-copy-status]");
  if (copyBtn) {
    copyBtn.addEventListener("click", async () => {
      const email = copyBtn.getAttribute("data-email") || "";
      try {
        await navigator.clipboard.writeText(email);
        if (copyStatus) copyStatus.textContent = "Copied to clipboard.";
      } catch {
        if (copyStatus) copyStatus.textContent = "Copy failed. Please copy manually.";
      }
    });
  }

  // === Latest ICC Highlights ===
  // Edit this list to add/remove videos (easy weekly updates).
  // Use ONLY the YouTube video id (the part after v= in the URL).
  // For youtu.be links, the ID is the part after the slash.
  const ICC_HIGHLIGHTS = [
    {
      id: "AO0VjqBnExs",
      title: "Latest ICC Highlight",
      note: "Click to play"
    }
  ];

  const listEl = document.querySelector("[data-video-list]");
  const modal = document.querySelector("[data-modal]");
  const frameEl = document.querySelector("[data-video-frame]");

  function openModal(videoId) {
    if (!modal || !frameEl) return;
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");

    // Autoplay + cleaner embeds
    frameEl.innerHTML = `
      <iframe
        src="https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1"
        title="YouTube video player"
        referrerpolicy="strict-origin-when-cross-origin"
        allow="autoplay; encrypted-media; picture-in-picture"
        allowfullscreen></iframe>
    `;

    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    if (!modal || !frameEl) return;
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    frameEl.innerHTML = "";
    document.body.style.overflow = "";
  }

  if (listEl) {
    listEl.innerHTML = ICC_HIGHLIGHTS.map(v => {
      const thumb = `https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`;
      return `
        <a class="video-item" href="#" data-video="${v.id}">
          <img class="video-thumb" src="${thumb}" alt="${v.title} thumbnail">
          <div class="video-meta">
            <p class="video-title">${v.title}</p>
            <p class="video-note">${v.note || "Click to play"}</p>
          </div>
        </a>
      `;
    }).join("");

    listEl.addEventListener("click", (e) => {
      const a = e.target.closest("[data-video]");
      if (!a) return;
      e.preventDefault();
      openModal(a.getAttribute("data-video"));
    });
  }

  // Modal close handlers
  if (modal) {
    modal.querySelectorAll("[data-modal-close]").forEach(btn => {
      btn.addEventListener("click", closeModal);
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.classList.contains("is-open")) closeModal();
    });
  }
})();