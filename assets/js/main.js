/* =========================================================
   President Kasane Teto — Campaign Scripts
   Handles vote submission to the campaign endpoint.
   ========================================================= */

(function () {
  "use strict";

  // Change this to your real endpoint when ready.
  var VOTE_ENDPOINT = "https://nullsoftware.net/api/survey/teto-promo";

  var form = document.getElementById("vote-form");
  var statusEl = document.getElementById("form-status");
  var submitBtn = document.getElementById("submit-btn");

  if (!form) return;

  function setStatus(message, state) {
    statusEl.textContent = message;
    statusEl.className = "form-status" + (state ? " is-" + state : "");
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    // Honeypot: if a bot filled the hidden field, silently pretend success.
    if (form.elements.website && form.elements.website.value) {
      setStatus("Your vote has been recorded. Glory to Teto.", "success");
      form.reset();
      return;
    }

    // Native validation (required fields, email format, radio, oath).
    if (!form.checkValidity()) {
      form.reportValidity();
      setStatus("The President requires every field. Complete your ballot.", "error");
      return;
    }

    var data = {
      name: form.elements.name.value.trim(),
      email: form.elements.email.value.trim(),
      country: form.elements.country.value.trim(),
      gender: form.elements.gender.value,
      food: (form.querySelector('input[name="food"]:checked') || {}).value || "",
      pledge: form.elements.pledge.value.trim(),
      oath: form.elements.oath.checked,
      submittedAt: new Date().toISOString()
    };

    submitBtn.disabled = true;
    setStatus("Transmitting your loyalty to the Eternal Drill…", "pending");

    fetch(VOTE_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    })
      .then(function (response) {
        if (!response.ok) {
          throw new Error("Server responded with " + response.status);
        }
        setStatus("★ Vote recorded. The President sees you. Glory to Teto! ★", "success");
        form.reset();
      })
      .catch(function (err) {
        console.error("Vote submission failed:", err);
        setStatus(
          "The drills could not reach the capital. Please try again shortly.",
          "error"
        );
      })
      .finally(function () {
        submitBtn.disabled = false;
      });
  });
})();
