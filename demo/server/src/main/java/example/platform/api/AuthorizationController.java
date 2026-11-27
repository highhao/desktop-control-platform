package example.platform.api;
import example.platform.application.AuthorizationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
@RestController
@RequestMapping("/api/demo")
public class AuthorizationController {
    private final AuthorizationService service;
    public AuthorizationController(AuthorizationService service) { this.service = service; }
    @GetMapping("/authorization")
    public ResponseEntity<String> authorize(@RequestParam String user, @RequestParam String device) {
        return service.allowed(user, device) ? ResponseEntity.ok("ALLOW") : ResponseEntity.status(403).body("DENY");
    }
}
