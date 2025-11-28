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
        div.className = 'card card--dealt';
        div.textContent = card.rank + card.suit;
      }
      dealerCardsEl.appendChild(div);
    });

    playerHand.forEach(card => {
      const div = document.createElement('div');
      div.className = 'card card--dealt';
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

    const betVal = validateBetAmount(betInput.value);
    if (betVal === null) {
      setStatus(t('status_invalid_bet', 'Mise invalide.'));
      playSound('lose');
      return;
    }

    const credits = getCredits();
    if (betVal > credits) {
      setStatus(t('status_insufficient_credits', 'Crédits insuffisants.'));
      playSound('lose');
      return;
    }

    currentBet = betVal;
    setCredits(credits - currentBet);

    deck = createDeck();
    dealerHand = [];
    playerHand = [];
    holeCardHidden = true;

    roundActive = true;
    dealBtn.disabled = true;
    hitBtn.disabled = true;
    standBtn.disabled = true;

    dealerCardsEl.innerHTML = '';
    playerCardsEl.innerHTML = '';
    dealerTotalEl.textContent = '';
    playerTotalEl.textContent = '';

    setStatus(t('status_new_round', 'Nouvelle manche.'));
    playSound('click');

    // Animation de distribution : 4 cartes une par une
    const sequence = [
      () => { playerHand.push(deck.pop()); renderHands(); },
      () => { dealerHand.push(deck.pop()); renderHands(); },
      () => { playerHand.push(deck.pop()); renderHands(); },
      () => { dealerHand.push(deck.pop()); renderHands(); }
    ];

    let idx = 0;
    const interval = setInterval(() => {
      sequence[idx]();
      idx++;
      if (idx >= sequence.length) {
        clearInterval(interval);
        hitBtn.disabled = false;
        standBtn.disabled = false;
        checkInitialBlackjack();
      }
    }, 300);
  }

  function endRound() {
    roundActive = false;
    dealBtn.disabled = false;
    hitBtn.disabled = true;
    standBtn.disabled = true;
  }

  function finishDealerTurn() {
    holeCardHidden = false;
    renderHands();

    let dealerVal = handValue(dealerHand);
    const playerVal = handValue(playerHand);

    while (dealerVal < 17) {
      dealerHand.push(deck.pop());
      renderHands();
      dealerVal = handValue(dealerHand);
    }

    const creditsBefore = getCredits();
    let winAmount = 0;

    if (playerVal > 21) {
      // vous avez déjà perdu plus haut normalement
    } else if (dealerVal > 21) {
      winAmount = currentBet * 2;
    } else if (playerVal > dealerVal) {
      winAmount = currentBet * 2;
    } else if (playerVal < dealerVal) {
      winAmount = 0;
    } else {
      // égalité → petite chance bonus
      if (Math.random() < 0.5) {
        winAmount = currentBet * 2;
      } else {
        winAmount = currentBet;
      }
    }

    if (winAmount > 0) {
      setCredits(creditsBefore + winAmount);
    }

    const net = winAmount - currentBet;
    const lang = getLang();
    if (net > 0) {
      animateWin();
      playSound('win');
      const txt = lang === 'fr'
        ? `Vous gagnez +${net.toFixed(2)} crédits.`
        : `You win +${net.toFixed(2)} credits.`;
      setStatus(txt);
    } else if (net < 0) {
      animateLoss();
      playSound('lose');
      const txt = lang === 'fr'
        ? `Vous perdez -${Math.abs(net).toFixed(2)} crédits.`
        : `You lose -${Math.abs(net).toFixed(2)} credits.`;
      setStatus(txt);
    } else {
      setStatus(t('status_push', 'Égalité.'));
    }

    endRound();
  }

  function checkInitialBlackjack() {
    const playerVal = handValue(playerHand);
    const dealerVal = handValue(dealerHand);

    if (playerVal === 21 || dealerVal === 21) {
      holeCardHidden = false;
      renderHands();
      let winAmount = 0;
      const creditsBefore = getCredits();

      if (playerVal === 21 && dealerVal !== 21) {
        winAmount = currentBet * 2.5;
      } else if (playerVal !== 21 && dealerVal === 21) {
        winAmount = 0;
      } else {
        if (Math.random() < 0.5) {
          winAmount = currentBet * 2;
        } else {
          winAmount = currentBet;
        }
      }

      if (winAmount > 0) {
        setCredits(creditsBefore + winAmount);
      }

      const net = winAmount - currentBet;
      const lang = getLang();
      if (net > 0) {
        animateWin();
        playSound('win');
        const txt = lang === 'fr'
          ? `Blackjack ! Vous gagnez +${net.toFixed(2)} crédits.`
          : `Blackjack! You win +${net.toFixed(2)} credits.`;
        setStatus(txt);
      } else if (net < 0) {
        animateLoss();
        playSound('lose');
        const txt = lang === 'fr'
          ? `Vous perdez -${Math.abs(net).toFixed(2)} crédits.`
          : `You lose -${Math.abs(net).toFixed(2)} credits.`;
        setStatus(txt);
      } else {
        setStatus(t('status_push', 'Égalité.'));
      }

      endRound();
    }
  }

  function playerHit() {
    if (!roundActive) return;
    playerHand.push(deck.pop());
    renderHands();
    playSound('click');

    const val = handValue(playerHand);
    if (val > 21) {
      holeCardHidden = false;
      renderHands();
      animateLoss();
      playSound('lose');

      const lang = getLang();
      const txt = lang === 'fr'
        ? `Vous dépassez 21. Vous perdez -${currentBet.toFixed(2)} crédits.`
        : `You bust. You lose -${currentBet.toFixed(2)} credits.`;
      setStatus(txt);
      endRound();
    }
  }

  function playerStand() {
    if (!roundActive) return;
    finishDealerTurn();
  }

  dealBtn.addEventListener('click', startRound);
  hitBtn.addEventListener('click', playerHit);
  standBtn.addEventListener('click', playerStand);

  setStatus(t('status_place_bet', 'Choisissez votre mise puis cliquez sur « Distribuer ».'));
  renderHands();
}
