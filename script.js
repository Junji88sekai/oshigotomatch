const allIds = [
  "kyoushi", "bengoshi", "ginkouin", "koumuin", "isha",
  "kaishain", "kenkyuusha", "shufu", "enjinia", "tenin",
  "kashu", "honyakuka", "haiyuu"
];

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

let flipped = [], lockBoard = false;
let startTime, timerInterval;

const selectedIds = shuffle([...allIds]).slice(0, 10);
let cards = [];
selectedIds.forEach(id => {
  cards.push({ type: "A", id, image: `images/${id}_A.png` });
  cards.push({ type: "B", id, image: `images/${id}_B.png` });
});

function createCard(card, index) {
  const div = document.createElement("div");
  div.classList.add("card");
  div.dataset.id = card.id;
  div.dataset.type = card.type;

  div.innerHTML = `
    <div class="card-inner">
      <div class="card-face card-front">
        <img src="images/omote.png" alt="front">
        <div class="card-number">${index + 1}</div>
      </div>
      <div class="card-face card-back">
        <img src="${card.image}" alt="${card.id}">
      </div>
    </div>
  `;

  div.addEventListener("click", () => handleCardClick(div));
  return div;
}

function renderCards() {
  const board = document.getElementById("game-board");
  board.innerHTML = "";
  const shuffled = shuffle([...cards]);

  shuffled.forEach((card, i) => {
    board.appendChild(createCard(card, i));
  });

  startTimer();
}

function handleCardClick(card) {
  if (lockBoard || card.classList.contains("matched") || card.classList.contains("flipped")) return;

  card.classList.add("flipped");
  if (document.getElementById("toggleSound").checked)
    document.getElementById("flipSound").play();

  flipped.push(card);

  if (flipped.length === 2) {
    lockBoard = true;
    setTimeout(() => {
      const [a, b] = flipped;
      const match = a.dataset.id === b.dataset.id && a.dataset.type !== b.dataset.type;

      if (match) {
        a.classList.add("matched");
        b.classList.add("matched");
        if (document.getElementById("toggleSound").checked)
          document.getElementById("correctSound").play();
      } else {
        a.classList.remove("flipped");
        b.classList.remove("flipped");
        if (document.getElementById("toggleSound").checked)
          document.getElementById("wrongSound").play();
      }

      flipped = [];
      lockBoard = false;
    }, 1000);
  }
}

function revealAll() {
  document.querySelectorAll(".card").forEach(c => c.classList.add("flipped"));
}

function restartGame() {
  flipped = [];
  lockBoard = false;
  renderCards();
}

function startTimer() {
  startTime = Date.now();
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    document.getElementById("timer").textContent = `経過時間: ${elapsed} 秒`;
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
}

window.addEventListener("DOMContentLoaded", renderCards);
