const CREDIT_KEY = 'daimao_credits';
const LANG_KEY = 'daimao_lang';

const MIN_BET = 0.2;
const MAX_BET = 10000;

// --- CREDITS ---

function getCredits() {
  const stored = localStorage.getItem(CREDIT_KEY);
  if (stored === null) {
    // Première visite → 10 crédits
    return 10;
  }
  const val = parseFloat(stored);
  return isNaN(val) ? 10 : val;
}

function setCredits(value) {
  const clean = Math.max(0, Number.isFinite(value) ? value : 0);
  localStorage.setItem(CREDIT_KEY, clean.toFixed(2));
  updateCreditDisplay();
}

function updateCreditDisplay() {
  const el = document.querySelector('[data-credits]');
  if (el) {
    el.textContent = getCredits().toFixed(2);
  }
}

// --- LANGUAGE ---

const translations = {
  fr: {
    home_title: "Bienvenue sur Daimao Games",
    home_subtitle: "Jeux de casino en ligne entre amis. Amusez-vous avec la roulette, le blackjack et les machines à sous.",
    home_blackjack_title: "Blackjack",
    home_blackjack_desc: "Affrontez le croupier dans une version simple, fluide et animée.",
    home_roulette_title: "Roulette européenne",
    home_roulette_desc: "Placez vos mises sur la table, regardez la roue tourner et voyez où la bille s’arrête.",
    home_slots_title: "Machines à sous",
    home_slots_desc: "Tirez la manette, regardez les rouleaux tourner et espérez l’alignement parfait.",
    home_cta_play: "Jouer",
    home_tag_cards: "Jeu de cartes",
    home_tag_table: "Jeu de table",
    home_tag_slots: "Machine à sous",
    page_blackjack_title: "Blackjack",
    page_blackjack_subtitle: "Distribution animée, règles simples, et un léger avantage pour vous.",
    page_roulette_title: "Roulette européenne",
    page_roulette_subtitle: "Table de mises interactive, roue animée et plusieurs mises possibles à chaque tour.",
    page_slots_title: "Machines à sous",
    page_slots_subtitle: "Trois rouleaux, une ligne gagnante et plusieurs thèmes au choix.",
    label_bet_amount: "Mise",
    placeholder_bet_amount: "Ex : 10",
    btn_deal: "Distribuer",
    btn_hit: "Carte (+)",
    btn_stand: "Rester",
    blackjack_dealer: "Croupier",
    blackjack_player: "Vous",
    status_place_bet: "Choisissez votre mise puis cliquez sur « Distribuer ».",
    status_new_round: "Nouvelle manche.",
    status_blackjack_win: "Blackjack ! Vous gagnez.",
    status_win_generic: "Vous gagnez.",
    status_loss_generic: "Vous perdez.",
    status_push: "Égalité.",
    label_bet_type: "Type de mise",
    label_bet_number: "Numéro (0–36)",
    btn_add_bet: "Ajouter la mise",
    btn_spin: "Lancer la roue",
    roulette_result: "Résultat",
    roulette_no_bet: "Ajoutez au moins une mise avant de lancer.",
    slots_theme_label: "Thème",
    slots_theme_fruits: "Fruits",
    slots_theme_manga: "Manga",
    slots_theme_neon: "Néon / Diamants",
    btn_spin_slots: "Lancer",
    status_insufficient_credits: "Crédits insuffisants.",
    status_invalid_bet: `Mise invalide (min ${MIN_BET}, max ${MAX_BET}).`,
    header_tagline: "Daimao Games · Casino entre amis",
    credits_label: "Crédits"
  },
  en: {
    home_title: "Welcome to Daimao Games",
    home_subtitle: "Casino-style games to enjoy with your friends: roulette, blackjack and slots.",
    home_blackjack_title: "Blackjack",
    home_blackjack_desc: "Face the dealer in a simple, fluid and animated version.",
    home_roulette_title: "European Roulette",
    home_roulette_desc: "Place your bets on the table, watch the wheel spin and see where the ball lands.",
    home_slots_title: "Slot Machines",
    home_slots_desc: "Pull the lever, watch the reels spin and hope for the perfect line.",
    home_cta_play: "Play",
    home_tag_cards: "Card game",
    home_tag_table: "Table game",
    home_tag_slots: "Slot machine",
    page_blackjack_title: "Blackjack",
    page_blackjack_subtitle: "Animated dealing, simple rules and a slight edge in your favor.",
    page_roulette_title: "European Roulette",
    page_roulette_subtitle: "Interactive betting table, animated wheel and multiple bets per spin.",
    page_slots_title: "Slot Machines",
    page_slots_subtitle: "Three reels, one payline and multiple themes to choose from.",
    label_bet_amount: "Bet",
    placeholder_bet_amount: "e.g. 10",
    btn_deal: "Deal",
    btn_hit: "Hit",
    btn_stand: "Stand",
    blackjack_dealer: "Dealer",
    blackjack_player: "You",
    status_place_bet: "Choose your bet then click “Deal”.",
    status_new_round: "New round.",
    status_blackjack_win: "Blackjack! You win.",
    status_win_generic: "You win.",
    status_loss_generic: "You lose.",
    status_push: "Push.",
    label_bet_type: "Bet type",
    label_bet_number: "Number (0–36)",
    btn_add_bet: "Add bet",
    btn_spin: "Spin the wheel",
    roulette_result: "Result",
    roulette_no_bet: "Add at least one bet before spinning.",
    slots_theme_label: "Theme",
    slots_theme_fruits: "Fruits",
    slots_theme_manga: "Manga",
    slots_theme_neon: "Neon / Diamonds",
    btn_spin_slots: "Spin",
    status_insufficient_credits: "Not enough credits.",
    status_invalid_bet: `Invalid bet (min ${MIN_BET}, max ${MAX_BET}).`,
    header_tagline: "Daimao Games · Friends casino",
    credits_label: "Credits"
  }
};

function getLang() {
  const stored = localStorage.getItem(LANG_KEY);
  if (stored === 'fr' || stored === 'en') return stored;
  return 'fr';
}

function setLang(lang) {
  localStorage.setItem(LANG_KEY, lang);
  applyTranslations();
  updateLangToggle();
}

function applyTranslations() {
  const lang = getLang();
  const dict = translations[lang] || translations.fr;
  document.querySelectorAll('[data-i18n-key]').forEach(el => {
    const key = el.getAttribute('data-i18n-key');
    if (key && dict[key]) {
      el.textContent = dict[key];
    }
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    const dictVal = dict[key];
    if (dictVal) {
      el.setAttribute('placeholder', dictVal);
    }
  });
}

function updateLangToggle() {
  const langBtn = document.getElementById('lang-toggle');
  if (!langBtn) return;
  const lang = getLang();
  const labelSpan = langBtn.querySelector('[data-lang-label]');
  if (labelSpan) {
    labelSpan.textContent = lang === 'fr' ? 'FR / EN' : 'EN / FR';
  }
}

// --- SOUNDS ---

const soundCache = {};

function playSound(name) {
  const path = {
    click: 'sounds/click.mp3',
    win: 'sounds/win.mp3',
    lose: 'sounds/lose.mp3',
    spin: 'sounds/spin.mp3'
  }[name];

  if (!path) return;
  let audio = soundCache[name];
  if (!audio) {
    audio = new Audio(path);
    soundCache[name] = audio;
  }
  audio.currentTime = 0;
  audio.volume = 0.35;
  audio.play().catch(() => {});
}

// --- ANIMATIONS (WIN / LOSS / PARTICLES) ---

function animateWin() {
  const creditBox = document.querySelector('.credit-display');
  if (!creditBox) return;
  creditBox.classList.remove('glow-win');
  void creditBox.offsetWidth;
  creditBox.classList.add('glow-win');
  spawnParticles();
}

function animateLoss() {
  const creditBox = document.querySelector('.credit-display');
  if (!creditBox) return;
  creditBox.classList.remove('shake-loss');
  void creditBox.offsetWidth;
  creditBox.classList.add('shake-loss');
  setTimeout(() => creditBox.classList.remove('shake-loss'), 450);
}

function spawnParticles() {
  const container = document.createElement('div');
  container.className = 'particles-container';
  document.body.appendChild(container);

  const count = 16;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.left = (40 + Math.random() * 20) + 'vw';
    p.style.top = (5 + Math.random() * 6) + 'vh';
    p.style.animationDelay = (Math.random() * 0.25) + 's';
    container.appendChild(p);
  }
  setTimeout(() => container.remove(), 900);
}

// --- BET VALIDATION ---

function validateBetAmount(amount) {
  const num = parseFloat(amount);
  if (!Number.isFinite(num)) return null;
  if (num < MIN_BET || num > MAX_BET) return null;
  return num;
}

// --- INIT COMMON ---

document.addEventListener('DOMContentLoaded', () => {
  // première visite → si aucune valeur, on fixe 10
  if (localStorage.getItem(CREDIT_KEY) === null) {
    setCredits(10);
  } else {
    updateCreditDisplay();
  }

  applyTranslations();
  updateLangToggle();

  const langBtn = document.getElementById('lang-toggle');
  if (langBtn) {
    langBtn.addEventListener('click', () => {
      playSound('click');
      const newLang = getLang() === 'fr' ? 'en' : 'fr';
      setLang(newLang);
    });
  }

  if (typeof initBlackjack === 'function') initBlackjack();
  if (typeof initRoulette === 'function') initRoulette();
  if (typeof initSlots === 'function') initSlots();
});

