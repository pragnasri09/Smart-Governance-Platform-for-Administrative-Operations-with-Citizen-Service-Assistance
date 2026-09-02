package in.gov.sgp.repository;
import in.gov.sgp.model.Department; import org.springframework.data.jpa.repository.JpaRepository; import java.util.*;
public interface DepartmentRepository extends JpaRepository<Department,Long> { List<Department> findByActiveTrueOrderByNameAsc(); Optional<Department> findByNameIgnoreCase(String name); }
