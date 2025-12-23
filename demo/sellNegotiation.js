// 판매 협상 시스템
function showSellNegotiationModal(itemNum) {
    const item = shopItems[itemNum];
    gameState.currentNegotiatingItem = itemNum;
    gameState.isSelling = true;

    const basePrice = Math.floor(item.price * (gameState.baseSellPrice + gameState.sellPriceBonus / 100));

    const infoDiv = document.getElementById('negotiation-item-info');
    infoDiv.innerHTML = `
        <div style="text-align: center; margin: 15px 0;">
            <h3>${item.name} 판매</h3>
            <p style="color: #ffd700; font-size: 1.3em;">기본 판매가: ${basePrice}G</p>
            <p style="font-size: 0.9em; opacity: 0.8;">협상 성공 시 더 비싸게 팔 수 있습니다!</p>
        </div>
    `;

    // 판매 협상 선택지로 변경
    document.querySelector('.persuasion-choices').innerHTML = `
        <button class="choice-btn polite" onclick="negotiateSell('polite')">
            <span class="choice-icon">🙏</span>
            <span class="choice-title">"이거 정말 좋은 물건이에요"</span>
            <span class="choice-desc">예의바르게 (성공률: ${15 + gameState.sellNegotiationBonus}%)</span>
        </button>
        <button class="choice-btn logical" onclick="negotiateSell('logical')">
            <span class="choice-icon">🧠</span>
            <span class="choice-title">"다른 곳에선 더 비싸게 팔던데요"</span>
            <span class="choice-desc">논리적으로 (성공률: ${25 + gameState.sellNegotiationBonus}%)</span>
        </button>
        <button class="choice-btn wisdom" onclick="negotiateSell('wisdom')">
            <span class="choice-icon">📖</span>
            <span class="choice-title">"가치를 아는 분이시잖아요"</span>
            <span class="choice-desc">가르침 인용 (성공률: ${35 + gameState.sellNegotiationBonus}%)</span>
        </button>
    `;

    negotiationModal.style.display = 'flex';
}

function negotiateSell(strategy) {
    const itemNum = gameState.currentNegotiatingItem;
    if (!itemNum) return;

    const item = shopItems[itemNum];

    const strategies = {
        polite: { base: 15, message: "이거 정말 좋은 물건이에요. 제발 좋은 가격에 사주세요..." },
        logical: { base: 25, message: "다른 곳에선 더 비싸게 팔던데요. 이 가격이면 손해 아닙니까?" },
        wisdom: { base: 35, message: "가치를 아는 분이시잖아요. 세이노님이라면 이 물건의 진가를..." }
    };

    const chosen = strategies[strategy];
    const penalty = gameState.negotiationPenaltyTurns > 0 ? gameState.negotiationPenalty : 0;
    const successRate = chosen.base + gameState.sellNegotiationBonus + penalty;
    const success = Math.random() * 100 < successRate;

    addUserMessage(chosen.message);
    closeNegotiation();

    setTimeout(() => {
        if (success) {
            // 성공: 85-95% 가격
            const bonusPercent = 15 + Math.floor(Math.random() * 11); // 15-25%
            const finalPrice = Math.floor(item.price * ((gameState.baseSellPrice + gameState.sellPriceBonus / 100) + bonusPercent / 100));

            gameState.gold += finalPrice;
            gameState.inventory[itemNum]--;
            if (gameState.inventory[itemNum] === 0) {
                delete gameState.inventory[itemNum];
            }
            gameState.totalSells++;

            updateStats();
            renderShopItems();
            checkGoalAchievement();

            updateSaynoEmotion('pleased');
            addNPCMessage(`좋아좋아! ${item.name}, ${finalPrice}G에 사주지. 제법인데? (+${bonusPercent}% 보너스)`);
        } else {
            // 실패: 60% 가격 (패널티)
            const penaltyPrice = Math.floor(item.price * 0.60);

            if (!gameState.noFailPenalty) {
                gameState.gold += penaltyPrice;
                gameState.inventory[itemNum]--;
                if (gameState.inventory[itemNum] === 0) {
                    delete gameState.inventory[itemNum];
                }
                gameState.totalSells++;

                updateStats();
                renderShopItems();

                updateSaynoEmotion('angry');
                addNPCMessage(`협상? 웃기지 마. ${penaltyPrice}G, 이게 끝이야. (패널티 -10%)`);
            } else {
                // 패널티 없음 증강
                const basePrice = Math.floor(item.price * (gameState.baseSellPrice + gameState.sellPriceBonus / 100));
                gameState.gold += basePrice;
                gameState.inventory[itemNum]--;
                if (gameState.inventory[itemNum] === 0) {
                    delete gameState.inventory[itemNum];
                }
                gameState.totalSells++;

                updateStats();
                renderShopItems();

                updateSaynoEmotion('neutral');
                addNPCMessage(`실패했지만... 뭐, ${basePrice}G에 사주지. (패널티 없음 효과!)`);
            }
        }

        // 패널티 턴 감소
        if (gameState.negotiationPenaltyTurns > 0) {
            gameState.negotiationPenaltyTurns--;
        }
    }, 800);
}
