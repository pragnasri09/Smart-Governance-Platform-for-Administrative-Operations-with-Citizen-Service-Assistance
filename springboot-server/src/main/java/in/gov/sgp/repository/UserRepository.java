package in.gov.sgp.repository;
import in.gov.sgp.model.*; import org.springframework.data.jpa.repository.JpaRepository; import org.springframework.transaction.annotation.Transactional; import java.util.*;
public interface UserRepository extends JpaRepository<User,Long> {
 Optional<User> findByEmailIgnoreCase(String email);
 List<User> findAllByOrderByCreatedAtDesc();
 List<User> findByNameContainingIgnoreCaseOrEmailContainingIgnoreCaseOrderByCreatedAtDesc(String name,String email);
 List<User> findByRole(Role role);
 @Transactional
 void deleteByEmailIgnoreCase(String email);
 List<User> findByRoleOrderByCreatedAtDesc(Role role);
 List<User> findByRoleAndDepartmentOrderByCreatedAtAsc(Role role, Department department);
}
