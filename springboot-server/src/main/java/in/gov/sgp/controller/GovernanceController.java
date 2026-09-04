package in.gov.sgp.controller;
import in.gov.sgp.dto.Dtos.*; import in.gov.sgp.model.*; import in.gov.sgp.service.GovernanceService; import jakarta.validation.Valid; import org.springframework.http.*; import org.springframework.security.core.Authentication; import org.springframework.security.access.prepost.PreAuthorize; import org.springframework.web.bind.annotation.*; import java.util.*;

@RestController @RequestMapping("/api")
public class GovernanceController {
 private final GovernanceService service; public GovernanceController(GovernanceService s){service=s;}
 @PostMapping("/auth/register") public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest x){return ResponseEntity.status(201).body(service.register(x));}
 @PostMapping("/auth/login") public AuthResponse login(@Valid @RequestBody LoginRequest x){return service.login(x);}
 @GetMapping("/auth/me") public UserDto me(Authentication a){return service.currentDto(a);}
 @GetMapping("/users/profile") public UserDto profile(Authentication a){return service.currentDto(a);}
 @PutMapping("/users/profile") public UserDto updateProfile(Authentication a,@Valid @RequestBody ProfileUpdateRequest x){return service.updateProfile(a,x);}
 @GetMapping("/users") @PreAuthorize("hasRole('ADMIN')") public List<UserDto> users(@RequestParam(required=false)String search,@RequestParam(required=false)Role role){return service.listUsers(search,role);}
 @GetMapping("/departments") public List<DepartmentDto> departments(){return service.listDepartments();}
 @PostMapping("/departments") @PreAuthorize("hasRole('ADMIN')") public ResponseEntity<DepartmentDto> createDepartment(@Valid @RequestBody DepartmentRequest x){return ResponseEntity.status(201).body(service.createDepartment(x));}
 @PutMapping("/departments/{id}") @PreAuthorize("hasRole('ADMIN')") public DepartmentDto updateDepartment(@PathVariable long id,@Valid @RequestBody DepartmentRequest x){return service.updateDepartment(id,x);}
 @DeleteMapping("/departments/{id}") @PreAuthorize("hasRole('ADMIN')") public ResponseEntity<Void> deleteDepartment(@PathVariable long id){service.deleteDepartment(id);return ResponseEntity.noContent().build();}
 @PostMapping("/complaints") @PreAuthorize("hasRole('CITIZEN')") public ResponseEntity<ComplaintDto> createComplaint(Authentication a,@Valid @RequestBody ComplaintRequest x){return ResponseEntity.status(201).body(service.createComplaint(a,x));}
 @GetMapping("/complaints/my") @PreAuthorize("hasRole('CITIZEN')") public List<ComplaintDto> my(Authentication a,@RequestParam(required=false)String search,@RequestParam(required=false)ComplaintStatus status){return service.myComplaints(a,search,status);}
 @GetMapping("/complaints/assigned") @PreAuthorize("hasRole('STAFF')") public List<ComplaintDto> assigned(Authentication a,@RequestParam(required=false)String search,@RequestParam(required=false)ComplaintStatus status){return service.assigned(a,search,status);}
 @GetMapping("/complaints") @PreAuthorize("hasRole('ADMIN')") public List<ComplaintDto> complaints(@RequestParam(required=false)String search,@RequestParam(required=false)ComplaintStatus status,@RequestParam(required=false)Long departmentId){return service.allComplaints(search,status,departmentId);}
 @DeleteMapping("/complaints/{id}") @PreAuthorize("hasRole('ADMIN')") public ResponseEntity<Void> deleteComplaint(@PathVariable long id){service.deleteComplaint(id);return ResponseEntity.noContent().build();}
 @GetMapping("/complaints/{id}") public ComplaintDto complaint(Authentication a,@PathVariable long id){return service.getComplaint(a,id);}
 @PutMapping("/complaints/{id}") @PreAuthorize("hasAnyRole('STAFF','ADMIN')") public ComplaintDto updateComplaint(Authentication a,@PathVariable long id,@Valid @RequestBody ComplaintUpdate x){return service.updateComplaint(a,id,x);}
 @GetMapping("/notifications") public List<NotificationDto> notifications(Authentication a){return service.notifications(a);}
 @PostMapping("/contact") public ResponseEntity<MessageResponse> contact(@Valid @RequestBody ContactRequest x){service.contact(x);return ResponseEntity.status(201).body(new MessageResponse("Thank you. Your message has been received by the SGP team."));}
 @GetMapping("/dashboard/citizen") @PreAuthorize("hasRole('CITIZEN')") public CitizenDashboard citizenDashboard(Authentication a){return service.citizenDashboard(a);}
 @GetMapping("/dashboard/staff") @PreAuthorize("hasRole('STAFF')") public StaffDashboard staffDashboard(Authentication a){return service.staffDashboard(a);}
 @GetMapping("/dashboard/admin") @PreAuthorize("hasRole('ADMIN')") public AdminDashboard adminDashboard(){return service.adminDashboard();}
}
