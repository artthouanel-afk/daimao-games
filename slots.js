function initSlots() {
  const cells = [
    document.getElementById('slot-r0'),
    document.getElementById('slot-r1'),
    document.getElementById('slot-r2')
  ];
  const betInput = document.getElementById('slots-bet');
  const spinBtn = document.getElementById('slots-spin');
  const statusEl = document.getElementById('slots-status');
  const themeButtons = document.querySelectorAll('.slot-theme-toggle .btn');

  let currentTheme = 'fruits';
  let spinning = false;

  const themes = {
    fruits: ['🍒', '🍋', '🍇', '🍉', '⭐', '7️⃣'],
    manga: ['⚔️', '👘', '🌀', '🐉', '🌸', '⭐'],
    neon: ['💎', '⭐', '⚡', '🎲', '🎧', '💠']
  };

  function t(key, fallback) {
    const lang = getLang();
    const dict = translations[lang] || translations.fr;
    return dict[key] || fallback || key;
  }

  function setStatus(text) {
    statusEl.textContent = text;
  }

  function setTheme(theme) {
    currentTheme = theme;
    themeButtons.forEach(btn => {
      if (btn.getAttribute('data-theme') === theme) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  themeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const th = btn.getAttribute('data-theme');
      setTheme(th);
      playSound('click');
    });
  });

  function randomSymbol() {
    const list = themes[currentTheme] || themes.fruits;
    return list[Math.floor(Math.random() * list.length)];
  }

  function clearHighlight() {
    cells.forEach(c => c.classList.remove('highlight'));
  }

  spinBtn.addEventListener('click', () => {
    if (spinning) return;

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

    setCredits(credits - betVal);
    spinning = true;
    clearHighlight();
    setStatus('');
    playSound('spin');

    // petite animation simple : changement rapide avant stop
    const spinSteps = 10;
    let step = 0;
    const spinInterval = setInterval(() => {
      cells.forEach(c => {
        c.textContent = randomSymbol();
      });
      step++;
      if (step >= spinSteps) {
        clearInterval(spinInterval);

        // résultat final
        let final = [randomSymbol(), randomSymbol(), randomSymbol()];
        cells.forEach((c, i) => { c.textContent = final[i]; });

        // victoire ?
        let win = (final[0] === final[1] && final[1] === final[2]);

        // si perdu → chance bonus de transformer en victoire
        if (!win && Math.random() < 0.3) {
          const sym = randomSymbol();
          final = [sym, sym, sym];
          cells.forEach((c, i) => { c.textContent = final[i]; });
          win = true;
        }

        let winAmount = 0;
        if (win) {
          // gain brut = 6x mise (stake inclus) → net +5x
          winAmount = betVal * 6;
          setCredits(getCredits() + winAmount);
        }

        const net = winAmount - betVal;
        if (net > 0) {
          cells.forEach(c => c.classList.add('highlight'));
          animateWin();
          playSound('win');
          const txt = getLang() === 'fr'
            ? `Victoire ! +${net.toFixed(2)} crédits`
            : `Win! +${net.toFixed(2)} credits`;
          setStatus(txt);
        } else {
          animateLoss();
          playSound('lose');
          const txt = getLang() === 'fr'
            ? `Perdu. -${betVal.toFixed(2)} crédits`
            : `Lost. -${betVal.toFixed(2)} credits`;
          setStatus(txt);
        }

        spinning = false;
      }
    }, 70);
  });

  setTheme('fruits');
  setStatus('');
}
