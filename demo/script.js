// Game State
const gameState = {
    gold: 1000,
    inventory: {},
    conversationCount: 0,
    goalLevel: 'beginner',
    totalBuys: 0,
    totalSells: 0,
    negotiationAttempts: 0,
    negotiationSuccesses: 0,
    totalProfit: 0,
    currentNegotiatingItem: null,
    saynoEmotion: 'neutral',
    // 증강 시스템
    augmentations: [],
    sellNegotiationBonus: 0,  // 판매 협상 성공률 보너스
    buyNegotiationBonus: 0,   // 구매 협상 성공률 보너스
    sellPriceBonus: 0,        // 판매 가격 보너스 %
    buyDiscountBonus: 0,      // 구매 할인 보너스 %
    baseSellPrice: 0.70,      // 기본 판매 가격 (70%)
    negotiationPenaltyTurns: 0, // 협상 패널티 남은 턴
    leveledUp: false
};

// Goals - 최종 목표: 전설의 검 싸게 구매!
const goals = {
    beginner: { gold: 2000, title: '견습 상인', reward: '세이노가 조금 인정함' },
    intermediate: { gold: 4000, title: '숙련 상인', reward: '세이노가 존중하기 시작' },
    legendary_sword: { gold: 500, title: '전설의 검 특가', reward: '전설의 검을 싸게 구매할 기회!' }
};

// Shop Items
const shopItems = {
    "1": { name: "낡은 검", price: 100, desc: "기본적인 검. 녹슬었지만 쓸만하다.", keywords: ["낡은검", "낡은", "검1"] },
    "2": { name: "강철 검", price: 500, desc: "튼튼한 강철 검. 전사의 필수품.", keywords: ["강철검", "강철", "검2"] },
    "3": { name: "전설의 검", price: 2000, desc: "전설로만 전해지는 명검. 세이노의 자랑.", keywords: ["전설의검", "전설검", "전설", "명검"], special: true },
    "4": { name: "가죽 갑옷", price: 300, desc: "기본 방어구. 가볍고 실용적이다.", keywords: ["가죽갑옷", "가죽", "갑옷1"] },
    "5": { name: "판금 갑옷", price: 800, desc: "무거운 대신 방어력은 최고.", keywords: ["판금갑옷", "판금", "갑옷2"] },
    "6": { name: "체력 포션", price: 50, desc: "HP 50 회복. 위급할 때 쓰는 물약.", keywords: ["체력포션", "체력", "빨간포션", "hp포션"] },
    "7": { name: "마나 포션", price: 50, desc: "MP 50 회복. 마법사의 필수템.", keywords: ["마나포션", "마나", "파란포션", "mp포션"] },
    "8": { name: "엘릭서", price: 500, desc: "HP/MP 완전 회복. 귀한 물건이다.", keywords: ["엘릭서", "엘릭시르", "만능물약"] }
};

// Enhanced Mock AI Responses with emotions
const mockResponses = {
    greeting: {
        neutral: ["어서오십시오... 아니, 그냥 구경꾼인가?", "손님이라도 돼야 인사를 받지. 뭘 원하나?"],
        pleased: ["오, 다시 왔군. 장사가 잘 되나?", "보는 눈이 있는 손님이군."]
    },
    smallTalk: {
        weather: ["날씨? 그딴 거 신경 쓸 시간에 돈이나 벌어.", "비가 오든 눈이 오든, 장사는 계속된다."],
        life: ["인생은 단순하다. 푼돈 아끼고, 큰돈 벌고. 그게 다야.", "돈 없으면 꿈도 못 꾼다. 현실이지."],
        business: ["장사? 제값 주는 놈한테만 판다. 간단해.", "장사는 속고 속이는 게 아니라, 가치를 아는 게임이다."],
        wisdom: ["푼돈을 아끼지 않는 놈은 절대 큰돈을 못 쥔다.", "남들이 커피 마실 때 투자해라. 그게 부자 되는 길이다.", "돈을 버는 건 기술이고, 지키는 건 예술이다."]
    },
    negotiationSuccess: {
        neutral: ["...제법이군. {}G에 넘긴다.", "흠. 네 말에 일리는 있다. {}G다."],
        pleased: ["좋아좋아! 이런 손님이 있어야 장사가 재밌지. {}G에 드리지."]
    },
    negotiationFail: {
        angry: ["가난이 벼슬이냐? 가격은 그대로야!", "협상을 구걸로 착각하지 마라!", "내 물건은 제값을 아는 사람한테만 판다!"]
    },
    goalAchieved: {
        beginner: "...제법이군. 네 실력을 인정한다. 견습은 졸업이다.",
        intermediate: "대단하군. 이정도면 숙련 상인이지. 벌써 전설의 검이 눈에 들어오나?",
        legendary_sword: "🎉 축하한다! 네가 진정한 상인임을 증명했어. 특별히... 전설의 검을 500G에 넘기지. 이건 네 실력에 대한 내 존경의 표시다."
    },
    compliment: ["나한테 아부는 소용없어.", "칭찬은 돈이 안 돼."],
    insult: ["무례한 놈. 썩 나가.", "장사 안 하냐? 꺼져."],
    goodbye: ["그래, 조심해서 가라.", "다음엔 돈 더 들고 와."]
};

// Sayno emotions with actual images
const saynoEmotions = {
    neutral: {
        emoji: "💼",
        image: "images/sayno_vase.jpg",
        class: "neutral"
    },
    angry: {
        emoji: "😠",
        image: "images/sayno_mad.jpg",
        class: "angry"
    },
    pleased: {
        emoji: "😊",
        image: "images/sayno_vase.jpg", // 기본 이미지 사용
        class: "pleased"
    }
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
    updateSaynoEmotion('neutral');
    addNPCMessage("어서오십시오... 목표는 간단하다. 실력을 증명해봐. 그럼 내 자랑인 '전설의 검'을 특가에 주지.");

    sendBtn.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });

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
        if (response) addNPCMessage(response);
    }, 500);
}

function processMessage(message) {
    gameState.conversationCount++;
    const lowerMsg = message.toLowerCase();
    const cleanMsg = message.replace(/\s/g, '').toLowerCase();

    // 목록 보기 - 확장된 키워드
    if (lowerMsg.includes('목록') || lowerMsg.includes('리스트') || lowerMsg.includes('상품') ||
        lowerMsg.includes('뭐파') || lowerMsg.includes('뭐있') ||
        lowerMsg.includes('물건') || lowerMsg.includes('아이템')) {
        showShopList();
        updateSaynoEmotion('neutral');
        return "물건들이다. '할인 요청'을 눌러서 입씨름해봐. 쉽진 않을 거야.";
    }

    // 인벤토리 - 확장
    if (lowerMsg.includes('인벤토리') || lowerMsg.includes('가방') || lowerMsg.includes('소지품') ||
        lowerMsg.includes('내꺼') || lowerMsg.includes('산거')) {
        showInventory();
        return "네 소지품이다. 팔 거 있으면 팔아.";
    }

    // 목표 확인 - 확장
    if (lowerMsg.includes('목표') || (lowerMsg.includes('얼마') && (lowerMsg.includes('모') || lowerMsg.includes('필요')))) {
        const currentGoal = goals[gameState.goalLevel];
        const remaining = currentGoal.gold - gameState.gold;
        return `현재 목표: ${currentGoal.title} (${currentGoal.gold}G). 지금 ${gameState.gold}G, ${remaining}G 더 필요해.`;
    }

    // 소지금 확인
    if ((lowerMsg.includes('소지금') || lowerMsg.includes('내돈') || (lowerMsg.includes('얼마') && lowerMsg.includes('있'))) &&
        !lowerMsg.includes('목표')) {
        return `${gameState.gold}G 있다. 목표까지 ${goals[gameState.goalLevel].gold - gameState.gold}G 남았어.`;
    }

    // 전설의 검
    if (lowerMsg.includes('전설') || cleanMsg.includes('전설의검')) {
        if (gameState.goalLevel !== 'legendary_sword') {
            updateSaynoEmotion('neutral');
            return "전설의 검? 허, 아직 일러. 먼저 실력부터 증명해.";
        }
    }

    // 도움말
    if (lowerMsg.includes('도움') || lowerMsg.includes('어떻게') || lowerMsg.includes('하는법')) {
        return "간단하다. 1) 목록 보기 2) 할인 요청으로 싸게 사기 3) 비싸게 팔기 4) 돈 모으기.";
    }

    // 나쁜말
    if (lowerMsg.includes('짜증') || lowerMsg.includes('싫어') || lowerMsg.includes('나빠') ||
        lowerMsg.includes('별로') || lowerMsg.includes('바보')) {
        updateSaynoEmotion('angry');
        return "무례한 놈. 썩 꺼져라.";
    }

    // 칭찬
    if (lowerMsg.includes('멋져') || lowerMsg.includes('대단') || lowerMsg.includes('존경') ||
        lowerMsg.includes('최고') || lowerMsg.includes('좋아')) {
        updateSaynoEmotion('neutral');
        return "아부는 소용없어. 장사는 실력이지.";
    }

    // 감사
    if (lowerMsg.includes('감사') || lowerMsg.includes('고마')) {
        updateSaynoEmotion('neutral');
        return "감사는 돈이 안 돼. 다음엔 더 벌어와.";
    }

    // 날씨
    if (lowerMsg.includes('날씨') || lowerMsg.includes('비') || lowerMsg.includes('덥') || lowerMsg.includes('추워')) {
        updateSaynoEmotion('neutral');
        return getRandomFrom(mockResponses.smallTalk.weather);
    }

    // 조언/가르침
    if (lowerMsg.includes('조언') || lowerMsg.includes('가르침') || lowerMsg.includes('인생') ||
        lowerMsg.includes('지혜') || lowerMsg.includes('비법') || lowerMsg.includes('성공')) {
        updateSaynoEmotion('pleased');
        return getRandomFrom(mockResponses.smallTalk.wisdom);
    }

    // 장사
    if (lowerMsg.includes('장사') || lowerMsg.includes('사업') || lowerMsg.includes('돈버')) {
        updateSaynoEmotion('neutral');
        return getRandomFrom(mockResponses.smallTalk.business);
    }

    // 판매
    if (lowerMsg.includes('판매') || lowerMsg.includes('팔게') || lowerMsg.includes('팔아') ||
        (lowerMsg.includes('팔') && !lowerMsg.includes('뭐팔'))) {
        const itemNum = findItemNumber(message);
        if (itemNum && gameState.inventory[itemNum]) {
            return sellItem(itemNum);
        }

        // 이름으로 찾기
        for (const [num, item] of Object.entries(shopItems)) {
            if (cleanMsg.includes(item.name.replace(/\s/g, '').toLowerCase()) ||
                item.keywords.some(kw => cleanMsg.includes(kw))) {
                if (gameState.inventory[num] && gameState.inventory[num] > 0) {
                    return sellItem(num);
                }
                return "그걸 가지고 있지도 않잖아.";
            }
        }
        return "뭘 팔겠다는 거야? 명확하게 말해.";
    }

    // 구매
    const purchaseWords = ['구매', '살게', '사고', '주세요', '줘', 'buy', '구입'];
    if (purchaseWords.some(w => lowerMsg.includes(w))) {
        const itemNum = findItemNumber(message);
        if (itemNum) {
            updateSaynoEmotion('neutral');
            return `${shopItems[itemNum].name}? 할인 받고 싶으면 '할인 요청' 버튼 눌러.`;
        }

        // 이름으로
        for (const [num, item] of Object.entries(shopItems)) {
            if (cleanMsg.includes(item.name.replace(/\s/g, '').toLowerCase()) ||
                item.keywords.some(kw => cleanMsg.includes(kw))) {
                return `${item.name}? 목록에서 '할인 요청' 눌러봐.`;
            }
        }
        return "뭘 사겠다는 거야? '목록' 쳐서 보고 말해.";
    }

    // 가격
    if (lowerMsg.includes('가격') || lowerMsg.includes('얼마')) {
        for (const [num, item] of Object.entries(shopItems)) {
            if (cleanMsg.includes(item.name.replace(/\s/g, '').toLowerCase()) ||
                item.keywords.some(kw => cleanMsg.includes(kw))) {
                const sellPrice = Math.floor(item.price * 0.7);
                return `${item.name}? 구매는 ${item.price}G, 판매는 ${sellPrice}G.`;
            }
        }
        return "'목록' 쳐서 봐. 다 있어.";
    }

    // 작별
    if ((lowerMsg.includes('안녕') && lowerMsg.includes('잘')) || lowerMsg.includes('bye') || lowerMsg.includes('그만')) {
        updateSaynoEmotion('neutral');
        return getRandomFrom(mockResponses.goodbye);
    }

    // 인사
    if (lowerMsg.includes('안녕') || lowerMsg.includes('hello') || lowerMsg.includes('hi') || lowerMsg.includes('반가')) {
        const emotion = gameState.totalBuys > 3 ? 'pleased' : 'neutral';
        updateSaynoEmotion(emotion);
        return getRandomFrom(mockResponses.greeting[emotion]);
    }

    // 자기소개
    if (lowerMsg.includes('누구') || lowerMsg.includes('이름')) {
        updateSaynoEmotion('neutral');
        return "나? 세이노다. 이 상점 주인. 쓸데없는 질문 말고 장사나 해.";
    }

    // 기본
    updateSaynoEmotion('neutral');
    const defaults = [
        "...무슨 말이야? 명확하게 얘기해.",
        "이해가 안 되는데. '목록', '인벤토리', '조언' 같은 말 해봐.",
        "장사할 거야 말 거야? 확실히 해."
    ];
    return getRandomFrom(defaults);
}

function updateSaynoEmotion(emotion) {
    gameState.saynoEmotion = emotion;
    const emotionData = saynoEmotions[emotion];

    // Update portrait image
    const portraitImg = document.getElementById('portrait-img');
    const portrait = document.getElementById('character-portrait');
    const indicator = document.getElementById('emotion-indicator');

    if (portraitImg && portrait && indicator) {
        // Change image
        portraitImg.src = emotionData.image;

        // Update portrait class
        portrait.className = `character-portrait ${emotion}`;

        // Update emotion indicator
        indicator.className = `emotion-indicator ${emotion}`;

        // Update emotion label
        const emotionLabels = {
            neutral: { icon: '💼', label: '평온' },
            angry: { icon: '😠', label: '화남' },
            pleased: { icon: '😊', label: '만족' }
        };

        const emotionInfo = emotionLabels[emotion];
        indicator.innerHTML = `
            <span class="emotion-icon">${emotionInfo.icon}</span>
            <span class="emotion-label">${emotionInfo.label}</span>
        `;
    }

    // Add emotion class to body for background effects
    document.body.className = `emotion-${emotion}`;
}

function showNegotiationModal(itemNum) {
    const item = shopItems[itemNum];
    gameState.currentNegotiatingItem = itemNum;

    // 전설의 검 특별 처리
    if (item.special && gameState.goalLevel === 'legendary_sword') {
        addNPCMessage("...좋아. 네 실력을 인정한다. 전설의 검, 특별히 500G에 넘기지!");
        setTimeout(() => {
            if (gameState.gold >= 500) {
                gameState.gold -= 500;
                gameState.inventory[itemNum] = (gameState.inventory[itemNum] || 0) + 1;
                updateStats();
                renderShopItems();
                updateSaynoEmotion('pleased');
                addNPCMessage("🎉 축하한다! 네가 진정한 상인이다. 이 검으로 큰 일을 해라!");
            } else {
                addNPCMessage("...500G도 없나? 그럼 아직 일러.");
            }
        }, 1000);
        return;
    }

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
            const discountPercent = 10 + Math.floor(Math.random() * 21);
            const discountedPrice = Math.floor(item.price * (1 - discountPercent / 100));

            gameState.negotiationSuccesses++;

            if (gameState.gold < discountedPrice) {
                updateSaynoEmotion('angry');
                addNPCMessage(`...좋아. ${discountedPrice}G에 넘긴다. 근데 돈이 모자라잖아!`);
                return;
            }

            gameState.gold -= discountedPrice;
            gameState.inventory[itemNum] = (gameState.inventory[itemNum] || 0) + 1;
            gameState.totalBuys++;
            gameState.totalProfit += (item.price - discountedPrice);

            updateStats();
            renderShopItems();
            checkGoalAchievement();

            updateSaynoEmotion('pleased');
            const emotion = gameState.negotiationSuccesses > 5 ? 'pleased' : 'neutral';
            const response = getRandomFrom(mockResponses.negotiationSuccess[emotion]).replace('{}', discountedPrice);
            addNPCMessage(response + ` (${discountPercent}% 할인)`);
        } else {
            updateSaynoEmotion('angry');
            addNPCMessage(getRandomFrom(mockResponses.negotiationFail.angry) + ` 정가 ${item.price}G다.`);
        }
    }, 800);
}

function sellItem(itemNum) {
    const item = shopItems[itemNum];
    if (!item || !gameState.inventory[itemNum] || gameState.inventory[itemNum] === 0) {
        return "그걸 가지고 있지도 않잖아.";
    }

    const sellPrice = Math.floor(item.price * 0.7);
    gameState.gold += sellPrice;
    gameState.inventory[itemNum]--;
    gameState.totalSells++;

    if (gameState.inventory[itemNum] === 0) {
        delete gameState.inventory[itemNum];
    }

    updateStats();
    renderShopItems();
    checkGoalAchievement();

    updateSaynoEmotion('neutral');
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

function getRandomFrom(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function updateStats() {
    goldDisplay.textContent = gameState.gold;
    const itemCount = Object.values(gameState.inventory).reduce((sum, count) => sum + count, 0);
    itemCountDisplay.textContent = itemCount;

    const currentGoal = goals[gameState.goalLevel];
    goalTitleDisplay.textContent = currentGoal.title;

    const progress = Math.min((gameState.gold / currentGoal.gold) * 100, 100);
    goalProgressFill.style.width = progress + '%';
    goalTextDisplay.textContent = `${gameState.gold} / ${currentGoal.gold}G`;
}

function checkGoalAchievement() {
    const currentGoal = goals[gameState.goalLevel];

    if (gameState.gold >= currentGoal.gold) {
        updateSaynoEmotion('pleased');
        const message = mockResponses.goalAchieved[gameState.goalLevel];
        addNPCMessage("🎉 " + message);

        if (gameState.goalLevel === 'beginner') {
            gameState.goalLevel = 'intermediate';
            setTimeout(() => {
                addNPCMessage("다음 목표: " + goals.intermediate.title + " (" + goals.intermediate.gold + "G)");
            }, 1000);
        } else if (gameState.goalLevel === 'intermediate') {
            gameState.goalLevel = 'legendary_sword';
            setTimeout(() => {
                addNPCMessage("최종 목표까지 왔군. 이제... 전설의 검을 500G에 팔아주지!");
            }, 1000);
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
    const emotion = saynoEmotions[gameState.saynoEmotion];
    messageDiv.innerHTML = `
        <div class="message-avatar">${emotion.emoji}</div>
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

        if (item.special) {
            itemDiv.classList.add('legendary');
        }

        const hasItem = gameState.inventory[num] > 0;
        const sellPrice = Math.floor(item.price * 0.7);

        itemDiv.innerHTML = `
            <div class="item-name">${num}. ${item.name}${item.special ? ' ⭐' : ''}</div>
            <div class="item-price">구매: ${item.price}G | 판매: ${sellPrice}G</div>
            <div class="item-desc">${item.desc}</div>
            <div class="item-actions">
                <button class="item-btn buy-btn" onclick="showNegotiationModal('${num}')">할인 요청</button>
                <button class="item-btn sell-btn" onclick="showSellNegotiationModal('${num}')" ${!hasItem ? 'disabled' : ''}>판매 협상</button>
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
                    <div class="item-name">${item.name} x${count}${item.special ? ' ⭐' : ''}</div>
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
