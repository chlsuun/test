import json
import os
import openai
from dotenv import load_dotenv

load_dotenv()

class DetectiveGame:
    def __init__(self, evidence_path="detective/evidence.json"):
        # Fix path if running from different dir
        if not os.path.exists(evidence_path):
             # try relative to file
             evidence_path = os.path.join(os.path.dirname(__file__), "evidence.json")

        with open(evidence_path, 'r', encoding='utf-8') as f:
            self.data = json.load(f)
        
        self.suspect = self.data['suspect_profile']
        self.context = self.data['evidence']
        
        # Simple RAG: Just dump all evidence into context for this small demo
        self.evidence_text = "\n".join([f"- {e['description']}" for e in self.context])

    def interact(self, user_input, client):
        system_prompt = f"""
        You are {self.suspect['name']}, {self.suspect['role']}.
        Personality: {self.suspect['personality']}
        
        The Situation: {self.data['crime']['event']}
        
        Secret Truth (DO NOT REVEAL EASILY): {self.suspect['secret']}
        
        Known Evidence against you:
        {self.evidence_text}
        
        Goal:
        - Defend yourself against the detective (user).
        - Lie if necessary to cover your secret.
        - If the user presents undeniable proof (like the witness testimony contradicting your alibi), act flustered or try to make a new excuse.
        """
        
        try:
            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_input}
                ],
                temperature=0.8
            )
            return response.choices[0].message.content
        except Exception as e:
            return f"Error: {e}"

if __name__ == "__main__":
    # Test
    pass
