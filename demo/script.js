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

    // === ?됲뙋 ?쒖뒪??(Reputation System) ===
    reputation: 0,              // ?곸씤 ?됲뙋 (寃쏀뿕移?
    reputationLevel: 1,         // ?됲뙋 ?덈꺼

    // === ?묒긽 ?덉뒪?좊━ (Anti-Repetition) ===
    negotiationHistory: [],     // ?ъ슜???묒긽 湲곕줉

    // 利앷컯 ?쒖뒪??    augmentations: [],
    sellNegotiationBonus: 0,
    buyNegotiationBonus: 0,
    sellPriceBonus: 0,
    buyDiscountBonus: 0,
    baseSellPrice: 0.70,
    negotiationPenaltyTurns: 0,
    leveledUp: false
};

// Goals - 理쒖쥌 紐⑺몴: ?꾩꽕??寃 ?멸쾶 援щℓ!
const goals = {
    beginner: { gold: 2000, title: '寃ъ뒿 ?곸씤', reward: '?몄씠?멸? 議곌툑 ?몄젙?? },
    intermediate: { gold: 4000, title: '?숇젴 ?곸씤', reward: '?몄씠?멸? 議댁쨷?섍린 ?쒖옉' },
    legendary_sword: { gold: 500, title: '?꾩꽕??寃 ?밴?', reward: '?꾩꽕??寃???멸쾶 援щℓ??湲고쉶!' }
};

// Shop Items - Expanded inventory
const shopItems = {
    // Weapons
    "1": { name: "?≪? 寃", price: 100, desc: "湲곕낯?곸씤 寃. ?뱀뒳?덉?留??몃쭔?섎떎.", keywords: ["?≪?寃", "?≪?", "寃1"] },
    "2": { name: "媛뺤쿋 寃", price: 500, desc: "?쇳듉??媛뺤쿋 寃. ?꾩궗???꾩닔??", keywords: ["媛뺤쿋寃", "媛뺤쿋", "寃2"] },
    "3": { name: "誘몄뒪由?寃", price: 1200, desc: "媛蹂띻퀬 ?좎뭅濡쒖슫 怨좉툒 寃.", keywords: ["誘몄뒪由닿?", "誘몄뒪由?, "寃3"] },
    "4": { name: "?꾩꽕??寃", price: 2000, desc: "?꾩꽕濡쒕쭔 ?꾪빐吏??紐낃?. ?몄씠?몄쓽 ?먮옉.", keywords: ["?꾩꽕?섍?", "?꾩꽕寃", "?꾩꽕", "紐낃?"], special: true },

    // Armor
    "5": { name: "媛二?媛묒샆", price: 300, desc: "湲곕낯 諛⑹뼱援? 媛蹂띻퀬 ?ㅼ슜?곸씠??", keywords: ["媛二쎄컩??, "媛二?, "媛묒샆1"] },
    "6": { name: "?먭툑 媛묒샆", price: 800, desc: "臾닿굅?????諛⑹뼱?μ? 理쒓퀬.", keywords: ["?먭툑媛묒샆", "?먭툑", "媛묒샆2"] },
    "7": { name: "??鍮꾨뒛 媛묒샆", price: 1500, desc: "?쒕옒怨ㅼ쓽 鍮꾨뒛濡?留뚮뱺 理쒖긽湲?媛묒샆.", keywords: ["?⑸퉬??, "?쒕옒怨?, "媛묒샆3"] },

    // Potions
    "8": { name: "泥대젰 ?ъ뀡", price: 50, desc: "HP 50 ?뚮났. ?꾧툒?????곕뒗 臾쇱빟.", keywords: ["泥대젰?ъ뀡", "泥대젰", "鍮④컙?ъ뀡", "hp?ъ뀡"] },
    "9": { name: "留덈굹 ?ъ뀡", price: 50, desc: "MP 50 ?뚮났. 留덈쾿?ъ쓽 ?꾩닔??", keywords: ["留덈굹?ъ뀡", "留덈굹", "?뚮??ъ뀡", "mp?ъ뀡"] },
    "10": { name: "?섎┃??, price: 500, desc: "HP/MP ?꾩쟾 ?뚮났. 洹??臾쇨굔?대떎.", keywords: ["?섎┃??, "?섎┃?쒕Ⅴ", "留뚮뒫臾쇱빟"] },

    // Accessories
    "11": { name: "?됱슫??諛섏?", price: 400, desc: "?щ━?곗뺄 ?뺣쪧 +10%. ?댁씠 醫뗭븘吏꾨떎.", keywords: ["?됱슫諛섏?", "諛섏?", "?됱슫"] },
    "12": { name: "?섏쓽 紐⑷구??, price: 600, desc: "怨듦꺽??+15. 媛뺥빐吏???먮굦.", keywords: ["?섎ぉ嫄몄씠", "紐⑷구??, "??] },
    "13": { name: "留덈쾿?ъ쓽 濡쒕툕", price: 900, desc: "留덈쾿 ?곕?吏 +20%. 留덈굹 ?뚮났 ?띾룄 利앷?.", keywords: ["濡쒕툕", "留덈쾿濡쒕툕", "留덈쾿??] },

    // Special Items
    "14": { name: "洹??二쇰Ц??, price: 200, desc: "利됱떆 留덉쓣濡?洹?? ?쇳쉶??", keywords: ["洹??, "二쇰Ц??, "?붾젅?ы듃"] },
    "15": { name: "寃쏀뿕移?臾쇱빟", price: 700, desc: "1?쒓컙 ?숈븞 寃쏀뿕移?+50%.", keywords: ["寃쏀뿕移?, "exp", "臾쇱빟"] }
};

// Enhanced Mock AI Responses with emotions
const mockResponses = {
    greeting: {
        neutral: ["?댁꽌?ㅼ떗?쒖삤... ?꾨땲, 洹몃깷 援ш꼍袁쇱씤媛?", "?먮떂?대씪???쇱빞 ?몄궗瑜?諛쏆?. 萸??먰븯??"],
        pleased: ["?? ?ㅼ떆 ?붽뎔. ?μ궗媛 ???섎굹?", "蹂대뒗 ?덉씠 ?덈뒗 ?먮떂?닿뎔."]
    },
    smallTalk: {
        weather: ["?좎뵪? 洹몃뵶 嫄??좉꼍 ???쒓컙???덉씠??踰뚯뼱.", "鍮꾧? ?ㅻ뱺 ?덉씠 ?ㅻ뱺, ?μ궗??怨꾩냽?쒕떎."],
        life: ["?몄깮? ?⑥닚?섎떎. ?쇰룉 ?꾨겮怨? ?곕룉 踰뚭퀬. 洹멸쾶 ?ㅼ빞.", "???놁쑝硫?轅덈룄 紐?袁쇰떎. ?꾩떎?댁?."],
        business: ["?μ궗? ?쒓컪 二쇰뒗 ?덊븳?뚮쭔 ?먮떎. 媛꾨떒??", "?μ궗???띻퀬 ?띿씠??寃??꾨땲?? 媛移섎? ?꾨뒗 寃뚯엫?대떎."],
        wisdom: ["?쇰룉???꾨겮吏 ?딅뒗 ?덉? ?덈? ?곕룉??紐?伊붾떎.", "?⑤뱾??而ㅽ뵾 留덉떎 ???ъ옄?대씪. 洹멸쾶 遺???섎뒗 湲몄씠??", "?덉쓣 踰꾨뒗 嫄?湲곗닠?닿퀬, 吏?ㅻ뒗 嫄??덉닠?대떎."]
    },
    negotiationSuccess: {
        neutral: ["...?쒕쾿?닿뎔. {}G???섍릿??", "?? ??留먯뿉 ?쇰━???덈떎. {}G??"],
        pleased: ["醫뗭븘醫뗭븘! ?대윴 ?먮떂???덉뼱???μ궗媛 ?щ컡吏. {}G???쒕━吏."]
    },
    negotiationFail: {
        angry: ["媛?쒖씠 踰쇱뒳?대깘? 媛寃⑹? 洹몃?濡쒖빞!", "?묒긽??援ш구濡?李⑷컖?섏? 留덈씪!", "??臾쇨굔? ?쒓컪???꾨뒗 ?щ엺?쒗뀒留??먮떎!"]
    },
    goalAchieved: {
        beginner: "...?쒕쾿?닿뎔. ???ㅻ젰???몄젙?쒕떎. 寃ъ뒿? 議몄뾽?대떎.",
        intermediate: "??⑦븯援? ?댁젙?꾨㈃ ?숇젴 ?곸씤?댁?. 踰뚯뜥 ?꾩꽕??寃???덉뿉 ?ㅼ뼱?ㅻ굹?",
        legendary_sword: "?럦 異뺥븯?쒕떎! ?ㅺ? 吏꾩젙???곸씤?꾩쓣 利앸챸?덉뼱. ?밸퀎??.. ?꾩꽕??寃??500G???섍린吏. ?닿굔 ???ㅻ젰???????議닿꼍???쒖떆??"
    },
    compliment: ["?섑븳???꾨????뚯슜?놁뼱.", "移?갔? ?덉씠 ????"],
    insult: ["臾대????? ???섍?.", "?μ궗 ???섎깘? 爰쇱졇."],
    goodbye: ["洹몃옒, 議곗떖?댁꽌 媛??", "?ㅼ쓬???????ㅺ퀬 ?."]
};

// Sayno emotions with actual images
const saynoEmotions = {
    neutral: {
        emoji: "?뮳",
        image: "images/sayno_vase.jpg",
        class: "neutral"
    },
    angry: {
        emoji: "?삝",
        image: "images/sayno_mad.jpg",
        class: "angry"
    },
    pleased: {
        emoji: "?삃",
        image: "images/sayno_vase.jpg", // 湲곕낯 ?대?吏 ?ъ슜
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
    addNPCMessage("?댁꽌?ㅼ떗?쒖삤... 紐⑺몴??媛꾨떒?섎떎. ?ㅻ젰??利앸챸?대킄. 洹몃읆 ???먮옉??'?꾩꽕??寃'???밴???二쇱?.");
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

    // 紐⑸줉 蹂닿린 - ?뺤옣???ㅼ썙??    if (lowerMsg.includes('紐⑸줉') || lowerMsg.includes('由ъ뒪??) || lowerMsg.includes('?곹뭹') ||
        lowerMsg.includes('萸먰뙆') || lowerMsg.includes('萸먯엳') ||
        lowerMsg.includes('臾쇨굔') || lowerMsg.includes('?꾩씠??)) {
        showShopList();
        updateSaynoEmotion('neutral');
        return "臾쇨굔?ㅼ씠?? '?좎씤 ?붿껌'???뚮윭???낆뵪由꾪빐遊? ?쎌쭊 ?딆쓣 嫄곗빞.";
    }

    // ?몃깽?좊━ - ?뺤옣
    if (lowerMsg.includes('?몃깽?좊━') || lowerMsg.includes('媛諛?) || lowerMsg.includes('?뚯???) ||
        lowerMsg.includes('?닿볼') || lowerMsg.includes('?곌굅')) {
        showInventory();
        return "???뚯??덉씠?? ??嫄??덉쑝硫??붿븘.";
    }

    // 紐⑺몴 ?뺤씤 - ?뺤옣
    if (lowerMsg.includes('紐⑺몴') || (lowerMsg.includes('?쇰쭏') && (lowerMsg.includes('紐?) || lowerMsg.includes('?꾩슂')))) {
        const currentGoal = goals[gameState.goalLevel];
        const remaining = currentGoal.gold - gameState.gold;
        return `?꾩옱 紐⑺몴: ${currentGoal.title} (${currentGoal.gold}G). 吏湲?${gameState.gold}G, ${remaining}G ???꾩슂??`;
    }

    // ?뚯?湲??뺤씤
    if ((lowerMsg.includes('?뚯?湲?) || lowerMsg.includes('?대룉') || (lowerMsg.includes('?쇰쭏') && lowerMsg.includes('??))) &&
        !lowerMsg.includes('紐⑺몴')) {
        return `${gameState.gold}G ?덈떎. 紐⑺몴源뚯? ${goals[gameState.goalLevel].gold - gameState.gold}G ?⑥븯??`;
    }

    // ?꾩꽕??寃
    if (lowerMsg.includes('?꾩꽕') || cleanMsg.includes('?꾩꽕?섍?')) {
        if (gameState.goalLevel !== 'legendary_sword') {
            updateSaynoEmotion('neutral');
            return "?꾩꽕??寃? ?? ?꾩쭅 ?쇰윭. 癒쇱? ?ㅻ젰遺??利앸챸??";
        }
    }

    // ?꾩?留?    if (lowerMsg.includes('?꾩?') || lowerMsg.includes('?대뼸寃?) || lowerMsg.includes('?섎뒗踰?)) {
        return "媛꾨떒?섎떎. 1) 紐⑸줉 蹂닿린 2) ?좎씤 ?붿껌?쇰줈 ?멸쾶 ?ш린 3) 鍮꾩떥寃??붽린 4) ??紐⑥쑝湲?";
    }

    // ?섏걶留?    if (lowerMsg.includes('吏쒖쬆') || lowerMsg.includes('?レ뼱') || lowerMsg.includes('?섎튌') ||
        lowerMsg.includes('蹂꾨줈') || lowerMsg.includes('諛붾낫')) {
        updateSaynoEmotion('angry');
        return "臾대????? ??爰쇱졇??";
    }

    // 移?갔
    if (lowerMsg.includes('硫뗭졇') || lowerMsg.includes('???) || lowerMsg.includes('議닿꼍') ||
        lowerMsg.includes('理쒓퀬') || lowerMsg.includes('醫뗭븘')) {
        updateSaynoEmotion('neutral');
        return "?꾨????뚯슜?놁뼱. ?μ궗???ㅻ젰?댁?.";
    }

    // 媛먯궗
    if (lowerMsg.includes('媛먯궗') || lowerMsg.includes('怨좊쭏')) {
        updateSaynoEmotion('neutral');
        return "媛먯궗???덉씠 ???? ?ㅼ쓬????踰뚯뼱?.";
    }

    // ?좎뵪
    if (lowerMsg.includes('?좎뵪') || lowerMsg.includes('鍮?) || lowerMsg.includes('??) || lowerMsg.includes('異붿썙')) {
        updateSaynoEmotion('neutral');
        return getRandomFrom(mockResponses.smallTalk.weather);
    }

    // 議곗뼵/媛瑜댁묠
    if (lowerMsg.includes('議곗뼵') || lowerMsg.includes('媛瑜댁묠') || lowerMsg.includes('?몄깮') ||
        lowerMsg.includes('吏??) || lowerMsg.includes('鍮꾨쾿') || lowerMsg.includes('?깃났')) {
        updateSaynoEmotion('pleased');
        return getRandomFrom(mockResponses.smallTalk.wisdom);
    }

    // ?μ궗
    if (lowerMsg.includes('?μ궗') || lowerMsg.includes('?ъ뾽') || lowerMsg.includes('?덈쾭')) {
        updateSaynoEmotion('neutral');
        return getRandomFrom(mockResponses.smallTalk.business);
    }

    // ?먮ℓ
    if (lowerMsg.includes('?먮ℓ') || lowerMsg.includes('?붽쾶') || lowerMsg.includes('?붿븘') ||
        (lowerMsg.includes('??) && !lowerMsg.includes('萸먰뙏'))) {
        const itemNum = findItemNumber(message);
        if (itemNum && gameState.inventory[itemNum]) {
            return sellItem(itemNum);
        }

        // ?대쫫?쇰줈 李얘린
        for (const [num, item] of Object.entries(shopItems)) {
            if (cleanMsg.includes(item.name.replace(/\s/g, '').toLowerCase()) ||
                item.keywords.some(kw => cleanMsg.includes(kw))) {
                if (gameState.inventory[num] && gameState.inventory[num] > 0) {
                    return sellItem(num);
                }
                return "洹멸구 媛吏怨??덉????딆옏??";
            }
        }
        return "萸??붽쿋?ㅻ뒗 嫄곗빞? 紐낇솗?섍쾶 留먰빐.";
    }

    // 援щℓ
    const purchaseWords = ['援щℓ', '?닿쾶', '?ш퀬', '二쇱꽭??, '以?, 'buy', '援ъ엯'];
    if (purchaseWords.some(w => lowerMsg.includes(w))) {
        const itemNum = findItemNumber(message);
        if (itemNum) {
            updateSaynoEmotion('neutral');
            return `${shopItems[itemNum].name}? ?좎씤 諛쏄퀬 ?띠쑝硫?'?좎씤 ?붿껌' 踰꾪듉 ?뚮윭.`;
        }

        // ?대쫫?쇰줈
        for (const [num, item] of Object.entries(shopItems)) {
            if (cleanMsg.includes(item.name.replace(/\s/g, '').toLowerCase()) ||
                item.keywords.some(kw => cleanMsg.includes(kw))) {
                return `${item.name}? 紐⑸줉?먯꽌 '?좎씤 ?붿껌' ?뚮윭遊?`;
            }
        }
        return "萸??ш쿋?ㅻ뒗 嫄곗빞? '紐⑸줉' 爾먯꽌 蹂닿퀬 留먰빐.";
    }

    // 媛寃?    if (lowerMsg.includes('媛寃?) || lowerMsg.includes('?쇰쭏')) {
        for (const [num, item] of Object.entries(shopItems)) {
            if (cleanMsg.includes(item.name.replace(/\s/g, '').toLowerCase()) ||
                item.keywords.some(kw => cleanMsg.includes(kw))) {
                const sellPrice = Math.floor(item.price * 0.7);
                return `${item.name}? 援щℓ??${item.price}G, ?먮ℓ??${sellPrice}G.`;
            }
        }
        return "'紐⑸줉' 爾먯꽌 遊? ???덉뼱.";
    }

    // ?묐퀎
    if ((lowerMsg.includes('?덈뀞') && lowerMsg.includes('??)) || lowerMsg.includes('bye') || lowerMsg.includes('洹몃쭔')) {
        updateSaynoEmotion('neutral');
        return getRandomFrom(mockResponses.goodbye);
    }

    // ?몄궗
    if (lowerMsg.includes('?덈뀞') || lowerMsg.includes('hello') || lowerMsg.includes('hi') || lowerMsg.includes('諛섍?')) {
        const emotion = gameState.totalBuys > 3 ? 'pleased' : 'neutral';
        updateSaynoEmotion(emotion);
        return getRandomFrom(mockResponses.greeting[emotion]);
    }

    // ?먭린?뚭컻
    if (lowerMsg.includes('?꾧뎄') || lowerMsg.includes('?대쫫')) {
        updateSaynoEmotion('neutral');
        return "?? ?몄씠?몃떎. ???곸젏 二쇱씤. ?몃뜲?녿뒗 吏덈Ц 留먭퀬 ?μ궗????";
    }

    // 湲곕낯
    updateSaynoEmotion('neutral');
    const defaults = [
        "...臾댁뒯 留먯씠?? 紐낇솗?섍쾶 ?섍린??",
        "?댄빐媛 ???섎뒗?? '紐⑸줉', '?몃깽?좊━', '議곗뼵' 媛숈? 留??대킄.",
        "?μ궗??嫄곗빞 留?嫄곗빞? ?뺤떎????"
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
            neutral: { icon: '?뮳', label: '?됱삩' },
            angry: { icon: '?삝', label: '?붾궓' },
            pleased: { icon: '?삃', label: '留뚯”' }
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

    // ?꾩꽕??寃 ?밸퀎 泥섎━
    if (item.special && gameState.goalLevel === 'legendary_sword') {
        addNPCMessage("...醫뗭븘. ???ㅻ젰???몄젙?쒕떎. ?꾩꽕??寃, ?밸퀎??500G???섍린吏!");
        setTimeout(() => {
            if (gameState.gold >= 500) {
                gameState.gold -= 500;
                gameState.inventory[itemNum] = (gameState.inventory[itemNum] || 0) + 1;
                updateStats();
                renderShopItems();
                updateSaynoEmotion('pleased');
                addNPCMessage("?럦 異뺥븯?쒕떎! ?ㅺ? 吏꾩젙???곸씤?대떎. ??寃?쇰줈 ???쇱쓣 ?대씪!");
            } else {
                addNPCMessage("...500G???녿굹? 洹몃읆 ?꾩쭅 ?쇰윭.");
            }
        }, 1000);
        return;
    }

    const infoDiv = document.getElementById('negotiation-item-info');
    infoDiv.innerHTML = `
        <div style="text-align: center; margin: 15px 0;">
            <h3>${item.name}</h3>
            <p style="color: #ffd700; font-size: 1.3em;">?뺢?: ${item.price}G</p>
            <p style="color: rgba(245, 230, 211, 0.8); font-size: 0.9em; margin-top: 10px;">${item.desc}</p>
        </div>
    `;

    // ?낅젰李?珥덇린??    const inputArea = document.getElementById('negotiation-input');
    inputArea.value = '';
    document.getElementById('char-count').textContent = '0';

    // 臾몄옄 移댁슫???대깽??    inputArea.oninput = () => {
        document.getElementById('char-count').textContent = inputArea.value.length;
    };

    // ?뚰듃 ?쒖떆 (?ㅽ뙣 ?잛닔???곕씪)
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

// ?덈줈???묒긽 ?쒖텧 ?⑥닔 (?ㅼ썙??湲곕컲)
function submitNegotiation() {
    const itemNum = gameState.currentNegotiatingItem;
    if (!itemNum) return;

    const item = shopItems[itemNum];
    const userInput = document.getElementById('negotiation-input').value.trim();
    const isSelling = gameState.isSelling || false;

    if (!userInput) {
        addNPCMessage("...留먯쓣 ?댁빞 ?묒긽???섏? ?딄쿋??");
        return;
    }

    // ?먮ℓ 紐⑤뱶?????몃깽?좊━ ?뺤씤
    if (isSelling && (!gameState.inventory[itemNum] || gameState.inventory[itemNum] === 0)) {
        addNPCMessage("洹멸구 媛吏怨??덉????딆옏?? ?ш린 移섎젮怨?");
        closeNegotiation();
        return;
    }

    // ?ㅼ썙??遺꾩꽍 (Advanced Negotiation Engine ?ъ슜)
    const analysis = negotiationEngine.analyze(userInput, item, gameState);
    gameState.negotiationAttempts++;

    // ?ъ슜??硫붿떆吏 ?쒖떆
    addUserMessage(userInput);
    closeNegotiation();

    setTimeout(() => {
        if (analysis.success) {
            // ?깃났!
            gameState.negotiationSuccesses++;
            gameState.negotiationFailures = 0;

            if (isSelling) {
                // ===== ?먮ℓ 紐⑤뱶 =====
                const basePrice = Math.floor(item.price * (gameState.baseSellPrice + gameState.sellPriceBonus / 100));
                const bonusPercent = Math.floor(10 + analysis.persuasionScore * 20);
                const finalPrice = Math.floor(basePrice * (1 + bonusPercent / 100));

                gameState.gold += finalPrice;
                gameState.inventory[itemNum]--;
                if (gameState.inventory[itemNum] === 0) {
                    delete gameState.inventory[itemNum];
                }
                gameState.totalSells++;

                // === ?됲뙋 ?띾뱷 ===
                const profit = finalPrice - basePrice;
                const repGain = gainReputation('sell', profit, true);

                updateStats();
                renderShopItems();
                updateSaynoEmotion(gameState.negotiationSuccesses > 5 ? 'pleased' : 'neutral');

                // 諛섎났 寃쎄퀬 硫붿떆吏 ?곗꽑 ?쒖떆
                if (analysis.repetitionCheck && analysis.repetitionCheck.isRepetition) {
                    addNPCMessage(analysis.repetitionCheck.message);
                    setTimeout(() => {
                        addNPCMessage(`洹몃옒??${finalPrice}G???ъ＜吏. (+${bonusPercent}% 蹂대꼫?? +${repGain} ?됲뙋)`);
                    }, 1000);
                } else {
                    const npcResponse = `${negotiationEngine.generateResponse(analysis, item)} ${finalPrice}G???ъ＜吏. (+${bonusPercent}% 蹂대꼫?? +${repGain} ?됲뙋)`;
                    addNPCMessage(npcResponse);
                }

                // ?덉뒪?좊━??異붽?
                const matchedKeywords = analysis.keywordAnalysis.matchedKeywords.map(k => k.keyword);
                addToNegotiationHistory(userInput, matchedKeywords, true);

                telemetry.logNegotiation({
                    userInput,
                    npcResponse: "?먮ℓ ?깃났",
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
                // ===== 援щℓ 紐⑤뱶 =====
                if (gameState.gold < analysis.finalPrice) {
                    updateSaynoEmotion('angry');
                    const response = `${negotiationEngine.generateResponse(analysis, item).split('.')[0]}. 洹쇰뜲 ?덉씠 紐⑥옄?쇱옏?? ${analysis.finalPrice}G 媛?몄?.`;
                    addNPCMessage(response);

                    // ?덉뒪?좊━??異붽? (?ㅽ뙣)
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

                // === ?됲뙋 ?띾뱷 ===
                const discount = item.price - analysis.finalPrice;
                const repGain = gainReputation('buy', discount, true);

                updateStats();
                renderShopItems();
                updateSaynoEmotion(gameState.negotiationSuccesses > 5 ? 'pleased' : 'neutral');

                // 諛섎났 寃쎄퀬 硫붿떆吏 ?곗꽑 ?쒖떆
                if (analysis.repetitionCheck && analysis.repetitionCheck.isRepetition) {
                    addNPCMessage(analysis.repetitionCheck.message);
                    setTimeout(() => {
                        addNPCMessage(`洹몃옒??${analysis.finalPrice}G???섍린吏. (${analysis.discountPercent}% ?좎씤, +${repGain} ?됲뙋)`);
                    }, 1000);
                } else {
                    const npcResponse = `${negotiationEngine.generateResponse(analysis, item)} (+${repGain} ?됲뙋)`;
                    addNPCMessage(npcResponse);
                }

                // ?덉뒪?좊━??異붽?
                const matchedKeywords = analysis.keywordAnalysis.matchedKeywords.map(k => k.keyword);
                addToNegotiationHistory(userInput, matchedKeywords, true);

                telemetry.logNegotiation({
                    userInput,
                    npcResponse: "援щℓ ?깃났",
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
            // ?ㅽ뙣
            gameState.negotiationFailures++;
            updateSaynoEmotion('angry');

            const npcResponse = negotiationEngine.generateResponse(analysis, item);
            addNPCMessage(npcResponse);

            // ?붾젅硫뷀듃由?濡쒓퉭
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

            // ?ㅼ쓬 ?묒긽 ???뚰듃 ?쒓났
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

// ?뺢? 援щℓ (紐⑤떖?먯꽌)
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
        addNPCMessage(`?덈룄 ?놁쑝硫댁꽌 臾댁뒯 援щℓ? ${item.price}G 媛?몄?.`);
        return;
    }

    gameState.gold -= item.price;
    gameState.inventory[itemNum] = (gameState.inventory[itemNum] || 0) + 1;
    gameState.totalBuys++;

    updateStats();
    renderShopItems();
    closeNegotiation();

    updateSaynoEmotion('neutral');
    addNPCMessage(`${item.name}, ${item.price}G?? ?뺢?濡??щ땲 ??留??놁??`);

    // Check level up
    checkGoalAchievement(); // Assuming checkLevelUp is actually checkGoalAchievement
}

function sellItem(itemNum) {
    const item = shopItems[itemNum];
    if (!item || !gameState.inventory[itemNum] || gameState.inventory[itemNum] === 0) {
        return "洹멸구 媛吏怨??덉????딆옏??";
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
    return `${item.name}? ${sellPrice}G???ъ＜吏. ?섏걯吏 ?딆? 嫄곕옒??`;
}

function findItemNumber(message) {
    for (const num of Object.keys(shopItems)) {
        if (message.includes(num + '踰?) || message.includes(num)) {
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
        addNPCMessage("?럦 " + message);

        if (gameState.goalLevel === 'beginner') {
            gameState.goalLevel = 'intermediate';
            setTimeout(() => {
                addNPCMessage("?ㅼ쓬 紐⑺몴: " + goals.intermediate.title + " (" + goals.intermediate.gold + "G)");
            }, 1000);
        } else if (gameState.goalLevel === 'intermediate') {
            gameState.goalLevel = 'legendary_sword';
            setTimeout(() => {
                addNPCMessage("理쒖쥌 紐⑺몴源뚯? ?붽뎔. ?댁젣... ?꾩꽕??寃??500G???붿븘二쇱?!");
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
        <div class="message-sender">?몄씠??/div>
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
            <div class="item-name">${item.name}${item.special ? ' 狩? : ''}</div>
            <div class="item-price">${item.price}G</div>
            <div class="item-desc">${item.desc}</div>
            <div class="item-actions">
                <button class="buy-btn" onclick="showNegotiationModal('${num}')">援щℓ</button>
                <button class="sell-btn" onclick="showSellNegotiationModal('${num}')" ${!hasItem ? 'disabled' : ''}>?먮ℓ</button>
            </div>
        `;
        shopGrid.appendChild(itemDiv);
    }
}

function renderInventory() {
    inventoryGrid.innerHTML = '';
    if (Object.keys(gameState.inventory).length === 0 || Object.values(gameState.inventory).every(count => count === 0)) {
        inventoryGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; opacity: 0.7;">?몃깽?좊━媛 鍮꾩뼱?덉뒿?덈떎</p>';
    } else {
        for (const [num, count] of Object.entries(gameState.inventory)) {
            if (count > 0) {
                const item = shopItems[num];
                const sellPrice = Math.floor(item.price * gameState.baseSellPrice);
                const itemDiv = document.createElement('div');
                itemDiv.className = 'inventory-item';
                itemDiv.innerHTML = `
                    <div class="item-name">${item.name}${item.special ? ' 狩? : ''}</div>
                    <div class="item-count">蹂댁쑀: ${count}媛?/div>
                    <div class="item-price">?먮ℓ媛: ${sellPrice}G</div>
                    <div class="item-actions">
                        <button class="sell-btn" onclick="showSellNegotiationModal('${num}')">?먮ℓ</button>
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
