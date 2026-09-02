package in.gov.sgp.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import in.gov.sgp.model.*;
import jakarta.validation.constraints.*;
import java.time.Instant;
import java.util.*;

public final class Dtos {
 private Dtos(){}
 public record UserDto(Long id,String name,String email,Role role,Long departmentId,String departmentName,Instant createdAt){}
 public record DepartmentDto(Long id,String name,String description,boolean active,Instant createdAt){}
 @JsonInclude(JsonInclude.Include.ALWAYS)
 public record ComplaintDto(Long id,String reference,String title,String category,String description,String location,Double latitude,Double longitude,ComplaintStatus status,Long citizenId,String citizenName,Long departmentId,String departmentName,Long assignedStaffId,String assignedStaffName,String remarks,String resolution,Instant createdAt,Instant updatedAt){}
 public record NotificationDto(Long id,String message,Long complaintId,String complaintReference,boolean read,Instant createdAt){}
 public record AuthResponse(String token,UserDto user){}
 public record ErrorResponse(String error){}
 public record MessageResponse(String message){}
 public record HealthStatus(String status){}
 public record CitizenDashboard(long total,long pending,long inProgress,long resolved,List<ComplaintDto> recent){}
 public record StaffDashboard(long assigned,long inProgress,long resolved,long overdue,List<ComplaintDto> recent){}
 public record DepartmentBreakdown(String department,long count){}
 public record AdminDashboard(long totalUsers,long totalComplaints,long resolvedComplaints,long departments,Map<String,Long> statusBreakdown,List<DepartmentBreakdown> departmentBreakdown,List<ComplaintDto> recent){}
 public record RegisterRequest(@NotBlank @Size(min=2) String name,@NotBlank @Email String email,@NotBlank @Size(min=8) String password,@NotNull Role role,Long departmentId){}
 public record LoginRequest(@NotBlank @Email String email,@NotBlank String password){}
 public record DepartmentRequest(@NotBlank @Size(min=2) String name,@NotBlank @Size(min=5) String description){}
 public record ComplaintRequest(@NotBlank @Size(min=3) String title,@NotBlank @Size(min=2) String category,@NotNull Long departmentId,@NotBlank @Size(min=10) String description,@NotBlank @Size(min=2) String location,@NotNull @DecimalMin("-90.0") @DecimalMax("90.0") Double latitude,@NotNull @DecimalMin("-180.0") @DecimalMax("180.0") Double longitude){}
 public record ComplaintUpdate(@NotNull ComplaintStatus status,String remarks,String resolution,Long assignedStaffId){}
 public record ContactRequest(@NotBlank @Size(min=2) String name,@NotBlank @Email String email,@NotBlank @Size(min=3) String subject,@NotBlank @Size(min=10) String message){}
}
