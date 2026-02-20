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
  // You can paste FULL YouTube links OR just IDs.
  // Examples:
  //  - https://youtu.be/VIDEO_ID
  //  - https://www.youtube.com/watch?v=VIDEO_ID
  //  - VIDEO_ID
  const ICC_HIGHLIGHTS = [
    {
      url: "https://www.youtube.com/watch?v=JFuzxrRb0DI",
      title: "Latest ICC Highlight",
      note: "Click to play"
    },
    {
      url: "https://www.youtube.com/watch?v=JFuzxrRb0DI",
      title: "Second ICC Highlight",
      note: "Click to play"
    }
  ];

  const listEl = document.querySelector("[data-video-list]");
  const modal = document.querySelector("[data-modal]");
  const frameEl = document.querySelector("[data-video-frame]");

  function extractYouTubeId(input) {
    if (!input) return null;

    // If it doesn't look like a URL, assume it's already an ID
    if (!input.includes("://")) return input.trim();

    try {
      const u = new URL(input);

      // youtu.be/<id>
      if (u.hostname.includes("youtu.be")) {
        const id = u.pathname.replace("/", "").trim();
        return id || null;
      }

      // youtube.com/watch?v=<id>
      const v = u.searchParams.get("v");
      if (v) return v.trim();

      // youtube.com/shorts/<id> OR youtube.com/embed/<id>
      const parts = u.pathname.split("/").filter(Boolean);
      const shortsIndex = parts.indexOf("shorts");
      if (shortsIndex !== -1 && parts[shortsIndex + 1]) return parts[shortsIndex + 1].trim();

      const embedIndex = parts.indexOf("embed");
      if (embedIndex !== -1 && parts[embedIndex + 1]) return parts[embedIndex + 1].trim();

      return null;
    } catch {
      return null;
    }
  }

  function openModal(videoId) {
    if (!modal || !frameEl) return;
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");

    frameEl.innerHTML = `
      <iframe
        src="https://www.youtube.com/embed/${videoId}?autoplay=1&playsinline=1&rel=0&modestbranding=1"
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
    const items = ICC_HIGHLIGHTS
      .map(v => {
        const id = extractYouTubeId(v.url || v.id || "");
        if (!id) {
          console.warn("Invalid YouTube link/id in ICC_HIGHLIGHTS:", v);
          return "";
        }
        const thumb = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
        const title = v.title || "Video highlight";
        const note = v.note || "Click to play";

        return `
          <a class="video-item" href="#" data-video="${id}">
            <img class="video-thumb" src="${thumb}" alt="${title} thumbnail">
            <div class="video-meta">
              <p class="video-title">${title}</p>
              <p class="video-note">${note}</p>
            </div>
          </a>
        `;
      })
      .filter(Boolean)
      .join("");

    listEl.innerHTML = items || `<p class="muted small" style="padding:14px;">No highlights added yet.</p>`;

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