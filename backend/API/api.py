from flask import Flask, jsonify, request
import grpc
from flask_cors import CORS

from TemperatureService.protofiles import temperature_pb2
from TemperatureService.protofiles import temperature_pb2_grpc

import requests
from dotenv import load_dotenv
import os
from API.profiles import ask_pb2
#from RestAPI.model_wrapper import ask_model

app = Flask(__name__)
#CORS(app, origins=["http://localhost:3000"])
CORS(app, origins="*")
channel = grpc.insecure_channel("temperatureservice:50051")
stub = temperature_pb2_grpc.TemperatureServiceStub(channel)

@app.route("/api/temperature/current", methods=["GET"])
def get_current_temperature():
    response = stub.GetCurrentTemperature(temperature_pb2.Empty())
    return jsonify({"value": response.value, "timestamp": response.timestamp})

# llm api
# 智能问答接口
# DeepSeek 的 OpenRouter API key
# 加载 .env 文件
load_dotenv(dotenv_path="./API/apikey.env")  # 默认会在当前目录或上级目录中查找 `.env`
DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY")
DEEPSEEK_URL = "https://openrouter.ai/api/v1/chat/completions"
if not DEEPSEEK_API_KEY:
    raise ValueError("DeepSeek API Key not found in .env file!")
print("API Key loaded successfully!")

@app.route("/api/ask", methods=["POST"])
def ask_ai():
    user_input = request.json.get("question", "")
    temperature_resp = stub.GetCurrentTemperature(temperature_pb2.Empty())
    current_temp = temperature_resp.value

    prompt = f"当前温度是 {current_temp}°C，用户问：{user_input}，请用简洁自然语言回答。"

    headers = {
        "Authorization": f"Bearer {DEEPSEEK_API_KEY}",
        "Content-Type": "application/json"
    }
    data = {
        "model": "deepseek/deepseek-chat-v3-0324:free",
        "messages": [{"role": "user", "content": prompt}]
    }

    resp = requests.post(DEEPSEEK_URL, headers=headers, json=data)
    if resp.status_code == 200:
        answer = resp.json()["choices"][0]["message"]["content"]
        return jsonify({"answer": answer})
    else:
        return jsonify({"error": resp.text}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001)
