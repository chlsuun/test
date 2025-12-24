/**
 * 판매 협상 시스템 (텍스트 입력 기반)
 * 구매 협상과 동일한 UI를 사용하되, 판매 모드로 작동
 */

function showSellNegotiationModal(itemNum) {
    const item = shopItems[itemNum];

    // 인벤토리 확인
    if (!gameState.inventory[itemNum] || gameState.inventory[itemNum] === 0) {
        addNPCMessage("그걸 가지고 있지도 않잖아. 사기 치려고?");
        return;
    }

    gameState.currentNegotiatingItem = itemNum;
    gameState.isSelling = true; // 판매 모드 설정

    const basePrice = Math.floor(item.price * (gameState.baseSellPrice + gameState.sellPriceBonus / 100));

    const infoDiv = document.getElementById('negotiation-item-info');
    infoDiv.innerHTML = `
        <div style="text-align: center; margin: 15px 0;">
            <h3>💰 ${item.name} 판매</h3>
            <p style="color: #4CAF50; font-size: 1.3em;">기본 판매가: ${basePrice}G</p>
            <p style="color: rgba(245, 230, 211, 0.8); font-size: 0.9em; margin-top: 10px;">
                협상 성공 시 더 비싸게 팔 수 있습니다!
            </p>
        </div>
    `;

    // 입력창 초기화
    const inputArea = document.getElementById('negotiation-input');
    inputArea.value = '';
    inputArea.placeholder = "세이노를 설득하세요... (예: 이 물건은 역사적 가치가 있습니다)";
    document.getElementById('char-count').textContent = '0';

    // 문자 카운터 이벤트
    inputArea.oninput = () => {
        document.getElementById('char-count').textContent = inputArea.value.length;
    };

    // 힌트 표시 (판매용)
    const hint = getSellHint(gameState.negotiationFailures);
    const hintsArea = document.getElementById('negotiation-hints');
    if (hint) {
        document.getElementById('hint-text').textContent = hint;
        hintsArea.style.display = 'block';
    } else {
        hintsArea.style.display = 'none';
    }

    negotiationModal.style.display = 'flex';
}

function getSellHint(failureCount) {
    if (failureCount === 0) {
        return null;
    } else if (failureCount === 1) {
        return "물건의 가치를 설명해봐라.";
    } else if (failureCount === 2) {
        return "왜 이 물건이 비싼지 근거를 대라.";
    } else if (failureCount === 3) {
        return "역사적 가치, 실용성, 희소성을 강조해봐라.";
    } else if (failureCount >= 5) {
        return "본질을 봐라. 이 물건의 진정한 가치가 뭔지 말해봐라.";
    }

    return "계속 실패하는군. 다시 생각해봐.";
}

function closeSellNegotiation() {
    negotiationModal.style.display = 'none';
    gameState.currentNegotiatingItem = null;
    gameState.isSelling = false;
}
