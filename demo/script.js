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
    negotiationFailures: 0,  // 협상 실패 횟수 (힌트용)
    totalProfit: 0,
    currentNegotiatingItem: null,
    saynoEmotion: 'neutral',
    isSelling: false,
    // 증강 시스템
    augmentations: [],
    sellNegotiationBonus: 0,
    buyNegotiationBonus: 0,
    sellPriceBonus: 0,
    buyDiscountBonus: 0,
    baseSellPrice: 0.70,
    negotiationPenaltyTurns: 0,
    leveledUp: false
};

// Goals - 최종 목표: 전설의 검 싸게 구매!
const goals = {
    beginner: { gold: 2000, title: '견습 상인', reward: '세이노가 조금 인정함' },
    intermediate: { gold: 4000, title: '숙련 상인', reward: '세이노가 존중하기 시작' },
    legendary_sword: { gold: 500, title: '전설의 검 특가', reward: '전설의 검을 싸게 구매할 기회!' }
};

// Shop Items - Expanded inventory
const shopItems = {
    // Weapons
    "1": { name: "낡은 검", price: 100, desc: "기본적인 검. 녹슬었지만 쓸만하다.", keywords: ["낡은검", "낡은", "검1"] },
    "2": { name: "강철 검", price: 500, desc: "튼튼한 강철 검. 전사의 필수품.", keywords: ["강철검", "강철", "검2"] },
    "3": { name: "미스릴 검", price: 1200, desc: "가볍고 날카로운 고급 검.", keywords: ["미스릴검", "미스릴", "검3"] },
    "4": { name: "전설의 검", price: 2000, desc: "전설로만 전해지는 명검. 세이노의 자랑.", keywords: ["전설의검", "전설검", "전설", "명검"], special: true },

    // Armor
    "5": { name: "가죽 갑옷", price: 300, desc: "기본 방어구. 가볍고 실용적이다.", keywords: ["가죽갑옷", "가죽", "갑옷1"] },
    "6": { name: "판금 갑옷", price: 800, desc: "무거운 대신 방어력은 최고.", keywords: ["판금갑옷", "판금", "갑옷2"] },
    "7": { name: "용 비늘 갑옷", price: 1500, desc: "드래곤의 비늘로 만든 최상급 갑옷.", keywords: ["용비늘", "드래곤", "갑옷3"] },

    // Potions
    "8": { name: "체력 포션", price: 50, desc: "HP 50 회복. 위급할 때 쓰는 물약.", keywords: ["체력포션", "체력", "빨간포션", "hp포션"] },
    "9": { name: "마나 포션", price: 50, desc: "MP 50 회복. 마법사의 필수템.", keywords: ["마나포션", "마나", "파란포션", "mp포션"] },
    "10": { name: "엘릭서", price: 500, desc: "HP/MP 완전 회복. 귀한 물건이다.", keywords: ["엘릭서", "엘릭시르", "만능물약"] },

    // Accessories
    "11": { name: "행운의 반지", price: 400, desc: "크리티컬 확률 +10%. 운이 좋아진다.", keywords: ["행운반지", "반지", "행운"] },
    "12": { name: "힘의 목걸이", price: 600, desc: "공격력 +15. 강해지는 느낌.", keywords: ["힘목걸이", "목걸이", "힘"] },
    "13": { name: "마법사의 로브", price: 900, desc: "마법 데미지 +20%. 마나 회복 속도 증가.", keywords: ["로브", "마법로브", "마법사"] },

    // Special Items
    "14": { name: "귀환 주문서", price: 200, desc: "즉시 마을로 귀환. 일회용.", keywords: ["귀환", "주문서", "텔레포트"] },
    "15": { name: "경험치 물약", price: 700, desc: "1시간 동안 경험치 +50%.", keywords: ["경험치", "exp", "물약"] }
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
const shopGrid = document.getElementById('shop-grid');
const inventoryGrid = document.getElementById('inventory-grid');
const negotiationModal = document.getElementById('negotiation-modal');
const characterPortrait = document.getElementById('character-portrait');
const emotionIndicator = document.getElementById('emotion-indicator');
const shopTab = document.getElementById('shop-tab');
const inventoryTab = document.getElementById('inventory-tab');

// Initialize
function init() {
    updateStats();
    renderShopItems();
    addNPCMessage("어서오십시오... 목표는 간단하다. 실력을 증명해봐. 그럼 내 자랑인 '전설의 검'을 특가에 주지.");
    updateSaynoEmotion('neutral');

    // Event listeners
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

    // Tab switching
    shopTab.addEventListener('click', () => {
        shopTab.classList.add('active');
        inventoryTab.classList.remove('active');
        shopGrid.style.display = 'grid';
        inventoryGrid.style.display = 'none';
    });

    inventoryTab.addEventListener('click', () => {
        inventoryTab.classList.add('active');
        shopTab.classList.remove('active');
        inventoryGrid.style.display = 'grid';
        shopGrid.style.display = 'none';
        renderInventory();
    });
}

init();

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
    gameState.isSelling = false; // Set to buying mode

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
            <p style="color: rgba(245, 230, 211, 0.8); font-size: 0.9em; margin-top: 10px;">${item.desc}</p>
        </div>
    `;

    // 입력창 초기화
    const inputArea = document.getElementById('negotiation-input');
    inputArea.value = '';
    document.getElementById('char-count').textContent = '0';

    // 문자 카운터 이벤트
    inputArea.oninput = () => {
        document.getElementById('char-count').textContent = inputArea.value.length;
    };

    // 힌트 표시 (실패 횟수에 따라)
    const hint = getProgressiveHint();
    const hintsArea = document.getElementById('negotiation-hints');
    if (hint) {
        document.getElementById('hint-text').textContent = hint;
        hintsArea.style.display = 'block';
    } else {
        hintsArea.style.display = 'none';
    }

    negotiationModal.style.display = 'flex';
}

function closeNegotiation() {
    negotiationModal.style.display = 'none';
    gameState.currentNegotiatingItem = null;
    gameState.isSelling = false;
}

// 새로운 협상 제출 함수 (키워드 기반)
function submitNegotiation() {
    const itemNum = gameState.currentNegotiatingItem;
    if (!itemNum) return;

    const item = shopItems[itemNum];
    const userInput = document.getElementById('negotiation-input').value.trim();
    const isSelling = gameState.isSelling || false;

    if (!userInput) {
        addNPCMessage("...말을 해야 협상이 되지 않겠나?");
        return;
    }

    // 판매 모드일 때 인벤토리 확인
    if (isSelling && (!gameState.inventory[itemNum] || gameState.inventory[itemNum] === 0)) {
        addNPCMessage("그걸 가지고 있지도 않잖아. 사기 치려고?");
        closeNegotiation();
        return;
    }

    // 키워드 분석 (Advanced Negotiation Engine 사용)
    const analysis = negotiationEngine.analyze(userInput, item, gameState);
    gameState.negotiationAttempts++;

    // 사용자 메시지 표시
    addUserMessage(userInput);
    closeNegotiation();

    setTimeout(() => {
        if (analysis.success) {
            // 성공!
            gameState.negotiationSuccesses++;
            gameState.negotiationFailures = 0;

            if (isSelling) {
                // ===== 판매 모드 =====
                const basePrice = Math.floor(item.price * (gameState.baseSellPrice + gameState.sellPriceBonus / 100));
                const bonusPercent = Math.floor(10 + analysis.persuasionScore * 20); // 10-30% 보너스
                const finalPrice = Math.floor(basePrice * (1 + bonusPercent / 100));

                gameState.gold += finalPrice;
                gameState.inventory[itemNum]--;
                if (gameState.inventory[itemNum] === 0) {
                    delete gameState.inventory[itemNum];
                }
                gameState.totalSells++;

                updateStats();
                renderShopItems();
                updateSaynoEmotion(gameState.negotiationSuccesses > 5 ? 'pleased' : 'neutral');

                const npcResponse = `${negotiationEngine.generateResponse(analysis, item)} ${finalPrice}G에 사주지. (+${bonusPercent}% 보너스)`;
                addNPCMessage(npcResponse);

                // 텔레메트리 로깅
                telemetry.logNegotiation({
                    userInput,
                    npcResponse,
                    itemId: itemNum,
                    itemName: item.name,
                    originalPrice: basePrice,
                    finalPrice: finalPrice,
                    discountPercent: bonusPercent,
                    persuasionScore: analysis.persuasionScore,
                    matchedKeywords: analysis.keywordAnalysis.matchedKeywords.map(k => k.keyword),
                    matchedCategories: analysis.keywordAnalysis.matchedCategories,
                    success: true,
                    attemptNumber: gameState.negotiationAttempts,
                    mode: 'sell'
                });

            } else {
                // ===== 구매 모드 =====
                if (gameState.gold < analysis.finalPrice) {
                    updateSaynoEmotion('angry');
                    const response = `${negotiationEngine.generateResponse(analysis, item).split('.')[0]}. 근데 돈이 모자라잖아! ${analysis.finalPrice}G 가져와.`;
                    addNPCMessage(response);

                    telemetry.logNegotiation({
                        userInput,
                        npcResponse: response,
                        itemId: itemNum,
                        itemName: item.name,
                        originalPrice: item.price,
                        finalPrice: analysis.finalPrice,
                        discountPercent: analysis.discountPercent,
                        persuasionScore: analysis.persuasionScore,
                        matchedKeywords: analysis.keywordAnalysis.matchedKeywords.map(k => k.keyword),
                        matchedCategories: analysis.keywordAnalysis.matchedCategories,
                        success: false,
                        attemptNumber: gameState.negotiationAttempts,
                        mode: 'buy'
                    });

                    return;
                }

                gameState.gold -= analysis.finalPrice;
                gameState.inventory[itemNum] = (gameState.inventory[itemNum] || 0) + 1;
                gameState.totalBuys++;

                updateStats();
                renderShopItems();
                updateSaynoEmotion(gameState.negotiationSuccesses > 5 ? 'pleased' : 'neutral');

                const npcResponse = negotiationEngine.generateResponse(analysis, item);
                addNPCMessage(npcResponse);

                telemetry.logNegotiation({
                    userInput,
                    npcResponse,
                    itemId: itemNum,
                    itemName: item.name,
                    originalPrice: item.price,
                    finalPrice: analysis.finalPrice,
                    discountPercent: analysis.discountPercent,
                    persuasionScore: analysis.persuasionScore,
                    matchedKeywords: analysis.keywordAnalysis.matchedKeywords.map(k => k.keyword),
                    matchedCategories: analysis.keywordAnalysis.matchedCategories,
                    success: true,
                    attemptNumber: gameState.negotiationAttempts,
                    mode: 'buy'
                });

                checkGoalAchievement();
            }
        } else {
            // 실패
            gameState.negotiationFailures++;
            updateSaynoEmotion('angry');

            const npcResponse = negotiationEngine.generateResponse(analysis, item);
            addNPCMessage(npcResponse);

            // 텔레메트리 로깅
            telemetry.logNegotiation({
                userInput,
                npcResponse,
                itemId: itemNum,
                itemName: item.name,
                originalPrice: item.price,
                finalPrice: item.price,
                discountPercent: 0,
                persuasionScore: analysis.persuasionScore,
                matchedKeywords: analysis.keywordAnalysis.matchedKeywords.map(k => k.keyword),
                matchedCategories: analysis.keywordAnalysis.matchedCategories,
                success: false,
                attemptNumber: gameState.negotiationAttempts,
                mode: isSelling ? 'sell' : 'buy'
            });

            // 다음 협상 시 힌트 제공
            const nextHint = isSelling ?
                getSellHint(gameState.negotiationFailures) :
                negotiationEngine.getHint(gameState.negotiationFailures);

            if (nextHint) {
                setTimeout(() => {
                    addNPCMessage(nextHint);
                }, 1500);
            }
        }
    }, 800);
}

// 정가 구매 (모달에서)
function buyDirectlyFromModal() {
    const itemNum = gameState.currentNegotiatingItem;
    if (!itemNum) return;

    buyDirectly(itemNum);
    closeNegotiation();
}

// Direct purchase without negotiation
function buyDirectly(itemNum) {
    const item = shopItems[itemNum];

    if (gameState.gold < item.price) {
        closeNegotiation();
        updateSaynoEmotion('angry');
        addNPCMessage(`돈도 없으면서 무슨 구매? ${item.price}G 가져와.`);
        return;
    }

    gameState.gold -= item.price;
    gameState.inventory[itemNum] = (gameState.inventory[itemNum] || 0) + 1;
    gameState.totalBuys++;

    updateStats();
    renderShopItems();
    closeNegotiation();

    updateSaynoEmotion('neutral');
    addNPCMessage(`${item.name}, ${item.price}G다. 정가로 사니 할 말 없지?`);

    // Check level up
    checkGoalAchievement(); // Assuming checkLevelUp is actually checkGoalAchievement
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
    const goldEl = document.getElementById('gold');
    if (goldEl) goldEl.textContent = gameState.gold;

    const itemCountEl = document.getElementById('item-count');
    if (itemCountEl) {
        const itemCount = Object.values(gameState.inventory).reduce((sum, count) => sum + count, 0);
        itemCountEl.textContent = itemCount;
    }

    const repInfo = getReputationInfo();
    const goalTitleEl = document.getElementById('goal-title');
    if (goalTitleEl) goalTitleEl.textContent = repInfo.name + ' (Lv.' + repInfo.level + ')';

    const goalTextEl = document.getElementById('goal-text');
    if (goalTextEl) {
        if (repInfo.isMaxLevel) {
            goalTextEl.textContent = '평판: ' + repInfo.current + ' (최대 레벨)';
        } else {
            goalTextEl.textContent = '평판: ' + repInfo.current + '/' + repInfo.required + ' (' + repInfo.progress + '%)';
        }
    }

    const goalProgressEl = document.getElementById('goal-progress');
    if (goalProgressEl) {
        if (!repInfo.isMaxLevel) {
            goalProgressEl.style.width = repInfo.progress + '%';
        } else {
            goalProgressEl.style.width = '100%';
        }
    }
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
        <div class="message-sender">나</div>
        <div class="message-text">${text}</div>
    `;
    chatMessages.appendChild(messageDiv);
    // Auto-scroll to bottom
    chatMessages.parentElement.scrollTop = chatMessages.parentElement.scrollHeight;
}

function addNPCMessage(text) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message npc';
    messageDiv.innerHTML = `
        <div class="message-sender">세이노</div>
        <div class="message-text">${text}</div>
    `;
    chatMessages.appendChild(messageDiv);
    // Auto-scroll to bottom
    chatMessages.parentElement.scrollTop = chatMessages.parentElement.scrollHeight;
}

function getCurrentTime() {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
}

function renderShopItems() {
    shopGrid.innerHTML = '';
    for (const [num, item] of Object.entries(shopItems)) {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'shop-item';

        if (item.special) {
            itemDiv.classList.add('legendary');
        }

        const hasItem = gameState.inventory[num] > 0;
        const sellPrice = Math.floor(item.price * gameState.baseSellPrice);

        itemDiv.innerHTML = `
            <div class="item-name">${item.name}${item.special ? ' ⭐' : ''}</div>
            <div class="item-price">${item.price}G</div>
            <div class="item-desc">${item.desc}</div>
            <div class="item-actions">
                <button class="buy-btn" onclick="showNegotiationModal('${num}')">구매</button>
                <button class="sell-btn" onclick="showSellNegotiationModal('${num}')" ${!hasItem ? 'disabled' : ''}>판매</button>
            </div>
        `;
        shopGrid.appendChild(itemDiv);
    }
}

function renderInventory() {
    inventoryGrid.innerHTML = '';
    if (Object.keys(gameState.inventory).length === 0 || Object.values(gameState.inventory).every(count => count === 0)) {
        inventoryGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; opacity: 0.7;">인벤토리가 비어있습니다</p>';
    } else {
        for (const [num, count] of Object.entries(gameState.inventory)) {
            if (count > 0) {
                const item = shopItems[num];
                const sellPrice = Math.floor(item.price * gameState.baseSellPrice);
                const itemDiv = document.createElement('div');
                itemDiv.className = 'inventory-item';
                itemDiv.innerHTML = `
                    <div class="item-name">${item.name}${item.special ? ' ⭐' : ''}</div>
                    <div class="item-count">보유: ${count}개</div>
                    <div class="item-price">판매가: ${sellPrice}G</div>
                    <div class="item-actions">
                        <button class="sell-btn" onclick="showSellNegotiationModal('${num}')">판매</button>
                    </div>
                `;
                inventoryGrid.appendChild(itemDiv);
            }
        }
    }
}

function showShopList() {
    shopTab.click();
}

function showInventory() {
    inventoryTab.click();
}

function quickSell(itemNum) {
    const response = sellItem(itemNum);
    addNPCMessage(response);
}
