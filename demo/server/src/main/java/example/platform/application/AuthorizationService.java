package example.platform.application;
import org.springframework.stereotype.Service;
@Service
public class AuthorizationService {
    public boolean allowed(String user, String device) {
        // 只供示範元件分工，不是真實認證與授權機制。
        return "demo-user".equals(user) && "demo-device".equals(device);
    }
}
