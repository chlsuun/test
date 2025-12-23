class SentimentAnalyzer:
    def __init__(self):
        self.positive_words = ["profit", "breakthrough", "booming", "record", "growth", "success"]
        self.negative_words = ["crisis", "breach", "tension", "fail", "loss", "crash", "worsens"]

    def analyze(self, headline):
        score = 0
        headline_lower = headline.lower()
        
        for word in self.positive_words:
            if word in headline_lower:
                score += 0.5
        
        for word in self.negative_words:
            if word in headline_lower:
                score -= 0.5
                
        # Clamp score between -1 and 1
        return max(min(score, 1.0), -1.0)

if __name__ == "__main__":
    analyzer = SentimentAnalyzer()
    print(f"Score: {analyzer.analyze('Tech Giant Announces Record Profits')}")
