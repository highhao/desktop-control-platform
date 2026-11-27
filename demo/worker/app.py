from typing import Literal
from fastapi import FastAPI
from fastapi.responses import PlainTextResponse

app = FastAPI(title="Portfolio Worker Demo")

@app.post("/analyze", response_class=PlainTextResponse)
def analyze(task: Literal["image", "text"]):
    # 固定示範資料，不擷取畫面、不執行實際辨識或遊戲操作。
    return "模擬畫面分析完成" if task == "image" else "模擬文字辨識完成"
