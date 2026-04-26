const bookingForm = document.querySelector("#bookingForm");
const formNote = document.querySelector("#formNote");
const telegramButton = document.querySelector("#telegramButton");
const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");
const dateInput = document.querySelector('input[name="date"]');
const revealItems = document.querySelectorAll(".reveal");

const TELEGRAM_USERNAME = "your_barber_username";

if (dateInput) {
  const today = new Date().toISOString().split("T")[0];
  dateInput.min = today;
}

if (menuToggle && siteNav) {
  menuToggle.addEventListener("click", () => {
    siteNav.classList.toggle("is-open");
  });

  siteNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      siteNav.classList.remove("is-open");
    });
  });
}

if (bookingForm) {
  bookingForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(bookingForm);
    const booking = {
      name: String(formData.get("name") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      phone: String(formData.get("phone") || "").trim(),
      service: String(formData.get("service") || "").trim(),
      date: String(formData.get("date") || "").trim(),
      time: String(formData.get("time") || "").trim(),
      message: String(formData.get("message") || "").trim(),
      createdAt: new Date().toISOString(),
    };

    if (
      !booking.name ||
      !booking.email ||
      !booking.phone ||
      !booking.service ||
      !booking.date ||
      !booking.time
    ) {
      formNote.textContent = "Заповни всі обов'язкові поля, щоб підтвердити запис.";
      return;
    }

    const bookings = JSON.parse(localStorage.getItem("supremeBookings") || "[]");
    bookings.push(booking);
    localStorage.setItem("supremeBookings", JSON.stringify(bookings));

    const telegramText = [
      "Привіт! Хочу записатись у Supreme Barber.",
      `Ім'я: ${booking.name}`,
      `Телефон: ${booking.phone}`,
      `Email: ${booking.email}`,
      `Послуга: ${booking.service}`,
      `Дата: ${booking.date}`,
      `Час: ${booking.time}`,
      booking.message ? `Коментар: ${booking.message}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    telegramButton.href = `https://t.me/${TELEGRAM_USERNAME}?text=${encodeURIComponent(telegramText)}`;
    formNote.textContent =
      "Запис збережено. Можеш натиснути кнопку Telegram, щоб одразу надіслати деталі майстру.";

    bookingForm.reset();
    dateInput.min = new Date().toISOString().split("T")[0];
  });
}

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.16,
      rootMargin: "0px 0px -50px 0px",
    }
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

window.addEventListener("scroll", () => {
  const heroPanel = document.querySelector(".hero-panel");

  if (!heroPanel) {
    return;
  }

  const offset = Math.min(window.scrollY * 0.08, 32);
  heroPanel.style.transform = `translateY(${offset}px)`;
});
