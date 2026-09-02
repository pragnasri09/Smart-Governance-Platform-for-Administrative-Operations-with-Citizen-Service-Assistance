package in.gov.sgp.model;
import jakarta.persistence.*; import java.time.Instant;
@Entity @Table(name="notifications")
public class Notification {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id; @Column(nullable=false,columnDefinition="TEXT") private String message;
 @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="user_id",nullable=false) private User user; @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="complaint_id") private Complaint complaint;
 @Column(name="`read`",nullable=false) private boolean read=false; @Column(name="created_at",nullable=false) private Instant createdAt; @PrePersist void pre(){if(createdAt==null)createdAt=Instant.now();}
 public Long getId(){return id;} public String getMessage(){return message;} public User getUser(){return user;} public Complaint getComplaint(){return complaint;} public boolean isRead(){return read;} public Instant getCreatedAt(){return createdAt;}
 public void setMessage(String v){message=v;} public void setUser(User v){user=v;} public void setComplaint(Complaint v){complaint=v;}
}
