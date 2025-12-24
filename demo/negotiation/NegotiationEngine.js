/**
 * Advanced Negotiation Engine
 * 
 * Orchestrates the entire negotiation process:
 * - Keyword matching
 * - Score calculation
 * - Price modification
 * - Telemetry logging
 */

class NegotiationEngine {
    constructor() {
        this.keywordMatcher = new KeywordMatcher();
    }

    /**
     * Analyze negotiation attempt
     * @param {string} userInput - User's persuasion message
     * @param {Object} item - Item being negotiated
     * @param {Object} gameState - Current game state
     * @returns {Object} Analysis results
     */
    analyze(userInput, item, gameState) {
        // Keyword analysis
        const keywordAnalysis = this.keywordMatcher.analyze(userInput);

        // Calculate success rate
        const baseRate = keywordAnalysis.normalizedScore * 100;
        const bonusRate = gameState.buyNegotiationBonus || 0;
        const penaltyRate = gameState.negotiationPenalty || 0;
        const finalRate = Math.max(5, Math.min(95, baseRate + bonusRate + penaltyRate));

        // Determine success
        const success = Math.random() * 100 < finalRate;

        // Calculate discount
        let discountPercent = 0;
        let finalPrice = item.price;

        if (success) {
            // Discount based on persuasion quality
            const baseDiscount = 10; // Minimum 10%
            const maxDiscount = 30;  // Maximum 30%
            const scoreDiscount = keywordAnalysis.normalizedScore * (maxDiscount - baseDiscount);
            discountPercent = Math.floor(baseDiscount + scoreDiscount);
            finalPrice = Math.floor(item.price * (1 - discountPercent / 100));
        }

        return {
            success,
            persuasionScore: keywordAnalysis.normalizedScore,
            successRate: finalRate,
            discountPercent,
            finalPrice,
            originalPrice: item.price,
            keywordAnalysis,
            feedback: this.keywordMatcher.getFeedback(keywordAnalysis)
        };
    }

    /**
     * Generate NPC response based on analysis
     */
    generateResponse(analysis, item) {
        if (analysis.success) {
            const responses = [
                `...제법이군. 네 말에 일리가 있어.`,
                `흠. 설득력이 있군.`,
                `좋아, 인정한다.`,
                `그 정도 말빨이면 할인해주지.`
            ];

            // Add specific feedback for high scores
            if (analysis.persuasionScore > 0.7) {
                responses.push(`대단한데? 네가 진짜 상인 소질이 있군.`);
            }

            const response = responses[Math.floor(Math.random() * responses.length)];
            return `${response} ${analysis.finalPrice}G에 넘기지. (${analysis.discountPercent}% 할인)`;
        } else {
            const responses = [
                `그 정도론 안 돼.`,
                `협상을 구걸로 착각하지 마라!`,
                `말빨이 부족하군.`,
                `그런 식으로는 할인 못 받아.`
            ];

            // Add specific feedback
            if (Object.keys(analysis.keywordAnalysis.negative).length > 0) {
                responses.push(`${analysis.feedback.split('|')[1]?.trim() || '아부는 통하지 않아.'}`);
            }

            const response = responses[Math.floor(Math.random() * responses.length)];
            return `${response} ${analysis.feedback}`;
        }
    }

    /**
     * Get progressive hint based on failure count
     */
    getHint(failureCount) {
        if (failureCount === 0) {
            return null;
        } else if (failureCount === 1) {
            return "협상이 서툴군. 내 말을 잘 들어봐.";
        } else if (failureCount === 2) {
            return "논리적으로 접근하거나, 진심을 보여봐.";
        } else if (failureCount === 3) {
            return "푼돈을 아끼는 게 큰돈 버는 길이라고 했지? 그걸 활용해봐.";
        } else if (failureCount >= 5) {
            return "내 가르침을 인용하면 할인해줄 수도 있어. 하지만 진심이어야 해.";
        }

        return "계속 실패하는군. 다시 생각해봐.";
    }

    /**
     * Calculate price modifier
     * @param {number} basePrice - Original item price
     * @param {number} persuasionScore - Score from 0.0 to 1.0
     * @param {number} maxDiscount - Maximum discount percentage (default 30%)
     * @returns {Object} Price details
     */
    calculatePrice(basePrice, persuasionScore, maxDiscount = 30) {
        const minDiscount = 10;
        const discountRange = maxDiscount - minDiscount;
        const discountPercent = Math.floor(minDiscount + (persuasionScore * discountRange));
        const finalPrice = Math.floor(basePrice * (1 - discountPercent / 100));

        return {
            originalPrice: basePrice,
            discountPercent,
            discountAmount: basePrice - finalPrice,
            finalPrice
        };
    }
}

// Global instance
const negotiationEngine = new NegotiationEngine();
