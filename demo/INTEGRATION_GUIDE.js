/**
 * Integration Guide for Advanced Negotiation & Telemetry
 * 
 * This file provides integration instructions for the new systems.
 * Copy and paste the functions below into script.js to replace existing ones.
 */

// ============================================
// REPLACE submitNegotiation() in script.js
// ============================================

function submitNegotiation() {
    const itemNum = gameState.currentNegotiatingItem;
    if (!itemNum) return;

    const item = shopItems[itemNum];
    const userInput = document.getElementById('negotiation-input').value.trim();

    if (!userInput) {
        addNPCMessage("...말을 해야 협상이 되지 않겠나?");
        return;
    }

    // Use Advanced Negotiation Engine
    const analysis = negotiationEngine.analyze(userInput, item, gameState);
    gameState.negotiationAttempts++;

    // 사용자 메시지 표시
    addUserMessage(userInput);
    closeNegotiation();

    setTimeout(() => {
        if (analysis.success) {
            // 성공!
            gameState.negotiationSuccesses++;
            gameState.negotiationFailures = 0;

            if (gameState.gold < analysis.finalPrice) {
                updateSaynoEmotion('angry');
                const response = `${negotiationEngine.generateResponse(analysis, item).split('.')[0]}. 근데 돈이 모자라잖아! ${analysis.finalPrice}G 가져와.`;
                addNPCMessage(response);

                // Log failed purchase (insufficient funds)
                telemetry.logNegotiation({
                    userInput,
                    npcResponse: response,
                    itemId: itemNum,
                    itemName: item.name,
                    originalPrice: item.price,
                    finalPrice: analysis.finalPrice,
                    discountPercent: analysis.discountPercent,
                    persuasionScore: analysis.persuasionScore,
                    matchedKeywords: analysis.keywordAnalysis.matchedKeywords.map(k => k.keyword),
                    matchedCategories: analysis.keywordAnalysis.matchedCategories,
                    success: false,
                    attemptNumber: gameState.negotiationAttempts
                });

                return;
            }

            gameState.gold -= analysis.finalPrice;
            gameState.inventory[itemNum] = (gameState.inventory[itemNum] || 0) + 1;
            gameState.totalBuys++;

            updateStats();
            renderShopItems();
            updateSaynoEmotion(gameState.negotiationSuccesses > 5 ? 'pleased' : 'neutral');

            const npcResponse = negotiationEngine.generateResponse(analysis, item);
            addNPCMessage(npcResponse);

            // Log successful negotiation
            telemetry.logNegotiation({
                userInput,
                npcResponse,
                itemId: itemNum,
                itemName: item.name,
                originalPrice: item.price,
                finalPrice: analysis.finalPrice,
                discountPercent: analysis.discountPercent,
                persuasionScore: analysis.persuasionScore,
                matchedKeywords: analysis.keywordAnalysis.matchedKeywords.map(k => k.keyword),
                matchedCategories: analysis.keywordAnalysis.matchedCategories,
                success: true,
                attemptNumber: gameState.negotiationAttempts
            });

            checkGoalAchievement();
        } else {
            // 실패
            gameState.negotiationFailures++;
            updateSaynoEmotion('angry');

            const npcResponse = negotiationEngine.generateResponse(analysis, item);
            addNPCMessage(npcResponse);

            // Log failed negotiation
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
                attemptNumber: gameState.negotiationAttempts
            });

            // 다음 협상 시 힌트 제공
            const nextHint = negotiationEngine.getHint(gameState.negotiationFailures);
            if (nextHint) {
                setTimeout(() => {
                    addNPCMessage(nextHint);
                }, 1500);
            }
        }
    }, 800);
}

// ============================================
// ADD to buyDirectly() function
// ============================================

// Add this telemetry call inside buyDirectly() after successful purchase:
/*
telemetry.logPurchase({
    itemId: itemNum,
    itemName: item.name,
    price: item.price
});
*/

// ============================================
// USAGE EXAMPLES
// ============================================

// View telemetry stats in console:
// console.log(telemetry.getStats());

// Download training data:
// telemetry.downloadLogs('sayno_training_data.jsonl');

// Switch to API logger (when backend is ready):
// telemetry.setLogger(new APILogger('https://your-api.com/training-data', 'your-api-key'));

// Export JSONL for manual upload:
// const jsonl = telemetry.exportJSONL();
// console.log(jsonl);
