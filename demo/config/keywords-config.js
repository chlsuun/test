/**
 * Keyword Configuration
 * 
 * Centralized keyword database with synonyms and weights
 * Easy to extend and maintain
 */

const KeywordConfig = {
    // Positive keyword categories
    positive: {
        wisdom: {
            keywords: ["푼돈", "투자", "가르침", "세이노", "큰돈", "아끼", "절약", "부자", "저축"],
            synonyms: ["모으다", "저금", "재테크", "돈관리"],
            weight: 0.30,
            description: "세이노의 가르침 관련"
        },
        logical: {
            keywords: ["비싸", "다른곳", "다른 곳", "손해", "가격", "시세", "비교", "저렴", "싸"],
            synonyms: ["고가", "값비싸", "저렴한곳", "할인"],
            weight: 0.20,
            description: "논리적 근거"
        },
        emotional: {
            keywords: ["필요", "간절", "진심", "꼭", "정말"],
            synonyms: ["절실", "반드시", "진짜"],
            weight: 0.15,
            description: "진정성"
        },
        polite: {
            keywords: ["부탁", "제발", "도와주세요", "감사", "부탁드립니다"],
            synonyms: ["부탁해요", "도와주세요"],
            weight: 0.10,
            description: "예의"
        }
    },

    // Negative keyword categories
    negative: {
        flattery: {
            keywords: ["멋지", "훌륭", "대단", "최고", "존경", "짱", "굿"],
            synonyms: ["좋아요", "완벽"],
            penalty: -0.20,
            description: "아부 (역효과)"
        },
        threat: {
            keywords: ["안사", "안살", "별로", "쓰레기", "최악", "안좋"],
            synonyms: ["구려", "형편없"],
            penalty: -0.30,
            description: "위협"
        },
        rude: {
            keywords: ["비싸기만", "바가지", "사기", "속이"],
            synonyms: ["사기꾼", "도둑"],
            penalty: -0.15,
            description: "무례"
        }
    },

    // Fuzzy matching configuration
    fuzzy: {
        enabled: true,
        threshold: 0.8, // Levenshtein similarity threshold
        maxDistance: 2  // Maximum edit distance
    }
};
