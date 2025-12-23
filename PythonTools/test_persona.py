import os
import openai
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Check for API Key
api_key = os.getenv("OPENAI_API_KEY")
if not api_key:
    print("WARNING: OPENAI_API_KEY not found in .env file.")
    print("Please create a .env file in PythonTools/ and add OPENAI_API_KEY=your_key")
    # For testing without key, we might mock or exit. 
    # Let's prompt user for input if missing.
    try:
        api_key = input("Enter your OpenAI API Key manually: ").strip()
        if not api_key:
            print("No key provided. Exiting.")
            exit()
    except EOFError:
        print("No input possible. Exiting.")
        exit()

client = openai.OpenAI(api_key=api_key)

def load_prompt(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        return f.read()

def chat_with_sayno():
    system_prompt = load_prompt("prompts/system_prompt.txt")
    print("\n[Sayno's Shop is Open]")
    print("Sayno: ...무슨 일이냐? (What do you want?)")

    messages = [
        {"role": "system", "content": system_prompt}
    ]

    while True:
        try:
            user_input = input("\nYou: ")
            if user_input.lower() in ["quit", "exit", "q"]:
                print("Sayno: 그래, 썩 꺼져라. (Get lost.)")
                break
            
            messages.append({"role": "user", "content": user_input})

            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=messages,
                temperature=0.7,
                max_tokens=150
            )

            bot_reply = response.choices[0].message.content
            print(f"Sayno: {bot_reply}")

            messages.append({"role": "assistant", "content": bot_reply})

        except Exception as e:
            print(f"Error: {e}")
            break

if __name__ == "__main__":
    chat_with_sayno()
