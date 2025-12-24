/**
 * 협상 히스토리 & 반복 방지 시스템
 * (Anti-Repetition / NPC Memory)
 * 
 * 문제: 플레이어가 동일한 성공 문구를 복사-붙여넣기로 반복 사용
 * 해결: 협상 히스토리 추적 및 반복 사용 시 페널티
 */

/**
 * 텍스트 해시 생성 (간단한 해시 함수)
 */
function simpleHash(text) {
    let hash = 0;
    const normalized = text.toLowerCase().trim();
    for (let i = 0; i < normalized.length; i++) {
        const char = normalized.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash.toString(36);
}

/**
 * 텍스트 유사도 계산 (간단한 Jaccard 유사도)
 */
function calculateSimilarity(text1, text2) {
    const words1 = new Set(text1.toLowerCase().split(/\s+/));
    const words2 = new Set(text2.toLowerCase().split(/\s+/));

    const intersection = new Set([...words1].filter(x => words2.has(x)));
    const union = new Set([...words1, ...words2]);

    return intersection.size / union.size;
}

/**
 * 협상 히스토리에 추가
 */
function addToNegotiationHistory(userInput, keywords, success) {
    const entry = {
        timestamp: Date.now(),
        text: userInput,
        textHash: simpleHash(userInput),
        keywords: keywords,
        success: success
    };

    gameState.negotiationHistory.push(entry);

    // 히스토리 크기 제한 (최근 20개만 유지)
    if (gameState.negotiationHistory.length > 20) {
        gameState.negotiationHistory.shift();
    }
}

/**
 * 반복 체크 및 페널티 계산
 * @returns {Object} { isRepetition, penalty, message }
 */
function checkRepetition(userInput, keywords) {
    if (gameState.negotiationHistory.length === 0) {
        return { isRepetition: false, penalty: 1.0, message: null };
    }

    const currentHash = simpleHash(userInput);

    // 1. 완전 동일 또는 매우 유사한 텍스트 체크
    for (const entry of gameState.negotiationHistory) {
        // 해시 일치 (완전 동일)
        if (entry.textHash === currentHash) {
            return {
                isRepetition: true,
                penalty: 0.0, // 점수 0
                message: "그거 아까 들었다. 앵무새냐? 새로운 근거를 대거나 꺼져라.",
                type: 'exact'
            };
        }

        // 높은 유사도 (80% 이상)
        const similarity = calculateSimilarity(userInput, entry.text);
        if (similarity > 0.8) {
            return {
                isRepetition: true,
                penalty: 0.2, // 점수 80% 감소
                message: "또 비슷한 소리 하는군. 창의성이 없어. 다른 말 해봐라.",
                type: 'similar'
            };
        }
    }

    // 2. 키워드 재사용 체크
    const usedKeywords = new Set();
    gameState.negotiationHistory.forEach(entry => {
        entry.keywords.forEach(kw => usedKeywords.add(kw));
    });

    const reusedKeywords = keywords.filter(kw => usedKeywords.has(kw));

    if (reusedKeywords.length > 0 && reusedKeywords.length === keywords.length) {
        // 모든 키워드가 재사용
        return {
            isRepetition: true,
            penalty: 0.5, // 점수 50% 감소
            message: "그 키워드들 계속 우려먹는군. 좀 더 다양하게 생각해봐라.",
            type: 'keyword_reuse'
        };
    } else if (reusedKeywords.length > keywords.length * 0.6) {
        // 60% 이상 키워드 재사용
        return {
            isRepetition: true,
            penalty: 0.7, // 점수 30% 감소
            message: "그 말 또 하네. 식상하군.",
            type: 'partial_reuse'
        };
    }

    return { isRepetition: false, penalty: 1.0, message: null };
}

/**
 * 히스토리 초기화 (새 세션 시작 시)
 */
function clearNegotiationHistory() {
    gameState.negotiationHistory = [];
}

/**
 * 히스토리 통계
 */
function getHistoryStats() {
    const total = gameState.negotiationHistory.length;
    const successful = gameState.negotiationHistory.filter(h => h.success).length;
    const uniqueKeywords = new Set();

    gameState.negotiationHistory.forEach(entry => {
        entry.keywords.forEach(kw => uniqueKeywords.add(kw));
    });

    return {
        total,
        successful,
        failureRate: total > 0 ? ((total - successful) / total * 100).toFixed(1) : 0,
        uniqueKeywordsUsed: uniqueKeywords.size
    };
}
