/**
 * 평판 시스템 (Reputation System)
 * 
 * 골드 기반 레벨업 문제 해결:
 * - 기존: 2000G 보유 시 레벨업 → 전설의 검 즉시 구매 가능 → 증강 시스템 무용지물
 * - 개선: 거래 횟수 기반 평판 시스템 → 증강 시스템 경험 강제
 */

// 평판 레벨 설정
const ReputationLevels = {
    1: { name: '초보 상인', requiredRep: 0, description: '이제 막 시작한 상인' },
    2: { name: '견습 상인', requiredRep: 100, description: '거래의 기본을 익혔다' },
    3: { name: '숙련 상인', requiredRep: 300, description: '협상의 달인이 되어간다' },
    4: { name: '전설의 상인', requiredRep: 600, description: '세이노도 인정하는 실력' }
};

/**
 * 평판 획득 (거래 완료 시)
 * @param {string} type - 'buy' or 'sell'
 * @param {number} profit - 이익 금액 (할인받은 금액 or 보너스 금액)
 * @param {boolean} negotiated - 협상 성공 여부
 */
function gainReputation(type, profit, negotiated) {
    let repGain = 0;

    // 기본 평판
    if (type === 'buy') {
        repGain = 10; // 구매 시 10 평판
    } else if (type === 'sell') {
        repGain = 15; // 판매 시 15 평판 (더 어려움)
    }

    // 협상 성공 보너스
    if (negotiated) {
        repGain += 10; // 협상 성공 시 +10
    }

    // 이익 보너스 (높은 마진일수록 더 많은 평판)
    const profitBonus = Math.floor(profit / 10);
    repGain += profitBonus;

    // 평판 적용
    gameState.reputation += repGain;

    // 레벨업 체크
    checkReputationLevelUp();

    return repGain;
}

/**
 * 평판 레벨업 체크
 */
function checkReputationLevelUp() {
    const currentLevel = gameState.reputationLevel;
    const nextLevel = currentLevel + 1;

    if (!ReputationLevels[nextLevel]) {
        return; // 최대 레벨
    }

    const required = ReputationLevels[nextLevel].requiredRep;

    if (gameState.reputation >= required && !gameState.leveledUp) {
        gameState.leveledUp = true;
        gameState.reputationLevel = nextLevel;

        updateSaynoEmotion('pleased');

        const levelInfo = ReputationLevels[nextLevel];
        addNPCMessage(`🎉 평판 레벨업! 이제 네가 ${levelInfo.name}이(가) 되었군. ${levelInfo.description}`);

        // 증강 선택
        setTimeout(() => {
            showAugmentationModal(`${levelInfo.name} 달성!`);
            gameState.leveledUp = false;

            // 목표 레벨 업데이트 (기존 시스템 호환)
            if (nextLevel === 2) {
                gameState.goalLevel = 'intermediate';
            } else if (nextLevel === 3) {
                gameState.goalLevel = 'legendary_sword';
            }

            updateStats();
        }, 1500);

        updateStats();
    }
}

/**
 * 평판 정보 가져오기
 */
function getReputationInfo() {
    const current = gameState.reputationLevel;
    const next = current + 1;

    const currentInfo = ReputationLevels[current];
    const nextInfo = ReputationLevels[next];

    if (!nextInfo) {
        return {
            level: current,
            name: currentInfo.name,
            current: gameState.reputation,
            isMaxLevel: true
        };
    }

    return {
        level: current,
        name: currentInfo.name,
        current: gameState.reputation,
        required: nextInfo.requiredRep,
        progress: ((gameState.reputation / nextInfo.requiredRep) * 100).toFixed(1),
        nextName: nextInfo.name,
        isMaxLevel: false
    };
}
