// --- 職業ID（13種類） ---
const allIds = [
  "kyoushi", "bengoshi", "ginkouin", "koumuin", "isha",
  "kaishain", "kenkyuusha", "shufu", "enjinia", "tenin",
  "kashu", "honyakuka", "haiyuu"
];

// --- シャッフル関数 ---
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// --- 初期化 ---
let flipped = [], lockBoard = false;
let startTime, timerInterval;

const selectedIds = shuffle([...allIds]).slice(0, 10); // ランダム10種類
let cards = [];
selectedIds.forEach(id => {
  cards.push({ type: "A", id, image: `images/${id}_A.png` });
  cards.push({ type: "B", id, image: `images/${id}_B.png` });
});

// --- カードを生成する関数 ---
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

// --- カードを3列に分けて表示 ---
function renderCards() {
  const row1 = document.getElementById("row1");
  const row2 = document.getElementById("row2");
  const row3 = document.getElementById("row3");

  row1.innerHTML = "";
  row2.innerHTML = "";
  row3.innerHTML = "";

  const shuffled = shuffle([...cards]);

  const row1Cards = shuffled.slice(0, 7);
  const row2Cards = shuffled.slice(7, 13);
  const row3Cards = shuffled.slice(13, 20);

  row1Cards.forEach((card, i) => row1.appendChild(createCard(card, i)));
  row2Cards.forEach((card, i) => row2.appendChild(createCard(card, i + 7)));
  row3Cards.forEach((card, i) => row3.appendChild(createCard(card, i + 13)));

  startTimer();
}

// --- カードをクリックした時の処理 ---
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

        if (document.querySelectorAll(".matched").length === 20)
          stopTimer(); // 全カード一致で終了
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

// --- 全カードをめくる ---
function revealAll() {
  document.querySelectorAll(".card").forEach(c => c.classList.add("flipped"));
}

// --- ゲーム再スタート ---
function restartGame() {
  flipped = [];
  lockBoard = false;
  renderCards();
}

// --- タイマー開始 ---
function startTimer() {
  startTime = Date.now();
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    document.getElementById("timer").textContent = `経過時間: ${elapsed} 秒`;
  }, 1000);
}

// --- タイマー停止 ---
function stopTimer() {
  clearInterval(timerInterval);
}

// --- 初期化：ページ読み込み時にゲーム開始 ---
window.addEventListener("DOMContentLoaded", renderCards);
