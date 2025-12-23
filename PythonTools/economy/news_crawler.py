import random

class NewsCrawler:
    def __init__(self):
        self.mock_news = [
            {"headline": "Tech Giant Announces Record Profits", "category": "Tech"},
            {"headline": "Global Supply Chain Crisis Worsens", "category": "Economy"},
            {"headline": "New Medical Breakthrough Cures Rare Disease", "category": "Health"},
            {"headline": "Major Bank Reports Security Breach", "category": "Finance"},
            {"headline": "Oil Prices Skyrocket Amidst Tensions", "category": "Energy"},
            {"headline": "Startups booming in the AI sector", "category": "Tech"}
        ]

    def get_latest_news(self, count=3):
        return random.sample(self.mock_news, min(count, len(self.mock_news)))

if __name__ == "__main__":
    crawler = NewsCrawler()
    print(crawler.get_latest_news())
