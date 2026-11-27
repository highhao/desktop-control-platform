import { createApp, ref } from "vue/dist/vue.esm-bundler.js";
createApp({
  setup() {
    const user = ref("demo-user"), task = ref("image"), busy = ref(false);
    const result = ref("尚未啟動任務");
    const steps = ref(["等待操作", "等待授權", "等待任務", "等待呼叫"]);
    async function runTask() {
      busy.value = true; result.value = "處理中…";
      steps.value = ["已送出", "確認中", "等待授權", "等待呼叫"];
      try {
        const params = new URLSearchParams({ user: user.value, task: task.value });
        const response = await fetch(`/agent/api/demo/task?${params}`, { method: "POST" });
        const text = await response.text();
        if (response.ok) {
          steps.value = ["已送出", "授權通過", "示範任務已執行", "已回傳模擬結果"];
          result.value = text;
        } else if (response.status === 403) {
          steps.value = ["已送出", "授權拒絕", "未啟動", "未呼叫"];
          result.value = "此使用者沒有示範裝置的授權。";
        } else {
          steps.value = ["已送出", "無法確認", "未完成", "未完成"];
          result.value = `服務無法完成請求：${text}`;
        }
      } catch {
        steps.value = ["已送出", "無法連線", "未啟動", "未呼叫"];
        result.value = "無法連接本機 Agent，請確認服務已啟動。";
      } finally { busy.value = false; }
    }
    function reset() { steps.value = ["等待操作", "等待授權", "等待任務", "等待呼叫"]; result.value = "尚未啟動任務"; }
    return { user, task, busy, steps, result, runTask, reset };
  },
  template: `<main class="page"><header><h1>遊戲任務授權與執行示範</h1><p>情境：使用者從網頁選擇自己電腦上的遊戲任務。平台確認這個使用者能否使用該裝置，再由本機程式執行示範任務。</p><p class="hint">試試看：先選使用者 A 啟動任務，再切換使用者 B，比較授權結果。</p></header>
  <section><h2>1 · 選擇情境</h2><label for="user">示範使用者</label><select id="user" v-model="user" @change="reset"><option value="demo-user">使用者 A · 有裝置授權</option><option value="other-user">使用者 B · 無裝置授權</option></select><label for="task">想執行的示範任務</label><select id="task" v-model="task" @change="reset"><option value="image">示範畫面分析</option><option value="text">示範文字辨識</option></select><p>裝置：示範電腦</p><button @click="runTask" :disabled="busy">啟動示範任務</button></section>
  <section aria-live="polite"><h2>2 · 元件處理狀態</h2><div class="grid"><div class="card"><strong>網頁</strong><small>送出使用者的操作</small><p>{{ steps[0] }}</p></div><div class="card"><strong>平台 Server</strong><small>確認使用資格</small><p>{{ steps[1] }}</p></div><div class="card"><strong>本機 Agent</strong><small>管理任務執行</small><p>{{ steps[2] }}</p></div><div class="card"><strong>分析 Worker</strong><small>提供模擬分析結果</small><p>{{ steps[3] }}</p></div></div><p><strong>結果：</strong>{{ result }}</p></section>
  <p class="hint">以上帳號、裝置與分析結果皆為虛構；不會登入、控制遊戲或擷取畫面。</p></main>`,
}).mount("#app");
