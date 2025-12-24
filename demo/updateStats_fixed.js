function updateStats() {
    // 골드 업데이트
    const goldEl = document.getElementById('gold');
    if (goldEl) {
        goldEl.textContent = gameState.gold;
    }

    // 아이템 수 업데이트
    const itemCountEl = document.getElementById('item-count');
    if (itemCountEl) {
        const itemCount = Object.values(gameState.inventory).reduce((sum, count) => sum + count, 0);
        itemCountEl.textContent = itemCount;
    }

    // 평판 정보 표시 (목표 영역에)
    const repInfo = getReputationInfo();
    const goalTitleEl = document.getElementById('goal-title');
    const goalTextEl = document.getElementById('goal-text');

    if (goalTitleEl) {
        goalTitleEl.textContent = `${repInfo.name} (Lv.${repInfo.level})`;
    }

    if (goalTextEl) {
        if (repInfo.isMaxLevel) {
            goalTextEl.textContent = `평판: ${repInfo.current} (최대 레벨)`;
        } else {
            goalTextEl.textContent = `평판: ${repInfo.current}/${repInfo.required} (${repInfo.progress}%)`;
        }
    }

    // 진행도 바 업데이트
    const goalProgressEl = document.getElementById('goal-progress');
    if (goalProgressEl && !repInfo.isMaxLevel) {
        goalProgressEl.style.width = repInfo.progress + '%';
    } else if (goalProgressEl) {
        goalProgressEl.style.width = '100%';
    }
}
