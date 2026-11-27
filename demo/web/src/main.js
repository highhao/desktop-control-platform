import { createApp, ref } from "vue/dist/vue.esm-bundler.js";
createApp({
  setup() {
    const user = ref("demo-user"), task = ref("image"), busy = ref(false);
    const result = ref("尚未啟動任務");
    const summary = ref(null);
    const steps = ref(["等待操作", "等待授權", "等待任務", "等待呼叫"]);
    async function runTask() {
      busy.value = true; result.value = "處理中…"; summary.value = null;
      steps.value = ["已送出", "確認中", "等待授權", "等待呼叫"];
      try {
        const params = new URLSearchParams({ user: user.value, task: task.value });
        const response = await fetch(`/agent/api/demo/task?${params}`, { method: "POST" });
        const text = await response.text();
        if (response.ok) {
          steps.value = ["已送出", "授權通過", "示範任務已執行", "已回傳模擬結果"];
          result.value = text;
          summary.value = { runId: response.headers.get("X-Demo-Run-Id") || "無", user: user.value === "demo-user" ? "使用者 A" : "使用者 B", device: "示範電腦", task: task.value === "image" ? "示範畫面分析" : "示範文字辨識", status: "模擬完成" };
        } else if (response.status === 403) {
          steps.value = ["已送出", "授權拒絕", "未啟動", "未呼叫"];
          result.value = "此使用者沒有示範裝置的授權，任務未啟動。";
          summary.value = { runId: "未建立", user: "使用者 B", device: "示範電腦", task: task.value === "image" ? "示範畫面分析" : "示範文字辨識", status: "授權拒絕" };
        } else {
          steps.value = ["已送出", "無法確認", "未完成", "未完成"];
          result.value = `服務無法完成請求：${text}`;
        }
      } catch {
        steps.value = ["已送出", "無法連線", "未啟動", "未呼叫"];
        result.value = "無法連接本機 Agent，請確認服務已啟動。";
      } finally { busy.value = false; }
    }
    function reset() { steps.value = ["等待操作", "等待授權", "等待任務", "等待呼叫"]; result.value = "尚未啟動任務"; summary.value = null; }
    return { user, task, busy, steps, result, summary, runTask, reset };
  },
  template: `<main class="page"><header><h1>本機遊戲任務示範</h1><p>使用者透過網頁，在自己的電腦啟動任務。平台先確認使用資格，通過後才讓本機程式執行。</p></header>
  <section><h2>1 · 選擇示範情境</h2><p class="hint">先選擇使用者 A 試一次，再選使用者 B，比較能否啟動任務。</p><label for="user">使用者與裝置權限</label><select id="user" v-model="user" @change="reset"><option value="demo-user">使用者 A｜可使用示範電腦</option><option value="other-user">使用者 B｜不可使用示範電腦</option></select><label for="task">要在電腦上執行的任務</label><select id="task" v-model="task" @change="reset"><option value="image">示範畫面分析</option><option value="text">示範文字辨識</option></select><p>目標裝置：示範電腦</p><button @click="runTask" :disabled="busy">啟動示範任務</button></section>
  <section aria-live="polite"><h2>2 · 執行結果</h2><p v-if="!summary">{{ result }}</p><div v-if="summary" class="summary"><p><strong>{{ summary.status }}</strong></p><p>使用者：{{ summary.user }}｜裝置：{{ summary.device }}</p><p>任務：{{ summary.task }}</p><p>示範執行編號：{{ summary.runId }}</p><p>{{ result }}</p></div>
  <details><summary>查看各元件如何合作</summary><div class="grid"><div class="card"><strong>Web UI</strong><small>接收使用者操作</small><p>{{ steps[0] }}</p></div><div class="card"><strong>Java Server</strong><small>確認帳號與裝置授權</small><p>{{ steps[1] }}</p></div><div class="card"><strong>Windows Agent</strong><small>負責本機任務</small><p>{{ steps[2] }}</p></div><div class="card"><strong>Python Worker</strong><small>提供分析能力</small><p>{{ steps[3] }}</p></div></div></details></section>
  <p class="hint">帳號、裝置與結果皆為虛構；此示範不會控制遊戲或擷取畫面。</p></main>`,
}).mount("#app");
