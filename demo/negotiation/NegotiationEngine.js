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
     * Generate NPC response based on analysis (Sayno Persona)
     */
    generateResponse(analysis, item) {
        if (analysis.success) {
            const responses = [
                `...제법이군. 네 말에 일리가 있어.`,
                `호오, 설득력이 있군.`,
                `좋아, 인정한다.`,
                `그래, 그거다. 공부 좀 했나 보군.`
            ];

            // High score responses (세이노가 감탄할 때)
            if (analysis.persuasionScore > 0.7) {
                responses.push(`대단한데? 네가 진짜 상인 소질이 있군.`);
                responses.push(`...인정한다. 네가 내 말을 이해했구나.`);
            }

            const response = responses[Math.floor(Math.random() * responses.length)];
            return `${response} ${analysis.finalPrice}G에 넘기지. (${analysis.discountPercent}% 할인)`;
        } else {
            const responses = [
                `그 정도론 안 돼. 공부 더 하고 와라.`,
                `협상을 구걸로 착각하지 마라!`,
                `한심하군. 네 말엔 근거가 없다.`,
                `그런 개소리로 날 설득할 수 있다고 생각했나?`
            ];

            // 부정 키워드 사용 시 더 강한 반응
            if (Object.keys(analysis.keywordAnalysis.negative).length > 0) {
                const negativeCategories = Object.keys(analysis.keywordAnalysis.negative);

                if (negativeCategories.includes('laziness')) {
                    responses.push(`운? 운 타령하는 놈은 평생 가난하다.`);
                    responses.push(`쉽게? 세상에 쉬운 건 없다. 게으른 소리 하지 마라.`);
                }

                if (negativeCategories.includes('begging')) {
                    responses.push(`거지 근성 버려라. 돈 벌고 와라.`);
                }

                if (negativeCategories.includes('flattery')) {
                    responses.push(`아부는 통하지 않는다. 나한테 그런 개소리 하지 마라.`);
                }
            }

            const response = responses[Math.floor(Math.random() * responses.length)];
            return `${response} ${analysis.feedback}`;
        }
    }

    /**
     * Get progressive hint based on failure count (Sayno's teachings)
     */
    getHint(failureCount) {
        if (failureCount === 0) {
            return null;
        } else if (failureCount === 1) {
            return "협상이 서툴군. 내 말을 잘 들어봐.";
        } else if (failureCount === 2) {
            return "협상은 구걸이 아니다. 근거를 대라.";
        } else if (failureCount === 3) {
            return "물건의 가치를 알아야 가격을 논할 수 있다. 본질을 봐라.";
        } else if (failureCount === 4) {
            return "대가 없이 얻는 건 없다. 네 노력을 보여줘라.";
        } else if (failureCount >= 5) {
            return "피보다 진하게 살아라. 그 말의 의미를 생각해봐라.";
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
