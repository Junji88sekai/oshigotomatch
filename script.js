const ids = [
  "kyoushi", "bengoshi", "ginkouin", "koumuin", "isha",
  "kaishain", "kenkyuusha", "shufu", "enjinia", "tenin"
];

let cards = [];

ids.forEach(id => {
  cards.push({ type: "A", id, image: "images/" + id + "_A.png" });
  cards.push({ type: "B", id, image: "images/" + id + "_B.png" });
});

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

let flipped = [], lockBoard = false;

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
  const row1 = document.getElementById("row1");
  const row2Left = document.getElementById("row2-left");
  const row2Right = document.getElementById("row2-right");
  const row3 = document.getElementById("row3");

  row1.innerHTML = "";
  row2Left.innerHTML = "";
  row2Right.innerHTML = "";
  row3.innerHTML = "";

  cards = shuffle(cards);

  const row1Cards = cards.slice(0, 7);
  const row2Cards = cards.slice(7, 13);
  const row3Cards = cards.slice(13);

  row1Cards.forEach((c, i) => row1.appendChild(createCard(c, i)));
  row2Cards.slice(0, 3).forEach((c, i) => row2Left.appendChild(createCard(c, i + 7)));
  row2Cards.slice(3).forEach((c, i) => row2Right.appendChild(createCard(c, i + 10)));
  row3Cards.forEach((c, i) => row3.appendChild(createCard(c, i + 13)));
}

function handleCardClick(card) {
  if (lockBoard || card.classList.contains("matched") || card.classList.contains("flipped")) return;

  card.classList.add("flipped");

  if (document.getElementById("toggleSound").checked) {
    const flipSound = document.getElementById("flipSound");
    if (flipSound) flipSound.play();
  }

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

window.onload = renderCards;

