// Game State
const gameState = {
    gold: 1000,
    inventory: {},
    conversationCount: 0
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
        "시간은 돈이다. 용건만 간단히.",
        "여기는 자선단체가 아니다. 돈 있으면 말해."
    ],
    discount: [
        "가난이 벼슬이냐? 돈 벌어서 다시 와라.",
        "깎아달라고? 협상을 구걸로 착각하지 마라.",
        "내 물건은 제값을 아는 사람한테만 판다. 썩 꺼져.",
        "가격은 그대로야. 싫으면 다른 데 가.",
        "할인? 여긴 백화점이 아니다. 정가 아니면 나가."
    ],
    fairDeal: [
        "보는 눈은 있군. 가져가라.",
        "정가를 낸다니, 현명한 선택이다.",
        "좋아. 네가 이 물건의 가치를 아는구나.",
        "그래, 이런 손님이라면 환영이지."
    ],
    adviceMoney: [
        "푼돈을 아끼지 않는 놈은 절대 큰돈을 못 쥔다.",
        "돈을 버는 건 기술이고, 지키는 건 예술이다.",
        "남들이 커피 마실 때 투자해라. 그게 부자 되는 길이다."
    ],
    default: [
        "...그래서?",
        "명확하게 말해.",
        "용건만 간단히.",
        "뭔 소리야.",
        "이해가 안 되는데."
    ]
};

// DOM Elements
const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const goldDisplay = document.getElementById('gold');
const itemCountDisplay = document.getElementById('item-count');
const shopItemsContainer = document.getElementById('shop-items');
const inventorySection = document.getElementById('inventory-section');
const inventoryItems = document.getElementById('inventory-items');

// Initialize
init();

function init() {
    renderShopItems();
    updateStats();
    addNPCMessage("어서오십시오, 손님... 아니면 구경꾼인가?");

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

    // Process message and get response
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
        return "마음에 드는 게 있으면 번호나 이름을 말해. 가격은 협상 불가다.";
    }

    // 인벤토리  
    if (lowerMsg.includes('인벤토리') || lowerMsg.includes('가방') || lowerMsg.includes('소지품')) {
        showInventory();
        return "네 소지품이다. 필요 없으면 팔아도 돼.";
    }

    // 소지금 확인
    if (lowerMsg.includes('소지금') || lowerMsg.includes('내돈') || lowerMsg.includes('얼마있')) {
        return `그 돈으로 뭘 살 수 있을지 생각해봐. (${gameState.gold}G)`;
    }

    // 판매 시도
    if (lowerMsg.includes('판매') || lowerMsg.includes('팔')) {
        const itemNum = findItemNumber(message);
        if (itemNum && gameState.inventory[itemNum]) {
            return sellItem(itemNum);
        }
        return "뭘 팔겠다는 거야? 명확하게 말해.";
    }

    // 구매 시도
    const purchaseKeywords = ['구매', '살게', '사', '주세요', '줘', 'buy'];
    const isPurchase = purchaseKeywords.some(kw => lowerMsg.includes(kw));

    if (isPurchase) {
        const itemNum = findItemNumber(message);
        if (!itemNum) {
            // 아이템 이름으로 찾기
            for (const [num, item] of Object.entries(shopItems)) {
                const cleanMsg = message.replace(/\s/g, '');
                const cleanName = item.name.replace(/\s/g, '');
                if (cleanMsg.includes(cleanName) || item.keywords.some(kw => cleanMsg.includes(kw))) {
                    return buyItem(num);
                }
            }
            return "무엇을 사겠다는 거야? 목록을 보고 정확히 말해.";
        }
        return buyItem(itemNum);
    }

    // 가격 문의
    if (lowerMsg.includes('가격') || lowerMsg.includes('얼마')) {
        for (const [num, item] of Object.entries(shopItems)) {
            if (message.includes(item.name) || item.keywords.some(kw => message.includes(kw))) {
                const sellPrice = Math.floor(item.price * 0.6);
                return `${item.name}? 구매는 ${item.price}G, 판매는 ${sellPrice}G에 받아준다.`;
            }
        }
        return "\"목록\" 쳐서 직접 봐. 다 적혀 있어.";
    }

    // 할인 요청
    if (lowerMsg.includes('깎') || lowerMsg.includes('할인') || lowerMsg.includes('싸게')) {
        return getRandomResponse('discount');
    }

    // 인사
    if (lowerMsg.includes('안녕') || lowerMsg.includes('hello') || lowerMsg.includes('hi')) {
        return getRandomResponse('greeting');
    }

    // 조언
    if (lowerMsg.includes('조언') || lowerMsg.includes('방법') || lowerMsg.includes('가르침')) {
        return getRandomResponse('adviceMoney');
    }

    // 기본 응답
    return getRandomResponse('default');
}

function buyItem(itemNum) {
    const item = shopItems[itemNum];
    if (!item) return "그런 물건은 없다.";

    if (gameState.gold < item.price) {
        const shortage = item.price - gameState.gold;
        return `돈이 ${shortage}G 모자라는데? 가난뱅이는 꿈도 꾸지 마.`;
    }

    gameState.gold -= item.price;
    gameState.inventory[itemNum] = (gameState.inventory[itemNum] || 0) + 1;
    updateStats();
    renderShopItems();

    return `좋아. ${item.name}, ${item.price}G에 넘긴다. 헛되이 쓰지 마.`;
}

function sellItem(itemNum) {
    const item = shopItems[itemNum];
    if (!item) return "그런 물건은 없다.";

    if (!gameState.inventory[itemNum] || gameState.inventory[itemNum] === 0) {
        return "그걸 가지고 있지도 않잖아. 사기꾼인가?";
    }

    const sellPrice = Math.floor(item.price * 0.6);
    gameState.gold += sellPrice;
    gameState.inventory[itemNum]--;
    if (gameState.inventory[itemNum] === 0) {
        delete gameState.inventory[itemNum];
    }
    updateStats();
    renderShopItems();

    return `${item.name}? 흠... ${sellPrice}G에 사주지. 후려치는 거 아니야.`;
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

function updateStats() {
    goldDisplay.textContent = gameState.gold;
    const itemCount = Object.values(gameState.inventory).reduce((sum, count) => sum + count, 0);
    itemCountDisplay.textContent = itemCount;
}

function renderShopItems() {
    shopItemsContainer.innerHTML = '';
    for (const [num, item] of Object.entries(shopItems)) {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'shop-item';

        const hasItem = gameState.inventory[num] > 0;
        const sellPrice = Math.floor(item.price * 0.6);

        itemDiv.innerHTML = `
            <div class="item-name">${num}. ${item.name}</div>
            <div class="item-price">구매: ${item.price}G | 판매: ${sellPrice}G</div>
            <div class="item-desc">${item.desc}</div>
            <div class="item-actions">
                <button class="item-btn buy-btn" onclick="quickBuy('${num}')">구매</button>
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
                    <div class="item-price">${Math.floor(item.price * 0.6)}G (판매가)</div>
                `;
                inventoryItems.appendChild(itemDiv);
            }
        }
    }
}

function quickBuy(itemNum) {
    const response = buyItem(itemNum);
    addNPCMessage(response);
}

function quickSell(itemNum) {
    const response = sellItem(itemNum);
    addNPCMessage(response);
}
