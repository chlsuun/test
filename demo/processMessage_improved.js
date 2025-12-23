function processMessage(message) {
    gameState.conversationCount++;
    const lowerMsg = message.toLowerCase();
    const cleanMsg = message.replace(/\s/g, '').toLowerCase();

    // 목록 보기 - 확장된 키워드
    if (lowerMsg.includes('목록') || lowerMsg.includes('리스트') || lowerMsg.includes('상품') ||
        lowerMsg.includes('뭐') || lowerMsg.includes('팔') && lowerMsg.includes('뭐') ||
        lowerMsg.includes('물건') || lowerMsg.includes('아이템')) {
        showShopList();
        updateSaynoEmotion('neutral');
        return "물건들이다. '할인 요청'을 눌러서 입씨름해봐. 쉽진 않을 거야.";
    }

    // 인벤토리 - 확장
    if (lowerMsg.includes('인벤토리') || lowerMsg.includes('가방') || lowerMsg.includes('소지품') ||
        lowerMsg.includes('내꺼') || lowerMsg.includes('내것') || lowerMsg.includes('샀')) {
        showInventory();
        return "네 소지품이다. 팔 거 있으면 팔아.";
    }

    // 목표 확인 - 확장
    if (lowerMsg.includes('목표') || lowerMsg.includes('얼마') && (lowerMsg.includes('모') || lowerMsg.includes('필요')) ||
        lowerMsg.includes('어디까지') || lowerMsg.includes('진행')) {
        const currentGoal = goals[gameState.goalLevel];
        const remaining = currentGoal.gold - gameState.gold;
        return `현재 목표: ${currentGoal.title} (${currentGoal.gold}G). 지금 ${gameState.gold}G 가지고 있고, ${remaining}G 더 필요해.`;
    }

    // 전설의 검 관련 - 확장
    if (lowerMsg.includes('전설') || cleanMsg.includes('전설의검') || lowerMsg.includes('명검')) {
        if (gameState.goalLevel !== 'legendary_sword') {
            updateSaynoEmotion('neutral');
            return "전설의 검? 허, 그건 아무나 못 사. 먼저 실력부터 증명해봐.";
        } else {
            return "이제 자격이 있군. 전설의 검, 500G에 가져가.";
        }
    }

    // 소지금 확인 - 확장
    if ((lowerMsg.includes('소지금') || lowerMsg.includes('내돈') || lowerMsg.includes('얼마') && lowerMsg.includes('있')) &&
        !lowerMsg.includes('목표')) {
        return `${gameState.gold}G 있다. 목표까지 ${goals[gameState.goalLevel].gold - gameState.gold}G 남았어.`;
    }

    // 도움말/가이드
    if (lowerMsg.includes('도움') || lowerMsg.includes('어떻게') || lowerMsg.includes('방법') ||
        lowerMsg.includes('하는법') || lowerMsg.includes('가이드') || lowerMsg.includes('튜토리얼')) {
        return "간단하다. 1) 목록 보기 2) 할인 요청으로 싸게 사기 3) 비싸게 팔기 4) 돈 모으기. 이게 전부야.";
    }

    // 나쁜말/욕 - 확장
    if (lowerMsg.includes('짜증') || lowerMsg.includes('싫어') || lowerMsg.includes('나빠') ||
        lowerMsg.includes('못생') || lowerMsg.includes('별로') || lowerMsg.includes('이상해') ||
        lowerMsg.includes('바보') || lowerMsg.includes('멍청')) {
        updateSaynoEmotion('angry');
        return "무례한 놈. 썩 꺼져. 내 가게에서 못된 말 하지 마.";
    }

    // 칭찬 - 확장
    if (lowerMsg.includes('멋져') || lowerMsg.includes('대단') || lowerMsg.includes('존경') ||
        lowerMsg.includes('훌륭') || lowerMsg.includes('최고') || lowerMsg.includes('좋아') ||
        lowerMsg.includes('잘생') || lowerMsg.includes('짱')) {
        updateSaynoEmotion('neutral');
        return "나한테 아부는 소용없어. 장사는 실력이지, 입발림이 아니야.";
    }

    // 감사 인사
    if (lowerMsg.includes('감사') || lowerMsg.includes('고마') || lowerMsg.includes('thanks')) {
        updateSaynoEmotion('neutral');
        return "감사는 돈이 안 돼. 다음엔 더 벌어와.";
    }

    // 날씨 대화 - 확장
    if (lowerMsg.includes('날씨') || lowerMsg.includes('weather') || lowerMsg.includes('비') ||
        lowerMsg.includes('눈') || lowerMsg.includes('덥') || lowerMsg.includes('추워')) {
        updateSaynoEmotion('neutral');
        return getRandomFrom(mockResponses.smallTalk.weather);
    }

    // 인생 조언 - 확장
    if (lowerMsg.includes('조언') || lowerMsg.includes('가르침') || lowerMsg.includes('인생') ||
        lowerMsg.includes('지혜') || lowerMsg.includes('비결') || lowerMsg.includes('비법') ||
        lowerMsg.includes('성공') || lowerMsg.includes('부자')) {
        updateSaynoEmotion('pleased');
        return getRandomFrom(mockResponses.smallTalk.wisdom);
    }

    // 장사 얘기 - 확장
    if (lowerMsg.includes('장사') || lowerMsg.includes('사업') || lowerMsg.includes('돈버') ||
        lowerMsg.includes('장사꾼') || lowerMsg.includes('상인')) {
        updateSaynoEmotion('neutral');
        return getRandomFrom(mockResponses.smallTalk.business);
    }

    // 판매 - 확장
    if (lowerMsg.includes('판매') || lowerMsg.includes('팔게') || lowerMsg.includes('팔아') ||
        (lowerMsg.includes('팔') && !lowerMsg.includes('팔아야')) || lowerMsg.includes('사줘')) {
        const itemNum = findItemNumber(message);
        if (itemNum && gameState.inventory[itemNum]) {
            return sellItem(itemNum);
        }

        // 아이템 이름으로 찾기
        for (const [num, item] of Object.entries(shopItems)) {
            if (cleanMsg.includes(item.name.replace(/\s/g, '').toLowerCase()) ||
                item.keywords.some(kw => cleanMsg.includes(kw))) {
                if (gameState.inventory[num] && gameState.inventory[num] > 0) {
                    return sellItem(num);
                } else {
                    return "그걸 가지고 있지도 않잖아.";
                }
            }
        }
        return "뭘 팔겠다는 거야? 명확하게 말해.";
    }

    // 구매 - 확장 (processMessage에는 이미 있지만 개선)
    const purchaseKeywords = ['구매', '살게', '사고', '주세요', '줘', '사', 'buy', '구입', '살래'];
    const isPurchase = purchaseKeywords.some(kw => lowerMsg.includes(kw));

    if (isPurchase) {
        // 아이템 번호로 찾기
        const itemNum = findItemNumber(message);
        if (itemNum) {
            updateSaynoEmotion('neutral');
            return `${shopItems[itemNum].name}? 할인 받고 싶으면 '할인 요청' 버튼 눌러.`;
        }

        // 아이템 이름으로 찾기
        for (const [num, item] of Object.entries(shopItems)) {
            if (cleanMsg.includes(item.name.replace(/\s/g, '').toLowerCase()) ||
                item.keywords.some(kw => cleanMsg.includes(kw))) {
                updateSaynoEmotion('neutral');
                return `${item.name}? 좋아. 목록에서 '할인 요청' 눌러봐.`;
            }
        }
        return "무엇을 사겠다는 거야? '목록' 쳐서 보고 정확히 말해.";
    }

    // 가격 문의 - 확장  
    if (lowerMsg.includes('가격') || lowerMsg.includes('얼마') || lowerMsg.includes('price')) {
        for (const [num, item] of Object.entries(shopItems)) {
            if (cleanMsg.includes(item.name.replace(/\s/g, '').toLowerCase()) ||
                item.keywords.some(kw => cleanMsg.includes(kw))) {
                const sellPrice = Math.floor(item.price * 0.7);
                return `${item.name}? 구매는 ${item.price}G, 판매는 ${sellPrice}G에 받아준다.`;
            }
        }
        return "'목록' 쳐서 직접 봐. 다 적혀 있어.";
    }

    // 작별 인사 - 확장
    if (lowerMsg.includes('안녕') && (lowerMsg.includes('잘') || lowerMsg.includes('가')) ||
        lowerMsg.includes('bye') || lowerMsg.includes('나가') || lowerMsg.includes('그만')) {
        updateSaynoEmotion('neutral');
        return getRandomFrom(mockResponses.goodbye);
    }

    // 인사 - 확장
    if (lowerMsg.includes('안녕') || lowerMsg.includes('hello') || lowerMsg.includes('hi') ||
        lowerMsg.includes('하이') || lowerMsg.includes('처음뵙') || lowerMsg.includes('반가')) {
        const emotion = gameState.totalBuys > 3 ? 'pleased' : 'neutral';
        updateSaynoEmotion(emotion);
        return getRandomFrom(mockResponses.greeting[emotion]);
    }

    // 자기소개
    if (lowerMsg.includes('누구') || lowerMsg.includes('이름') || lowerMsg.includes('who')) {
        updateSaynoEmotion('neutral');
        return "나? 세이노다. 이 상점 주인이지. 쓸데없는 질문 말고 장사나 해.";
    }

    // 기본 응답 - 좀 더 다양하게
    updateSaynoEmotion('neutral');
    const defaultResponses = [
        "...무슨 말이야? 명확하게 얘기해.",
        "이해가 안 되는데. 다시 말해봐.",
        "용건만 간단히.",
        "'목록', '인벤토리', '조언' 같은 말을 해봐.",
        "장사할 거야 말 거야? 확실히 해."
    ];
    return getRandomFrom(defaultResponses);
}
