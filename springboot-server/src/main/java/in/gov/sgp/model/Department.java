package in.gov.sgp.model;
import jakarta.persistence.*; import java.time.Instant;
@Entity @Table(name="departments")
public class Department {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @Column(nullable=false, length=120, unique=true) private String name;
 @Column(nullable=false,columnDefinition="TEXT") private String description;
 @Column(nullable=false) private boolean active=true; @Column(name="created_at",nullable=false) private Instant createdAt;
 @PrePersist void pre(){if(createdAt==null)createdAt=Instant.now();}
 public Long getId(){return id;} public String getName(){return name;} public String getDescription(){return description;} public boolean isActive(){return active;} public Instant getCreatedAt(){return createdAt;}
 public void setName(String v){name=v;} public void setDescription(String v){description=v;} public void setActive(boolean v){active=v;}
}
