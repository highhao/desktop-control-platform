# 多使用者遊戲操作平台

獨立設計與開發多使用者平台，透過 Web 控制台管理帳號、裝置與任務，由客戶端執行本機操作，並將遊戲相關工具與分析能力拆分。

## 系統架構與流程

```mermaid
flowchart TB
    User[使用者] --> UI
    subgraph Client["使用者的 Windows 電腦"]
        UI[瀏覽器 Web UI]
        Agent[Windows Agent]
        Worker[Python Worker]
        UI -->|本機操作命令| Agent
        Agent -->|按需呼叫| Worker
    end
    Server[平台端 Java Server<br/>帳號、裝置與授權]
    UI -->|登入與授權| Server
    Agent -->|授權確認與狀態回報| Server
```

使用者登入並選擇裝置及任務；Web UI 向 Server 取得授權後，向本機 Agent 發出操作命令。Agent 管理任務啟停與資源清理，並按需呼叫 Worker 的影像、OCR 與遊戲相關能力，再回報狀態。

## 設計考量

- **多客戶授權：**集中管理帳號、裝置歸屬與授權狀態，區分一般使用者及管理員權限。
- **平台與本機分工：**Server 管理平台政策；Agent 管理本機任務生命週期與執行資源。
- **遊戲能力拆分：**將遊戲相關處理與分析工具放在 Worker，讓平台共用功能與遊戲模組各自演進。

**技術：**Vue 3、Java 21、Spring Boot、PostgreSQL、Python、FastAPI、OpenCV、OCR。

## 程式分層

[查看元件職責與程式分層](architecture-demo.md)
