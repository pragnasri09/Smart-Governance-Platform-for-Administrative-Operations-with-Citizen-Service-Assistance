package in.gov.sgp.model;
import jakarta.persistence.*; import java.time.Instant;
@Entity @Table(name="contact_messages")
public class ContactMessage {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id; @Column(nullable=false,length=120) private String name; @Column(nullable=false,length=255) private String email; @Column(nullable=false,length=180) private String subject; @Column(nullable=false,columnDefinition="TEXT") private String message; @Column(name="created_at",nullable=false) private Instant createdAt;
 @PrePersist void pre(){if(createdAt==null)createdAt=Instant.now();}
 public void setName(String v){name=v;} public void setEmail(String v){email=v;} public void setSubject(String v){subject=v;} public void setMessage(String v){message=v;}
}
