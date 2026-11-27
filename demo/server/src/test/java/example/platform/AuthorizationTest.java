package example.platform;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
@SpringBootTest @AutoConfigureMockMvc
class AuthorizationTest {
    @Autowired MockMvc mvc;
    @Test void allowsKnownDemoPairAndRejectsOtherUser() throws Exception {
        mvc.perform(get("/api/demo/authorization").param("user", "demo-user").param("device", "demo-device")).andExpect(status().isOk());
        mvc.perform(get("/api/demo/authorization").param("user", "other").param("device", "demo-device")).andExpect(status().isForbidden());
    }
}
