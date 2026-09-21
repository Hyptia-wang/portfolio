/* 王秋璇 · 简约现代 · 交互脚本 */
document.addEventListener("DOMContentLoaded", function () {
  initMenu();
  initNavActive();
  initScrollEffects();
  initReveal();
  setupForm();
});

/* 移动端菜单 */
function initMenu() {
  var menuBtn = document.querySelector(".menu-btn");
  var mobileNav = document.querySelector(".mobile-nav");
  if (menuBtn && mobileNav) {
    menuBtn.addEventListener("click", function () {
      var isOpen = mobileNav.classList.toggle("open");
      menuBtn.classList.toggle("open", isOpen);
      menuBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
  }
}

/* 高亮当前导航 */
function initNavActive() {
  var path = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".site-nav a, .mobile-nav a").forEach(function (a) {
    var href = (a.getAttribute("href") || "").split("/").pop();
    if (href === path) a.classList.add("active");
  });
}

/* 滚动进度条 + 导航阴影 */
function initScrollEffects() {
  var bar = document.querySelector(".progress-bar");
  var header = document.querySelector(".site-header");
  function onScroll() {
    var max = document.documentElement.scrollHeight - window.innerHeight;
    var p = max > 0 ? (window.scrollY / max) * 100 : 0;
    if (bar) bar.style.width = p + "%";
    if (header) header.classList.toggle("scrolled", window.scrollY > 10);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

/* 滚动进入动画（首屏 rise 动画为纯 CSS，无需 JS 触发） */
function initReveal() {
  var items = document.querySelectorAll(".reveal");
  if (!items.length) return;
  if (!("IntersectionObserver" in window)) {
    items.forEach(function (el) { el.classList.add("in"); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("in");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
  items.forEach(function (el) { io.observe(el); });
}

/* 联系表单验证 */
function setupForm() {
  var form = document.getElementById("contact-form");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var name = document.getElementById("name");
    var email = document.getElementById("email");
    var message = document.getElementById("message");
    var valid = true;

    valid = validateField(name, "请填写你的称呼") && valid;
    valid = validateEmail(email) && valid;
    valid = validateField(message, "请填写留言内容") && valid;

    if (valid) {
      document.getElementById("form-card").classList.add("hidden");
      document.getElementById("form-success").classList.remove("hidden");
    }
  });

  ["name", "email", "subject", "message"].forEach(function (id) {
    var el = document.getElementById(id);
    if (!el) return;
    el.addEventListener("input", function () {
      el.classList.remove("error");
      var err = el.parentNode.querySelector(".err");
      if (err) err.textContent = "";
    });
  });

  var resetBtn = document.getElementById("reset-form");
  if (resetBtn) {
    resetBtn.addEventListener("click", function () {
      document.getElementById("form-card").classList.remove("hidden");
      document.getElementById("form-success").classList.add("hidden");
      form.reset();
    });
  }
}

function validateField(el, msg) {
  if (!el.value.trim()) {
    el.classList.add("error");
    var err = el.parentNode.querySelector(".err");
    if (err) err.textContent = msg;
    return false;
  }
  return true;
}

function validateEmail(el) {
  if (!el.value.trim()) {
    el.classList.add("error");
    var err = el.parentNode.querySelector(".err");
    if (err) err.textContent = "请填写邮箱";
    return false;
  }
  var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!re.test(el.value.trim())) {
    el.classList.add("error");
    var err = el.parentNode.querySelector(".err");
    if (err) err.textContent = "邮箱格式不正确";
    return false;
  }
  return true;
}
