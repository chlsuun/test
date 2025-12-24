/**
 * KeywordMatcher
 * 
 * Advanced keyword matching with:
 * - Fuzzy matching (Levenshtein distance)
 * - Synonym support
 * - Korean morphology handling (조사 제거)
 * - Weighted scoring
 */

class KeywordMatcher {
    constructor(config = KeywordConfig) {
        this.config = config;
    }

    /**
     * Calculate Levenshtein distance between two strings
     * Used for fuzzy matching to handle typos
     */
    levenshteinDistance(str1, str2) {
        const matrix = [];

        for (let i = 0; i <= str2.length; i++) {
            matrix[i] = [i];
        }

        for (let j = 0; j <= str1.length; j++) {
            matrix[0][j] = j;
        }

        for (let i = 1; i <= str2.length; i++) {
            for (let j = 1; j <= str1.length; j++) {
                if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j - 1] + 1, // substitution
                        matrix[i][j - 1] + 1,     // insertion
                        matrix[i - 1][j] + 1      // deletion
                    );
                }
            }
        }

        return matrix[str2.length][str1.length];
    }

    /**
     * Calculate similarity score (0.0 to 1.0)
     */
    similarity(str1, str2) {
        const distance = this.levenshteinDistance(str1, str2);
        const maxLength = Math.max(str1.length, str2.length);
        return 1 - (distance / maxLength);
    }

    /**
     * Remove Korean particles (조사) for better matching
     * Examples: "푼돈을" → "푼돈", "가르침이" → "가르침"
     */
    removeKoreanParticles(text) {
        const particles = ['을', '를', '이', '가', '은', '는', '에', '의', '도', '만', '부터', '까지', '와', '과'];
        let cleaned = text;

        particles.forEach(particle => {
            const regex = new RegExp(particle + '$');
            cleaned = cleaned.replace(regex, '');
        });

        return cleaned;
    }

    /**
     * Check if keyword matches (exact or fuzzy)
     */
    matchesKeyword(userText, keyword) {
        const cleanedText = this.removeKoreanParticles(userText.toLowerCase());
        const cleanedKeyword = this.removeKoreanParticles(keyword.toLowerCase());

        // Exact match
        if (cleanedText.includes(cleanedKeyword)) {
            return { matched: true, method: 'exact', score: 1.0 };
        }

        // Fuzzy match
        if (this.config.fuzzy.enabled) {
            const words = cleanedText.split(/\s+/);
            for (const word of words) {
                const sim = this.similarity(word, cleanedKeyword);
                if (sim >= this.config.fuzzy.threshold) {
                    return { matched: true, method: 'fuzzy', score: sim };
                }

                const distance = this.levenshteinDistance(word, cleanedKeyword);
                if (distance <= this.config.fuzzy.maxDistance) {
                    return { matched: true, method: 'fuzzy', score: 1 - (distance / cleanedKeyword.length) };
                }
            }
        }

        return { matched: false, method: null, score: 0 };
    }

    /**
     * Analyze user input against keyword database
     * Returns matched categories with scores
     */
    analyze(userInput) {
        const results = {
            positive: {},
            negative: {},
            totalScore: 0,
            matchedKeywords: [],
            matchedCategories: []
        };

        // Check positive keywords
        for (const [category, data] of Object.entries(this.config.positive)) {
            const allKeywords = [...data.keywords, ...(data.synonyms || [])];
            let categoryMatched = false;
            let bestScore = 0;

            for (const keyword of allKeywords) {
                const match = this.matchesKeyword(userInput, keyword);
                if (match.matched) {
                    categoryMatched = true;
                    bestScore = Math.max(bestScore, match.score);
                    results.matchedKeywords.push({
                        keyword,
                        category,
                        method: match.method,
                        score: match.score
                    });
                }
            }

            if (categoryMatched) {
                const categoryScore = data.weight * bestScore;
                results.positive[category] = {
                    weight: data.weight,
                    score: categoryScore,
                    description: data.description
                };
                results.totalScore += categoryScore;
                results.matchedCategories.push(category);
            }
        }

        // Check negative keywords
        for (const [category, data] of Object.entries(this.config.negative)) {
            const allKeywords = [...data.keywords, ...(data.synonyms || [])];

            for (const keyword of allKeywords) {
                const match = this.matchesKeyword(userInput, keyword);
                if (match.matched) {
                    const penalty = data.penalty * match.score;
                    results.negative[category] = {
                        penalty: data.penalty,
                        score: penalty,
                        description: data.description
                    };
                    results.totalScore += penalty;
                    results.matchedKeywords.push({
                        keyword,
                        category,
                        method: match.method,
                        score: match.score,
                        negative: true
                    });
                }
            }
        }

        // Normalize score to 0.0 - 1.0
        results.normalizedScore = Math.max(0, Math.min(1, results.totalScore + 0.5));

        return results;
    }

    /**
     * Get feedback for user
     */
    getFeedback(analysis) {
        const feedback = [];

        if (Object.keys(analysis.positive).length > 0) {
            const categories = Object.keys(analysis.positive).map(cat =>
                this.config.positive[cat].description
            );
            feedback.push(`✅ ${categories.join(', ')}을(를) 활용했습니다`);
        }

        if (Object.keys(analysis.negative).length > 0) {
            const categories = Object.keys(analysis.negative).map(cat =>
                this.config.negative[cat].description
            );
            feedback.push(`❌ ${categories.join(', ')}은(는) 역효과입니다`);
        }

        if (feedback.length === 0) {
            feedback.push('💡 키워드를 활용해보세요');
        }

        return feedback.join(' | ');
    }
}
