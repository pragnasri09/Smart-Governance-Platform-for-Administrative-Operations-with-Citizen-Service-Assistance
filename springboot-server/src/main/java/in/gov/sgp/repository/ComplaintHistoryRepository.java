package in.gov.sgp.repository;

import in.gov.sgp.model.*;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ComplaintHistoryRepository extends JpaRepository<ComplaintHistory, Long> {
    List<ComplaintHistory> findByComplaintOrderByEventAtAsc(Complaint complaint);
    void deleteByComplaint(Complaint complaint);
}
