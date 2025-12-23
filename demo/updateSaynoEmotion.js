function updateSaynoEmotion(emotion) {
    gameState.saynoEmotion = emotion;
    const emotionData = saynoEmotions[emotion];

    // Update character visual with actual image
    saynoCharacter.innerHTML = `
        <div class="character-image ${emotionData.class}">
            <img src="${emotionData.image}" alt="Sayno ${emotion}" class="character-img" 
                 onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
            <div class="character-emoji" style="display:none;">${emotionData.emoji}</div>
        </div>
    `;

    // Add emotion class to body for background effects
    document.body.className = `emotion-${emotion}`;
}
