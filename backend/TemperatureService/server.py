from concurrent import futures
import grpc
import time
from datetime import datetime
import psycopg2

from TemperatureService.protofiles import temperature_pb2
from TemperatureService.protofiles import temperature_pb2_grpc

DB_CONFIG = {
    "host": "postgres",        # docker-compose 中 postgres 容器的名称
    "database": "temperature_db",
    "user": "postgres",
    "password": "password"
}

class TemperatureService(temperature_pb2_grpc.TemperatureServiceServicer):
    def __init__(self):
        self.conn = psycopg2.connect(**DB_CONFIG)
        self.cursor = self.conn.cursor()

    #def GetCurrentTemperature(self, request, context):
    #    # 模拟从数据库获取最新温度
    #   temp = 25.0 + (datetime.now().second % 10)  # 模拟波动
    #    return temperature_pb2.Temperature(value=temp, timestamp=datetime.now().isoformat())

    def GetCurrentTemperature(self, request, context):
        try:
            conn = psycopg2.connect(**DB_CONFIG)
            cur = conn.cursor()
            cur.execute("SELECT value, timestamp FROM temperature_data ORDER BY timestamp DESC LIMIT 1;")
            row = cur.fetchone()
            cur.close()
            conn.close()

            if row:
                value, timestamp = row
                return temperature_pb2.Temperature(value=value, timestamp=timestamp.isoformat())
            else:
                context.set_code(grpc.StatusCode.NOT_FOUND)
                context.set_details("No data")
                return temperature_pb2.Temperature()

        except Exception as e:
            context.set_code(grpc.StatusCode.INTERNAL)
            context.set_details(f"Database error: {str(e)}")
            return temperature_pb2.Temperature()
        
    #def StreamTemperature(self, request, context):
    #    # 流式推送温度数据
    #    while True:
    #        temp = 25.0 + (datetime.now().second % 10)
    #        yield temperature_pb2.Temperature(value=temp, timestamp=datetime.now().isoformat())
    #        time.sleep(1)

    def StreamTemperature(self, request, context):
        try:
            while True:
                conn = psycopg2.connect(**DB_CONFIG)
                cur = conn.cursor()
                cur.execute("SELECT value, timestamp FROM temperature_data ORDER BY timestamp DESC LIMIT 1;")
                row = cur.fetchone()
                cur.close()
                conn.close()

                if row:
                    value, timestamp = row
                    yield temperature_pb2.Temperature(value=value, timestamp=timestamp.isoformat())
                else:
                    # yield 空对象也行
                    yield temperature_pb2.Temperature(value=0.0, timestamp=datetime.now().isoformat())

                time.sleep(1)
        except Exception as e:
            context.set_code(grpc.StatusCode.INTERNAL)
            context.set_details(f"Database error: {str(e)}")
            return

def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    temperature_pb2_grpc.add_TemperatureServiceServicer_to_server(TemperatureService(), server)
    server.add_insecure_port("[::]:50051")
    server.start()
    server.wait_for_termination()

if __name__ == "__main__":
    serve()
