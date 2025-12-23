// Game State
const gameState = {
    gold: 1000,
    inventory: {},
    conversationCount: 0,
    // Goal system
    goalLevel: 'beginner',
    totalBuys: 0,
    totalSells: 0,
    negotiationAttempts: 0,
    negotiationSuccesses: 0,
    totalProfit: 0,
    currentNegotiatingItem: null
};

// Goals
const goals = {
    beginner: { gold: 3000, title: '견습 상인', reward: '세이노의 인정' },
    intermediate: { gold: 5000, title: '숙련 상인', reward: '상인의 비법' },
    master: { gold: 10000, title: '마스터 상인', reward: '세이노의 가르침' }
};

// Shop Items
const shopItems = {
    "1": { name: "낡은 검", price: 100, desc: "기본적인 검. 녹슬었지만 쓸만하다.", keywords: ["낡은검", "낡은", "검1"] },
    "2": { name: "강철 검", price: 500, desc: "튼튼한 강철 검. 전사의 필수품.", keywords: ["강철검", "강철", "검2"] },
    "3": { name: "전설의 검", price: 2000, desc: "전설로만 전해지는 명검. 세이노의 자랑.", keywords: ["전설의검", "전설검", "전설", "명검"] },
    "4": { name: "가죽 갑옷", price: 300, desc: "기본 방어구. 가볍고 실용적이다.", keywords: ["가죽갑옷", "가죽", "갑옷1"] },
    "5": { name: "판금 갑옷", price: 800, desc: "무거운 대신 방어력은 최고.", keywords: ["판금갑옷", "판금", "갑옷2"] },
    "6": { name: "체력 포션", price: 50, desc: "HP 50 회복. 위급할 때 쓰는 물약.", keywords: ["체력포션", "체력", "빨간포션", "hp포션"] },
    "7": { name: "마나 포션", price: 50, desc: "MP 50 회복. 마법사의 필수템.", keywords: ["마나포션", "마나", "파란포션", "mp포션"] },
    "8": { name: "엘릭서", price: 500, desc: "HP/MP 완전 회복. 귀한 물건이다.", keywords: ["엘릭서", "엘릭시르", "만능물약"] }
};

// Mock AI Responses
const mockResponses = {
    greeting: [
        "어서오십시오... 아니, 그냥 구경꾼인가?",
        "손님이라도 돼야 인사를 받지. 뭘 원하나?",
        "시간은 돈이다. 용건만 간단히."
    ],
    negotiationSuccess: [
        "...제법이군. {}G에 넘긴다.",
        "흠. 네 말에 일리는 있다. {}G다.",
        "좋아, 이번만이다. {}G."
    ],
    negotiationFail: [
        "가난이 벼슬이냐? 가격은 그대로야.",
        "협상을 구걸로 착각하지 마라.",
        "내 물건은 제값을 아는 사람한테만 판다."
    ],
    goalAchieved: {
        beginner: "...제법이군. 네 실력을 인정한다. 견습은 졸업이다.",
        intermediate: "보는 눈이 있어. 이정도면 숙련 상인이지.",
        master: "대단하군... 내 가르침을 완전히 이해했군. 합격이다."
    },
    default: ["...그래서?", "명확하게 말해.", "용건만 간단히."]
};

// DOM Elements
const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const goldDisplay = document.getElementById('gold');
const itemCountDisplay = document.getElementById('item-count');
const goalTitleDisplay = document.getElementById('goal-title');
const goalProgressFill = document.getElementById('goal-progress');
const goalTextDisplay = document.getElementById('goal-text');
const shopItemsContainer = document.getElementById('shop-items');
const inventorySection = document.getElementById('inventory-section');
const inventoryItems = document.getElementById('inventory-items');
const negotiationModal = document.getElementById('negotiation-modal');

// Initialize
init();

function init() {
    renderShopItems();
    updateStats();
    addNPCMessage("어서오십시오, 손님... 목표는 " + goals[gameState.goalLevel].title + "이 되는 거다. 할 수 있겠나?");

    // Event Listeners
    sendBtn.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });

    // Quick Action Buttons
    document.querySelectorAll('.quick-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            userInput.value = btn.dataset.action;
            sendMessage();
        });
    });
}

function sendMessage() {
    const message = userInput.value.trim();
    if (!message) return;

    addUserMessage(message);
    userInput.value = '';

    setTimeout(() => {
        const response = processMessage(message);
        addNPCMessage(response);
    }, 500);
}

function processMessage(message) {
    gameState.conversationCount++;
    const lowerMsg = message.toLowerCase();

    // 목록 보기
    if (lowerMsg.includes('목록') || lowerMsg.includes('리스트')) {
        showShopList();
        return "마음에 드는 게 있으면 이름을 말하고 '할인'을 요청해봐. 쉽진 않을 거야.";
    }

    // 인벤토리  
    if (lowerMsg.includes('인벤토리') || lowerMsg.includes('가방') || lowerMsg.includes('소지품')) {
        showInventory();
        return "네 소지품이다. 필요 없으면 팔아도 돼.";
    }

    // 소지금 확인
    if (lowerMsg.includes('소지금') || lowerMsg.includes('내돈') || lowerMsg.includes('얼마있')) {
        return `${gameState.gold}G. 목표까지 ${goals[gameState.goalLevel].gold - gameState.gold}G 남았다.`;
    }

    // 목표 확인
    if (lowerMsg.includes('목표')) {
        const currentGoal = goals[gameState.goalLevel];
        return `현재 목표: ${currentGoal.title} (${currentGoal.gold}G). 지금 ${gameState.gold}G 가지고 있고.`;
    }

    // 판매 시도
    if (lowerMsg.includes('판매') || lowerMsg.includes('팔')) {
        const itemNum = findItemNumber(message);
        if (itemNum && gameState.inventory[itemNum]) {
            return sellItem(itemNum);
        }
        return "뭘 팔겠다는 거야? 명확하게 말해.";
    }

    // 인사
    if (lowerMsg.includes('안녕') || lowerMsg.includes('hello')) {
        return getRandomResponse('greeting');
    }

    // 기본 응답
    return getRandomResponse('default');
}

function showNegotiationModal(itemNum) {
    const item = shopItems[itemNum];
    gameState.currentNegotiatingItem = itemNum;

    const infoDiv = document.getElementById('negotiation-item-info');
    infoDiv.innerHTML = `
        <div style="text-align: center; margin: 15px 0;">
            <h3>${item.name}</h3>
            <p style="color: #ffd700; font-size: 1.3em;">정가: ${item.price}G</p>
        </div>
    `;

    negotiationModal.style.display = 'flex';
}

function closeNegotiation() {
    negotiationModal.style.display = 'none';
    gameState.currentNegotiatingItem = null;
}

function negotiate(strategy) {
    const itemNum = gameState.currentNegotiatingItem;
    if (!itemNum) return;

    const item = shopItems[itemNum];
    gameState.negotiationAttempts++;

    // 성공 확률 계산
    const strategies = {
        polite: { base: 15, message: "정말 필요합니다. 부탁드립니다..." },
        logical: { base: 25, message: "다른 곳은 더 싸던데요. 이 가격이면 손해 아닙니까?" },
        wisdom: { base: 35, message: "푼돈을 아끼는게 큰돈 버는 길 아니었습니까? 세이노님 가르침이..." }
    };

    const chosen = strategies[strategy];
    const success = Math.random() * 100 < chosen.base;

    addUserMessage(chosen.message);
    closeNegotiation();

    setTimeout(() => {
        if (success) {
            // 할인 성공
            const discountPercent = 10 + Math.floor(Math.random() * 21); // 10-30%
            const discountedPrice = Math.floor(item.price * (1 - discountPercent / 100));

            gameState.negotiationSuccesses++;

            if (gameState.gold < discountedPrice) {
                const shortage = discountedPrice - gameState.gold;
                addNPCMessage(`...좋아. ${discountedPrice}G에 넘긴다. 근데 네 돈이 ${shortage}G 모자란데?`);
                return;
            }

            gameState.gold -= discountedPrice;
            gameState.inventory[itemNum] = (gameState.inventory[itemNum] || 0) + 1;
            gameState.totalBuys++;
            gameState.totalProfit += (item.price - discountedPrice);

            updateStats();
            renderShopItems();
            checkGoalAchievement();

            const response = getRandomResponse('negotiationSuccess').replace('{}', discountedPrice);
            addNPCMessage(response + ` (${discountPercent}% 할인)`);
        } else {
            // 할인 실패
            addNPCMessage(getRandomResponse('negotiationFail') + ` 정가 ${item.price}G다.`);
        }
    }, 800);
}

function sellItem(itemNum) {
    const item = shopItems[itemNum];
    if (!item) return "그런 물건은 없다.";

    if (!gameState.inventory[itemNum] || gameState.inventory[itemNum] === 0) {
        return "그걸 가지고 있지도 않잖아.";
    }

    const sellPrice = Math.floor(item.price * 0.7); // 70% 가격에 판매
    gameState.gold += sellPrice;
    gameState.inventory[itemNum]--;
    gameState.totalSells++;

    if (gameState.inventory[itemNum] === 0) {
        delete gameState.inventory[itemNum];
    }

    updateStats();
    renderShopItems();
    checkGoalAchievement();

    return `${item.name}? ${sellPrice}G에 사주지. 나쁘지 않은 거래야.`;
}

function findItemNumber(message) {
    for (const num of Object.keys(shopItems)) {
        if (message.includes(num + '번') || message.includes(num)) {
            return num;
        }
    }
    return null;
}

function getRandomResponse(category) {
    const responses = mockResponses[category];
    return responses[Math.floor(Math.random() * responses.length)];
}

function updateStats() {
    goldDisplay.textContent = gameState.gold;
    const itemCount = Object.values(gameState.inventory).reduce((sum, count) => sum + count, 0);
    itemCountDisplay.textContent = itemCount;

    // Update goal progress
    const currentGoal = goals[gameState.goalLevel];
    goalTitleDisplay.textContent = currentGoal.title;

    const progress = Math.min((gameState.gold / currentGoal.gold) * 100, 100);
    goalProgressFill.style.width = progress + '%';
    goalTextDisplay.textContent = `${gameState.gold} / ${currentGoal.gold}G`;
}

function checkGoalAchievement() {
    const currentGoal = goals[gameState.goalLevel];

    if (gameState.gold >= currentGoal.gold) {
        const message = mockResponses.goalAchieved[gameState.goalLevel];
        addNPCMessage("🎉 " + message);

        // Level up
        if (gameState.goalLevel === 'beginner') {
            gameState.goalLevel = 'intermediate';
            addNPCMessage("다음 목표: " + goals.intermediate.title + " (" + goals.intermediate.gold + "G)");
        } else if (gameState.goalLevel === 'intermediate') {
            gameState.goalLevel = 'master';
            addNPCMessage("최종 목표: " + goals.master.title + " (" + goals.master.gold + "G)");
        } else if (gameState.goalLevel === 'master') {
            addNPCMessage("축하한다. 네가 진정한 상인이다. 이제 더 이상 가르칠 게 없군.");
        }

        updateStats();
    }
}

function addUserMessage(text) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message user';
    messageDiv.innerHTML = `
        <div class="message-bubble">
            <div>${text}</div>
            <div class="message-time">${getCurrentTime()}</div>
        </div>
        <div class="message-avatar">👤</div>
    `;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function addNPCMessage(text) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message npc';
    messageDiv.innerHTML = `
        <div class="message-avatar">💼</div>
        <div class="message-bubble">
            <div>${text}</div>
            <div class="message-time">${getCurrentTime()}</div>
        </div>
    `;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function getCurrentTime() {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
}

function renderShopItems() {
    shopItemsContainer.innerHTML = '';
    for (const [num, item] of Object.entries(shopItems)) {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'shop-item';

        const hasItem = gameState.inventory[num] > 0;
        const sellPrice = Math.floor(item.price * 0.7);

        itemDiv.innerHTML = `
            <div class="item-name">${num}. ${item.name}</div>
            <div class="item-price">구매: ${item.price}G | 판매: ${sellPrice}G</div>
            <div class="item-desc">${item.desc}</div>
            <div class="item-actions">
                <button class="item-btn buy-btn" onclick="showNegotiationModal('${num}')">할인 요청</button>
                <button class="item-btn sell-btn" onclick="quickSell('${num}')" ${!hasItem ? 'disabled' : ''}>판매</button>
            </div>
        `;
        shopItemsContainer.appendChild(itemDiv);
    }
}

function showShopList() {
    inventorySection.style.display = 'none';
    shopItemsContainer.parentElement.style.display = 'block';
}

function showInventory() {
    shopItemsContainer.parentElement.style.display = 'none';
    inventorySection.style.display = 'block';

    inventoryItems.innerHTML = '';
    if (Object.keys(gameState.inventory).length === 0) {
        inventoryItems.innerHTML = '<p style="opacity: 0.7;">비어있음</p>';
    } else {
        for (const [num, count] of Object.entries(gameState.inventory)) {
            if (count > 0) {
                const item = shopItems[num];
                const itemDiv = document.createElement('div');
                itemDiv.className = 'shop-item';
                itemDiv.innerHTML = `
                    <div class="item-name">${item.name} x${count}</div>
                    <div class="item-price">${Math.floor(item.price * 0.7)}G (판매가)</div>
                `;
                inventoryItems.appendChild(itemDiv);
            }
        }
    }
}

function quickSell(itemNum) {
    const response = sellItem(itemNum);
    addNPCMessage(response);
}
