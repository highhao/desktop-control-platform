# 桌面控制任務流程

```mermaid
sequenceDiagram
    actor User as 使用者
    participant UI as Web UI
    participant Server
    participant Agent as Windows Agent
    participant Worker as Python Worker
    participant Desktop as 桌面環境

    User->>UI: 選擇裝置與控制任務
    UI->>Server: 驗證身份、裝置權限與任務政策
    Server-->>UI: 回傳允許操作的狀態／授權資料
    UI->>Agent: 透過本機 API 發出控制請求
    Agent->>Server: 確認／續期任務授權
    Server-->>Agent: 回覆允許狀態與規則版本
    Agent->>Desktop: 本機環境檢查與桌面操作
    opt 需要擷取或分析
        Agent->>Worker: 呼叫 OCR／影像／分析工具
        Worker-->>Agent: 回傳分析結果
    end
    Agent->>Server: 回報任務狀態、事件與結果
    Server-->>UI: 更新任務狀態
    UI-->>User: 顯示結果與狀態
```

## 執行責任

1. Web UI 負責人機操作與狀態呈現。
2. Server 檢查帳號、裝置和任務政策，並維護授權與規則狀態。
3. Agent 在受控電腦執行操作，管理工作階段並負責啟停與資源清理。
4. Worker 只在 Agent 呼叫時提供分析工具，回傳結果後由 Agent 繼續控制任務。
5. 執行觀測轉成標準事件；需判讀的未知結果進入確認流程，確認後再整理為版本化知識。

English: The Web UI requests a task, the Server authorizes it, the local Agent operates the desktop, and the Worker returns analysis results.
