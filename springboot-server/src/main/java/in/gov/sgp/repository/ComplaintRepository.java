package in.gov.sgp.repository;
import in.gov.sgp.model.*; import org.springframework.data.jpa.repository.JpaRepository; import java.time.Instant; import java.util.*;
public interface ComplaintRepository extends JpaRepository<Complaint,Long> {
 List<Complaint> findAllByOrderByCreatedAtDesc(); List<Complaint> findByCitizenOrderByCreatedAtDesc(User u);
 List<Complaint> findByAssignedStaffOrderByCreatedAtDesc(User u); long countByCitizen(User u); long countByCitizenAndStatus(User u,ComplaintStatus s);
 long countByAssignedStaff(User u); long countByAssignedStaffAndStatus(User u,ComplaintStatus s);
 long countByAssignedStaffAndStatusNotInAndCreatedAtBefore(User u,Collection<ComplaintStatus> s,Instant t);
 long countByStatus(ComplaintStatus s); List<Complaint> findByDepartment(Department d);
 long countByDepartment(Department d);
}
