/* 
   leng.js
   Dynamic Features, Navigation & Animations for Aleng's Page
*/

let successIntervalId = null;

document.addEventListener('DOMContentLoaded', () => {
  // --- Initialize Systems ---
  createStars();
  startGreetingTypewriter();
  setupNavigation();
  setupNoButtonEvasion();
  setupImages();
});

/* --- Star Generator --- */
function createStars() {
  const container = document.getElementById('stars-container');
  if (!container) return;
  
  const starCount = window.innerWidth < 600 ? 40 : 80;
  for (let i = 0; i < starCount; i++) {
    const star = document.createElement('div');
    star.classList.add('star');
    
    const size = Math.random() * 2 + 1;
    const top = Math.random() * 100;
    const left = Math.random() * 100;
    const speed = Math.random() * 3 + 2;
    
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    star.style.top = `${top}%`;
    star.style.left = `${left}%`;
    star.style.setProperty('--speed', `${speed}s`);
    
    container.appendChild(star);
  }
}

/* --- Typewriter Effect --- */
function startGreetingTypewriter() {
  const greetingEl = document.getElementById('greeting-text');
  const nextBtnContainer = document.querySelector('.fade-in-delayed');
  if (!greetingEl) return;
  
  const text = "Hello, Aleng! How are you? I hope you're doing well.";
  let index = 0;
  
  function typeChar() {
    if (index < text.length) {
      greetingEl.textContent += text.charAt(index);
      index++;
      setTimeout(typeChar, 75); // Speed of typing (ms per character)
    } else {
      // Finished typing: fade in the button
      if (nextBtnContainer) {
        nextBtnContainer.style.opacity = '1';
        nextBtnContainer.style.transition = 'opacity 1s ease';
      }
    }
  }
  
  setTimeout(typeChar, 600);
}

/* --- Multi-step Navigation (Forward & Back) --- */
function setupNavigation() {
  // Next Step Configs
  const nextSteps = [
    { id: 1, nextBtnId: 'btn-next-1' },
    { id: 2, nextBtnId: 'btn-next-2' },
    { id: 3, nextBtnId: 'btn-next-3' }
  ];
  
  nextSteps.forEach(step => {
    const nextBtn = document.getElementById(step.nextBtnId);
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        navigateToStep(step.id, step.id + 1);
      });
    }
  });

  // Back Step Configs
  const backSteps = [
    { id: 2, backBtnId: 'btn-back-2' },
    { id: 3, backBtnId: 'btn-back-3' },
    { id: 4, backBtnId: 'btn-back-4' },
    { id: 5, backBtnId: 'btn-back-5' }
  ];

  backSteps.forEach(step => {
    const backBtn = document.getElementById(step.backBtnId);
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        if (step.id === 5) {
          stopSuccessCelebration();
        }
        navigateToStep(step.id, step.id - 1);
      });
    }
  });
  
  // Yes Button click triggers Success Step (Step 5)
  const yesBtn = document.getElementById('btn-yes');
  if (yesBtn) {
    yesBtn.addEventListener('click', () => {
      navigateToStep(4, 5);
      triggerSuccessCelebration();
    });
  }
}

function navigateToStep(currentStepId, nextStepId) {
  const currentStep = document.getElementById(`step-${currentStepId}`);
  const nextStep = document.getElementById(`step-${nextStepId}`);
  
  if (currentStep && nextStep) {
    currentStep.classList.add('fade-out');
    
    setTimeout(() => {
      currentStep.classList.remove('active', 'fade-out');
      nextStep.classList.add('active');
      
      const card = document.getElementById('main-glass-card');
      if (card) {
        card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }, 500);
  }
}

/* --- Evading "No" Button --- */
function setupNoButtonEvasion() {
  const btnNo = document.getElementById('btn-no');
  if (!btnNo) return;
  
  const moveButton = () => {
    const isMobile = window.innerWidth <= 600;
    
    // Calculate boundaries relative to viewport & parent container
    const maxOffsetWidth = isMobile ? 100 : 200;
    const maxOffsetHeight = isMobile ? 60 : 100;
    
    // Random offsets
    let randomX = (Math.random() - 0.5) * 2 * maxOffsetWidth;
    let randomY = (Math.random() - 0.5) * 2 * maxOffsetHeight;
    
    // Ensure button jumps a minimum distance away from cursor
    if (Math.abs(randomX) < 45) {
      randomX += randomX >= 0 ? 55 : -55;
    }
    if (Math.abs(randomY) < 35) {
      randomY += randomY >= 0 ? 45 : -45;
    }
    
    btnNo.style.transform = `translate(${randomX}px, ${randomY}px)`;
  };
  
  btnNo.addEventListener('mouseenter', moveButton);
  btnNo.addEventListener('mouseover', moveButton);
  
  btnNo.addEventListener('touchstart', (e) => {
    e.preventDefault();
    moveButton();
  });
  
  btnNo.addEventListener('click', (e) => {
    e.preventDefault();
    moveButton();
  });
}

/* --- Static Image Loader (checks for hardcoded paths) --- */
function setupImages() {
  const imageItems = [
    { imgId: 'img-1', svgId: 'placeholder-svg-1' },
    { imgId: 'img-2', svgId: 'placeholder-svg-2' },
    { imgId: 'img-3', svgId: 'placeholder-svg-3' },
    { imgId: 'img-4', svgId: 'placeholder-svg-4' },
    { imgId: 'img-5', svgId: 'placeholder-svg-5' },
    { imgId: 'img-6', svgId: 'placeholder-svg-6' },
    { imgId: 'img-date', svgId: 'placeholder-svg-date' }
  ];

  imageItems.forEach(item => {
    const img = document.getElementById(item.imgId);
    const svg = document.getElementById(item.svgId);

    if (img) {
      const src = img.getAttribute('src');
      if (src && src !== '') {
        img.style.display = 'block';
        if (svg) svg.style.display = 'none';
      }
    }
  });
}

/* --- Success Celebration (Hearts & Confetti) --- */
function triggerSuccessCelebration() {
  const container = document.getElementById('floating-hearts-container');
  if (!container) return;
  
  successIntervalId = setInterval(() => {
    spawnHeart(container, false);
  }, 1000);
  
  for (let i = 0; i < 45; i++) {
    setTimeout(() => {
      spawnConfetti();
      if (i % 2 === 0) spawnHeart(container, true);
    }, i * 60);
  }
}

function stopSuccessCelebration() {
  if (successIntervalId) {
    clearInterval(successIntervalId);
    successIntervalId = null;
  }
  
  document.querySelectorAll('.confetti').forEach(el => el.remove());
  document.querySelectorAll('.floating-heart').forEach(el => el.remove());
}

/* Helper to spawn a floating heart */
function spawnHeart(container, isBurst) {
  const heart = document.createElement('div');
  heart.innerHTML = `<svg viewBox="0 0 24 24" width="100%" height="100%"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`;
  heart.classList.add('floating-heart');
  
  const size = isBurst ? Math.random() * 20 + 15 : Math.random() * 15 + 10;
  const left = Math.random() * 100;
  const speed = isBurst ? Math.random() * 4 + 3 : Math.random() * 6 + 5;
  const drift = (Math.random() - 0.5) * 120;
  
  heart.style.width = `${size}px`;
  heart.style.height = `${size}px`;
  heart.style.left = `${left}%`;
  heart.style.setProperty('--speed', `${speed}s`);
  heart.style.setProperty('--drift', `${drift}px`);
  heart.style.setProperty('--scale', Math.random() * 0.5 + 0.8);
  
  const colors = ['#fbcfe8', '#fecfef', '#ff758f', '#ffb3c1', '#e5c158', '#ffffff'];
  heart.style.color = colors[Math.floor(Math.random() * colors.length)];
  
  container.appendChild(heart);
  
  setTimeout(() => {
    heart.remove();
  }, speed * 1000);
}

/* Helper to spawn confetti particles falling down */
function confetti() {}
function spawnConfetti() {
  const confetti = document.createElement('div');
  confetti.classList.add('confetti');
  
  const size = Math.random() * 8 + 6;
  const left = Math.random() * 100;
  const speed = Math.random() * 3 + 2;
  const colors = [
    '#ff758f', '#fecfef', '#e5c158', '#4cc9f0', 
    '#4895ef', '#7209b7', '#f72585', '#52b788'
  ];
  
  confetti.style.width = `${size}px`;
  confetti.style.height = `${size}px`;
  confetti.style.left = `${left}%`;
  confetti.style.top = `-20px`;
  confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
  confetti.style.setProperty('--speed', `${speed}s`);
  
  if (Math.random() > 0.5) {
    confetti.style.borderRadius = '0%';
  }
  
  document.body.appendChild(confetti);
  
  setTimeout(() => {
    confetti.remove();
  }, speed * 1000);
}
