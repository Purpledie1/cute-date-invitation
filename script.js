/**
 * ============================================================================
 * INTERACTIVE DATE INVITATION & PIXEL CAT ENGINE
 * ============================================================================
 */

(function () {
  'use strict';

  // --- DOM Elements ---
  const soundToggle = document.getElementById('soundToggle');
  const soundIcon = document.getElementById('soundIcon');
  const soundText = document.getElementById('soundText');
  
  const stage1 = document.getElementById('stage1');
  const stage2 = document.getElementById('stage2');
  const stage3 = document.getElementById('stage3');
  
  const pixelCatBox = document.getElementById('pixelCatBox');
  const speechText = document.getElementById('speechText');
  
  const btnYes1 = document.getElementById('btnYes1');
  const btnYes2 = document.getElementById('btnYes2');
  const btnDodge = document.getElementById('btnDodge');
  const dodgeText = document.getElementById('dodgeText');
  const dodgeWrapper = document.getElementById('dodgeWrapper');
  
  const btnConfirmDate = document.getElementById('btnConfirmDate');
  const daySelector = document.getElementById('daySelector');
  const customWishInput = document.getElementById('customWish');
  
  const summaryActivities = document.getElementById('summaryActivities');
  const summaryDay = document.getElementById('summaryDay');
  const summaryWish = document.getElementById('summaryWish');
  const summaryWishRow = document.getElementById('summaryWishRow');
  const ticketSerial = document.getElementById('ticketSerial');
  
  const btnTelegram = document.getElementById('btnTelegram');
  const btnWhatsapp = document.getElementById('btnWhatsapp');
  const btnCopy = document.getElementById('btnCopy');
  const btnReset = document.getElementById('btnReset');
  
  const toastNotification = document.getElementById('toastNotification');
  const toastMessage = document.getElementById('toastMessage');
  const confettiCanvas = document.getElementById('confettiCanvas');
  const ambientBg = document.getElementById('ambientBg');

  // --- State ---
  let soundEnabled = true;
  let audioCtx = null;
  let dodgeCount = 0;
  let selectedDay = 'В эту пятницу вечером ✨';
  let isDodgeTransformed = false;

  // --- Web Audio Synthesizer (Zero External Dependencies) ---
  function initAudioContext() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playTone(freq, duration, type = 'sine', gainVal = 0.15) {
    if (!soundEnabled) return;
    try {
      initAudioContext();
      if (!audioCtx) return;

      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

      gain.gain.setValueAtTime(gainVal, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      console.warn('Audio playback error:', e);
    }
  }

  // Cute Paw Click Sound: Playful high-frequency pop
  function playPawSound() {
    if (!soundEnabled) return;
    try {
      initAudioContext();
      if (!audioCtx) return;
      
      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.12);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.16);
    } catch (e) {}
  }

  // Celebratory Yes Chime: Sweet romantic celesta chord arpeggio
  function playYesSound() {
    if (!soundEnabled) return;
    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C5, E5, G5, C6, E6
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        playTone(freq, 0.45, 'triangle', 0.2);
      }, idx * 90);
    });
  }

  // Playful Boing / Slide for the Runaway Button
  function playDodgeSound() {
    if (!soundEnabled) return;
    try {
      initAudioContext();
      if (!audioCtx) return;

      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(580, now);
      osc.frequency.exponentialRampToValueAtTime(260, now + 0.22);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.24);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.25);
    } catch (e) {}
  }

  // Cat Purr Sound
  function playPurrSound() {
    if (!soundEnabled) return;
    try {
      initAudioContext();
      if (!audioCtx) return;

      // Soft dual oscillator purr
      for (let i = 0; i < 4; i++) {
        setTimeout(() => {
          playTone(85 + (i % 2) * 15, 0.18, 'triangle', 0.12);
        }, i * 160);
      }
    } catch (e) {}
  }

  // Sound Toggle Control
  if (soundToggle) {
    soundToggle.addEventListener('click', () => {
      soundEnabled = !soundEnabled;
      if (soundEnabled) {
        initAudioContext();
        soundToggle.classList.remove('muted');
        soundIcon.textContent = '🔔';
        soundText.textContent = 'Звуки: Вкл';
        playPawSound();
        showToast('Звуковые эффекты включены 🐾');
      } else {
        soundToggle.classList.add('muted');
        soundIcon.textContent = '🔕';
        soundText.textContent = 'Звуки: Выкл';
        showToast('Звуковые эффекты отключены');
      }
    });
  }

  // --- Modern Web Guidance: Smooth Card Transitions ---
  function canTransitionDisplay() {
    if (!window.CSS?.supports?.('transition-behavior', 'allow-discrete') || !document.body) {
      return false;
    }
    const probe = document.createElement('div');
    probe.style.cssText = 'transition: display 0.1s allow-discrete !important; display: block;';
    document.body.appendChild(probe);
    const supported = getComputedStyle(probe).display === 'block';
    probe.remove();
    return supported;
  }

  async function hideCard(card) {
    if (canTransitionDisplay()) {
      card.hidden = true;
    } else {
      card.setAttribute('data-closing', '');
      const animations = card.getAnimations();
      if (animations.length > 0) {
        await Promise.race([
          Promise.allSettled(animations.map(a => a.finished)),
          new Promise(r => setTimeout(r, 450))
        ]);
      }
      card.removeAttribute('data-closing');
      card.hidden = true;
    }
  }

  function showCard(card) {
    card.removeAttribute('data-closing');
    card.hidden = false;
    window.scrollTo({ top: card.offsetTop - 30, behavior: 'smooth' });
  }

  async function switchStage(fromCard, toCard) {
    await hideCard(fromCard);
    showCard(toCard);
  }

  // --- Pixel Cat State Management ---
  function setCatState(state, customSpeech = null) {
    if (!pixelCatBox) return;

    pixelCatBox.classList.remove('excited', 'pleading', 'celebrate');
    if (state && state !== 'idle') {
      pixelCatBox.classList.add(state);
    }

    if (customSpeech && speechText) {
      speechText.textContent = customSpeech;
    }
  }

  // Pet the Cat Interactive Event
  if (pixelCatBox) {
    pixelCatBox.addEventListener('click', () => {
      initAudioContext();
      playPurrSound();
      setCatState('excited', 'Муррр-мяу! Спасибо, что гладишь меня! 😻💖');
      triggerHeartBurst(pixelCatBox);

      setTimeout(() => {
        if (!pixelCatBox.classList.contains('celebrate')) {
          setCatState('idle', 'Ты самая лучшая! Так что насчёт свидания? 🐾');
        }
      }, 3500);
    });
  }

  // Floating heart burst on pet
  function triggerHeartBurst(targetEl) {
    const rect = targetEl.getBoundingClientRect();
    const emojis = ['💖', '🐾', '✨', '🌸', '💕'];
    for (let i = 0; i < 6; i++) {
      const heart = document.createElement('span');
      heart.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      heart.style.position = 'fixed';
      heart.style.left = (rect.left + rect.width / 2 + (Math.random() * 40 - 20)) + 'px';
      heart.style.top = (rect.top + 20) + 'px';
      heart.style.fontSize = (16 + Math.random() * 12) + 'px';
      heart.style.pointerEvents = 'none';
      heart.style.zIndex = '9999';
      heart.style.transition = 'all 1s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
      heart.style.transform = 'scale(0.5)';
      heart.style.opacity = '1';
      document.body.appendChild(heart);

      requestAnimationFrame(() => {
        heart.style.transform = `translate(${Math.random() * 80 - 40}px, ${-60 - Math.random() * 50}px) scale(1.3) rotate(${Math.random() * 40 - 20}deg)`;
        heart.style.opacity = '0';
      });

      setTimeout(() => heart.remove(), 1050);
    }
  }

  // --- Decision Buttons Behavior ---
  function onYesClicked() {
    initAudioContext();
    playYesSound();
    fireConfetti();
    setCatState('celebrate', 'УРРРААА! Я знал, что ты согласишься! 😻💖🎉');

    setTimeout(() => {
      switchStage(stage1, stage2);
    }, 1200);
  }

  if (btnYes1) {
    btnYes1.addEventListener('click', onYesClicked);
    btnYes1.addEventListener('mouseenter', () => {
      setCatState('excited', 'О да-да-да! Нажимай скорее! 😻🐾');
    });
    btnYes1.addEventListener('mouseleave', () => {
      if (!pixelCatBox.classList.contains('celebrate')) {
        setCatState('idle', 'Мяу! У меня к тебе один очень важный вопрос... 🐾');
      }
    });
  }

  if (btnYes2) {
    btnYes2.addEventListener('click', onYesClicked);
    btnYes2.addEventListener('mouseenter', () => {
      setCatState('excited', 'Конечно да — самый правильный ответ! ✨');
    });
    btnYes2.addEventListener('mouseleave', () => {
      if (!pixelCatBox.classList.contains('celebrate')) {
        setCatState('idle', 'Мяу! У меня к тебе один очень важный вопрос... 🐾');
      }
    });
  }

  // --- The Playful Dodge Button ("Я ещё подумаю... 🙈") ---
  const dodgePhrases = [
    'Ой, лапка соскользнула! 😸',
    'Котик не принимает отказов! 🥺',
    'Хи-хи, не поймаешь! 🐾',
    'Ну пожалуйста-пожалуйста! 💖',
    'От судьбы не убежишь! ✨',
    'Ладно-ладно, согласна! 🥰'
  ];

  function runAwayButton(event) {
    if (isDodgeTransformed) return;
    initAudioContext();
    playDodgeSound();
    dodgeCount++;

    setCatState('pleading', 'Ты правда хочешь подумать? Котик грустит... 🥺🐾');

    if (dodgeCount >= 4) {
      // Transform into a YES button!
      isDodgeTransformed = true;
      btnDodge.classList.remove('btn-dodge');
      btnDodge.classList.add('btn-yes');
      dodgeText.textContent = 'Ладно, уговорил, ДА! 💖';
      dodgeWrapper.style.transform = 'none';
      setCatState('celebrate', 'Ураа! Теперь точно согласна! 😻');
      btnDodge.addEventListener('click', onYesClicked, { once: true });
      triggerHeartBurst(btnDodge);
      return;
    }

    // Move within safe bounds
    const container = document.getElementById('decisionContainer');
    const containerRect = container.getBoundingClientRect();
    const btnRect = btnDodge.getBoundingClientRect();

    const maxMoveX = Math.min(window.innerWidth - btnRect.width - 40, 160);
    const maxMoveY = 50;

    const randomX = (Math.random() - 0.5) * maxMoveX * 1.5;
    const randomY = (Math.random() - 0.5) * maxMoveY * 1.5;

    dodgeWrapper.style.transform = `translate(${randomX}px, ${randomY}px)`;
    dodgeText.textContent = dodgePhrases[(dodgeCount - 1) % dodgePhrases.length];
  }

  if (btnDodge) {
    btnDodge.addEventListener('mouseenter', runAwayButton);
    btnDodge.addEventListener('touchstart', (e) => {
      if (!isDodgeTransformed) {
        e.preventDefault();
        runAwayButton(e);
      }
    });
    btnDodge.addEventListener('click', (e) => {
      if (!isDodgeTransformed) {
        e.preventDefault();
        runAwayButton(e);
      }
    });
  }

  // --- Paw Checkbox Click Sounds & Cards Sync ---
  const activityCheckboxes = document.querySelectorAll('.activity-checkbox');
  activityCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', () => {
      initAudioContext();
      playPawSound();
      if (checkbox.checked) {
        setCatState('excited', 'Отличный выбор! Мне тоже это очень нравится! 🐾✨');
      }
    });
  });

  // --- Day / Time Selection Pill Buttons ---
  if (daySelector) {
    const pillButtons = daySelector.querySelectorAll('.pill-btn');
    pillButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        initAudioContext();
        playPawSound();
        pillButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedDay = btn.getAttribute('data-day') || btn.textContent.trim();
      });
    });
  }

  // --- Confirm Date Activities & Generate Ticket (Stage 2 -> Stage 3) ---
  if (btnConfirmDate) {
    btnConfirmDate.addEventListener('click', () => {
      initAudioContext();
      playYesSound();
      fireConfetti();

      // Gather chosen activities
      const chosenActivities = [];
      activityCheckboxes.forEach(cb => {
        if (cb.checked) {
          chosenActivities.push(cb.value);
        }
      });

      if (chosenActivities.length === 0) {
        chosenActivities.push('☕ Уютная кофейня и кофе с круассанами');
      }

      // Populate summary ticket
      summaryActivities.innerHTML = '';
      chosenActivities.forEach(act => {
        const li = document.createElement('li');
        li.textContent = act;
        summaryActivities.appendChild(li);
      });

      summaryDay.textContent = selectedDay;

      const customWish = customWishInput.value.trim();
      if (customWish) {
        summaryWish.textContent = customWish;
        summaryWishRow.style.display = 'block';
      } else {
        summaryWishRow.style.display = 'none';
      }

      // Generate cute random serial code
      const randomCode = Math.floor(1000 + Math.random() * 9000);
      ticketSerial.textContent = `№ LOVE-2026-${randomCode} 🐾`;

      // Build romantic pre-filled share message
      const shareMessage = buildShareMessage(chosenActivities, selectedDay, customWish);

      // Setup Telegram & WhatsApp links
      if (btnTelegram) {
        btnTelegram.href = `https://t.me/share/url?text=${encodeURIComponent(shareMessage)}`;
      }
      if (btnWhatsapp) {
        btnWhatsapp.href = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareMessage)}`;
      }

      // Copy text button setup
      btnCopy.onclick = () => {
        navigator.clipboard.writeText(shareMessage).then(() => {
          showToast('Текст ответа скопирован в буфер! 🐾');
          playPawSound();
        }).catch(() => {
          showToast('Не удалось скопировать, отправь в мессенджер!');
        });
      };

      // Switch to Ticket
      switchStage(stage2, stage3);
      setCatState('celebrate', 'Ура! Наше идеальное свидание утверждено! 🎟️💖');
    });
  }

  // Reset Button
  if (btnReset) {
    btnReset.addEventListener('click', () => {
      switchStage(stage3, stage2);
    });
  }

  function buildShareMessage(activities, day, wish) {
    let msg = `Привет! 💖 Я согласна пойти с тобой на свидание! 🐾\n\n`;
    msg += `Наши идеальные планы:\n`;
    activities.forEach(act => {
      msg += `• ${act}\n`;
    });
    msg += `\n🗓 Когда: ${day}\n`;
    if (wish) {
      msg += `🧁 Моё пожелание: ${wish}\n`;
    }
    msg += `\nБуду ждать с нетерпением! 😻✨`;
    return msg;
  }

  // --- Toast Notification ---
  let toastTimer = null;
  function showToast(message) {
    if (!toastNotification || !toastMessage) return;
    toastMessage.textContent = message;
    toastNotification.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastNotification.classList.remove('show');
    }, 3200);
  }

  // --- Confetti Explosion on Canvas ---
  function fireConfetti() {
    if (!confettiCanvas) return;
    const ctx = confettiCanvas.getContext('2d');
    const width = confettiCanvas.width = window.innerWidth;
    const height = confettiCanvas.height = window.innerHeight;

    const particles = [];
    const colors = ['#ff5b89', '#ff9ebb', '#ffd166', '#a78bfa', '#38bdf8', '#34d399', '#ffffff'];
    const emojis = ['💖', '🐾', '✨', '🌸', '⭐'];

    for (let i = 0; i < 90; i++) {
      particles.push({
        x: width / 2 + (Math.random() * 80 - 40),
        y: height / 2 + (Math.random() * 60 - 30),
        vx: (Math.random() - 0.5) * 16,
        vy: -Math.random() * 14 - 6,
        gravity: 0.35,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
        size: Math.random() * 9 + 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        emoji: Math.random() > 0.65 ? emojis[Math.floor(Math.random() * emojis.length)] : null,
        alpha: 1,
        decay: Math.random() * 0.015 + 0.008
      });
    }

    let animationFrame;
    function render() {
      ctx.clearRect(0, 0, width, height);
      let active = 0;

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.rotation += p.rotationSpeed;
        p.alpha -= p.decay;

        if (p.alpha > 0) {
          active++;
          ctx.save();
          ctx.globalAlpha = Math.max(p.alpha, 0);
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);

          if (p.emoji) {
            ctx.font = `${p.size * 2}px sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(p.emoji, 0, 0);
          } else {
            ctx.fillStyle = p.color;
            ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
          }
          ctx.restore();
        }
      });

      if (active > 0) {
        animationFrame = requestAnimationFrame(render);
      } else {
        ctx.clearRect(0, 0, width, height);
        cancelAnimationFrame(animationFrame);
      }
    }

    render();
  }

  // --- Background Ambient Floating Particles ---
  function initAmbientParticles() {
    if (!ambientBg) return;
    const icons = ['🐾', '💖', '✨', '🌸', '🎀', '⭐'];
    const count = 18;

    for (let i = 0; i < count; i++) {
      const span = document.createElement('span');
      span.className = 'ambient-particle';
      span.textContent = icons[Math.floor(Math.random() * icons.length)];
      span.style.left = Math.random() * 96 + 'vw';
      span.style.animationDuration = (Math.random() * 12 + 10) + 's';
      span.style.animationDelay = (Math.random() * 10) + 's';
      span.style.fontSize = (Math.random() * 1 + 0.8) + 'rem';
      ambientBg.appendChild(span);
    }
  }

  initAmbientParticles();

  // Resize handler for canvas
  window.addEventListener('resize', () => {
    if (confettiCanvas) {
      confettiCanvas.width = window.innerWidth;
      confettiCanvas.height = window.innerHeight;
    }
  });

})();
