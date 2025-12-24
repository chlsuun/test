# -*- coding: utf-8 -*-
import os
import re
import json
from collections import Counter

def extract_text_pdfplumber(pdf_path):
    """pdfplumber를 사용한 텍스트 추출"""
    try:
        import pdfplumber
        text = ""
        with pdfplumber.open(pdf_path) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text
        return text
    except Exception as e:
        print(f"Error: {e}")
        return None

def extract_keywords(text):
    """텍스트에서 핵심 키워드 추출"""
    words = re.findall(r'[가-힣]{2,}', text)
    stopwords = {'이다', '있다', '하다', '되다', '그것', '저것', '것이', '수가', '때문', '경우', '것은', '같은', '대한', '위해'}
    words = [w for w in words if w not in stopwords]
    return Counter(words)

def main():
    pdf_files = [
        '세이노판-16절-내지1.PDF',
        '세이노판-16절-내지2.PDF',
        '세이노판-16절-내지3.PDF',
        '세이노판-16절-내지4.PDF',
        '세이노판-16절-내지5.PDF'
    ]
    
    all_text = ""
    
    print("="*60)
    print("PDF Analysis Start")
    print("="*60)
    
    for pdf_file in pdf_files:
        if not os.path.exists(pdf_file):
            print(f"File not found: {pdf_file}")
            continue
        
        print(f"\nAnalyzing: {pdf_file}")
        text = extract_text_pdfplumber(pdf_file)
        
        if text:
            all_text += text
            print(f"  Extracted: {len(text)} chars")
        else:
            print(f"  Failed")
    
    if not all_text:
        print("\nNo text extracted")
        return
    
    print(f"\nTotal: {len(all_text)} chars")
    
    # 키워드 추출
    print("\n" + "="*60)
    print("Top 50 Keywords")
    print("="*60)
    
    keywords = extract_keywords(all_text)
    for word, count in keywords.most_common(50):
        print(f"{word:15s} : {count:5d}")
    
    # 결과 저장
    output = {
        'total_chars': len(all_text),
        'top_keywords': dict(keywords.most_common(100)),
        'sample_text': all_text[:1000]
    }
    
    with open('pdf_analysis_result.json', 'w', encoding='utf-8') as f:
        json.dump(output, f, ensure_ascii=False, indent=2)
    
    print("\nAnalysis complete! Saved to: pdf_analysis_result.json")

if __name__ == "__main__":
    main()
