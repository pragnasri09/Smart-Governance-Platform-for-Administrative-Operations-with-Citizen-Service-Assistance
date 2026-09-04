package in.gov.sgp.repository;
import in.gov.sgp.model.*; import org.springframework.data.jpa.repository.JpaRepository; import java.util.*;
public interface NotificationRepository extends JpaRepository<Notification,Long> { List<Notification> findByUserOrderByCreatedAtDesc(User user); long countByUser(User user); void deleteByComplaint(Complaint complaint); }
