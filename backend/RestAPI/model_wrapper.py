import requests

def ask_model(question: str, context: str) -> str:
    prompt = f"用户问：{question}\n\n背景信息：{context}\n\n请生成简洁的回答："
    headers = {
        "Authorization": "Bearer YOUR_API_KEY",
        "Content-Type": "application/json"
    }
    payload = {
        "model": "deepseek-chat",
        "messages": [{"role": "user", "content": prompt}],
    }
    resp = requests.post("https://api.deepseek.com/v1/chat/completions", headers=headers, json=payload)
    return resp.json()["choices"][0]["message"]["content"]