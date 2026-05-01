/* 리안이의 요리 게임 - 게임 엔진 */

const messageEl = document.getElementById('message');
const playArea  = document.getElementById('play-area');
const btn       = document.getElementById('action-btn');
const progress  = document.getElementById('progress-fill');

let currentRecipe = null;
let stepIndex = 0;

// 시작 화면
function init() {
  messageEl.textContent = "오늘은 무엇을 만들까?";
  playArea.innerHTML = "";
  btn.textContent = "시작!";
  btn.classList.remove('hidden');
  progress.style.width = "0%";
  btn.onclick = startGame;
}

function startGame() {
  // 현재는 1개뿐이지만, 추후 여러 레시피 중 랜덤 선택
  const keys = Object.keys(RECIPES);
  const key = keys[Math.floor(Math.random() * keys.length)];
  currentRecipe = RECIPES[key];
  stepIndex = 0;
  runStep();
}

function updateProgress() {
  const total = currentRecipe.steps.length;
  progress.style.width = ((stepIndex / total) * 100) + "%";
}

function nextStep() {
  stepIndex++;
  if (stepIndex >= currentRecipe.steps.length) {
    init();
    return;
  }
  runStep();
}

function runStep() {
  updateProgress();
  const step = currentRecipe.steps[stepIndex];
  messageEl.textContent = step.message;
  playArea.innerHTML = "";

  // 버튼 처리
  if (step.button) {
    btn.textContent = step.button;
    btn.classList.remove('hidden');
    btn.onclick = nextStep;
  } else {
    btn.classList.add('hidden');
  }

  // 단계별 화면 그리기
  const handler = stepHandlers[step.type];
  if (handler) handler(step);
}

// === 각 단계 화면 ===
const stepHandlers = {
  talk(step) {
    // 메시지만 보여주기
  },

  ingredients(step) {
    let tappedCount = 0;
    step.items.forEach(({ emoji, label }) => {
      const div = document.createElement('div');
      div.className = 'item';
      div.innerHTML = `<span>${emoji}</span><span class="label">${label}</span>`;
      div.onclick = () => {
        if (div.dataset.tapped) return;
        div.dataset.tapped = "1";
        div.style.transform = "scale(1.3)";
        setTimeout(() => div.style.transform = "scale(1)", 200);
        tappedCount++;
        if (tappedCount === step.items.length) {
          messageEl.textContent = "다 만져봤구나! 좋아!";
        }
      };
      playArea.appendChild(div);
    });
    playArea.style.flexWrap = "wrap";
  },

  knead(step) {
    let count = 0;
    const dough = document.createElement('div');
    dough.className = 'dough';
    dough.onclick = () => {
      count++;
      const scale = 1 - count * 0.05;
      dough.style.transform = `scale(${scale}, ${1 + count * 0.03})`;
      messageEl.textContent = `조물조물! ${count}/${step.target}`;
      if (count >= step.target) {
        setTimeout(nextStep, 500);
      }
    };
    playArea.appendChild(dough);
  },

  roll(step) {
    let count = 0;
    const dough = document.createElement('div');
    dough.className = 'dough';
    dough.style.transform = "scaleY(0.85)";
    dough.onclick = () => {
      count++;
      const flatten = 0.85 - count * 0.1;
      dough.style.transform = `scaleY(${flatten}) scaleX(${1 + count * 0.08})`;
      dough.style.borderRadius = `${50 - count * 8}%`;
      messageEl.textContent = `밀어밀어! ${count}/${step.target}`;
      if (count >= step.target) {
        setTimeout(nextStep, 500);
      }
    };
    playArea.appendChild(dough);
  },

  stove_in(step) {
    // 빵과 가스레인지 동시에 표시
    const wrap = document.createElement('div');
    wrap.style.display = "flex";
    wrap.style.gap = "20px";
    wrap.style.alignItems = "center";

    const bread = document.createElement('div');
    bread.className = 'bread draggable';
    bread.textContent = '🍞';

    const stove = document.createElement('div');
    stove.className = 'stove';
    stove.innerHTML = '<div class="burner"></div>';

    bread.onclick = () => {
      // 클릭하면 가스레인지 안으로 들어감
      bread.style.transition = "all 0.6s ease";
      bread.style.transform = "translateX(-100px) scale(0.6)";
      bread.style.opacity = "0";
      setTimeout(() => {
        stove.querySelector('.burner').textContent = '🍞';
        setTimeout(nextStep, 400);
      }, 500);
    };

    wrap.appendChild(bread);
    wrap.appendChild(stove);
    playArea.appendChild(wrap);
  },

  cook(step) {
    const stove = document.createElement('div');
    stove.className = 'stove on';
    stove.innerHTML = '<div class="burner">🍞</div>';
    playArea.appendChild(stove);

    let dots = 0;
    const interval = setInterval(() => {
      dots = (dots + 1) % 4;
      messageEl.textContent = "맛있게 구워지는 중" + ".".repeat(dots) + " 🔥";
    }, 400);

    setTimeout(() => {
      clearInterval(interval);
      stove.querySelector('.burner').textContent = '🥖';
      nextStep();
    }, step.duration);
  },

  lid_open(step) {
    const stove = document.createElement('div');
    stove.className = 'stove';
    stove.innerHTML = `
      <div class="lid"></div>
      <div class="burner">🥖</div>
    `;
    const lid = stove.querySelector('.lid');
    lid.onclick = () => {
      lid.classList.add('open');
      setTimeout(nextStep, 700);
    };
    playArea.appendChild(stove);
  },

  take_out(step) {
    const bread = document.createElement('div');
    bread.className = 'bread';
    bread.textContent = '🥖';
    bread.onclick = () => {
      bread.style.transition = "all 0.5s ease";
      bread.style.transform = "translateY(-100px) scale(1.4)";
      setTimeout(nextStep, 500);
    };
    playArea.appendChild(bread);
  },

  jam(step) {
    const wrap = document.createElement('div');
    wrap.className = 'jam-area';

    const bread = document.createElement('div');
    bread.style.fontSize = "180px";
    bread.style.position = "absolute";
    bread.textContent = '🥖';

    const canvas = document.createElement('canvas');
    canvas.width = 240;
    canvas.height = 240;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = "#ff5d92";

    let painting = false;
    let paintedPixels = 0;
    const totalPixels = 240 * 240;

    function getPos(e) {
      const rect = canvas.getBoundingClientRect();
      const t = e.touches ? e.touches[0] : e;
      return {
        x: t.clientX - rect.left,
        y: t.clientY - rect.top
      };
    }

    function paint(e) {
      if (!painting) return;
      const { x, y } = getPos(e);
      ctx.beginPath();
      ctx.arc(x, y, 22, 0, Math.PI * 2);
      ctx.fill();

      // 진행률 측정 (성능: 가끔만 측정)
      if (Math.random() < 0.2) {
        const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        let painted = 0;
        for (let i = 3; i < data.length; i += 4) {
          if (data[i] > 0) painted++;
        }
        const ratio = painted / (canvas.width * canvas.height);
        if (ratio >= step.target) {
          messageEl.textContent = "잼이 듬뿍! 맛있겠다 😋";
          painting = false;
          setTimeout(nextStep, 700);
        }
      }
    }

    canvas.addEventListener('mousedown', e => { painting = true; paint(e); });
    canvas.addEventListener('mousemove', paint);
    canvas.addEventListener('mouseup',   () => painting = false);
    canvas.addEventListener('mouseleave',() => painting = false);
    canvas.addEventListener('touchstart',e => { painting = true; paint(e); e.preventDefault(); });
    canvas.addEventListener('touchmove', e => { paint(e); e.preventDefault(); });
    canvas.addEventListener('touchend',  () => painting = false);

    wrap.appendChild(bread);
    wrap.appendChild(canvas);
    playArea.appendChild(wrap);
  },

  finale(step) {
    const div = document.createElement('div');
    div.className = 'finale';

    const img = document.createElement('img');
    img.src = currentRecipe.finalImage;
    img.alt = currentRecipe.name;
    img.onerror = () => {
      // 이미지 없으면 placeholder 분홍 케이크
      img.remove();
      const ph = document.createElement('div');
      ph.className = 'placeholder-cake';
      ph.textContent = '🍰';
      div.insertBefore(ph, div.firstChild);
    };
    div.appendChild(img);

    const sparkles = document.createElement('div');
    sparkles.className = 'sparkles';
    sparkles.textContent = '✨ 🌟 ✨';
    div.appendChild(sparkles);

    playArea.appendChild(div);
    progress.style.width = "100%";
  }
};

// 시작
init();
