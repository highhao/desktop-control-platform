from fastapi import FastAPI
from fastapi.responses import PlainTextResponse

app = FastAPI(title="Portfolio Worker Demo")

@app.post("/analyze", response_class=PlainTextResponse)
def analyze():
    # 示範回應；未擷取畫面，未執行遊戲邏輯或 OCR。
    return "模擬分析完成"
