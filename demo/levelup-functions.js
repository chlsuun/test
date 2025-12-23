function checkGoalAchievement() {
    const currentGoal = goals[gameState.goalLevel];

    if (gameState.gold >= currentGoal.gold && !gameState.leveledUp) {
        gameState.leveledUp = true;
        updateSaynoEmotion('pleased');
        const message = mockResponses.goalAchieved[gameState.goalLevel];
        addNPCMessage("🎉 " + message);

        if (gameState.goalLevel === 'beginner') {
            // 레벨업! 증강 선택
            setTimeout(() => {
                showAugmentationModal('견습 상인 달성!');
                gameState.goalLevel = 'intermediate';
                gameState.leveledUp = false;
                updateStats();
            }, 1500);
        } else if (gameState.goalLevel === 'intermediate') {
            setTimeout(() => {
                showAugmentationModal('숙련 상인 달성!');
                gameState.goalLevel = 'legendary_sword';
                gameState.leveledUp = false;
                updateStats();
            }, 1500);
        }

        updateStats();
    }
}

// 증강 모달 표시
function showAugmentationModal(message) {
    const modal = document.getElementById('augmentation-modal');
    const messageEl = document.getElementById('level-up-message');
    const choicesEl = document.getElementById('augmentation-choices');

    messageEl.textContent = message;

    const augs = getRandomAugmentations();
    choicesEl.innerHTML = '';

    augs.forEach(aug => {
        const card = document.createElement('div');
        card.className = `aug-card ${aug.category}`;
        if (aug.good !== undefined) {
            card.classList.add(aug.good ? 'good' : 'bad');
        }

        const icons = {
            personality: '😊',
            gold: '💰',
            trading: '📈',
            random: '🎲'
        };

        card.innerHTML = `
            <div class="aug-icon">${icons[aug.category]}</div>
            <div class="aug-name">${aug.name}</div>
            <div class="aug-desc">${aug.desc}</div>
            <div class="aug-category">${aug.category}</div>
        `;

        card.onclick = () => selectAugmentation(aug);
        choicesEl.appendChild(card);
    });

    modal.style.display = 'flex';
}

function selectAugmentation(aug) {
    applyAugmentation(aug);
    document.getElementById('augmentation-modal').style.display = 'none';

    addNPCMessage(`증강 선택: ${aug.name} - ${aug.desc}`);
    updateStats();
}
