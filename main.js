const CREDIT_KEY = 'daimao_credits';
const LANG_KEY = 'daimao_lang';

const MIN_BET = 0.2;
const MAX_BET = 10000;

// --- CREDITS ---

function getCredits() {
  const stored = localStorage.getItem(CREDIT_KEY);
  const val = stored ? parseFloat(stored) : 0;
  return isNaN(val) ? 0 : val;
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
    home_subtitle: "Casino virtuel, crédits virtuels. Amuse-toi avec la roulette, le blackjack et les machines à sous.",
    home_blackjack_title: "Blackjack",
    home_blackjack_desc: "Affronte le croupier dans une version simplifiée, pensée pour les débutants.",
    home_roulette_title: "Roulette européenne",
    home_roulette_desc: "Mises sur rouge/noir, pair/impair, manque/passe ou un numéro direct.",
    home_slots_title: "Machines à sous",
    home_slots_desc: "Choisis ton thème : fruits classiques, manga ou néon/diamants.",
    home_cta_play: "Jouer",
    home_tag_cards: "Jeu de cartes",
    home_tag_table: "Jeu de table",
    home_tag_slots: "Machine à sous",
    page_blackjack_title: "Blackjack",
    page_blackjack_subtitle: "Version simplifiée, avec une légère chance bonus en ta faveur.",
    page_roulette_title: "Roulette européenne",
    page_roulette_subtitle: "Place plusieurs mises, lance la roue, et vois jusqu’où vont tes crédits.",
    page_slots_title: "Machines à sous",
    page_slots_subtitle: "Trois rouleaux, une ligne gagnante et trois thèmes différents.",
    label_bet_amount: "Mise",
    placeholder_bet_amount: "Ex : 10",
    btn_deal: "Distribuer",
    btn_hit: "Carte (+)",
    btn_stand: "Rester",
    blackjack_dealer: "Croupier",
    blackjack_player: "Toi",
    status_place_bet: "Choisis ta mise puis distribue.",
    status_new_round: "Nouvelle manche.",
    status_blackjack_win: "Blackjack ! Victoire.",
    status_win_generic: "Victoire !",
    status_loss_generic: "Perdu.",
    status_push: "Égalité.",
    label_bet_type: "Type de mise",
    label_bet_number: "Numéro (0-36)",
    btn_add_bet: "Ajouter la mise",
    btn_spin: "Lancer la roue",
    roulette_result: "Résultat",
    roulette_no_bet: "Ajoute au moins une mise avant de lancer.",
    slots_theme_label: "Thème",
    slots_theme_fruits: "Fruits",
    slots_theme_manga: "Manga",
    slots_theme_neon: "Néon / Diamants",
    btn_spin_slots: "Lancer",
    status_insufficient_credits: "Crédits insuffisants.",
    status_invalid_bet: `Mise invalide (min ${MIN_BET}, max ${MAX_BET}).`,
    header_tagline: "Crédits virtuels, plaisir réel.",
    credits_label: "Crédits"
  },
  en: {
    home_title: "Welcome to Daimao Games",
    home_subtitle: "Virtual casino, virtual credits. Enjoy roulette, blackjack and slot machines.",
    home_blackjack_title: "Blackjack",
    home_blackjack_desc: "Face the dealer in a simplified version designed for beginners.",
    home_roulette_title: "European Roulette",
    home_roulette_desc: "Bet on red/black, odd/even, low/high or straight numbers.",
    home_slots_title: "Slot Machines",
    home_slots_desc: "Pick your theme: classic fruits, manga or neon/diamonds.",
    home_cta_play: "Play",
    home_tag_cards: "Card game",
    home_tag_table: "Table game",
    home_tag_slots: "Slot machine",
    page_blackjack_title: "Blackjack",
    page_blackjack_subtitle: "Simplified version, with a slight extra win chance in your favor.",
    page_roulette_title: "European Roulette",
    page_roulette_subtitle: "Place multiple bets, spin the wheel, and see how far your credits go.",
    page_slots_title: "Slot Machines",
    page_slots_subtitle: "Three reels, one payline and three different themes.",
    label_bet_amount: "Bet",
    placeholder_bet_amount: "e.g. 10",
    btn_deal: "Deal",
    btn_hit: "Hit",
    btn_stand: "Stand",
    blackjack_dealer: "Dealer",
    blackjack_player: "You",
    status_place_bet: "Choose your bet and deal.",
    status_new_round: "New round.",
    status_blackjack_win: "Blackjack! You win.",
    status_win_generic: "Win!",
    status_loss_generic: "Lost.",
    status_push: "Push.",
    label_bet_type: "Bet type",
    label_bet_number: "Number (0-36)",
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
    header_tagline: "Virtual credits, real fun.",
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
  updateCreditDisplay();
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
