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
    negotiationFailures: 0,
    totalProfit: 0,
    currentNegotiatingItem: null,
    saynoEmotion: 'neutral',
    isSelling: false,

    // === ?‰íŒ ?œìŠ¤??(Reputation System) ===
    reputation: 0,              // ?ì¸ ?‰íŒ (ê²½í—˜ì¹?
    reputationLevel: 1,         // ?‰íŒ ?ˆë²¨

    // === ?‘ìƒ ?ˆìŠ¤? ë¦¬ (Anti-Repetition) ===
    negotiationHistory: [],     // ?¬ìš©???‘ìƒ ê¸°ë¡

    // ì¦ê°• ?œìŠ¤??
    augmentations: [],
    sellNegotiationBonus: 0,
    buyNegotiationBonus: 0,
    sellPriceBonus: 0,
    buyDiscountBonus: 0,
    baseSellPrice: 0.70,
    negotiationPenaltyTurns: 0,
    leveledUp: false
};

// Goals - ìµœì¢… ëª©í‘œ: ?„ì„¤??ê²€ ?¸ê²Œ êµ¬ë§¤!
const goals = {
    beginner: { gold: 2000, title: 'ê²¬ìŠµ ?ì¸', reward: '?¸ì´?¸ê? ì¡°ê¸ˆ ?¸ì •?? },
    intermediate: { gold: 4000, title: '?™ë ¨ ?ì¸', reward: '?¸ì´?¸ê? ì¡´ì¤‘?˜ê¸° ?œì‘' },
    legendary_sword: { gold: 500, title: '?„ì„¤??ê²€ ?¹ê?', reward: '?„ì„¤??ê²€???¸ê²Œ êµ¬ë§¤??ê¸°íšŒ!' }
};

// Shop Items - Expanded inventory
const shopItems = {
    // Weapons
    "1": { name: "?¡ì? ê²€", price: 100, desc: "ê¸°ë³¸?ì¸ ê²€. ?¹ìŠ¬?ˆì?ë§??¸ë§Œ?˜ë‹¤.", keywords: ["?¡ì?ê²€", "?¡ì?", "ê²€1"] },
    "2": { name: "ê°•ì²  ê²€", price: 500, desc: "?¼íŠ¼??ê°•ì²  ê²€. ?„ì‚¬???„ìˆ˜??", keywords: ["ê°•ì² ê²€", "ê°•ì² ", "ê²€2"] },
    "3": { name: "ë¯¸ìŠ¤ë¦?ê²€", price: 1200, desc: "ê°€ë³ê³  ? ì¹´ë¡œìš´ ê³ ê¸‰ ê²€.", keywords: ["ë¯¸ìŠ¤ë¦´ê?", "ë¯¸ìŠ¤ë¦?, "ê²€3"] },
    "4": { name: "?„ì„¤??ê²€", price: 2000, desc: "?„ì„¤ë¡œë§Œ ?„í•´ì§€??ëª…ê?. ?¸ì´?¸ì˜ ?ë‘.", keywords: ["?„ì„¤?˜ê?", "?„ì„¤ê²€", "?„ì„¤", "ëª…ê?"], special: true },

    // Armor
    "5": { name: "ê°€ì£?ê°‘ì˜·", price: 300, desc: "ê¸°ë³¸ ë°©ì–´êµ? ê°€ë³ê³  ?¤ìš©?ì´??", keywords: ["ê°€ì£½ê°‘??, "ê°€ì£?, "ê°‘ì˜·1"] },
    "6": { name: "?ê¸ˆ ê°‘ì˜·", price: 800, desc: "ë¬´ê±°???€??ë°©ì–´?¥ì? ìµœê³ .", keywords: ["?ê¸ˆê°‘ì˜·", "?ê¸ˆ", "ê°‘ì˜·2"] },
    "7": { name: "??ë¹„ëŠ˜ ê°‘ì˜·", price: 1500, desc: "?œë˜ê³¤ì˜ ë¹„ëŠ˜ë¡?ë§Œë“  ìµœìƒê¸?ê°‘ì˜·.", keywords: ["?©ë¹„??, "?œë˜ê³?, "ê°‘ì˜·3"] },

    // Potions
    "8": { name: "ì²´ë ¥ ?¬ì…˜", price: 50, desc: "HP 50 ?Œë³µ. ?„ê¸‰?????°ëŠ” ë¬¼ì•½.", keywords: ["ì²´ë ¥?¬ì…˜", "ì²´ë ¥", "ë¹¨ê°„?¬ì…˜", "hp?¬ì…˜"] },
    "9": { name: "ë§ˆë‚˜ ?¬ì…˜", price: 50, desc: "MP 50 ?Œë³µ. ë§ˆë²•?¬ì˜ ?„ìˆ˜??", keywords: ["ë§ˆë‚˜?¬ì…˜", "ë§ˆë‚˜", "?Œë??¬ì…˜", "mp?¬ì…˜"] },
    "10": { name: "?˜ë¦­??, price: 500, desc: "HP/MP ?„ì „ ?Œë³µ. ê·€??ë¬¼ê±´?´ë‹¤.", keywords: ["?˜ë¦­??, "?˜ë¦­?œë¥´", "ë§ŒëŠ¥ë¬¼ì•½"] },

    // Accessories
    "11": { name: "?‰ìš´??ë°˜ì?", price: 400, desc: "?¬ë¦¬?°ì»¬ ?•ë¥  +10%. ?´ì´ ì¢‹ì•„ì§„ë‹¤.", keywords: ["?‰ìš´ë°˜ì?", "ë°˜ì?", "?‰ìš´"] },
    "12": { name: "?˜ì˜ ëª©ê±¸??, price: 600, desc: "ê³µê²©??+15. ê°•í•´ì§€???ë‚Œ.", keywords: ["?˜ëª©ê±¸ì´", "ëª©ê±¸??, "??] },
    "13": { name: "ë§ˆë²•?¬ì˜ ë¡œë¸Œ", price: 900, desc: "ë§ˆë²• ?°ë?ì§€ +20%. ë§ˆë‚˜ ?Œë³µ ?ë„ ì¦ê?.", keywords: ["ë¡œë¸Œ", "ë§ˆë²•ë¡œë¸Œ", "ë§ˆë²•??] },

    // Special Items
    "14": { name: "ê·€??ì£¼ë¬¸??, price: 200, desc: "ì¦‰ì‹œ ë§ˆì„ë¡?ê·€?? ?¼íšŒ??", keywords: ["ê·€??, "ì£¼ë¬¸??, "?”ë ˆ?¬íŠ¸"] },
    "15": { name: "ê²½í—˜ì¹?ë¬¼ì•½", price: 700, desc: "1?œê°„ ?™ì•ˆ ê²½í—˜ì¹?+50%.", keywords: ["ê²½í—˜ì¹?, "exp", "ë¬¼ì•½"] }
};

// Enhanced Mock AI Responses with emotions
const mockResponses = {
    greeting: {
        neutral: ["?´ì„œ?¤ì‹­?œì˜¤... ?„ë‹ˆ, ê·¸ëƒ¥ êµ¬ê²½ê¾¼ì¸ê°€?", "?ë‹˜?´ë¼???¼ì•¼ ?¸ì‚¬ë¥?ë°›ì?. ë­??í•˜??"],
        pleased: ["?? ?¤ì‹œ ?”êµ°. ?¥ì‚¬ê°€ ???˜ë‚˜?", "ë³´ëŠ” ?ˆì´ ?ˆëŠ” ?ë‹˜?´êµ°."]
    },
    smallTalk: {
        weather: ["? ì”¨? ê·¸ë”´ ê±?? ê²½ ???œê°„???ˆì´??ë²Œì–´.", "ë¹„ê? ?¤ë“  ?ˆì´ ?¤ë“ , ?¥ì‚¬??ê³„ì†?œë‹¤."],
        life: ["?¸ìƒ?€ ?¨ìˆœ?˜ë‹¤. ?¼ëˆ ?„ë¼ê³? ?°ëˆ ë²Œê³ . ê·¸ê²Œ ?¤ì•¼.", "???†ìœ¼ë©?ê¿ˆë„ ëª?ê¾¼ë‹¤. ?„ì‹¤?´ì?."],
        business: ["?¥ì‚¬? ?œê°’ ì£¼ëŠ” ?ˆí•œ?Œë§Œ ?ë‹¤. ê°„ë‹¨??", "?¥ì‚¬???ê³  ?ì´??ê²??„ë‹ˆ?? ê°€ì¹˜ë? ?„ëŠ” ê²Œì„?´ë‹¤."],
        wisdom: ["?¼ëˆ???„ë¼ì§€ ?ŠëŠ” ?ˆì? ?ˆë? ?°ëˆ??ëª?ì¥”ë‹¤.", "?¨ë“¤??ì»¤í”¼ ë§ˆì‹¤ ???¬ì?´ë¼. ê·¸ê²Œ ë¶€???˜ëŠ” ê¸¸ì´??", "?ˆì„ ë²„ëŠ” ê±?ê¸°ìˆ ?´ê³ , ì§€?¤ëŠ” ê±??ˆìˆ ?´ë‹¤."]
    },
    negotiationSuccess: {
        neutral: ["...?œë²•?´êµ°. {}G???˜ê¸´??", "?? ??ë§ì— ?¼ë¦¬???ˆë‹¤. {}G??"],
        pleased: ["ì¢‹ì•„ì¢‹ì•„! ?´ëŸ° ?ë‹˜???ˆì–´???¥ì‚¬ê°€ ?¬ë°Œì§€. {}G???œë¦¬ì§€."]
    },
    negotiationFail: {
        angry: ["ê°€?œì´ ë²¼ìŠ¬?´ëƒ? ê°€ê²©ì? ê·¸ë?ë¡œì•¼!", "?‘ìƒ??êµ¬ê±¸ë¡?ì°©ê°?˜ì? ë§ˆë¼!", "??ë¬¼ê±´?€ ?œê°’???„ëŠ” ?¬ëŒ?œí…Œë§??ë‹¤!"]
    },
    goalAchieved: {
        beginner: "...?œë²•?´êµ°. ???¤ë ¥???¸ì •?œë‹¤. ê²¬ìŠµ?€ ì¡¸ì—…?´ë‹¤.",
        intermediate: "?€?¨í•˜êµ? ?´ì •?„ë©´ ?™ë ¨ ?ì¸?´ì?. ë²Œì¨ ?„ì„¤??ê²€???ˆì— ?¤ì–´?¤ë‚˜?",
        legendary_sword: "?‰ ì¶•í•˜?œë‹¤! ?¤ê? ì§„ì •???ì¸?„ì„ ì¦ëª…?ˆì–´. ?¹ë³„??.. ?„ì„¤??ê²€??500G???˜ê¸°ì§€. ?´ê±´ ???¤ë ¥???€????ì¡´ê²½???œì‹œ??"
    },
    compliment: ["?˜í•œ???„ë????Œìš©?†ì–´.", "ì¹?°¬?€ ?ˆì´ ????"],
    insult: ["ë¬´ë????? ???˜ê?.", "?¥ì‚¬ ???˜ëƒ? êº¼ì ¸."],
    goodbye: ["ê·¸ë˜, ì¡°ì‹¬?´ì„œ ê°€??", "?¤ìŒ???????¤ê³  ?€."]
};

// Sayno emotions with actual images
const saynoEmotions = {
    neutral: {
        emoji: "?’¼",
        image: "images/sayno_vase.jpg",
        class: "neutral"
    },
    angry: {
        emoji: "?˜ ",
        image: "images/sayno_mad.jpg",
        class: "angry"
    },
    pleased: {
        emoji: "?˜Š",
        image: "images/sayno_vase.jpg", // ê¸°ë³¸ ?´ë?ì§€ ?¬ìš©
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
    addNPCMessage("?´ì„œ?¤ì‹­?œì˜¤... ëª©í‘œ??ê°„ë‹¨?˜ë‹¤. ?¤ë ¥??ì¦ëª…?´ë´. ê·¸ëŸ¼ ???ë‘??'?„ì„¤??ê²€'???¹ê???ì£¼ì?.");
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

    // ëª©ë¡ ë³´ê¸° - ?•ì¥???¤ì›Œ??
    if (lowerMsg.includes('ëª©ë¡') || lowerMsg.includes('ë¦¬ìŠ¤??) || lowerMsg.includes('?í’ˆ') ||
        lowerMsg.includes('ë­íŒŒ') || lowerMsg.includes('ë­ìˆ') ||
        lowerMsg.includes('ë¬¼ê±´') || lowerMsg.includes('?„ì´??)) {
        showShopList();
        updateSaynoEmotion('neutral');
        return "ë¬¼ê±´?¤ì´?? '? ì¸ ?”ì²­'???ŒëŸ¬???…ì”¨ë¦„í•´ë´? ?½ì§„ ?Šì„ ê±°ì•¼.";
    }

    // ?¸ë²¤? ë¦¬ - ?•ì¥
    if (lowerMsg.includes('?¸ë²¤? ë¦¬') || lowerMsg.includes('ê°€ë°?) || lowerMsg.includes('?Œì???) ||
        lowerMsg.includes('?´êº¼') || lowerMsg.includes('?°ê±°')) {
        showInventory();
        return "???Œì??ˆì´?? ??ê±??ˆìœ¼ë©??”ì•„.";
    }

    // ëª©í‘œ ?•ì¸ - ?•ì¥
    if (lowerMsg.includes('ëª©í‘œ') || (lowerMsg.includes('?¼ë§ˆ') && (lowerMsg.includes('ëª?) || lowerMsg.includes('?„ìš”')))) {
        const currentGoal = goals[gameState.goalLevel];
        const remaining = currentGoal.gold - gameState.gold;
        return `?„ì¬ ëª©í‘œ: ${currentGoal.title} (${currentGoal.gold}G). ì§€ê¸?${gameState.gold}G, ${remaining}G ???„ìš”??`;
    }

    // ?Œì?ê¸??•ì¸
    if ((lowerMsg.includes('?Œì?ê¸?) || lowerMsg.includes('?´ëˆ') || (lowerMsg.includes('?¼ë§ˆ') && lowerMsg.includes('??))) &&
        !lowerMsg.includes('ëª©í‘œ')) {
        return `${gameState.gold}G ?ˆë‹¤. ëª©í‘œê¹Œì? ${goals[gameState.goalLevel].gold - gameState.gold}G ?¨ì•˜??`;
    }

    // ?„ì„¤??ê²€
    if (lowerMsg.includes('?„ì„¤') || cleanMsg.includes('?„ì„¤?˜ê?')) {
        if (gameState.goalLevel !== 'legendary_sword') {
            updateSaynoEmotion('neutral');
            return "?„ì„¤??ê²€? ?? ?„ì§ ?¼ëŸ¬. ë¨¼ì? ?¤ë ¥ë¶€??ì¦ëª…??";
        }
    }

    // ?„ì?ë§?
    if (lowerMsg.includes('?„ì?') || lowerMsg.includes('?´ë–»ê²?) || lowerMsg.includes('?˜ëŠ”ë²?)) {
        return "ê°„ë‹¨?˜ë‹¤. 1) ëª©ë¡ ë³´ê¸° 2) ? ì¸ ?”ì²­?¼ë¡œ ?¸ê²Œ ?¬ê¸° 3) ë¹„ì‹¸ê²??”ê¸° 4) ??ëª¨ìœ¼ê¸?";
    }

    // ?˜ìœë§?
    if (lowerMsg.includes('ì§œì¦') || lowerMsg.includes('?«ì–´') || lowerMsg.includes('?˜ë¹ ') ||
        lowerMsg.includes('ë³„ë¡œ') || lowerMsg.includes('ë°”ë³´')) {
        updateSaynoEmotion('angry');
        return "ë¬´ë????? ??êº¼ì ¸??";
    }

    // ì¹?°¬
    if (lowerMsg.includes('ë©‹ì ¸') || lowerMsg.includes('?€??) || lowerMsg.includes('ì¡´ê²½') ||
        lowerMsg.includes('ìµœê³ ') || lowerMsg.includes('ì¢‹ì•„')) {
        updateSaynoEmotion('neutral');
        return "?„ë????Œìš©?†ì–´. ?¥ì‚¬???¤ë ¥?´ì?.";
    }

    // ê°ì‚¬
    if (lowerMsg.includes('ê°ì‚¬') || lowerMsg.includes('ê³ ë§ˆ')) {
        updateSaynoEmotion('neutral');
        return "ê°ì‚¬???ˆì´ ???? ?¤ìŒ????ë²Œì–´?€.";
    }

    // ? ì”¨
    if (lowerMsg.includes('? ì”¨') || lowerMsg.includes('ë¹?) || lowerMsg.includes('??) || lowerMsg.includes('ì¶”ì›Œ')) {
        updateSaynoEmotion('neutral');
        return getRandomFrom(mockResponses.smallTalk.weather);
    }

    // ì¡°ì–¸/ê°€ë¥´ì¹¨
    if (lowerMsg.includes('ì¡°ì–¸') || lowerMsg.includes('ê°€ë¥´ì¹¨') || lowerMsg.includes('?¸ìƒ') ||
        lowerMsg.includes('ì§€??) || lowerMsg.includes('ë¹„ë²•') || lowerMsg.includes('?±ê³µ')) {
        updateSaynoEmotion('pleased');
        return getRandomFrom(mockResponses.smallTalk.wisdom);
    }

    // ?¥ì‚¬
    if (lowerMsg.includes('?¥ì‚¬') || lowerMsg.includes('?¬ì—…') || lowerMsg.includes('?ˆë²„')) {
        updateSaynoEmotion('neutral');
        return getRandomFrom(mockResponses.smallTalk.business);
    }

    // ?ë§¤
    if (lowerMsg.includes('?ë§¤') || lowerMsg.includes('?”ê²Œ') || lowerMsg.includes('?”ì•„') ||
        (lowerMsg.includes('??) && !lowerMsg.includes('ë­íŒ”'))) {
        const itemNum = findItemNumber(message);
        if (itemNum && gameState.inventory[itemNum]) {
            return sellItem(itemNum);
        }

        // ?´ë¦„?¼ë¡œ ì°¾ê¸°
        for (const [num, item] of Object.entries(shopItems)) {
            if (cleanMsg.includes(item.name.replace(/\s/g, '').toLowerCase()) ||
                item.keywords.some(kw => cleanMsg.includes(kw))) {
                if (gameState.inventory[num] && gameState.inventory[num] > 0) {
                    return sellItem(num);
                }
                return "ê·¸ê±¸ ê°€ì§€ê³??ˆì????Šì–??";
            }
        }
        return "ë­??”ê² ?¤ëŠ” ê±°ì•¼? ëª…í™•?˜ê²Œ ë§í•´.";
    }

    // êµ¬ë§¤
    const purchaseWords = ['êµ¬ë§¤', '?´ê²Œ', '?¬ê³ ', 'ì£¼ì„¸??, 'ì¤?, 'buy', 'êµ¬ì…'];
    if (purchaseWords.some(w => lowerMsg.includes(w))) {
        const itemNum = findItemNumber(message);
        if (itemNum) {
            updateSaynoEmotion('neutral');
            return `${shopItems[itemNum].name}? ? ì¸ ë°›ê³  ?¶ìœ¼ë©?'? ì¸ ?”ì²­' ë²„íŠ¼ ?ŒëŸ¬.`;
        }

        // ?´ë¦„?¼ë¡œ
        for (const [num, item] of Object.entries(shopItems)) {
            if (cleanMsg.includes(item.name.replace(/\s/g, '').toLowerCase()) ||
                item.keywords.some(kw => cleanMsg.includes(kw))) {
                return `${item.name}? ëª©ë¡?ì„œ '? ì¸ ?”ì²­' ?ŒëŸ¬ë´?`;
            }
        }
        return "ë­??¬ê² ?¤ëŠ” ê±°ì•¼? 'ëª©ë¡' ì³ì„œ ë³´ê³  ë§í•´.";
    }

    // ê°€ê²?
    if (lowerMsg.includes('ê°€ê²?) || lowerMsg.includes('?¼ë§ˆ')) {
        for (const [num, item] of Object.entries(shopItems)) {
            if (cleanMsg.includes(item.name.replace(/\s/g, '').toLowerCase()) ||
                item.keywords.some(kw => cleanMsg.includes(kw))) {
                const sellPrice = Math.floor(item.price * 0.7);
                return `${item.name}? êµ¬ë§¤??${item.price}G, ?ë§¤??${sellPrice}G.`;
            }
        }
        return "'ëª©ë¡' ì³ì„œ ë´? ???ˆì–´.";
    }

    // ?‘ë³„
    if ((lowerMsg.includes('?ˆë…•') && lowerMsg.includes('??)) || lowerMsg.includes('bye') || lowerMsg.includes('ê·¸ë§Œ')) {
        updateSaynoEmotion('neutral');
        return getRandomFrom(mockResponses.goodbye);
    }

    // ?¸ì‚¬
    if (lowerMsg.includes('?ˆë…•') || lowerMsg.includes('hello') || lowerMsg.includes('hi') || lowerMsg.includes('ë°˜ê?')) {
        const emotion = gameState.totalBuys > 3 ? 'pleased' : 'neutral';
        updateSaynoEmotion(emotion);
        return getRandomFrom(mockResponses.greeting[emotion]);
    }

    // ?ê¸°?Œê°œ
    if (lowerMsg.includes('?„êµ¬') || lowerMsg.includes('?´ë¦„')) {
        updateSaynoEmotion('neutral');
        return "?? ?¸ì´?¸ë‹¤. ???ì  ì£¼ì¸. ?¸ë°?†ëŠ” ì§ˆë¬¸ ë§ê³  ?¥ì‚¬????";
    }

    // ê¸°ë³¸
    updateSaynoEmotion('neutral');
    const defaults = [
        "...ë¬´ìŠ¨ ë§ì´?? ëª…í™•?˜ê²Œ ?˜ê¸°??",
        "?´í•´ê°€ ???˜ëŠ”?? 'ëª©ë¡', '?¸ë²¤? ë¦¬', 'ì¡°ì–¸' ê°™ì? ë§??´ë´.",
        "?¥ì‚¬??ê±°ì•¼ ë§?ê±°ì•¼? ?•ì‹¤????"
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
            neutral: { icon: '?’¼', label: '?‰ì˜¨' },
            angry: { icon: '?˜ ', label: '?”ë‚¨' },
            pleased: { icon: '?˜Š', label: 'ë§Œì¡±' }
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

    // ?„ì„¤??ê²€ ?¹ë³„ ì²˜ë¦¬
    if (item.special && gameState.goalLevel === 'legendary_sword') {
        addNPCMessage("...ì¢‹ì•„. ???¤ë ¥???¸ì •?œë‹¤. ?„ì„¤??ê²€, ?¹ë³„??500G???˜ê¸°ì§€!");
        setTimeout(() => {
            if (gameState.gold >= 500) {
                gameState.gold -= 500;
                gameState.inventory[itemNum] = (gameState.inventory[itemNum] || 0) + 1;
                updateStats();
                renderShopItems();
                updateSaynoEmotion('pleased');
                addNPCMessage("?‰ ì¶•í•˜?œë‹¤! ?¤ê? ì§„ì •???ì¸?´ë‹¤. ??ê²€?¼ë¡œ ???¼ì„ ?´ë¼!");
            } else {
                addNPCMessage("...500G???†ë‚˜? ê·¸ëŸ¼ ?„ì§ ?¼ëŸ¬.");
            }
        }, 1000);
        return;
    }

    const infoDiv = document.getElementById('negotiation-item-info');
    infoDiv.innerHTML = `
        <div style="text-align: center; margin: 15px 0;">
            <h3>${item.name}</h3>
            <p style="color: #ffd700; font-size: 1.3em;">?•ê?: ${item.price}G</p>
            <p style="color: rgba(245, 230, 211, 0.8); font-size: 0.9em; margin-top: 10px;">${item.desc}</p>
        </div>
    `;

    // ?…ë ¥ì°?ì´ˆê¸°??
    const inputArea = document.getElementById('negotiation-input');
    inputArea.value = '';
    document.getElementById('char-count').textContent = '0';

    // ë¬¸ì ì¹´ìš´???´ë²¤??
    inputArea.oninput = () => {
        document.getElementById('char-count').textContent = inputArea.value.length;
    };

    // ?ŒíŠ¸ ?œì‹œ (?¤íŒ¨ ?Ÿìˆ˜???°ë¼)
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

// ?ˆë¡œ???‘ìƒ ?œì¶œ ?¨ìˆ˜ (?¤ì›Œ??ê¸°ë°˜)
function submitNegotiation() {
    const itemNum = gameState.currentNegotiatingItem;
    if (!itemNum) return;

    const item = shopItems[itemNum];
    const userInput = document.getElementById('negotiation-input').value.trim();
    const isSelling = gameState.isSelling || false;

    if (!userInput) {
        addNPCMessage("...ë§ì„ ?´ì•¼ ?‘ìƒ???˜ì? ?Šê² ??");
        return;
    }

    // ?ë§¤ ëª¨ë“œ?????¸ë²¤? ë¦¬ ?•ì¸
    if (isSelling && (!gameState.inventory[itemNum] || gameState.inventory[itemNum] === 0)) {
        addNPCMessage("ê·¸ê±¸ ê°€ì§€ê³??ˆì????Šì–?? ?¬ê¸° ì¹˜ë ¤ê³?");
        closeNegotiation();
        return;
    }

    // ?¤ì›Œ??ë¶„ì„ (Advanced Negotiation Engine ?¬ìš©)
    const analysis = negotiationEngine.analyze(userInput, item, gameState);
    gameState.negotiationAttempts++;

    // ?¬ìš©??ë©”ì‹œì§€ ?œì‹œ
    addUserMessage(userInput);
    closeNegotiation();

    setTimeout(() => {
        if (analysis.success) {
            // ?±ê³µ!
            gameState.negotiationSuccesses++;
            gameState.negotiationFailures = 0;

            if (isSelling) {
                // ===== ?ë§¤ ëª¨ë“œ =====
                const basePrice = Math.floor(item.price * (gameState.baseSellPrice + gameState.sellPriceBonus / 100));
                const bonusPercent = Math.floor(10 + analysis.persuasionScore * 20);
                const finalPrice = Math.floor(basePrice * (1 + bonusPercent / 100));

                gameState.gold += finalPrice;
                gameState.inventory[itemNum]--;
                if (gameState.inventory[itemNum] === 0) {
                    delete gameState.inventory[itemNum];
                }
                gameState.totalSells++;

                // === ?‰íŒ ?ë“ ===
                const profit = finalPrice - basePrice;
                const repGain = gainReputation('sell', profit, true);

                updateStats();
                renderShopItems();
                updateSaynoEmotion(gameState.negotiationSuccesses > 5 ? 'pleased' : 'neutral');

                // ë°˜ë³µ ê²½ê³  ë©”ì‹œì§€ ?°ì„  ?œì‹œ
                if (analysis.repetitionCheck && analysis.repetitionCheck.isRepetition) {
                    addNPCMessage(analysis.repetitionCheck.message);
                    setTimeout(() => {
                        addNPCMessage(`ê·¸ë˜??${finalPrice}G???¬ì£¼ì§€. (+${bonusPercent}% ë³´ë„ˆ?? +${repGain} ?‰íŒ)`);
                    }, 1000);
                } else {
                    const npcResponse = `${negotiationEngine.generateResponse(analysis, item)} ${finalPrice}G???¬ì£¼ì§€. (+${bonusPercent}% ë³´ë„ˆ?? +${repGain} ?‰íŒ)`;
                    addNPCMessage(npcResponse);
                }

                // ?ˆìŠ¤? ë¦¬??ì¶”ê?
                const matchedKeywords = analysis.keywordAnalysis.matchedKeywords.map(k => k.keyword);
                addToNegotiationHistory(userInput, matchedKeywords, true);

                telemetry.logNegotiation({
                    userInput,
                    npcResponse: "?ë§¤ ?±ê³µ",
                    itemId: itemNum,
                    itemName: item.name,
                    originalPrice: basePrice,
                    finalPrice: finalPrice,
                    discountPercent: bonusPercent,
                    persuasionScore: analysis.persuasionScore,
                    matchedKeywords: matchedKeywords,
                    matchedCategories: analysis.keywordAnalysis.matchedCategories,
                    success: true,
                    attemptNumber: gameState.negotiationAttempts,
                    mode: 'sell',
                    repetitionPenalty: analysis.repetitionCheck?.penalty || 1.0
                });

            } else {
                // ===== êµ¬ë§¤ ëª¨ë“œ =====
                if (gameState.gold < analysis.finalPrice) {
                    updateSaynoEmotion('angry');
                    const response = `${negotiationEngine.generateResponse(analysis, item).split('.')[0]}. ê·¼ë° ?ˆì´ ëª¨ì?¼ì–?? ${analysis.finalPrice}G ê°€?¸ì?.`;
                    addNPCMessage(response);

                    // ?ˆìŠ¤? ë¦¬??ì¶”ê? (?¤íŒ¨)
                    const matchedKeywords = analysis.keywordAnalysis.matchedKeywords.map(k => k.keyword);
                    addToNegotiationHistory(userInput, matchedKeywords, false);

                    telemetry.logNegotiation({
                        userInput,
                        npcResponse: response,
                        itemId: itemNum,
                        itemName: item.name,
                        originalPrice: item.price,
                        finalPrice: analysis.finalPrice,
                        discountPercent: analysis.discountPercent,
                        persuasionScore: analysis.persuasionScore,
                        matchedKeywords: matchedKeywords,
                        matchedCategories: analysis.keywordAnalysis.matchedCategories,
                        success: false,
                        attemptNumber: gameState.negotiationAttempts,
                        mode: 'buy',
                        repetitionPenalty: analysis.repetitionCheck?.penalty || 1.0
                    });

                    return;
                }

                gameState.gold -= analysis.finalPrice;
                gameState.inventory[itemNum] = (gameState.inventory[itemNum] || 0) + 1;
                gameState.totalBuys++;

                // === ?‰íŒ ?ë“ ===
                const discount = item.price - analysis.finalPrice;
                const repGain = gainReputation('buy', discount, true);

                updateStats();
                renderShopItems();
                updateSaynoEmotion(gameState.negotiationSuccesses > 5 ? 'pleased' : 'neutral');

                // ë°˜ë³µ ê²½ê³  ë©”ì‹œì§€ ?°ì„  ?œì‹œ
                if (analysis.repetitionCheck && analysis.repetitionCheck.isRepetition) {
                    addNPCMessage(analysis.repetitionCheck.message);
                    setTimeout(() => {
                        addNPCMessage(`ê·¸ë˜??${analysis.finalPrice}G???˜ê¸°ì§€. (${analysis.discountPercent}% ? ì¸, +${repGain} ?‰íŒ)`);
                    }, 1000);
                } else {
                    const npcResponse = `${negotiationEngine.generateResponse(analysis, item)} (+${repGain} ?‰íŒ)`;
                    addNPCMessage(npcResponse);
                }

                // ?ˆìŠ¤? ë¦¬??ì¶”ê?
                const matchedKeywords = analysis.keywordAnalysis.matchedKeywords.map(k => k.keyword);
                addToNegotiationHistory(userInput, matchedKeywords, true);

                telemetry.logNegotiation({
                    userInput,
                    npcResponse: "êµ¬ë§¤ ?±ê³µ",
                    itemId: itemNum,
                    itemName: item.name,
                    originalPrice: item.price,
                    finalPrice: analysis.finalPrice,
                    discountPercent: analysis.discountPercent,
                    persuasionScore: analysis.persuasionScore,
                    matchedKeywords: matchedKeywords,
                    matchedCategories: analysis.keywordAnalysis.matchedCategories,
                    success: true,
                    attemptNumber: gameState.negotiationAttempts,
                    mode: 'buy',
                    repetitionPenalty: analysis.repetitionCheck?.penalty || 1.0
                });

                checkGoalAchievement();
            }
        } else {
            // ?¤íŒ¨
            gameState.negotiationFailures++;
            updateSaynoEmotion('angry');

            const npcResponse = negotiationEngine.generateResponse(analysis, item);
            addNPCMessage(npcResponse);

            // ?”ë ˆë©”íŠ¸ë¦?ë¡œê¹…
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

            // ?¤ìŒ ?‘ìƒ ???ŒíŠ¸ ?œê³µ
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

// ?•ê? êµ¬ë§¤ (ëª¨ë‹¬?ì„œ)
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
        addNPCMessage(`?ˆë„ ?†ìœ¼ë©´ì„œ ë¬´ìŠ¨ êµ¬ë§¤? ${item.price}G ê°€?¸ì?.`);
        return;
    }

    gameState.gold -= item.price;
    gameState.inventory[itemNum] = (gameState.inventory[itemNum] || 0) + 1;
    gameState.totalBuys++;

    updateStats();
    renderShopItems();
    closeNegotiation();

    updateSaynoEmotion('neutral');
    addNPCMessage(`${item.name}, ${item.price}G?? ?•ê?ë¡??¬ë‹ˆ ??ë§??†ì??`);

    // Check level up
    checkGoalAchievement(); // Assuming checkLevelUp is actually checkGoalAchievement
}

function sellItem(itemNum) {
    const item = shopItems[itemNum];
    if (!item || !gameState.inventory[itemNum] || gameState.inventory[itemNum] === 0) {
        return "ê·¸ê±¸ ê°€ì§€ê³??ˆì????Šì–??";
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
    return `${item.name}? ${sellPrice}G???¬ì£¼ì§€. ?˜ì˜ì§€ ?Šì? ê±°ë˜??`;
}

function findItemNumber(message) {
    for (const num of Object.keys(shopItems)) {
        if (message.includes(num + 'ë²?) || message.includes(num)) {
            return num;
        }
    }
    return null;
}

function getRandomFrom(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function updateStats() {
    document.getElementById('gold').textContent = gameState.gold;
    // Removed: total-buys element does not exist
    // Removed: total-sells element does not exist

    // ?‰íŒ ?•ë³´ ?œì‹œ
    const repInfo = getReputationInfo();
    const goalDisplay = document.getElementById('goal-text');

    if (repInfo.isMaxLevel) {
        goalDisplay.innerHTML = `
            <strong>?‰íŒ:</strong> ${repInfo.name} (ìµœë? ?ˆë²¨)<br>
            <strong>?‰íŒ ?ìˆ˜:</strong> ${repInfo.current}
        `;
    } else {
        goalDisplay.innerHTML = `
            <strong>?‰íŒ:</strong> ${repInfo.name} (Lv.${repInfo.level})<br>
            <strong>ì§„í–‰??</strong> ${repInfo.current}/${repInfo.required} (${repInfo.progress}%)<br>
            <strong>?¤ìŒ ?ˆë²¨:</strong> ${repInfo.nextName}
        `;
    }

    // ê¸°ì¡´ ëª©í‘œ ?•ë³´ (?„ì„¤??ê²€)
    if (gameState.goalLevel === 'legendary_sword') {
        goalDisplay.innerHTML += `<br><strong>ìµœì¢… ëª©í‘œ:</strong> ?„ì„¤??ê²€ êµ¬ë§¤ (2000G)`;
    }
}

function checkGoalAchievement() {
    const currentGoal = goals[gameState.goalLevel];

    if (gameState.gold >= currentGoal.gold) {
        updateSaynoEmotion('pleased');
        const message = mockResponses.goalAchieved[gameState.goalLevel];
        addNPCMessage("?‰ " + message);

        if (gameState.goalLevel === 'beginner') {
            gameState.goalLevel = 'intermediate';
            setTimeout(() => {
                addNPCMessage("?¤ìŒ ëª©í‘œ: " + goals.intermediate.title + " (" + goals.intermediate.gold + "G)");
            }, 1000);
        } else if (gameState.goalLevel === 'intermediate') {
            gameState.goalLevel = 'legendary_sword';
            setTimeout(() => {
                addNPCMessage("ìµœì¢… ëª©í‘œê¹Œì? ?”êµ°. ?´ì œ... ?„ì„¤??ê²€??500G???”ì•„ì£¼ì?!");
            }, 1000);
        }

        updateStats();
    }
}

function addUserMessage(text) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message user';
    messageDiv.innerHTML = `
        <div class="message-sender">??/div>
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
        <div class="message-sender">?¸ì´??/div>
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
            <div class="item-name">${item.name}${item.special ? ' â­? : ''}</div>
            <div class="item-price">${item.price}G</div>
            <div class="item-desc">${item.desc}</div>
            <div class="item-actions">
                <button class="buy-btn" onclick="showNegotiationModal('${num}')">êµ¬ë§¤</button>
                <button class="sell-btn" onclick="showSellNegotiationModal('${num}')" ${!hasItem ? 'disabled' : ''}>?ë§¤</button>
            </div>
        `;
        shopGrid.appendChild(itemDiv);
    }
}

function renderInventory() {
    inventoryGrid.innerHTML = '';
    if (Object.keys(gameState.inventory).length === 0 || Object.values(gameState.inventory).every(count => count === 0)) {
        inventoryGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; opacity: 0.7;">?¸ë²¤? ë¦¬ê°€ ë¹„ì–´?ˆìŠµ?ˆë‹¤</p>';
    } else {
        for (const [num, count] of Object.entries(gameState.inventory)) {
            if (count > 0) {
                const item = shopItems[num];
                const sellPrice = Math.floor(item.price * gameState.baseSellPrice);
                const itemDiv = document.createElement('div');
                itemDiv.className = 'inventory-item';
                itemDiv.innerHTML = `
                    <div class="item-name">${item.name}${item.special ? ' â­? : ''}</div>
                    <div class="item-count">ë³´ìœ : ${count}ê°?/div>
                    <div class="item-price">?ë§¤ê°€: ${sellPrice}G</div>
                    <div class="item-actions">
                        <button class="sell-btn" onclick="showSellNegotiationModal('${num}')">?ë§¤</button>
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
