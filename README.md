# 自動化與訊號分析平台

**技術：** Java 21、Spring Boot 3.3.1、PostgreSQL、Vue 3、Python 3.11+、FastAPI、OpenCV、OCR。

## 專案定位

中央服務協調身份、授權與任務；本機 Agent 執行工作，分析 Worker 處理觀測資料，目標專屬規則與知識由獨立模組管理。

## 架構重點

Server 管理平台狀態；Web UI 提供操作入口；Agent 負責本機執行；Worker 提供分析工具；目標模組承載專屬設定、規則與知識。

## 詳細文件

- [系統架構與元件分層](docs/architecture.md)
- [執行與知識流程](docs/workflow.md)

## 後續優化方向（設計建議）

- 為 Server、Agent 與 Worker 的版本化資料契約加入相容性檢查，並定義任務狀態轉換。
- 為任務識別碼與回報事件加入冪等處理及跨元件追蹤，支援重試與問題定位。

English: A multi-language automation and signal-analysis platform with central services, a local agent, and analysis workers.
