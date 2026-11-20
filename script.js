// Interaksi sederhana untuk prototipe Lamongan Forest Guardian.
document.addEventListener("DOMContentLoaded", () => {
  const reportForm = document.getElementById("reportForm");
  if (reportForm) {
    reportForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const data = Object.fromEntries(new FormData(reportForm).entries());
      // File foto tidak disimpan pada demo ini.
      delete data.photo;
      const reports = JSON.parse(localStorage.getItem("lfgReports") || "[]");
      reports.push({...data, createdAt: new Date().toISOString(), status: "Menunggu pemeriksaan (simulasi)"});
      localStorage.setItem("lfgReports", JSON.stringify(reports));
      document.getElementById("reportResult").innerHTML =
        '<div class="notice"><strong>Laporan simulasi tersimpan.</strong><br>Dalam penggunaan nyata, laporan harus diverifikasi dan diteruskan melalui saluran resmi.</div>';
      reportForm.reset();
    });
  }

  const challengeInputs = document.querySelectorAll(".challenge input");
  const score = document.getElementById("score");
  function updateScore() {
    if (!score) return;
    let total = 0;
    challengeInputs.forEach(input => { if (input.checked) total += Number(input.dataset.points); });
    score.textContent = total;
    localStorage.setItem("lfgChallengeScore", String(total));
  }
  if (challengeInputs.length) {
    const saved = Number(localStorage.getItem("lfgChallengeScore") || 0);
    let remaining = saved;
    challengeInputs.forEach(input => {
      const points = Number(input.dataset.points);
      if (remaining >= points) { input.checked = true; remaining -= points; }
      input.addEventListener("change", updateScore);
    });
    updateScore();
    document.getElementById("resetChallenge")?.addEventListener("click", () => {
      challengeInputs.forEach(input => input.checked = false);
      updateScore();
    });
  }

  const answers = document.querySelectorAll(".answer");
  if (answers.length) {
    answers.forEach(answer => answer.addEventListener("click", () => {
      answers.forEach(item => item.disabled = true);
      answer.classList.add(answer.dataset.correct === "true" ? "correct" : "incorrect");
      const feedback = document.getElementById("quizFeedback");
      feedback.textContent = answer.dataset.correct === "true"
        ? "Benar! Utamakan keselamatan dan sampaikan informasi kepada pihak yang bertanggung jawab."
        : "Belum tepat. Jangan mendekati atau menangani kebakaran sendiri. Menjauh dan laporkan dari tempat aman.";
      document.getElementById("nextQuestion").hidden = false;
    }));
    document.getElementById("nextQuestion")?.addEventListener("click", () => {
      document.getElementById("question").textContent = "Apa salah satu cara mencegah kebakaran hutan dan lahan?";
      const options = [
        ["Membakar sampah di dekat vegetasi kering", false],
        ["Tidak menggunakan api sembarangan dan ikut edukasi pencegahan", true],
        ["Meninggalkan api unggun tanpa pengawasan", false]
      ];
      const container = document.getElementById("answers");
      container.innerHTML = options.map(([label, correct]) =>
        `<button class="answer" data-correct="${correct}">${label}</button>`).join("");
      document.getElementById("quizFeedback").textContent = "";
      document.getElementById("nextQuestion").hidden = true;
      container.querySelectorAll(".answer").forEach(answer => answer.addEventListener("click", () => {
        container.querySelectorAll(".answer").forEach(item => item.disabled = true);
        answer.classList.add(answer.dataset.correct === "true" ? "correct" : "incorrect");
        document.getElementById("quizFeedback").textContent = answer.dataset.correct === "true" ? "Tepat! Pencegahan dimulai dari perilaku aman." : "Coba ingat kembali prinsip pencegahan kebakaran.";
        document.getElementById("nextQuestion").hidden = false;
      }));
      document.getElementById("nextQuestion").onclick = () => location.reload();
    });
  }
});