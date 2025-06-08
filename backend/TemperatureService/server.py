from concurrent import futures
import grpc
import time
from datetime import datetime
import psycopg2

from TemperatureService.protofiles import temperature_pb2
from TemperatureService.protofiles import temperature_pb2_grpc

class TemperatureService(temperature_pb2_grpc.TemperatureServiceServicer):
    def GetCurrentTemperature(self, request, context):
        # 模拟从数据库获取最新温度
        temp = 25.0 + (datetime.now().second % 10)  # 模拟波动
        return temperature_pb2.Temperature(value=temp, timestamp=datetime.now().isoformat())

    def StreamTemperature(self, request, context):
        # 流式推送温度数据
        while True:
            temp = 25.0 + (datetime.now().second % 10)
            yield temperature_pb2.Temperature(value=temp, timestamp=datetime.now().isoformat())
            time.sleep(1)

def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    temperature_pb2_grpc.add_TemperatureServiceServicer_to_server(TemperatureService(), server)
    server.add_insecure_port("[::]:50051")
    server.start()
    server.wait_for_termination()

if __name__ == "__main__":
    serve()
