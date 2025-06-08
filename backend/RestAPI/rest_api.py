from flask import Flask, jsonify
import grpc
from flask_cors import CORS

from TemperatureService.protofiles import temperature_pb2
from TemperatureService.protofiles import temperature_pb2_grpc


app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"])
channel = grpc.insecure_channel("temperatureservice:50051")
stub = temperature_pb2_grpc.TemperatureServiceStub(channel)

@app.route("/api/temperature/current", methods=["GET"])
def get_current_temperature():
    response = stub.GetCurrentTemperature(temperature_pb2.Empty())
    return jsonify({"value": response.value, "timestamp": response.timestamp})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001)
