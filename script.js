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

const soundEnabled = document.getElementById("toggleSound");
let flipped = [], lockBoard = false;

// 🎯 カードを列に分配して表示する関数
function distributeCards() {
  cards = shuffle([...cards]);

  const col1 = document.getElementById("col1");
  const col2 = document.getElementById("col2");
  const col3 = document.getElementById("col3");

  // 各列に 7・6・7 枚ずつ分ける
  const col1Cards = cards.slice(0, 7);
  const col2Cards = cards.slice(7, 13);
  const col3Cards = cards.slice(13, 20);

  [col1Cards, col2Cards, col3Cards].forEach((group, columnIndex) => {
    const column = [col1, col2, col3][columnIndex];
    column.innerHTML = ""; // 初期化

    group.forEach((card, index) => {
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
      column.appendChild(div);
    });
  });
}

// 🎯 カードをクリックしたときの処理
function handleCardClick(card) {
  if (lockBoard || card.classList.contains("matched") || card.classList.contains("flipped")) return;

  card.classList.add("flipped");
  if (soundEnabled.checked) {
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

// 🎯 全部のカードをめくるボタン
function revealAll() {
  document.querySelectorAll(".card").forEach(c => c.classList.add("flipped"));
}

// 🎯 リスタートボタン（カードを再配置）
function restartGame() {
  flipped = [];
  lockBoard = false;
  distributeCards();
}

// 🎯 ページ読み込み時に実行
window.onload = () => {
  distributeCards();
};
