import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpServer;
import java.io.IOException;
import java.net.InetSocketAddress;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;

/** 簡化的本機 Agent：不執行桌面控制，不包含正式授權機制。 */
public class Agent {
    private static final HttpClient CLIENT = HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(3)).build();
    public static void main(String[] args) throws IOException {
        HttpServer server = HttpServer.create(new InetSocketAddress("127.0.0.1", 18082), 0);
        server.createContext("/api/demo/task", Agent::startTask);
        server.start();
        System.out.println("Demo Agent listening on localhost:18082");
    }
    private static void startTask(HttpExchange exchange) throws IOException {
        if (!"POST".equals(exchange.getRequestMethod())) { respond(exchange, 405, "method not allowed"); return; }
        String user = exchange.getRequestURI().getRawQuery();
        if (!"demo-user".equals(user) && !"other-user".equals(user)) {
            respond(exchange, 400, "invalid demo user"); return;
        }
        try {
            HttpRequest auth = HttpRequest.newBuilder(URI.create("http://127.0.0.1:18081/api/demo/authorization?user=" + user + "&device=demo-device")).timeout(Duration.ofSeconds(3)).GET().build();
            HttpResponse<String> decision = CLIENT.send(auth, HttpResponse.BodyHandlers.ofString());
            if (decision.statusCode() != 200 || !"ALLOW".equals(decision.body())) { respond(exchange, 403, "authorization denied"); return; }
            HttpRequest work = HttpRequest.newBuilder(URI.create("http://127.0.0.1:18083/analyze")).timeout(Duration.ofSeconds(3)).POST(HttpRequest.BodyPublishers.noBody()).build();
            HttpResponse<String> result = CLIENT.send(work, HttpResponse.BodyHandlers.ofString());
            if (result.statusCode() != 200) { respond(exchange, 502, "worker unavailable"); return; }
            respond(exchange, 200, "Agent：授權通過 → 任務啟動 → Worker：" + result.body());
        } catch (InterruptedException ex) {
            Thread.currentThread().interrupt(); respond(exchange, 503, "request interrupted");
        } catch (IOException ex) { respond(exchange, 503, "service unavailable"); }
    }
    private static void respond(HttpExchange exchange, int status, String body) throws IOException {
        byte[] bytes = body.getBytes(StandardCharsets.UTF_8);
        exchange.getResponseHeaders().set("Content-Type", "text/plain; charset=utf-8");
        exchange.sendResponseHeaders(status, bytes.length);
        try (var stream = exchange.getResponseBody()) { stream.write(bytes); }
    }
}
