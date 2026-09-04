package in.gov.sgp.controller;
import in.gov.sgp.dto.Dtos.HealthStatus; import org.springframework.web.bind.annotation.*;
@RestController @RequestMapping("/api") public class HealthController { @GetMapping({"/healthz","/health"}) public HealthStatus health(){return new HealthStatus("ok");} }
