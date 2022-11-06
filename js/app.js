document.body.style.zoom = 0.8;

// Layers
const startLayer = document.querySelector('.start-layer');
const gameLayer = document.querySelector('.game-layer');
const endLayer = document.querySelector('.end-layer');
const gameArea = document.querySelector('.game-layer .wrapper.layer');

// Start Form
const startForm = document.getElementById('start-form');
const playerNameInput = document.getElementById('player-name');

// Timer and Player Name in DOM
const timerDisplay = document.querySelector('.time-display');
const playerNameDisplay = document.querySelector('.player-display');

// Player Aircraft
const playerContainer = document.querySelector('.player');
const playerAircraft = document.querySelector('.player img');
const playerBullet = document.querySelector('.player .player-bullet');

// Alien Container
const AlienContainer = document.querySelector('.formation');

// Variables
let playerName = '';
let time = 0;
let leftPress = false;
let rightPress = false;

// Game States
// start, game, end
let gameState = 'start';
let timer = 0;

// Class
class Player {
  constructor() {
    this.aircraft = playerAircraft;
    this.bullet = playerBullet;
    this.x = 0;
    this.speed = 5;
    this.bullets = [];
    this.loaded = true;
    this.reloadSpeed = 1000;
  }
  update() {
    if (leftPress && this.x > -480) {
      this.moveleft();
    }
    if (rightPress && this.x < 480) {
      this.moveRight();
    }
    const bullets = Array.from(
      document.querySelectorAll('.player-bullet-fired')
    );
    bullets.forEach((bullet) => {});
  }
  props() {
    return this.aircraft.getBoundingClientRect();
  }
  moveleft() {
    this.x += this.speed * -1;
    this.aircraft.style.transform = `translateX(${this.x}px)`;
    this.bullet.style.transform = `translateX(${this.x}px)`;
  }
  moveRight() {
    this.x += this.speed;
    this.aircraft.style.transform = `translateX(${this.x}px)`;
    this.bullet.style.transform = `translateX(${this.x}px)`;
  }
  fire() {
    this.bullet.style.animation = 'none';

    if (this.loaded) {
      this.loaded = false;
      new Bullet(
        this.aircraft.getBoundingClientRect().x + 21,
        this.aircraft.getBoundingClientRect().y - 4,
        'player-bullet-fired'
      ).draw();
      this.bullet.style.visibility = 'hidden';
      console.log(playerName.toLocaleLowerCase());
      if (playerName.toLocaleLowerCase().trim() === 'god father') {
        this.rapidFire();
      }
      setTimeout(() => {
        this.loaded = true;
        this.bullet.style.visibility = 'visible';
      }, this.reloadSpeed);
    }
  }
  rapidFire() {
    setTimeout(() => {
      new Bullet(
        this.aircraft.getBoundingClientRect().x + 21,
        this.aircraft.getBoundingClientRect().y - 4,
        'player-bullet-fired'
      ).draw();
    }, 100);
    setTimeout(() => {
      new Bullet(
        this.aircraft.getBoundingClientRect().x + 21,
        this.aircraft.getBoundingClientRect().y - 4,
        'player-bullet-fired'
      ).draw();
    }, 200);
    setTimeout(() => {
      new Bullet(
        this.aircraft.getBoundingClientRect().x + 21,
        this.aircraft.getBoundingClientRect().y - 4,
        'player-bullet-fired'
      ).draw();
    }, 300);
    setTimeout(() => {
      new Bullet(
        this.aircraft.getBoundingClientRect().x + 21,
        this.aircraft.getBoundingClientRect().y - 4,
        'player-bullet-fired',
        'player'
      ).draw();
    }, 400);
  }
}

class Bullet {
  constructor(x, y, classList, type) {
    this.x = x;
    this.y = y;
    this.classList = classList;
    this.type = type;
  }
  draw() {
    const bullet = document.createElement('div');
    bullet.classList.add(this.classList);
    bullet.classList.add(this.type);
    bullet.style.left = `${this.x}px`;
    bullet.style.top = `${this.y}px`;
    // gameArea.appendChild(bullet)
    document.querySelector('body').appendChild(bullet);
  }
}
class Explosion {
  constructor(x, y, isPlayer) {
    this.x = x;
    this.y = y;
    this.isPlayer = isPlayer;
  }
  draw() {
    const id = Date.now();
    const explosion = document.createElement('div');
    explosion.classList.add('explosion');
    explosion.setAttribute('id', id);
    explosion.style.left = `${this.x}px`;
    explosion.style.top = `${this.y}px`;
    document.querySelector('body').appendChild(explosion);

    if (this.isPlayer) {
      explosion.style.width = '100px';
      explosion.style.height = '100px';
    }

    setTimeout(() => {
      document.getElementById(id).remove();
    }, 1000);
  }
}
// Initialize Player
const player = new Player();

function animate() {
  // Run if In Game
  if (gameState === 'game') {
    displayTime();

    player.update();

    checkCollisions();
  }

  requestAnimationFrame(animate);
}

// Utilities
function startNewGame() {
  const startTimer = setInterval(() => {
    if (gameState === 'game') {
      timer++;
    }
    if (gameState === 'end') {
      clearInterval(startTimer);
    }

    if (timer > 5) {
      if (timer % 2 === 0) {
        alienFireBullets('purple');
        alienFireBullets('yellow');
      } else {
        alienFireBullets('green');
        alienFireBullets('red');
      }
    }
  }, 1000);
}
function alienFireBullets(type) {
  const aliens = Array.from(document.querySelectorAll(`.bee-ctn .${type}`));
  const random = Math.floor(Math.random() * aliens.length);
  new Bullet(
    aliens[random].getBoundingClientRect().x + 20,
    aliens[random].getBoundingClientRect().y +
      aliens[random].getBoundingClientRect().height,
    `${type}-alien-bullet-fired`,
    'alien'
  ).draw();

  setTimeout(() => {
    new Bullet(
      aliens[random].getBoundingClientRect().x + 20,
      aliens[random].getBoundingClientRect().y +
        aliens[random].getBoundingClientRect().height,
      `${type}-alien-bullet-fired`,
      'alien'
    ).draw();
  }, 200);
}
function checkCollisions() {
  const aliens = Array.from(document.querySelectorAll('.bee-ctn'));

  aliens.forEach((alien) => {
    const alienProp = alien.getBoundingClientRect();
    const bullets = Array.from(
      document.querySelectorAll('.player-bullet-fired')
    );

    bullets.forEach((bullet) => {
      const bulletProp = bullet.getBoundingClientRect();
      if (
        bulletProp.y < alienProp.y + alienProp.height - 27 &&
        bulletProp.y > alienProp.y + 27 &&
        bulletProp.x > alienProp.x + 27 &&
        bulletProp.x < alienProp.x + alienProp.width - 27
      ) {
        new Explosion(alienProp.x + 20, alienProp.y + 16, false).draw();
        bullet.remove();
        alien.remove();
      }
    });
  });

  const enemyBullets = Array.from(document.querySelectorAll('.alien'));
  enemyBullets.forEach((bullet) => {
    const bulletProp = bullet.getBoundingClientRect();
    const playerProp = player.props();
    if (bulletProp.y > window.innerHeight) {
      bullet.remove();
    }

    if (
      bulletProp.y > playerProp.y &&
      bulletProp.y < playerProp.y + playerProp.height &&
      bulletProp.x > playerProp.x &&
      bulletProp.x < playerProp.x + playerProp.width
    ) {
      bullet.remove();
      new Explosion(playerProp.x - 20, playerProp.y - 20, true).draw();
      if (
        Array.from(document.querySelectorAll('.life-display img')).length > 0
      ) {
        const livesDom = Array.from(
          document.querySelectorAll('.life-display img')
        );
        livesDom[livesDom.length - 1].remove();
      }

      if (
        Array.from(document.querySelectorAll('.life-display img')).length === 0
      ) {
        const enemyBullets = Array.from(document.querySelectorAll('.alien'));
        enemyBullets.forEach((bullet) => {
          bullet.remove();
        });
        gameOver();
      }
    }
  });
}
function gameOver() {
  new Explosion(player.props().x - 20, player.props().y - 20, true).draw();
  // player.aircraft.style.display = 'none'
  // player.bullet.style.display = 'none'
  setTimeout(() => {
    gameState = 'end';
    changeLayer(gameState);
    player.aircraft.style.display = 'block';
    player.bullet.style.display = 'block';
  }, 2000);
}
function displayTime() {
  let minutesText = '00';
  let secondsText = '00';
  const minutes = Math.floor(timer / 60);
  const seconds = minutes > 0 ? timer % (minutes * 60) : timer;

  if (minutes > 0) {
    minutesText = minutes > 9 ? minutes : `0${minutes}`;
    secondsText = seconds > 9 ? seconds : `0${seconds}`;
  } else {
    secondsText = seconds > 9 ? seconds : `0${seconds}`;
  }
  timerDisplay.textContent = `${minutesText}:${secondsText}`;
}

function changeLayer(state) {
  // Remove current class to all layers
  startLayer.classList.remove('current');
  gameLayer.classList.remove('current');
  endLayer.classList.remove('current');

  // add current class to layers based on game state
  if (state === 'start') {
    startLayer.classList.add('current');
  } else if (state === 'game') {
    gameLayer.classList.add('current');
  } else if (state === 'end') {
    endLayer.classList.add('current');
  }
}
function keydown(e) {
  if (timer > 5) {
    if (gameState === 'game') {
      if (e.key === 'ArrowLeft') {
        leftPress = true;
      } else if (e.key === 'ArrowRight') {
        rightPress = true;
      } else if (e.key === ' ') {
        player.fire();
      }
    }
  }
}
function keyup(e) {
  if (timer > 5) {
    if (gameState === 'game') {
      if (e.key === 'ArrowLeft') {
        leftPress = false;
      } else if (e.key === 'ArrowRight') {
        rightPress = false;
      }
    }
  }
}

// Event Listeners
startForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const confirm = window.confirm('Confirm Name' + playerNameInput.value);

  if (confirm) {
    gameState = 'game';
    changeLayer(gameState);
    playerName = playerNameInput.value;
    playerNameDisplay.textContent = playerName;
    startNewGame();
  }
});

window.addEventListener('keydown', keydown);
window.addEventListener('keyup', keyup);

animate();
