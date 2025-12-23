# Google Gemini API용 세이노 함수 (console_demo.py에 추가할 코드)

def run_sayno_gemini():
    """Gemini API를 사용한 세이노 상점"""
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
    chat.send_message(f"{system_prompt}\n\n당신은 세이노입니다. 이제부터 손님과 대화합니다.")
    
    print("Sayno: '어서오십시오, 손님... 아니면 구경꾼인가?'")
    print(f"\n{'='*40}")
    print(f"💰 현재 소지금: {player_gold} Gold")
    print(f"{'='*40}\n")
    
    while True:
        user_in = input("You: ").strip()
        
        if user_in.lower() in ['q', 'quit', 'exit', 'back', '나가']:
            response = chat.send_message("손님이 나간다고 합니다. 마지막 인사를 해주세요.")
            print(f"Sayno: {response.text}")
            break
        
        if not user_in:
            continue
        
        # 간단한 명령어는 로컬 처리
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
        
        # AI에게 쿼리 전송
        try:
            context = f"\n\n[현재 상황: 소지금 {player_gold}G, 인벤토리: {len(player_inventory)}개]"
            response = chat.send_message(user_in + context)
            print(f"Sayno: {response.text}\n")
        except Exception as e:
            print(f"Sayno: ...뭔가 잘못됐군. (오류: {e})\n")
