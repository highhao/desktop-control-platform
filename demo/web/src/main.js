import { createApp, ref } from "vue";
createApp({
  setup() {
    const status = ref("等待操作");
    async function runTask() {
      status.value = "執行中";
      try {
        const response = await fetch("/agent/api/demo/task", { method: "POST" });
        const result = await response.text();
        status.value = response.ok ? result : `任務未完成：${result}`;
      } catch { status.value = "無法連接本機 Agent"; }
    }
    return { status, runTask };
  },
  template: `<main style="font:16px system-ui;max-width:42rem;margin:4rem auto;padding:0 1rem;line-height:1.7"><h1>平台協作示範</h1><p>虛構使用者與裝置；示範元件協作。</p><button @click="runTask">執行示範任務</button><p>狀態：{{ status }}</p></main>`,
}).mount("#app");
