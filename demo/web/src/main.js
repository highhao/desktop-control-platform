import { createApp, ref } from "vue";
createApp({
  setup() {
    const user = ref("demo-user");
    const status = ref("等待操作");
    const busy = ref(false);
    async function runTask() {
      busy.value = true;
      status.value = "Agent 正在確認授權並處理任務…";
      try {
        const response = await fetch(`/agent/api/demo/task?${encodeURIComponent(user.value)}`, { method: "POST" });
        const result = await response.text();
        status.value = response.ok ? result : response.status === 403 ? "Server：此使用者沒有裝置授權，Agent 未啟動任務。" : `任務未完成：${result}`;
      } catch { status.value = "無法連接本機 Agent"; }
      finally { busy.value = false; }
    }
    return { user, status, busy, runTask };
  },
  template: `<main class="page"><header><h1>多使用者平台協作示範</h1><p>使用虛構帳號與裝置，觀察授權和任務執行結果。</p></header><section><h2>選擇使用者</h2><label for="user">模擬帳號</label><select id="user" v-model="user"><option value="demo-user">使用者 A · 有裝置授權</option><option value="other-user">使用者 B · 無裝置授權</option></select><p>裝置：示範電腦</p><button @click="runTask" :disabled="busy">啟動示範任務</button></section><section aria-live="polite"><h2>執行狀態</h2><p>{{ status }}</p></section><p class="hint">Web UI → Agent → Server 授權 → Worker 模擬分析。此示範不操作遊戲或桌面。</p></main>`,
}).mount("#app");
