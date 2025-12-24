/**
 * Keyword Configuration
 * 
 * Based on Sayno's Persona (세이노의 가르침)
 * Ruthless pragmatist merchant and harsh mentor
 */

const KeywordConfig = {
    // Positive keyword categories (세이노가 좋아하는 말)
    positive: {
        wisdom: {
            keywords: ["본질", "대가", "피", "근거", "투자", "가르침", "공부", "실력"],
            synonyms: ["핵심", "증거", "노력", "학습", "능력"],
            weight: 0.35,
            description: "세이노의 가르침 (본질, 대가, 피보다 진하게)"
        },
        logical: {
            keywords: ["왜냐하면", "이유", "가치", "역사적", "실용적", "근거", "비교"],
            synonyms: ["논리", "분석", "타당성"],
            weight: 0.25,
            description: "논리적 근거"
        },
        effort: {
            keywords: ["노력", "공부", "배움", "성장", "발전", "실천"],
            synonyms: ["수련", "훈련", "연습"],
            weight: 0.20,
            description: "노력과 성장"
        },
        value: {
            keywords: ["가치", "품질", "효용", "쓸모"],
            synonyms: ["유용성", "실용성"],
            weight: 0.15,
            description: "가치 인식"
        }
    },

    // Negative keyword categories (세이노가 혐오하는 말)
    negative: {
        laziness: {
            keywords: ["운", "운이", "쉽게", "대충", "힐링", "편하게"],
            synonyms: ["간편", "수월", "편안"],
            penalty: -0.35,
            description: "게으름과 운 타령 (세이노 최대 혐오)"
        },
        begging: {
            keywords: ["제발", "부탁", "좀", "싸게", "깎아", "공짜", "무료"],
            synonyms: ["거저", "공짜로"],
            penalty: -0.25,
            description: "거지 근성"
        },
        flattery: {
            keywords: ["멋지", "훌륭", "대단", "최고", "존경", "짱"],
            synonyms: ["좋아요", "완벽", "굿"],
            penalty: -0.30,
            description: "아부 (개소리)"
        },
        threat: {
            keywords: ["안사", "안살", "별로", "쓰레기", "최악"],
            synonyms: ["구려", "형편없"],
            penalty: -0.40,
            description: "위협과 무례"
        }
    },

    // Fuzzy matching configuration
    fuzzy: {
        enabled: true,
        threshold: 0.8,
        maxDistance: 2
    }
};
