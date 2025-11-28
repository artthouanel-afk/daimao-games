function initBlackjack() {
  const betInput = document.getElementById('bj-bet');
  const dealBtn = document.getElementById('bj-deal');
  const hitBtn = document.getElementById('bj-hit');
  const standBtn = document.getElementById('bj-stand');
  const statusEl = document.getElementById('bj-status');
  const dealerCardsEl = document.getElementById('dealer-cards');
  const playerCardsEl = document.getElementById('player-cards');
  const dealerTotalEl = document.getElementById('dealer-total');
  const playerTotalEl = document.getElementById('player-total');

  let deck = [];
  let dealerHand = [];
  let playerHand = [];
  let currentBet = 0;
  let roundActive = false;
  let holeCardHidden = true;

  function t(key, fallback) {
    const lang = getLang();
    const dict = translations[lang] || translations.fr;
    return dict[key] || fallback || key;
  }

  function createDeck() {
    const suits = ['♠', '♥', '♦', '♣'];
    const ranks = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];
    const newDeck = [];
    for (const s of suits) {
      for (const r of ranks) {
        newDeck.push({ rank: r, suit: s });
      }
    }
    for (let i = newDeck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
    }
    return newDeck;
  }

  function cardValue(card) {
    if (card.rank === 'A') return 11;
    if (['J','Q','K'].includes(card.rank)) return 10;
    return parseInt(card.rank, 10);
  }

  function handValue(hand) {
    let total = 0;
    let aces = 0;
    for (const c of hand) {
      total += cardValue(c);
      if (c.rank === 'A') aces++;
    }
    while (total > 21 && aces > 0) {
      total -= 10;
      aces--;
    }
    return total;
  }

  function renderHands() {
    dealerCardsEl.innerHTML = '';
    playerCardsEl.innerHTML = '';

    dealerHand.forEach((card, idx) => {
      const div = document.createElement('div');
      if (idx === 1 && holeCardHidden && roundActive) {
        div.className = 'card back';
        div.textContent = '?';
      } else {
        div.className = 'card';
        div.textContent = card.rank + card.suit;
      }
      dealerCardsEl.appendChild(div);
    });

    playerHand.forEach(card => {
      const div = document.createElement('div');
      div.className = 'card';
      div.textContent = card.rank + card.suit;
      playerCardsEl.appendChild(div);
    });

    const dealerVal = holeCardHidden && roundActive
      ? cardValue(dealerHand[0])
      : handValue(dealerHand);

    dealerTotalEl.textContent = dealerVal ? `(${dealerVal})` : '';
    const playerVal = handValue(playerHand);
    playerTotalEl.textContent = playerVal ? `(${playerVal})` : '';
  }

  function setStatus(text) {
    statusEl.textContent = text;
  }

  function startRound() {
    if (roundActive) return;

    const betVal = validateBetAmount(betInput.valu

