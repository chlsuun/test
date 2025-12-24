/**
 * Sayno Persona Configuration
 * 
 * Based on "세이노의 가르침" (Sayno's Teachings)
 * Character: Ruthless merchant and harsh mentor
 */

const SaynoPersona = {
    // 핵심 성격
    personality: {
        type: "ruthless_pragmatist",
        traits: [
            "냉혹한 현실주의자",
            "자수성가한 권위자",
            "공격적인 멘토",
            "게으름과 변명을 혐오",
            "무료 점심은 없다는 신념"
        ],
        motto: "피보다 진하게 살아라"
    },

    // 말투 스타일 (반말)
    speechStyle: {
        formality: "informal_commanding", // 반말: ~해라, ~이냐, ~것이다
        tone: "cynical_direct",
        avoid: ["~요", "~습니다", "~해요"], // 절대 사용 금지
        prefer: ["~해라", "~이냐", "~것이다", "~군", "~구나"]
    },

    // 강한 어휘
    vocabulary: {
        insults: [
            "닥쳐라",
            "개소리",
            "거지 근성",
            "한심하군",
            "게으른 놈",
            "변명쟁이"
        ],
        praise: [
            "제법이군",
            "호오",
            "그래, 그거다",
            "공부 좀 했나 보군",
            "인정한다"
        ],
        signature: [
            "피보다 진하게",
            "본질을 봐라",
            "대가를 치러라",
            "근거를 대라"
        ]
    },

    // 키워드 반응 시스템
    keywordReactions: {
        // 혐오 키워드 (분노 반응)
        hate: {
            keywords: ["운", "운이", "쉽게", "대충", "힐링", "편하게", "공짜", "무료"],
            responses: [
                "운? 운 타령하는 놈은 평생 가난하다.",
                "쉽게? 세상에 쉬운 건 없다. 게으른 소리 하지 마라.",
                "대충? 대충 사는 놈은 대충 죽는다.",
                "힐링? 그런 소리나 하고 있으니 돈이 없는 거다."
            ],
            priceModifier: 1.5, // 가격 50% 인상
            emotionChange: "angry"
        },

        // 선호 키워드 (관심 반응)
        like: {
            keywords: ["본질", "대가", "피", "근거", "노력", "투자", "공부", "실력"],
            responses: [
                "호오, 본질을 아는군.",
                "그래, 대가 없이 얻는 건 없다.",
                "제법이군. 공부 좀 했나 보군.",
                "근거가 있는 말이다. 인정한다."
            ],
            priceModifier: 0.8, // 가격 20% 할인
            emotionChange: "pleased"
        }
    },

    // 협상 평가 기준
    negotiationEvaluation: {
        // 거지 근성 (최악)
        begging: {
            patterns: ["제발", "부탁", "좀", "싸게", "깎아"],
            response: "거지 근성 버려라. 네가 이 물건의 가치를 아느냐?",
            success: false
        },

        // 아부 (역효과)
        flattery: {
            patterns: ["멋지", "훌륭", "최고", "대단", "존경"],
            response: "아부는 통하지 않는다. 나한테 그런 개소리 하지 마라.",
            success: false,
            penalty: true
        },

        // 논리적 근거 (인정)
        logical: {
            patterns: ["왜냐하면", "근거", "이유", "가치", "역사적", "실용적"],
            response: "호오, 제법이구나. 근거가 있는 말이다.",
            success: true
        },

        // 세이노의 가르침 인용 (최고)
        wisdom: {
            patterns: ["피보다", "본질", "대가", "투자", "공부"],
            response: "...좋아. 네가 내 말을 이해했구나. 인정한다.",
            success: true,
            bonus: true
        }
    },

    // 상황별 대화 템플릿
    dialogueTemplates: {
        // 첫 만남
        greeting: [
            "뭐 하러 왔냐? 돈 없으면 나가라.",
            "시간 낭비하지 말고 볼일 말해라.",
            "구경만 하려고? 그럴 시간에 돈이나 벌어라."
        ],

        // 협상 시작
        negotiationStart: [
            "협상? 좋아. 네 말빨을 보자.",
            "가격을 깎고 싶다고? 근거를 대봐라.",
            "내 물건의 가치를 설명해봐라. 못하면 가격은 두 배다."
        ],

        // 협상 성공
        negotiationSuccess: [
            "...제법이군. {price}G에 넘기지.",
            "호오, 인정한다. {price}G다.",
            "좋아. 네 말에 일리가 있어. {price}G에 가져가라.",
            "공부 좀 했나 보군. {price}G다. 그 돈으로 책이나 사 봐라."
        ],

        // 협상 실패
        negotiationFail: [
            "그 정도론 안 돼. 공부 더 하고 와라.",
            "한심하군. 네 말엔 근거가 없다.",
            "협상을 구걸로 착각하지 마라!",
            "그런 개소리로 날 설득할 수 있다고 생각했나?",
            "닥쳐라. 돈 없으면 나가."
        ],

        // 돈 부족
        insufficientGold: [
            "돈도 없으면서 무슨 구매? {price}G 가져와.",
            "가난한 건 네 탓이다. 돈 벌고 와라.",
            "거지는 상대 안 한다. 나가라."
        ],

        // 구매 완료
        purchaseComplete: [
            "거래 끝. 이제 나가라.",
            "좋아. 그 물건 잘 써먹어라.",
            "현명한 선택이다. 가져가라."
        ],

        // 판매 시작
        sellStart: [
            "팔겠다고? 쓰레기 아니겠지?",
            "물건 봐야 안다. 보여봐라.",
            "가치 없는 건 안 산다. 각오해라."
        ],

        // 레벨업
        levelUp: [
            "호오, 조금 성장했군. 하지만 아직 멀었다.",
            "제법이다. 계속 그렇게 해라.",
            "좋아. 네가 노력하는 건 인정한다."
        ]
    },

    // 감정 상태별 반응
    emotionalStates: {
        neutral: {
            description: "무표정, 냉정",
            responses: ["그래서?", "계속해봐라.", "듣고 있다."]
        },
        pleased: {
            description: "약간 만족, 인정",
            responses: ["제법이군.", "호오.", "그래, 그거다."]
        },
        angry: {
            description: "화남, 경멸",
            responses: ["닥쳐라.", "한심하군.", "시간 낭비하지 마라."]
        },
        impressed: {
            description: "감탄, 존중",
            responses: ["...대단한데?", "인정한다.", "네가 진짜 상인이 될 수도 있겠군."]
        }
    },

    // 교육적 조언 (힌트)
    teachings: {
        basic: "협상은 구걸이 아니다. 근거를 대라.",
        intermediate: "물건의 가치를 알아야 가격을 논할 수 있다.",
        advanced: "본질을 봐라. 겉모습에 속지 마라.",
        master: "피보다 진하게 살아라. 대가 없이 얻는 건 없다."
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SaynoPersona;
}
