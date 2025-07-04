const ids = [
  "kyoushi", "bengoshi", "ginkouin", "koumuin", "isha",
  "kaishain", "kenkyuusha", "shufu", "enjinia", "tenin"
];

let cards = [];

// 各職業に対してAカード（イラスト）とBカード（テキスト）を作成
ids.forEach(id => {
  cards.push({ type: "A", id, image: "images/" + id + "_A.png" });
  cards.push({ type: "B", id, image: "images/" + id + "_B.png" });
});

// シャッフル関数
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

cards = shuffle(cards);

const board = document.getElementById("game-board");
const soundEnabled = document.getElementById("toggleSound");
let flipped = [], lockBoard = false;

// カードを生成して配置
cards.forEach((card, index) => {
  const div = document.createElement("div");
  div.classList.add("card");
  div.dataset.id = card.id;
  div.dataset.type = card.type;

  div.innerHTML = `
    <div class="card-inner">
      <div class="card-face card-front">
        <img src="images/omote.png" alt="omote">
        <div class="card-number">${index + 1}</div>
      </div>
      <div class="card-face card-back">
        <img src="${card.image}" alt="${card.id}">
      </div>
    </div>`;

  div.addEventListener("click", () => handleCardClick(div));
  board.appendChild(div);
});

// カードをクリックしたときの処理
function handleCardClick(card) {
  if (lockBoard || card.classList.contains("matched") || card.classList.contains("flipped")) return;
  card.classList.add("flipped");
  flipped.push(card);

  if (flipped.length === 2) {
    lockBoard = true;
    setTimeout(() => {
      const [a, b] = flipped;
      const match = a.dataset.id === b.dataset.id && a.dataset.type !== b.dataset.type;

      if (match) {
        a.classList.add("matched");
        b.classList.add("matched");
        if (soundEnabled.checked) document.getElementById("correctSound").play();
      } else {
        a.classList.remove("flipped");
        b.classList.remove("flipped");
        if (soundEnabled.checked) document.getElementById("wrongSound").play();
      }

      flipped = [];
      lockBoard = false;
    }, 1000);
  }
}

// すべてのカードをめくる
function revealAll() {
  document.querySelectorAll(".card").forEach(c => c.classList.add("flipped"));
}
