# 桌面端控制與自動化平台

將平台授權與本機桌面操作分開，讓 Server 管理任務權限，由 Windows Agent 在受控電腦執行操作。

## 元件與技術

- **Web UI｜Vue 3：** 操作入口、裝置與任務狀態呈現。
- **Server｜Java 21、Spring Boot 3.3.1、PostgreSQL：** 身份、權限、裝置政策與任務狀態。
- **Windows Agent｜Java：** 本機桌面控制、任務生命週期與資源清理。
- **Python Worker｜Python、FastAPI、OpenCV、OCR：** Agent 按需呼叫的影像擷取與分析工具。

## 任務流程

1. 使用者在操作介面選擇裝置與任務。
2. Server 檢查身份、裝置權限與任務政策。
3. Agent 在本機檢查環境並執行桌面操作。
4. 需要影像或文字分析時，Agent 呼叫 Worker 取得結果。
5. Agent 回報任務狀態；Server 更新狀態供介面呈現。

## 架構邊界

Server 是授權與平台狀態的依據；Agent 負責本機執行和清理；Worker 只提供分析工具，不負責整體任務控制。

## English

The Server authorizes tasks, the local Agent controls the desktop, and the Worker provides analysis tools.
