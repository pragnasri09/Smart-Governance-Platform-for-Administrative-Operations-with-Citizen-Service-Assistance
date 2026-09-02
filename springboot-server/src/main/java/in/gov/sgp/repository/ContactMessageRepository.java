package in.gov.sgp.repository;
import in.gov.sgp.model.ContactMessage; import org.springframework.data.jpa.repository.JpaRepository;
public interface ContactMessageRepository extends JpaRepository<ContactMessage,Long> {}
