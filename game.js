// Oyun verileri

const towers = [
    // Oyuncu kulesi (limit: 50)
    { 
        id: 1, 
        type: "player", 
        soldiers: 10, 
        maxSoldiers: 50,
        x: 300, 
        y: 550, 
        production: 1 
    },
    
    // Nötr kuleler (limit: 35)
    { 
        id: 2, 
        type: "neutral", 
        soldiers: 0, 
        maxSoldiers: 35,
        x: 620, 
        y: 200, 
        production: 1 
    },
    { 
        id: 3, 
        type: "neutral", 
        soldiers: 0, 
        maxSoldiers: 35,
        x: 270, 
        y: 150, 
        production: 1 
    },
    { 
        id: 4, 
        type: "neutral", 
        soldiers: 0, 
        maxSoldiers: 35,
        x: 550, 
        y: 550, 
        production: 1 
    },
    
    // Düşman kulesi (limit: 50)
    { 
        id: 5, 
        type: "enemy", 
        soldiers: 7, 
        maxSoldiers: 50,
        x: 780, 
        y: 400, 
        production: 1 
    }
];

let selectedTower = null;
let gameInterval;
let gameArea = document.getElementById('game-area');

// Oyunu başlat
function initGame() {
    renderTowers();
    startProduction();
}

// Kuleleri ekrana yerleştir
function renderTowers() {
    gameArea.innerHTML = '';
    
    towers.forEach(tower => {
        const towerElement = document.createElement('div');
        towerElement.className = `tower ${tower.type}`;
        towerElement.style.left = `${tower.x - 30}px`;
        towerElement.style.top = `${tower.y - 30}px`;
        
        // Sadece asker sayısını göster (limit gösterme)
        const countText = document.createElement('div');
        countText.className = 'soldier-count';
        countText.textContent = tower.soldiers; // Sadece sayı
        towerElement.appendChild(countText);
        
        // Limit dolunca görsel efekt
        if (tower.soldiers >= tower.maxSoldiers) {
            towerElement.style.boxShadow = '0 0 10px rgba(255,255,255,0.7)';
        } else {
            towerElement.style.boxShadow = 'none';
        }
        
        towerElement.addEventListener('mousedown', () => selectTower(tower.id));
        towerElement.addEventListener('mouseup', () => attackTower(tower.id));
        
        gameArea.appendChild(towerElement);
    });
}

// Kule seçimi
function selectTower(towerId) {
    const tower = towers.find(t => t.id === towerId);
    if (tower.type === "player") {
        selectedTower = tower;
    }
}

// Saldırı işlemi
function startProduction() {
    clearInterval(gameInterval);
    gameInterval = setInterval(() => {
        towers.forEach(tower => {
            // Limit kontrolü - eğer asker sayısı max'tan azsa üret
            if (tower.soldiers < tower.maxSoldiers) {
                tower.soldiers += tower.production;
                // Max değeri aşmasın diye kontrol
                tower.soldiers = Math.min(tower.soldiers, tower.maxSoldiers);
            }
            // Max'a ulaştıysa üretim yapma (otomatik durur)
        });
        renderTowers();
        
        if (checkLevelComplete()) {
            levelCompleted();
        }
    }, 1000); // Saniyede 1 asker
}
function attackTower(targetId) {
    if (!selectedTower) return;
    
    const target = towers.find(t => t.id === targetId);
    if (!target) return;

    // KENDİ KULELERİMİZ ARASI TRANSFER
    if (target.type === "player") {
        const availableSpace = target.maxSoldiers - target.soldiers;
        const transferAmount = Math.min(selectedTower.soldiers, availableSpace);
        
        target.soldiers += transferAmount;
        selectedTower.soldiers -= transferAmount;
    } 
    // DÜŞMANA/NÖTRE SALDIRI
    else {
        target.soldiers -= selectedTower.soldiers;
        selectedTower.soldiers = 0;

        if (target.soldiers <= 0) {
            target.type = "player";
            target.soldiers = Math.abs(target.soldiers);
            target.maxSoldiers = 50; // Ele geçirilen kule limiti
        }
    }
    
    renderTowers();
    selectedTower = null;
}

// Bölüm tamamlandı mı kontrolü
function checkLevelComplete() {
    return towers.every(tower => tower.type === "player");
}

// Bölüm tamamlandığında
function levelCompleted() {
    clearInterval(gameInterval);
    
    const congrats = document.createElement('div');
    congrats.style.position = 'absolute';
    congrats.style.top = '50%';
    congrats.style.left = '50%';
    congrats.style.transform = 'translate(-50%, -50%)';
    congrats.style.backgroundColor = 'rgba(0,0,0,0.8)';
    congrats.style.color = 'white';
    congrats.style.padding = '20px';
    congrats.style.borderRadius = '10px';
    congrats.style.textAlign = 'center';
    congrats.style.zIndex = '100';
    congrats.innerHTML = `
        <h1>Tebrikler!</h1>
        <p>Bölümü başarıyla tamamladınız</p>
        <button id="next-level" style="padding: 10px 20px; margin-top: 10px;">Çıkış</button>
    `;
    
    gameArea.appendChild(congrats);
    
    document.getElementById('next-level').addEventListener('click', () => {
        // Bölüm seçim ekranına yönlendir
        window.location.href = "index.html"; // Veya kendi bölüm seçim fonksiyonunuz
    });
}

// Asker üretimi
function startProduction() {
    clearInterval(gameInterval);
    gameInterval = setInterval(() => {
        towers.forEach(tower => {
            // MAX LİMİT KONTROLÜ (Artık kesin çalışıyor)
            if (tower.soldiers < tower.maxSoldiers) {
                tower.soldiers = Math.min(
                    tower.soldiers + tower.production,
                    tower.maxSoldiers // Kesin sınırlama
                );
            }
        });
        renderTowers();
        if (checkLevelComplete()) levelCompleted();
    }, 1000);
}
// Kule pozisyonlarını görselleştirmek için:
function debugPositions() {
    towers.forEach(tower => {
        console.log(`Kule ${tower.id}: (${tower.x}, ${tower.y})`);
        const marker = document.createElement('div');
        marker.style.position = 'absolute';
        marker.style.left = `${tower.x - 5}px`;
        marker.style.top = `${tower.y - 5}px`;
        marker.style.width = '10px';
        marker.style.height = '10px';
        marker.style.backgroundColor = 'yellow';
        marker.style.borderRadius = '50%';
        document.getElementById('game-area').appendChild(marker);
    });
}
// initGame() içinde çağırabilirsiniz
// Oyun başlangıcı
window.onload = initGame;
// Her üretim adımında ekstra kontrol
function safeAddSoldiers(tower) {
    const newCount = tower.soldiers + tower.production;
    tower.soldiers = Math.min(newCount, tower.maxSoldiers);
    
    // DEBUG: Konsolda limit aşım kontrolü
    if (newCount > tower.maxSoldiers) {
        console.warn(`Limit aşımı önlendi: Kule ${tower.id}`);
    }
}
