function initRoulette() {
  const betTypeSelect = document.getElementById('bet-type');
  const betNumberInput = document.getElementById('bet-number');
  const betAmountInput = document.getElementById('bet-amount');
  const addBetBtn = document.getElementById('add-bet');
  const betListEl = document.getElementById('bet-list');
  const spinBtn = document.getElementById('spin-wheel');
  const wheelEl = document.getElementById('roulette-wheel');
  const resultNumberEl = document.getElementById('roulette-result-number');
  const lastResultText = document.getElementById('roulette-last-result');
  const statusEl = document.getElementById('roulette-status');

  let bets = [];
  let spinning = false;

  function t(key, fallback) {
    const lang = getLang();
    const dict = translations[lang] || translations.fr;
    return dict[key] || fallback || key;
  }

  function setStatus(text) {
    statusEl.textContent = text;
  }

  function colorOf(number) {
    if (number === 0) return 'green';
    const reds = [1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36];
    return reds.includes(number) ? 'red' : 'black';
  }

  function describeBet(bet) {
    switch (bet.type) {
      case 'red': return 'Rouge';
      case 'black': return 'Noir';
      case 'even': return 'Pair';
      case 'odd': return 'Impair';
      case 'low': return 'Manque (1–18)';
      case 'high': return 'Passe (19–36)';
      case 'number': return `Numéro ${bet.param}`;
      default: return bet.type;
    }
  }

  function renderBets() {
    betListEl.innerHTML = '';
    if (bets.length === 0) {
      betListEl.textContent = '';
      return;
    }
    bets.forEach((bet, idx) => {
      const row = document.createElement('div');
      row.className = 'bet-list-item';
      const left = document.createElement('div');
      const right = document.createElement('div');
      left.textContent = describeBet(bet);
      right.textContent = bet.amount.toFixed(2);
      row.appendChild(left);
      row.appendChild(right);
      row.addEventListener('click', () => {
        // clic pour supprimer la mise
        bets.splice(idx, 1);
        renderBets();
      });
      betListEl.appendChild(row);
    });
  }

  betTypeSelect.addEventListener('change', () => {
    if (betTypeSelect.value === 'number') {
      betNumberInput.disabled = false;
    } else {
      betNumberInput.disabled = true;
    }
  });

  addBetBtn.addEventListener('click', () => {
    const amt = validateBetAmount(betAmountInput.value);
    if (amt === null) {
      setStatus(t('status_invalid_bet', 'Mise invalide.'));
      playSound('lose');
      return;
    }
    let param = null;
    const type = betTypeSelect.value;
    if (type === 'number') {
      const n = parseInt(betNumberInput.value, 10);
      if (!Number.isInteger(n) || n < 0 || n > 36) {
        setStatus('Numéro invalide (0–36).');
        playSound('lose');
        return;
      }
      param = n;
    }

    bets.push({ type, param, amount: amt });
    renderBets();
    setStatus('');
    playSound('click');
  });

  function computeWin(outcome, betsList) {
    let win = 0;
    const col = colorOf(outcome);
    for (const bet of betsList) {
      const amt = bet.amount;
      switch (bet.type) {
        case 'red':
          if (col === 'red') win += amt * 2;
          break;
        case 'black':
          if (col === 'black') win += amt * 2;
          break;
        case 'even':
          if (outcome !== 0 && outcome % 2 === 0) win += amt * 2;
          break;
        case 'odd':
          if (outcome % 2 === 1) win += amt * 2;
          break;
        case 'low':
          if (outcome >= 1 && outcome <= 18) win += amt * 2;
          break;
        case 'high':
          if (outcome >= 19 && outcome <= 36) win += amt * 2;
          break;
        case 'number':
          if (outcome === bet.param) win += amt * 36;
          break;
      }
    }
    return win;
  }

  function forceWinningOutcome(betsList) {
    if (betsList.length === 0) return null;
    const chosen = betsList[Math.floor(Math.random() * betsList.length)];
    switch (chosen.type) {
      case 'red': {
        const redNums = [1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36];
        return redNums[Math.floor(Math.random() * redNums.length)];
      }
      case 'black': {
        const blackNums = [2,4,6,8,10,11,13,15,17,20,22,24,26,28,29,31,33,35];
        return blackNums[Math.floor(Math.random() * blackNums.length)];
      }
      case 'even': {
        const evens = [];
        for (let i = 2; i <= 36; i += 2) evens.push(i);
        return evens[Math.floor(Math.random() * evens.length)];
      }
      case 'odd': {
        const odds = [];
        for (let i = 1; i <= 35; i += 2) odds.push(i);
        return odds[Math.floor(Math.random() * odds.length)];
      }
      case 'low': {
        const lows = [];
        for (let i = 1; i <= 18; i++) lows.push(i);
        return lows[Math.floor(Math.random() * lows.length)];
      }
      case 'high': {
        const highs = [];
        for (let i = 19; i <= 36; i++) highs.push(i);
        return highs[Math.floor(Math.random() * highs.length)];
      }
      case 'number':
        return chosen.param;
      default:
        return null;
    }
  }

  spinBtn.addEventListener('click', () => {
    if (spinning) return;
    if (bets.length === 0) {
      setStatus(t('roulette_no_bet', 'Ajoute au moins une mise avant de lancer.'));
      playSound('lose');
      return;
    }

    const totalStake = bets.reduce((sum, b) => sum + b.amount, 0);
    const credits = getCredits();
    if (totalStake > credits) {
      setStatus(t('status_insufficient_credits', 'Crédits insuffisants.'));
      playSound('lose');
      return;
    }

    setCredits(credits - totalStake);
    spinning = true;
    wheelEl.classList.add('spinning');
    playSound('spin');
    setStatus('');

    setTimeout(() => {
      // résultat de base
      let outcome = Math.floor(Math.random() * 37);
      let winAmount = computeWin(outcome, bets);

      // si tout est perdant → petite chance bonus de forcer un résultat gagnant
      if (winAmount === 0 && Math.random() < 0.25) {
        const forced = forceWinningOutcome(bets);
        if (forced !== null) {
          outcome = forced;
          winAmount = computeWin(outcome, bets);
        }
      }

      spinning = false;
      wheelEl.classList.remove('spinning');

      resultNumberEl.textContent = outcome;
      lastResultText.textContent = outcome + ' (' + colorOf(outcome) + ')';

      if (winAmount > 0) {
        setCredits(getCredits() + winAmount);
      }

      const net = winAmount - totalStake;
      if (net > 0) {
        animateWin();
        playSound('win');
        const txt = getLang() === 'fr'
          ? `Victoire ! +${net.toFixed(2)} crédits`
          : `Win! +${net.toFixed(2)} credits`;
        setStatus(txt);
      } else if (net < 0) {
        animateLoss();
        playSound('lose');
        const txt = getLang() === 'fr'
          ? `Perdu. -${Math.abs(net).toFixed(2)} crédits`
          : `Lost. -${Math.abs(net).toFixed(2)} credits`;
        setStatus(txt);
      } else {
        setStatus('');
      }

      // on garde les mises pour info, mais on pourrait aussi les vider
      bets = [];
      renderBets();
    }, 2000);
  });

  renderBets();
  setStatus('');
}
