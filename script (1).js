(function () {
  var navBtn = document.querySelector(".menu-btn");
  var mobileNav = document.querySelector(".mobile-nav");
  if (navBtn && mobileNav) {
    navBtn.addEventListener("click", function () {
      var open = mobileNav.classList.toggle("open");
      navBtn.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  var amount = document.getElementById("calc-amount");
  var out = document.getElementById("calc-result");
  if (amount && out) {
    function formatINR(n) {
      try {
        return new Intl.NumberFormat("en-IN", {
          style: "currency",
          currency: "INR",
          maximumFractionDigits: 2
        }).format(n);
      } catch (e) {
        return "₹" + n.toFixed(2);
      }
    }
    function update() {
      var raw = String(amount.value || "").replace(/[^\d.]/g, "");
      var val = parseFloat(raw);
      if (!raw || isNaN(val) || val < 0) {
        out.textContent = "₹0";
        return;
      }
      out.textContent = formatINR(val * 0.2);
    }
    amount.addEventListener("input", update);
    update();
  }

  var form = document.getElementById("partner-form");
  if (!form) return;

  var successBox = document.getElementById("form-success");
  var errorBox = document.getElementById("form-error");
  var submitBtn = document.getElementById("submit-btn");

  function showError(fieldId, message) {
    var field = document.getElementById(fieldId);
    if (!field) return false;
    var wrap = field.closest(".field") || field.closest(".check");
    if (wrap) wrap.classList.add("invalid");
    var err = wrap ? wrap.querySelector(".error") : null;
    if (err) {
      err.textContent = message;
      err.style.display = "block";
    }
    return false;
  }

  function clearErrors() {
    form.querySelectorAll(".invalid").forEach(function (el) {
      el.classList.remove("invalid");
    });
    form.querySelectorAll(".error").forEach(function (el) {
      el.style.display = "none";
    });
    if (successBox) successBox.style.display = "none";
    if (errorBox) {
      errorBox.style.display = "none";
      errorBox.classList.remove("err");
    }
  }

  function validEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  }

  function validPhone(v) {
    var d = v.replace(/\D/g, "");
    return d.length >= 10 && d.length <= 13;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    clearErrors();

    var name = document.getElementById("fullName").value.trim();
    var age = document.getElementById("age").value.trim();
    var city = document.getElementById("city").value.trim();
    var whatsapp = document.getElementById("whatsapp").value.trim();
    var email = document.getElementById("email").value.trim();
    var occupation = document.getElementById("occupation").value.trim();
    var businesses = document.getElementById("businesses").value.trim();
    var method = document.getElementById("method").value.trim();
    var source = document.getElementById("source").value.trim();
    var terms = document.getElementById("terms").checked;

    var ok = true;
    if (!name) ok = showError("fullName", "Full name zaroori hai.");
    var ageNum = parseInt(age, 10);
    if (!age) ok = showError("age", "Age zaroori hai.");
    else if (isNaN(ageNum) || ageNum < 16) ok = showError("age", "Minimum age 16 years honi chahiye.");
    if (!city) ok = showError("city", "City zaroori hai.");
    if (!whatsapp) ok = showError("whatsapp", "WhatsApp number zaroori hai.");
    else if (!validPhone(whatsapp)) ok = showError("whatsapp", "Valid WhatsApp number likhein.");
    if (!email) ok = showError("email", "Email zaroori hai.");
    else if (!validEmail(email)) ok = showError("email", "Valid email address likhein.");
    if (!occupation) ok = showError("occupation", "Yeh field zaroori hai.");
    if (!businesses) ok = showError("businesses", "Yeh field zaroori hai.");
    if (!method) ok = showError("method", "Yeh field zaroori hai.");
    if (!source) ok = showError("source", "Yeh field zaroori hai.");
    if (!terms) ok = showError("terms", "Terms accept karna zaroori hai.");
    if (!ok) return;

    var payload = {
      name: name,
      fullName: name,
      age: ageNum,
      city: city,
      whatsapp: whatsapp,
      email: email,
      occupation: occupation,
      businesses: businesses,
      method: method,
      source: source,
      submittedAt: new Date().toISOString()
    };

    var endpoint = (window.MD_CONFIG && window.MD_CONFIG.formEndpoint) || "";
    submitBtn.disabled = true;
    submitBtn.textContent = "Submitting...";

    function succeed() {
      form.reset();
      if (successBox) successBox.style.display = "block";
      submitBtn.disabled = false;
      submitBtn.textContent = "Submit Application";
      successBox && successBox.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    function fail() {
      if (errorBox) {
        errorBox.style.display = "block";
        errorBox.classList.add("err");
      }
      submitBtn.disabled = false;
      submitBtn.textContent = "Submit Application";
    }

    if (!endpoint) {
      /* Email fallback until Apps Script URL is added in config.js */
      var publicEmail = (window.MD_CONFIG && window.MD_CONFIG.publicEmail) || "mdservice.in@gmail.com";
      fetch("https://formsubmit.co/ajax/" + publicEmail, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          _subject: "New MD Service Partner Application",
          Name: payload.name,
          Age: payload.age,
          City: payload.city,
          WhatsApp: payload.whatsapp,
          Email: payload.email,
          Occupation: payload.occupation,
          "Business contacts": payload.businesses,
          "Client acquisition method": payload.method,
          Source: payload.source,
          "Submission date/time": payload.submittedAt
        })
      })
        .then(function (res) { return res.json(); })
        .then(function (data) {
          if (data && (data.success === "true" || data.success === true)) succeed();
          else fail();
        })
        .catch(fail);
      return;
    }

    fetch(endpoint, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload)
    })
      .then(succeed)
      .catch(fail);
  });
})();
