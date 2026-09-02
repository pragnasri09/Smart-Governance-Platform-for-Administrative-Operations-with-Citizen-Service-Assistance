package in.gov.sgp.model;
import jakarta.persistence.*; import java.time.Instant;
@Entity @Table(name="users")
public class User {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @Column(nullable=false,length=120) private String name; @Column(nullable=false,unique=true,length=255) private String email;
 @Column(name="password_hash",nullable=false,length=255) private String passwordHash; @Enumerated(EnumType.STRING) @Column(nullable=false,length=20) private Role role;
 @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="department_id") private Department department;
 @Column(name="created_at",nullable=false) private Instant createdAt; @PrePersist void pre(){if(createdAt==null)createdAt=Instant.now();}
 public Long getId(){return id;} public String getName(){return name;} public String getEmail(){return email;} public String getPasswordHash(){return passwordHash;} public Role getRole(){return role;} public Department getDepartment(){return department;} public Instant getCreatedAt(){return createdAt;}
 public void setName(String v){name=v;} public void setEmail(String v){email=v;} public void setPasswordHash(String v){passwordHash=v;} public void setRole(Role v){role=v;} public void setDepartment(Department v){department=v;}
}
