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

#game-board {
  display: flex;
  flex-direction: column;
  gap: 30px;
  align-items: center;
}

.row {
  display: flex;
  justify-content: center;
  gap: 20px;
}


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

function revealAll() {
  document.quer
