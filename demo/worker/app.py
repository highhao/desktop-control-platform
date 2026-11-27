from typing import Literal
from fastapi import FastAPI
from fastapi.responses import PlainTextResponse

app = FastAPI(title="Portfolio Worker Demo")

@app.post("/analyze", response_class=PlainTextResponse)
def analyze(task: Literal["image", "text"]):
    # 固定示範資料，不擷取畫面、不執行實際辨識或遊戲操作。
    return "示範畫面 A：模擬分析完成" if task == "image" else "示範文字：READY（模擬結果）"
