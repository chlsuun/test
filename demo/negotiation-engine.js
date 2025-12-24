// 키워드 기반 협상 분석 엔진
const negotiationKeywords = {
    // 긍정 키워드 (효과적인 설득)
    wisdom: {
        keywords: ["푼돈", "투자", "가르침", "세이노", "큰돈", "아끼", "절약", "부자"],
        score: 30,
        category: "세이노의 가르침"
    },
    logical: {
        keywords: ["비싸", "다른곳", "다른 곳", "손해", "가격", "시세", "비교", "저렴", "싸"],
        score: 20,
        category: "논리적 근거"
    },
    polite: {
        keywords: ["부탁", "제발", "도와주세요", "필요", "간절", "부탁드립니다", "감사"],
        score: 10,
        category: "예의"
    },
    sincere: {
        keywords: ["정말", "진심", "꼭", "필요", "간절히"],
        score: 15,
        category: "진정성"
    },

    // 부정 키워드 (역효과)
    flattery: {
        keywords: ["멋지", "훌륭", "대단", "최고", "존경", "짱", "굿"],
        score: -20,
        category: "아부"
    },
    threat: {
        keywords: ["안사", "안살", "별로", "쓰레기", "안좋", "최악"],
        score: -30,
        category: "위협"
    },
    rude: {
        keywords: ["비싸기만", "바가지", "사기", "속이"],
        score: -15,
        category: "무례"
    }
};

// 협상 메시지 분석
function analyzeNegotiation(userInput) {
    if (!userInput || userInput.trim().length === 0) {
        return { score: 0, categories: [], feedback: "아무 말도 안 하면 협상이 안 되지." };
    }

    const input = userInput.toLowerCase().trim();
    let totalScore = 0;
    let matchedCategories = [];
    let positiveMatches = [];
    let negativeMatches = [];

    // 키워드 매칭
    for (const [key, data] of Object.entries(negotiationKeywords)) {
        for (const keyword of data.keywords) {
            if (input.includes(keyword)) {
                totalScore += data.score;
                matchedCategories.push(data.category);

                if (data.score > 0) {
                    positiveMatches.push(data.category);
                } else {
                    negativeMatches.push(data.category);
                }
                break; // 카테고리당 한 번만 점수 부여
            }
        }
    }

    // 길이 보너스/패널티
    if (input.length < 10) {
        totalScore -= 10;
        matchedCategories.push("너무 짧음");
    } else if (input.length > 30) {
        totalScore += 5;
    }

    // 최종 점수 (0-100 범위)
    const finalScore = Math.max(0, Math.min(100, totalScore + 50));

    // 피드백 생성
    let feedback = "";
    if (positiveMatches.length > 0) {
        feedback = `${positiveMatches.join(", ")}을(를) 활용했다.`;
    }
    if (negativeMatches.length > 0) {
        feedback += ` 하지만 ${negativeMatches.join(", ")}은(는) 역효과다.`;
    }

    return {
        score: finalScore,
        categories: matchedCategories,
        positiveMatches,
        negativeMatches,
        feedback
    };
}

// 점진적 힌트 시스템
function getProgressiveHint() {
    const failures = gameState.negotiationFailures;

    if (failures === 0) {
        return null; // 첫 시도엔 힌트 없음
    } else if (failures === 1) {
        return "협상이 서툴군. 내 말을 잘 들어봐.";
    } else if (failures === 2) {
        return "논리적으로 접근하거나, 진심을 보여봐.";
    } else if (failures === 3) {
        return "푼돈을 아끼는 게 큰돈 버는 길이라고 했지? 그걸 활용해봐.";
    } else if (failures >= 5) {
        return "내 가르침을 인용하면 할인해줄 수도 있어. 하지만 진심이어야 해.";
    }

    return "계속 실패하는군. 다시 생각해봐.";
}

// 협상 응답 생성
function generateNegotiationResponse(analysis, item, success) {
    if (success) {
        const responses = [
            `...제법이군. 네 말에 일리가 있어.`,
            `흠. ${analysis.positiveMatches[0] || "설득력"}이 있군.`,
            `좋아, 인정한다.`
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    } else {
        const responses = [
            `그 정도론 안 돼. ${analysis.feedback || "더 노력해봐."}`,
            `협상을 구걸로 착각하지 마라!`,
            `말빨이 부족하군. 다시 생각해봐.`,
            `그런 식으로는 할인 못 받아.`
        ];

        if (analysis.negativeMatches.length > 0) {
            responses.push(`${analysis.negativeMatches[0]}은 통하지 않아.`);
        }

        return responses[Math.floor(Math.random() * responses.length)];
    }
}
