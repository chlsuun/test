// 증강 시스템 데이터
const augmentations = {
    personality: [
        {
            id: 'kind',
            name: '세이노의 친절함',
            icon: '😊',
            desc: '협상 성공률 +5%',
            detailedDesc: '세이노가 조금 부드러워진다. 모든 협상 시도의 성공률이 5% 증가한다.',
            effect: { buyNegotiationBonus: 5, sellNegotiationBonus: 5 }
        },
        {
            id: 'generous',
            name: '세이노의 관대함',
            icon: '🤝',
            desc: '판매 기본가 +5%',
            detailedDesc: '세이노가 물건을 더 비싸게 사준다. 판매 기본 가격이 5% 증가한다.',
            effect: { baseSellPrice: 0.05 }
        },
        {
            id: 'respect',
            name: '세이노의 인정',
            icon: '👍',
            desc: '구매 할인 +5%',
            detailedDesc: '세이노가 너를 인정한다. 구매 시 할인율이 5% 증가한다.',
            effect: { buyDiscountBonus: 5 }
        }
    ],
    gold: [
        {
            id: 'emergency',
            name: '긴급 자금',
            icon: '💰',
            desc: '즉시 500G 획득',
            detailedDesc: '세이노가 긴급 자금을 준다. 즉시 500G를 획득한다.',
            effect: { gold: 500 }
        },
        {
            id: 'lucky',
            name: '행운의 동전',
            icon: '🪙',
            desc: '즉시 300G 획득',
            detailedDesc: '행운이 찾아왔다! 즉시 300G를 획득한다.',
            effect: { gold: 300 }
        },
        {
            id: 'gift',
            name: '세이노의 선물',
            icon: '🎁',
            desc: '즉시 800G 획득',
            detailedDesc: '세이노가 특별한 선물을 준다. 즉시 800G를 획득한다.',
            effect: { gold: 800 }
        }
    ],
    trading: [
        {
            id: 'negotiator',
            name: '협상의 달인',
            icon: '🗣️',
            desc: '구매 협상 +10%',
            detailedDesc: '협상 기술이 향상된다. 구매 협상 성공률이 10% 증가한다.',
            effect: { buyNegotiationBonus: 10 }
        },
        {
            id: 'sharp',
            name: '날카로운 혀',
            icon: '💬',
            desc: '구매 할인 +5%',
            detailedDesc: '말빨이 좋아진다. 구매 시 할인율이 5% 증가한다.',
            effect: { buyDiscountBonus: 5 }
        },
        {
            id: 'patience',
            name: '인내심',
            icon: '🧘',
            desc: '협상 실패 패널티 없음',
            detailedDesc: '인내심이 생긴다. 협상 실패 시 패널티를 받지 않는다.',
            effect: { noFailPenalty: true }
        },
        {
            id: 'persuasion',
            name: '설득의 기술',
            icon: '🎯',
            desc: '판매 협상 +10%',
            detailedDesc: '설득력이 향상된다. 판매 협상 성공률이 10% 증가한다.',
            effect: { sellNegotiationBonus: 10 }
        },
        {
            id: 'appraiser',
            name: '가치 평가',
            icon: '💎',
            desc: '판매 가격 +5%',
            detailedDesc: '물건의 가치를 정확히 안다. 판매 가격이 5% 증가한다.',
            effect: { sellPriceBonus: 5 }
        },
        {
            id: 'merchant',
            name: '상인의 눈',
            icon: '👁️',
            desc: '판매 가격 +5%',
            detailedDesc: '상인의 눈을 가진다. 판매 가격이 5% 증가한다.',
            effect: { sellPriceBonus: 5 }
        }
    ],
    random: [
        {
            id: 'jackpot',
            name: '대박!',
            icon: '🎰',
            desc: '1000G 획득!',
            detailedDesc: '대박이 터졌다! 즉시 1000G를 획득한다.',
            effect: { gold: 1000 },
            good: true
        },
        {
            id: 'super',
            name: '초협상가',
            icon: '⭐',
            desc: '모든 협상 +15%',
            detailedDesc: '협상의 신이 되었다! 모든 협상 성공률이 15% 증가한다.',
            effect: { buyNegotiationBonus: 15, sellNegotiationBonus: 15 },
            good: true
        },
        {
            id: 'golden',
            name: '황금 손',
            icon: '✨',
            desc: '모든 거래 +10%',
            detailedDesc: '손에 황금이 묻었다! 모든 거래에서 10% 이득을 본다.',
            effect: { buyDiscountBonus: 10, sellPriceBonus: 10 },
            good: true
        },
        {
            id: 'angry',
            name: '세이노가 화났다',
            icon: '😠',
            desc: '다음 3회 협상 -10%',
            detailedDesc: '세이노가 화를 냈다. 다음 3회 협상의 성공률이 10% 감소한다.',
            effect: { negotiationPenaltyTurns: 3, penalty: -10 },
            good: false
        },
        {
            id: 'unlucky',
            name: '불운',
            icon: '💸',
            desc: '100G 손실',
            detailedDesc: '불운이 찾아왔다. 즉시 100G를 잃는다.',
            effect: { gold: -100 },
            good: false
        },
        {
            id: 'mistake',
            name: '실수',
            icon: '🤦',
            desc: '다음 거래 -5%',
            detailedDesc: '실수를 했다. 다음 거래에서 5% 손해를 본다.',
            effect: { negotiationPenaltyTurns: 1, penalty: -5 },
            good: false
        }
    ]
};

// 증강 선택 (3개 랜덤)
function getRandomAugmentations() {
    const categories = ['personality', 'gold', 'trading', 'random'];
    const weights = [10, 30, 40, 20]; // 확률 가중치

    const selected = [];
    for (let i = 0; i < 3; i++) {
        const category = weightedRandom(categories, weights);
        const pool = augmentations[category];
        const aug = pool[Math.floor(Math.random() * pool.length)];
        selected.push({ ...aug, category });
    }
    return selected;
}

function weightedRandom(items, weights) {
    const total = weights.reduce((sum, w) => sum + w, 0);
    let random = Math.random() * total;

    for (let i = 0; i < items.length; i++) {
        if (random < weights[i]) return items[i];
        random -= weights[i];
    }
    return items[items.length - 1];
}

// 증강 적용
function applyAugmentation(aug) {
    gameState.augmentations.push(aug);

    if (aug.effect.gold) {
        gameState.gold += aug.effect.gold;
    }
    if (aug.effect.buyNegotiationBonus) {
        gameState.buyNegotiationBonus += aug.effect.buyNegotiationBonus;
    }
    if (aug.effect.sellNegotiationBonus) {
        gameState.sellNegotiationBonus += aug.effect.sellNegotiationBonus;
    }
    if (aug.effect.buyDiscountBonus) {
        gameState.buyDiscountBonus += aug.effect.buyDiscountBonus;
    }
    if (aug.effect.sellPriceBonus) {
        gameState.sellPriceBonus += aug.effect.sellPriceBonus;
    }
    if (aug.effect.baseSellPrice) {
        gameState.baseSellPrice += aug.effect.baseSellPrice;
    }
    if (aug.effect.negotiationPenaltyTurns) {
        gameState.negotiationPenaltyTurns = aug.effect.negotiationPenaltyTurns;
        gameState.negotiationPenalty = aug.effect.penalty || 0;
    }
    if (aug.effect.noFailPenalty) {
        gameState.noFailPenalty = true;
    }

    updateStats();
}
