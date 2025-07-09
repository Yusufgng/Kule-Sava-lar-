// Global Değişkenler
const elements = {
    mainMenu: document.getElementById('main-menu'),
    settingsPanel: document.getElementById('settings-panel'),
    levelSelection: document.getElementById('level-selection'),
    levelsContainer: document.querySelector('.levels-container'),
    bgMusic: document.getElementById('bg-music'),
    clickSound: document.getElementById('click-sound'),
    musicToggle: document.getElementById('musicToggle'),
    soundToggle: document.getElementById('soundToggle'),
    musicVolume: document.getElementById('musicVolume'),
    soundVolume: document.getElementById('soundVolume')
};

// Oyun Durumu
const gameState = {
    isMusicOn: true,
    isSoundOn: true,
    unlockedLevels: 1 // Başlangıçta sadece 1. bölüm açık
};

// Sayfa Yüklendiğinde
document.addEventListener('DOMContentLoaded', () => {
    initAudio();
    setupEventListeners();
    generateLevelButtons();
});

// Ses Ayarlarını Başlat
function initAudio() {
    elements.bgMusic.volume = elements.musicVolume.value / 100;
    elements.clickSound.volume = elements.soundVolume.value / 100;
    
    if (elements.musicToggle.checked) {
        elements.bgMusic.play().catch(e => console.warn("Müzik otomatik başlatılamadı:", e));
    }
}

// Event Listener'ları Kur
function setupEventListeners() {
    // Müzik Kontrolleri
    elements.musicToggle.addEventListener('change', toggleMusic);
    elements.musicVolume.addEventListener('input', updateMusicVolume);
    
    // Ses Kontrolleri
    elements.soundToggle.addEventListener('change', toggleSound);
    elements.soundVolume.addEventListener('input', updateSoundVolume);
    
    // Butonlara Tıklama Sesleri
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', playClickSound);
    });
}

// Oyun Kontrol Fonksiyonları
function startGame() {
    playClickSound();
    toggleScreen(elements.mainMenu, elements.levelSelection);
}

function backToMainMenu() {
    playClickSound();
    toggleScreen(elements.levelSelection, elements.mainMenu);
}

function toggleSettings() {
    playClickSound();
    elements.settingsPanel.classList.toggle('hidden');
}

function toggleTheme() {
    playClickSound();
    document.body.classList.toggle('night-theme');
    document.body.classList.toggle('day-theme');
}

// Bölüm Seçim Fonksiyonları
function generateLevelButtons() {
    elements.levelsContainer.innerHTML = '';
    
    for (let i = 1; i <= 10; i++) {
        const levelBtn = document.createElement('button');
        levelBtn.className = `level-btn ${i > gameState.unlockedLevels ? 'locked' : ''}`;
        levelBtn.textContent = i;
        
        levelBtn.onclick = i > gameState.unlockedLevels ? 
            () => showLockedLevelMessage() : 
            () => selectLevel(i);
        
        elements.levelsContainer.appendChild(levelBtn);
    }
}

function selectLevel(levelNumber) {
    playClickSound();
    alert(`Bölüm ${levelNumber} başlatılıyor...`);
    // loadLevel(levelNumber); // Gerçek oyun yükleme fonksiyonu
}

function showLockedLevelMessage() {
    playClickSound();
    alert('Bu bölüm kilitli! Önceki bölümleri tamamlamalısınız.');
}

// Ses Kontrol Fonksiyonları
function toggleMusic() {
    gameState.isMusicOn = elements.musicToggle.checked;
    gameState.isMusicOn ? elements.bgMusic.play() : elements.bgMusic.pause();
}

function toggleSound() {
    gameState.isSoundOn = elements.soundToggle.checked;
}

function updateMusicVolume() {
    elements.bgMusic.volume = elements.musicVolume.value / 100;
}

function updateSoundVolume() {
    elements.clickSound.volume = elements.soundVolume.value / 100;
}

function playClickSound() {
    if (!gameState.isSoundOn) return;
    
    elements.clickSound.currentTime = 0;
    elements.clickSound.play().catch(e => console.warn("Tık sesi çalınamadı:", e));
}

// Yardımcı Fonksiyonlar
function toggleScreen(hideElement, showElement) {
    hideElement.classList.add('hidden');
    showElement.classList.remove('hidden');
}
function saveSettings() {
    localStorage.setItem('gameSettings', JSON.stringify({
        musicOn: gameState.isMusicOn,
        soundOn: gameState.isSoundOn,
        musicVolume: elements.musicVolume.value,
        soundVolume: elements.soundVolume.value,
        theme: document.body.classList.contains('night-theme') ? 'night' : 'day'
    }));
}

function loadSettings() {
    const saved = JSON.parse(localStorage.getItem('gameSettings'));
    if (saved) {
        // Ayarları yükle
    }
}
function unlockNextLevel() {
    gameState.unlockedLevels++;
    localStorage.setItem('unlockedLevels', gameState.unlockedLevels);
    generateLevelButtons();
}
// Oyun durumunu kontrol için global değişken
let isGameRunning = false;

// Orijinal startGame fonksiyonunu güncelle
function startGame() {
    playClickSound();
    document.getElementById('main-menu').classList.add('hidden');
    document.getElementById('level-selection').classList.remove('hidden');
    isGameRunning = false;
}

// Bölüm seçim fonksiyonunu güncelle
function selectLevel(levelNumber) {
    playClickSound();
    document.getElementById('level-selection').classList.add('hidden');
    
    if (levelNumber === 1) {
        startLevel(level1);
        document.getElementById('game-container').classList.remove('hidden');
        isGameRunning = true;
    }
}

// Menüye dönüş fonksiyonu
function backToLevelSelection() {
    if (gameState.gameInterval) clearInterval(gameState.gameInterval);
    document.getElementById('game-container').classList.add('hidden');
    document.getElementById('result-screen').classList.add('hidden');
    document.getElementById('level-selection').classList.remove('hidden');
    isGameRunning = false;
}
/* oç */
// Oyun durumu
let currentGameState = {
    selectedLevel: 1,
    isGameRunning: false,
    gameInterval: null,
    lastUnlockedLevel: localStorage.getItem('lastUnlockedLevel') || 1
};

// 10 bölümlük veri
const levels = {};
for (let i = 1; i <= 10; i++) {
    levels[i] = {
        towers: [
            { id: 1, type: "player", soldiers: 10, maxSoldiers: 30, productionRate: 1, position: { x: 100, y: 200 }, color: "#4CAF50" },
            { id: 2, type: "neutral", soldiers: 5, maxSoldiers: 20, productionRate: 0.3, position: { x: 300, y: 150 }, color: "#9E9E9E" },
            { id: 3, type: "neutral", soldiers: 5, maxSoldiers: 20, productionRate: 0.3, position: { x: 200, y: 350 }, color: "#9E9E9E" },
            { id: 4, type: "neutral", soldiers: 5, maxSoldiers: 20, productionRate: 0.3, position: { x: 400, y: 300 }, color: "#9E9E9E" },
            { id: 5, type: "enemy", soldiers: 5 + (i*2), maxSoldiers: 30 + (i*5), productionRate: 0.5 + (i*0.05), position: { x: 500, y: 200 }, color: "#F44336" }
        ],
        mapSize: { width: 600 + (i*20), height: 400 + (i*20) }
    };
}

// Bölüm butonlarını oluştur
function generateLevelButtons() {
    const container = document.querySelector('.levels-container');
    container.innerHTML = '';
    
    for (let i = 1; i <= 10; i++) {
        const btn = document.createElement('button');
        btn.className = `level-btn ${i > currentGameState.lastUnlockedLevel ? 'locked' : ''}`;
        btn.textContent = i;
        btn.onclick = () => startLevel(i);
        container.appendChild(btn);
    }
}

// Bölüm başlatma fonksiyonu (güncellendi)
function startSelectedLevel() {
    if (!currentGameState.selectedLevel) {
        alert("Lütfen bir bölüm seçin!");
        return;
    }
    startLevel(currentGameState.selectedLevel);
}

// Bölüm seçme fonksiyonu (güncellendi)
function selectLevel(levelNum) {
    // Tüm seçimleri kaldır
    document.querySelectorAll('.level-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    // Yeni seçimi uygula
    const selectedBtn = document.querySelector(`.level-btn:nth-child(${levelNum})`);
    if (selectedBtn) {
        selectedBtn.classList.add('selected');
        currentGameState.selectedLevel = levelNum;
    }
}

// Bölüm butonlarını oluştur (güncellendi)
function generateLevelButtons() {
    const container = document.querySelector('.levels-container');
    container.innerHTML = '';
    
    for (let i = 1; i <= 10; i++) {
        const btn = document.createElement('button');
        btn.className = `level-btn ${i > currentGameState.lastUnlockedLevel ? 'locked' : ''}`;
        btn.textContent = i;
        btn.onclick = () => {
            if (i <= currentGameState.lastUnlockedLevel) {
                selectLevel(i);
            } else {
                playClickSound();
                alert('Bu bölüm kilitli! Önceki bölümleri tamamlamalısınız.');
            }
        };
        container.appendChild(btn);
    }
}
let currentSelectedLevel = 1;
let unlockedLevels = JSON.parse(localStorage.getItem('unlockedLevels')) || 1;

// Bölüm seçildiğinde
function selectLevel(levelNumber) {
    if (levelNumber > unlockedLevels) {
        playClickSound();
        alert(`Önce bölüm ${unlockedLevels}'i tamamlamalısın!`);
        return;
    }
    
    currentSelectedLevel = levelNumber;
    playClickSound();
    
    // Tüm butonlardan seçim class'ını kaldır
    document.querySelectorAll('.level-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    // Sadece seçilen butona ekle
    const selectedBtn = document.querySelector(`.level-btn[data-level="${levelNumber}"]`);
    if (selectedBtn) {
        selectedBtn.classList.add('selected');
    }
    
    // Direkt başlat (bölüm numarasına tıklayınca)
    startLevel(levelNumber);
}

// Başlat butonu fonksiyonu
function startSelectedLevel() {
    if (currentSelectedLevel) {
        startLevel(currentSelectedLevel);
    } else {
        alert("Lütfen bir bölüm seçin!");
    }
}

// Oyunu başlat
function startLevel(levelNumber) {
    playClickSound();
    document.getElementById('level-selection').classList.add('hidden');
    document.getElementById('game-screen').classList.remove('hidden');
    
    // Oyun başlatma kodları
    console.log(`Bölüm ${levelNumber} başlatılıyor...`);
    initializeGame(levelNumber);
}

// Bölümü tamamladığımızda
function completeLevel(levelNumber) {
    if (levelNumber === unlockedLevels) {
        unlockedLevels++;
        localStorage.setItem('unlockedLevels', unlockedLevels);
    }
}
