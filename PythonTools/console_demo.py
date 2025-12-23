import os
import time
import random

# Import our modules
from economy.news_crawler import NewsCrawler
from economy.sentiment_analyzer import SentimentAnalyzer
from detective.interrogator import DetectiveGame

# Try to import AI libraries
HAS_GEMINI = False
HAS_OPENAI = False
gemini_model = None
openai_client = None

# Try Gemini first
try:
    import google.generativeai as genai
    from dotenv import load_dotenv
    load_dotenv()
    gemini_key = os.getenv("GOOGLE_API_KEY")
    if gemini_key:
        genai.configure(api_key=gemini_key)
        gemini_model = genai.GenerativeModel('gemini-pro')
        HAS_GEMINI = True
except:
    pass

# Try OpenAI second
try:
    import openai
    from dotenv import load_dotenv
    load_dotenv()
    openai_key = os.getenv("OPENAI_API_KEY")
    if openai_key:
        openai_client = openai.OpenAI(api_key=openai_key)
        HAS_OPENAI = True
except:
    pass

# Determine which AI to use
AI_BACKEND = "Mock"
if HAS_GEMINI:
    AI_BACKEND = "Gemini"
elif HAS_OPENAI:
    AI_BACKEND = "OpenAI"

# --- Mock AI Responses ---
class MockSaynoAI:
    def __init__(self):
        self.conversation_count = 0
        self.responses = {
            "greeting": [
                "어서오십시오... 아니, 그냥 구경꾼인가?",
                "손님이라도 돼야 인사를 받지. 뭘 원하나?",
                "시간은 돈이다. 용건만 간단히.",
                "여기는 자선단체가 아니다. 돈 있으면 말해."
            ],
            "what_sell": [
                "검, 갑옷, 포션. 돈만 있으면 다 살 수 있어.",
                "여기 있는 건 전부 최상급이다. 싼 건 기대하지 마.",
                "물건 목록? 그런 건 없다. 네가 원하는 걸 말해.",
                "뭘 찾든 간에, 가격은 협상 불가다."
            ],
            "discount": [
                "가난이 벼슬이냐? 돈 벌어서 다시 와라.",
                "깎아달라고? 협상을 구걸로 착각하지 마라.",
                "내 물건은 제값을 아는 사람한테만 판다. 썩 꺼져.",
                "가격은 그대로야. 싫으면 다른 데 가.",
                "할인? 여긴 백화점이 아니다. 정가 아니면 나가.",
                "돈이 없다는 건 네 문제지, 내 문제가 아니야."
            ],
            "fair_deal": [
                "보는 눈은 있군. 가져가라.",
                "정가를 낸다니, 현명한 선택이다.",
                "좋아. 네가 이 물건의 가치를 아는구나.",
                "그래, 이런 손님이라면 환영이지.",
                "훌륭해. 그 검으로 네 값어치를 증명해봐."
            ],
            "advice_money": [
                "푼돈을 아끼지 않는 놈은 절대 큰돈을 못 쥔다.",
                "돈을 버는 건 기술이고, 지키는 건 예술이다.",
                "남들이 커피 마실 때 투자해라. 그게 부자 되는 길이다.",
                "월급쟁이로 평생 살 거면 그냥 포기해."
            ],
            "advice_success": [
                "성공하고 싶으면 피 냄새를 맡아라. 남들이 기피하는 곳에 기회가 있다.",
                "징징거릴 시간에 실력을 키워라. 세상은 네 사정 안 봐준다.",
                "무능함을 남 탓으로 돌리지 마. 네가 못난 게 문제다.",
                "노력도 안 하면서 운을 탓하지 마라. 개소리다."
            ],
            "compliment": [
                "...칭찬? 그런 거 여기서 기대하지 마.",
                "칭찬으로 배는 안 불러. 돈 벌어.",
                "흠... 그래도 나쁘진 않군. 계속 그렇게 해.",
                "네가 기특하다고? 착각하지 마. 아직 멀었어."
            ],
            "insult": [
                "나한테 욕? 네 인생이나 걱정해.",
                "화내봤자 네 호주머니만 가벼워진다.",
                "기분 나쁘면 나가. 손님은 너 하나뿐이 아니야.",
                "소리 지르지 마. 돈으로 말해."
            ],
            "buy_item": [
                "좋아, 거래 성사. 그 돈 헛되이 쓰지 마.",
                "현명한 투자다. 이걸로 네 목숨값은 올랐어.",
                "받았다. 이제 나가서 써먹어 봐.",
                "그래, 가져가. 그리고 후회하지 마."
            ],
            "browse": [
                "구경만? 시간 낭비하지 말고 결정해.",
                "눈팅만 할 거면 나가. 자리 차지하지 마.",
                "보기만 할 거야? 돈 없으면 그냥 가.",
                "구경이면 박물관 가. 여긴 장사하는 곳이다."
            ],
            "question": [
                "궁금하면 책을 읽어. 공짜 교육은 안 해.",
                "질문이 많으면 돈을 내. 상담료 받아야겠어.",
                "왜 그런지 알 필요 있나? 그냥 사던가 말던가.",
                "묻지 말고 행동해. 말은 공짜지만 시간은 아니야."
            ],
            "complaint": [
                "불만? 환불은 없다. 네가 고른 거잖아.",
                "징징대지 마. 네 선택이야.",
                "후회되면 다음엔 제대로 골라.",
                "내 탓 하지 마. 네 안목이 문제지."
            ],
            "thanks": [
                "고맙긴. 돈 낸 거잖아.",
                "감사는 됐고, 다음에 또 와.",
                "...그래. 또 보자고.",
                "말은 필요 없어. 다음에 현금 들고 와."
            ],
            "random_wisdom": [
                "세상은 공평하지 않아. 그러니 더 잘해야지.",
                "가난은 네 잘못이 아니지만, 극복 못하는 건 네 책임이야.",
                "돈은 목적이 아니라 도구다. 제대로 써.",
                "남 부러워할 시간에 너나 잘해.",
                "인생은 짧아. 징징댈 시간 없어."
            ],
            "default": [
                "...그래서?",
                "명확하게 말해.",
                "용건만 간단히.",
                "뭔 소리야.",
                "이해가 안 되는데.",
                "다시 말해봐."
            ]
        }
    
    def get_response(self, user_input):
        if not user_input.strip():
            return "말을 해야 알아듣지."
        
        self.conversation_count += 1
        user_lower = user_input.lower()
        
        # 인사
        if any(word in user_lower for word in ["안녕", "처음", "hello", "hi", "헬로"]):
            return random.choice(self.responses["greeting"])
        
        # 뭐 파는지 물어봄
        if any(word in user_lower for word in ["뭐", "무엇", "뭘", "팔", "파시", "판매", "what", "sell"]):
            if "파" in user_lower or "팔" in user_lower or "sell" in user_lower:
                return random.choice(self.responses["what_sell"])
        
        # 할인 요청
        if any(word in user_lower for word in ["깎", "할인", "싸게", "저렴", "비싸", "비싸요", "discount", "cheap", "cheaper"]):
            return random.choice(self.responses["discount"])
        
        # 정가 지불
        if any(word in user_lower for word in ["정가", "전액", "드리", "드릴", "지불", "살게", "사겠", "pay", "buy"]):
            if any(w in user_lower for w in ["깎", "할인"]):  # 동시에 할인 언급하면 할인 응답
                return random.choice(self.responses["discount"])
            return random.choice(self.responses["fair_deal"])
        
        # 구매
        if any(word in user_lower for word in ["사", "구매", "주세요", "살게", "사겠"]):
            return random.choice(self.responses["buy_item"])
        
        # 조언/방법
        if any(word in user_lower for word in ["조언", "방법", "어떻게", "가르침", "비법", "advice", "how", "tip"]):
            if any(w in user_lower for w in ["돈", "부자", "버", "모", "money", "rich"]):
                return random.choice(self.responses["advice_money"])
            else:
                return random.choice(self.responses["advice_success"])
        
        # 칭찬
        if any(word in user_lower for word in ["멋", "대단", "훌륭", "좋", "최고", "great", "amazing", "ㅋㅋ", "ㄱㅇㄷ"]):
            return random.choice(self.responses["compliment"])
        
        # 욕/불만
        if any(word in user_lower for word in ["병신", "씨발", "개새", "닥쳐", "fuck", "shit", "damn", "나쁜", "싫어", "짜증"]):
            return random.choice(self.responses["insult"])
        
        # 질문
        if "?" in user_input or "?" in user_input or any(word in user_lower for word in ["왜", "why", "어디", "where"]):
            return random.choice(self.responses["question"])
        
        # 불만
        if any(word in user_lower for word in ["환불", "후회", "별로", "실망", "refund", "bad"]):
            return random.choice(self.responses["complaint"])
        
        # 감사
        if any(word in user_lower for word in ["감사", "고마", "thanks", "thank"]):
            return random.choice(self.responses["thanks"])
        
        # 구경
        if any(word in user_lower for word in ["구경", "보", "둘러", "look", "browse"]):
            return random.choice(self.responses["browse"])
        
        # 가끔 랜덤으로 지혜
        if self.conversation_count % 5 == 0:
            return random.choice(self.responses["random_wisdom"])
        
        # 기본 응답
        return random.choice(self.responses["default"])

class MockDetectiveAI:
    def __init__(self, game_data):
        self.data = game_data
        self.caught = False
        
    def get_response(self, user_input):
        user_lower = user_input.lower()
        
        # If caught with evidence
        if "장갑" in user_lower or "glove" in user_lower:
            self.caught = True
            return "그건... 누군가 내 장갑을 훔쳐서 거기 뒀을 수도 있잖아요! 나는 결백합니다!"
        
        # Alibi contradiction
        if ("10시" in user_lower or "10:30" in user_lower) and ("떠났" in user_lower or "left" in user_lower):
            return "...아, 그건... 제가 기억을 잘못했을 수도 있어요. 피곤했거든요."
        
        # Time question
        if "시간" in user_lower or "몇 시" in user_lower or "when" in user_lower:
            if not self.caught:
                return "저는 저녁 파티에 자정까지 있었습니다. 친구들이 증인입니다."
            else:
                return "...정확히 기억이 안 나네요."
        
        # General denial
        if "왜" in user_lower or "why" in user_lower:
            return "나는 아무것도 하지 않았어요. 왜 나를 의심하는 거죠?"
            
        return "무슨 말씀이신지 모르겠는데요. 저는 결백합니다."

# --- Sayno Logic ---
def run_sayno():
    print("\n--- [Sayno's Shop] ---")
    
    if HAS_GEMINI:
        print("✅ Google Gemini API 연결됨")
        run_sayno_gemini()
    elif HAS_OPENAI:
        print("✅ OpenAI API 연결됨")
        run_sayno_openai()
    else:
        print("⚠️ Mock Mode (미리 정의된 응답 사용)")
        run_sayno_mock()

def run_sayno_mock():
    mock_ai = MockSaynoAI()
    
    # 상점 인벤토리
    shop_items = {
        "1": {"name": "낡은 검", "price": 100, "desc": "기본적인 검. 녹슬었지만 쓸만하다.", "keywords": ["낡은검", "낡은", "검1"]},
        "2": {"name": "강철 검", "price": 500, "desc": "튼튼한 강철 검. 전사의 필수품.", "keywords": ["강철검", "강철", "검2"]},
        "3": {"name": "전설의 검", "price": 2000, "desc": "전설로만 전해지는 명검. 세이노의 자랑.", "keywords": ["전설의검", "전설검", "전설", "명검"]},
        "4": {"name": "가죽 갑옷", "price": 300, "desc": "기본 방어구. 가볍고 실용적이다.", "keywords": ["가죽갑옷", "가죽", "갑옷1"]},
        "5": {"name": "판금 갑옧", "price": 800, "desc": "무거운 대신 방어력은 최고.", "keywords": ["판금갑옷", "판금", "갑옷2"]},
        "6": {"name": "체력 포션", "price": 50, "desc": "HP 50 회복. 위급할 때 쓰는 물약.", "keywords": ["체력포션", "체력", "빨간포션", "hp포션"]},
        "7": {"name": "마나 포션", "price": 50, "desc": "MP 50 회복. 마법사의 필수템.", "keywords": ["마나포션", "마나", "파란포션", "mp포션"]},
        "8": {"name": "엘릭서", "price": 500, "desc": "HP/MP 완전 회복. 귀한 물건이다.", "keywords": ["엘릭서", "엘릭시르", "만능물약"]},
    }
    
    player_gold = 1000  # 플레이어 소지금
    player_inventory = {}  # 플레이어 인벤토리 {item_num: count}
    
    print("Sayno: '어서오십시오, 손님... 아니면 구경꾼인가?'")
    print(f"\n{'='*40}")
    print(f"💰 현재 소지금: {player_gold} Gold")
    print(f"{'='*40}")
    print("\n💡 팁:")
    print("  - '목록' : 상품 보기")
    print("  - '강철검 주세요' or '2번' : 구매")
    print("  - '인벤토리' : 내 소지품 확인")
    print("  - '강철검 팔게요' or '판매 2번' : 판매")
    print("  - 'q' : 나가기\n")
    
    while True:
        user_in = input("You: ").strip()
        
        if user_in.lower() in ['q', 'quit', 'exit', 'back', '나가', '나갈게']:
            print("Sayno: '그래, 썩 꺼져라.'")
            break
        
        # 빈 입력
        if not user_in:
            print("Sayno: 말을 해야 알아듣지.")
            continue
        
        # 목록 보기
        if user_in in ['목록', '리스트', 'list', 'items'] or user_in.startswith('목록'):
            print(f"\n{'='*50}")
            print("📋 세이노의 상점 목록")
            print(f"{'='*50}")
            for key, item in shop_items.items():
                sell_price = int(item['price'] * 0.6)
                print(f"{key}. {item['name']:10s} - 구매: {item['price']:4d}G | 판매: {sell_price:3d}G")
            print(f"{'='*50}")
            print(f"💰 현재 소지금: {player_gold} Gold")
            print(f"{'='*50}\n")
            print("Sayno: '마음에 드는 게 있으면 번호나 이름을 말해. 가격은 협상 불가다.'")
            continue
        
        # 인벤토리 확인
        if any(word in user_in for word in ['인벤토리', '가방', '소지품', 'inventory', 'bag']):
            print(f"\n{'='*40}")
            print("🎒 내 인벤토리")
            print(f"{'='*40}")
            if player_inventory:
                for item_num, count in player_inventory.items():
                    item_name = shop_items[item_num]['name']
                    print(f"  - {item_name} x{count}")
            else:
                print("  (비어있음)")
            print(f"{'='*40}")
            print(f"💰 소지금: {player_gold} Gold")
            print(f"{'='*40}\n")
            continue
        
        # 소지금 확인
        if any(word in user_in for word in ['소지금', '내돈', '잔액', '얼마있', '돈얼마']):
            print(f"\n💰 현재 소지금: {player_gold} Gold")
            print("Sayno: '그 돈으로 뭘 살 수 있을지 생각해봐.'\n")
            continue
        
        # 판매 시도
        sell_keywords = ['판매', '팔게요', '팔', '팔아요', 'sell', '팔래요']
        is_sell = any(keyword in user_in for keyword in sell_keywords)
        
        if is_sell:
            # 번호로 찾기
            item_num = None
            for num in shop_items.keys():
                if num in user_in or f"{num}번" in user_in:
                    item_num = num
                    break
            
            # 번호 없으면 이름으로 찾기
            if not item_num:
                user_clean = user_in.replace(" ", "")
                for num, item in shop_items.items():
                    item_name_clean = item['name'].replace(" ", "")
                    if item_name_clean in user_clean or any(keyword in user_clean for keyword in item['keywords']):
                        item_num = num
                        break
            
            if item_num:
                # 인벤토리에 있는지 확인
                if item_num in player_inventory and player_inventory[item_num] > 0:
                    item = shop_items[item_num]
                    sell_price = int(item['price'] * 0.6)  # 구매가의 60%
                    
                    player_gold += sell_price
                    player_inventory[item_num] -= 1
                    if player_inventory[item_num] == 0:
                        del player_inventory[item_num]
                    
                    print(f"\nSayno: '{item['name']}? 흠... {sell_price}G에 사주지. 후려치는 거 아니야.'")
                    print(f"\n{'='*40}")
                    print(f"💵 [{item['name']}] 판매 완료!")
                    print(f"💰 받은 금액: +{sell_price} Gold")
                    print(f"💰 현재 소지금: {player_gold} Gold")
                    print(f"{'='*40}\n")
                else:
                    print(f"Sayno: '그걸 가지고 있지도 않잖아. 사기꾼인가?'\n")
            else:
                print("Sayno: '뭘 팔겠다는 거야? 명확하게 말해.'\n")
            continue
        
        # 구매 시도
        purchase_keywords = ['구매', '살게', '사', '주세요', '줘', '구입', 'buy', '살래', '사줘']
        is_purchase = any(keyword in user_in for keyword in purchase_keywords)
        
        # 먼저 번호로 찾기 (1-8)
        item_num = None
        for num in shop_items.keys():
            if num in user_in or f"{num}번" in user_in:
                item_num = num
                break
        
        # 번호로 못 찾으면 아이템 이름으로 찾기
        if not item_num and is_purchase:
            user_clean = user_in.replace(" ", "")
            for num, item in shop_items.items():
                item_name_clean = item['name'].replace(" ", "")
                if item_name_clean in user_clean or any(keyword in user_clean for keyword in item['keywords']):
                    item_num = num
                    break
        
        # 번호가 있으면 구매로 간주
        if item_num and (is_purchase or user_in.startswith(item_num)):
            item = shop_items[item_num]
            
            # 할인 요청이 포함되어 있는지 확인
            if any(word in user_in for word in ['깎', '할인', '싸게', '저렴']):
                print(f"Sayno: '{item['name']}? 깎아달라고? 가격은 {item['price']}G다. 싫으면 말고.'\n")
                continue
            
            # 돈이 충분한지 확인
            if player_gold >= item['price']:
                player_gold -= item['price']
                
                # 인벤토리에 추가
                if item_num in player_inventory:
                    player_inventory[item_num] += 1
                else:
                    player_inventory[item_num] = 1
                
                print(f"\nSayno: '좋아. {item['name']}, {item['price']}G에 넘긴다. 헛되이 쓰지 마.'")
                print(f"\n{'='*40}")
                print(f"✅ [{item['name']}] 구매 완료!")
                print(f"💳 지불 금액: {item['price']} Gold")
                print(f"💰 남은 소지금: {player_gold} Gold")
                print(f"📦 인벤토리에 추가됨!")
                print(f"{'='*40}\n")
            else:
                shortage = item['price'] - player_gold
                print(f"\nSayno: '돈이 {shortage}G 모자라는데? 가난뱅이는 꿈도 꾸지 마. 돈 벌어서 와.'")
                print(f"💰 현재 소지금: {player_gold} Gold (필요: {item['price']}G)\n")
            continue
        
        # 가격 문의
        if "가격" in user_in or "얼마" in user_in or "price" in user_in:
            found_item = None
            user_clean = user_in.replace(" ", "")
            for num, item in shop_items.items():
                item_name_clean = item['name'].replace(" ", "")
                if item_name_clean in user_clean or any(keyword in user_clean for keyword in item['keywords']):
                    found_item = item
                    break
            
            if found_item:
                sell_price = int(found_item['price'] * 0.6)
                print(f"Sayno: '{found_item['name']}? 구매는 {found_item['price']}G, 판매는 {sell_price}G에 받아준다.'\n")
            else:
                print("Sayno: '\"목록\" 쳐서 직접 봐. 다 적혀 있어.'\n")
            continue
        
        # 일반 대화
        reply = mock_ai.get_response(user_in)
        print(f"Sayno: {reply}\n")

def run_sayno_gemini():
    """Gemini API를 사용한 세이노 상점"""
    # 상점 인벤토리 (동일)
    shop_items = {
        "1": {"name": "낡은 검", "price": 100, "desc": "기본적인 검. 녹슬었지만 쓸만하다.", "keywords": ["낡은검", "낡은", "검1"]},
        "2": {"name": "강철 검", "price": 500, "desc": "튼튼한 강철 검. 전사의 필수품.", "keywords": ["강철검", "강철", "검2"]},
        "3": {"name": "전설의 검", "price": 2000, "desc": "전설로만 전해지는 명검. 세이노의 자랑.", "keywords": ["전설의검", "전설검", "전설", "명검"]},
        "4": {"name": "가죽 갑옷", "price": 300, "desc": "기본 방어구. 가볍고 실용적이다.", "keywords": ["가죽갑옷", "가죽", "갑옷1"]},
        "5": {"name": "판금 갑옧", "price": 800, "desc": "무거운 대신 방어력은 최고.", "keywords": ["판금갑옷", "판금", "갑옷2"]},
        "6": {"name": "체력 포션", "price": 50, "desc": "HP 50 회복. 위급할 때 쓰는 물약.", "keywords": ["체력포션", "체력", "빨간포션", "hp포션"]},
        "7": {"name": "마나 포션", "price": 50, "desc": "MP 50 회복. 마법사의 필수템.", "keywords": ["마나포션", "마나", "파란포션", "mp포션"]},
        "8": {"name": "엘릭서", "price": 500, "desc": "HP/MP 완전 회복. 귀한 물건이다.", "keywords": ["엘릭서", "엘릭시르", "만능물약"]},
    }
    
    player_gold = 1000
    player_inventory = {}
    
    # System Prompt 로드
    prompt_path = os.path.join("prompts", "system_prompt.txt")
    if not os.path.exists(prompt_path):
        prompt_path = os.path.join(os.path.dirname(__file__), "prompts", "system_prompt.txt")
    
    with open(prompt_path, 'r', encoding='utf-8') as f:
        system_prompt = f.read()
    
    # Gemini Chat 세션 시작
    chat = gemini_model.start_chat(history=[])
    
    # 시스템 프롬프트 전송
    chat.send_message(f"{system_prompt}\n\n이제부터 당신은 세이노입니다. 짧고 간결하게 대답하세요.")
    
    print("Sayno: '어서오십시오, 손님... 아니면 구경꾼인가?'")
    print(f"\n{'='*40}")
    print(f"💰 현재 소지금: {player_gold} Gold")
    print(f"{'='*40}")
    print("\n💡 팁: '목록', '인벤토리', '강철검 주세요', '판매', 'q' 등 사용 가능\n")
    
    while True:
        user_in = input("You: ").strip()
        
        if user_in.lower() in ['q', 'quit', 'exit', 'back', '나가']:
            try:
                response = chat.send_message("손님이 나간다고 합니다. 한 마디로 작별 인사하세요.")
                print(f"Sayno: {response.text}")
            except:
                print("Sayno: '그래, 썩 꺼져라.'")
            break
        
        if not user_in:
            continue
        
        # 목록 (로컬 처리)
        if user_in in ['목록', '리스트']:
            print(f"\n{'='*50}")
            print("📋 세이노의 상점 목록")
            print(f"{'='*50}")
            for key, item in shop_items.items():
                sell_price = int(item['price'] * 0.6)
                print(f"{key}. {item['name']:10s} - 구매: {item['price']:4d}G | 판매: {sell_price:3d}G")
            print(f"{'='*50}")
            print(f"💰 현재 소지금: {player_gold} Gold")
            print(f"{'='*50}\n")
            continue
        
        # 인벤토리 (로컬 처리)
        if '인벤토리' in user_in:
            print(f"\n{'='*40}")
            print("🎒 내 인벤토리")
            print(f"{'='*40}")
            if player_inventory:
                for item_num, count in player_inventory.items():
                    print(f"  - {shop_items[item_num]['name']} x{count}")
            else:
                print("  (비어있음)")
            print(f"{'='*40}\n")
            continue
        
        # AI에게 쿼리 (나머지는 Gemini가 처리)
        try:
            context = f"\n\n[현재 상황: 손님 소지금 {player_gold}G]"
            response = chat.send_message(user_in + context)
            print(f"Sayno: {response.text}\n")
        except Exception as e:
            print(f"Sayno: ...뭔가 잘못됐군. (오류: {str(e)[:50]})\n")

def run_sayno_openai():
    prompt_path = os.path.join("prompts", "system_prompt.txt")
    if not os.path.exists(prompt_path):
        prompt_path = os.path.join(os.path.dirname(__file__), "prompts", "system_prompt.txt")
        
    with open(prompt_path, 'r', encoding='utf-8') as f:
        system_prompt = f.read()

    print("Sayno: '어서오십시오, 손님... 아니면 구경꾼인가?'")
    
    messages = [{"role": "system", "content": system_prompt}]
    
    while True:
        user_in = input("\nYou: ")
        if user_in.lower() in ['q', 'quit', 'exit', 'back']:
            break
            
        messages.append({"role": "user", "content": user_in})
        try:
            resp = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=messages
            )
            reply = resp.choices[0].message.content
            print(f"Sayno: {reply}")
            messages.append({"role": "assistant", "content": reply})
        except Exception as e:
            print(f"Error: {e}")
            break

# --- Economy Logic ---
def run_economy():
    crawler = NewsCrawler()
    analyzer = SentimentAnalyzer()
    
    print("\n--- [Global Market Terminal] ---")
    print("Fetching latest news...")
    time.sleep(1)
    
    news_list = crawler.get_latest_news(3)
    total_sentiment = 0
    
    for news in news_list:
        score = analyzer.analyze(news['headline'])
        total_sentiment += score
        print(f"[{news['category']}] {news['headline']} (Sentiment: {score})")
    
    print("-" * 30)
    print(f"Total Market Sentiment: {total_sentiment}")
    
    if total_sentiment > 0.5:
        print(">> MARKET BULLISH! Asset prices increasing by 10%.")
    elif total_sentiment < -0.5:
        print(">> MARKET CRASH! Asset prices dropping by 10%.")
    else:
        print(">> Market Stable.")
    
    input("\nPress Enter to return...")

# --- Detective Logic ---
def run_detective():
    print(f"\n--- [Interrogation Room] ---")
    
    if HAS_OPENAI:
        print("✅ OpenAI API 연결됨 (실제 AI 사용)")
        run_detective_real()
    else:
        print("⚠️ Mock Mode (미리 정의된 응답 사용)")
        run_detective_mock()

def run_detective_mock():
    # Load evidence data
    import json
    evidence_path = os.path.join("detective", "evidence.json")
    with open(evidence_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    mock_ai = MockDetectiveAI(data)
    
    print(f"Suspect: {data['suspect_profile']['name']}")
    print(f"Crime: {data['crime']['event']}")
    print("Goal: Find out the truth behind his alibi.")
    print("(Type 'q' to quit)")
    
    print(f"\n{data['suspect_profile']['name']}: 'I don't know why I'm here. I have nothing to hide.'")
    
    while True:
        user_in = input("\nDetective (You): ")
        if user_in.lower() in ['q', 'quit', 'exit']:
            break
            
        reply = mock_ai.get_response(user_in)
        print(f"{data['suspect_profile']['name']}: {reply}")

def run_detective_real():
    game = DetectiveGame()
    print(f"Suspect: {game.suspect['name']}")
    print(f"Crime: {game.data['crime']['event']}")
    print("Goal: Find out the truth behind his alibi.")
    print("(Type 'q' to quit)")
    
    print(f"\n{game.suspect['name']}: 'I don't know why I'm here. I have nothing to hide.'")
    
    while True:
        user_in = input("\nDetective (You): ")
        if user_in.lower() in ['q', 'quit', 'exit']:
            break
            
        reply = game.interact(user_in, client)
        print(f"{game.suspect['name']}: {reply}")

# --- Main Menu ---
def main_menu():
    print("\n========================================")
    print("   AI Gaming Agent Portfolio - Demo")
    print("========================================")
    print(f"[AI Backend: {AI_BACKEND}]")
    print("========================================")
    print("1. Talk to Sayno (Persona NPC)")
    print("2. Market Simulation (Economy Agent)")
    print("3. Solve the Crime (Detective Agent)")
    print("0. Exit")
    
    choice = input("\nSelect Mode: ")
    return choice

if __name__ == "__main__":
    while True:
        c = main_menu()
        if c == '1': run_sayno()
        elif c == '2': run_economy()
        elif c == '3': run_detective()
        elif c == '0': 
            print("Exiting...")
            break
        else:
            print("Invalid choice.")
