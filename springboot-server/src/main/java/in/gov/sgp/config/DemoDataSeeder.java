package in.gov.sgp.config;
import in.gov.sgp.model.Complaint;
import in.gov.sgp.model.ComplaintStatus;
import in.gov.sgp.model.Department;
import in.gov.sgp.model.Notification;
import in.gov.sgp.model.Role;
import in.gov.sgp.model.User;
import in.gov.sgp.repository.ComplaintRepository;
import in.gov.sgp.repository.DepartmentRepository;
import in.gov.sgp.repository.NotificationRepository;
import in.gov.sgp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

@Configuration
public class DemoDataSeeder {
 @Bean CommandLineRunner seed(UserRepository users,DepartmentRepository deps,ComplaintRepository complaints,NotificationRepository notifications,PasswordEncoder encoder,@Value("${app.seed-demo:true}") boolean enabled){
  return args->{if(!enabled)return; seedData(users,deps,complaints,notifications,encoder);};
 }
 private void seedData(UserRepository users,DepartmentRepository deps,ComplaintRepository complaints,NotificationRepository notifications,PasswordEncoder encoder){
  String[][] ds={{"Public Works","Roads, street lighting, drainage, and public infrastructure."},{"Water Supply","Water connections, leakage, and supply interruptions."},{"Electricity","Public electrical infrastructure and street power concerns."},{"Sanitation","Waste collection, cleanliness, and sanitation services."},{"Roads & Transport","Traffic signals, road safety, and transport facilities."},{"Public Health","Local health facilities and public health assistance."}};
  Map<String,Department> d=new HashMap<>();for(var x:ds){var dep=deps.findByNameIgnoreCase(x[0]).orElseGet(()->{var z=new Department();z.setName(x[0]);z.setDescription(x[1]);return deps.save(z);});d.put(x[0],dep);}
  String adminHash=encoder.encode("12345678"), demoHash=encoder.encode("DemoPass123!"), staffHash=encoder.encode("12345678");Map<String,User> u=new HashMap<>();
  Object[][] us={{"Admin","admin1@teamb.com",Role.ADMIN,null},{"Ananya Rao","ananya.rao@gmail.com",Role.CITIZEN,null},{"Kabir Sharma","kabir.sharma@gmail.com",Role.CITIZEN,null},{"Priya Nair","priya.nair@gmail.com",Role.CITIZEN,null},{"Vikram Singh","vikram.singh@gmail.com",Role.CITIZEN,null},{"Ishita Kapoor","ishita.kapoor@gmail.com",Role.CITIZEN,null}};
  for(var row:us){String email=(String)row[1];var x=users.findByEmailIgnoreCase(email).orElseGet(()->((Role)row[2])==Role.ADMIN?users.findByRole(Role.ADMIN).stream().findFirst().orElseGet(User::new):new User());x.setName((String)row[0]);x.setEmail(email);x.setPasswordHash((Role)row[2]==Role.ADMIN?adminHash:demoHash);x.setRole((Role)row[2]);x.setDepartment(null);x=users.save(x);u.put(email,x);}
  Object[][] staff={{"Road1","road1@teamb.com","Public Works"},{"Water1","water1@teamb.com","Water Supply"},{"Electricity1","electricity1@teamb.com","Electricity"},{"Sanitation1","sanitation1@teamb.com","Sanitation"},{"Transport1","transport1@teamb.com","Roads & Transport"},{"Health1","health1@teamb.com","Public Health"}};
  Map<Long,User> staffByDepartment=new HashMap<>();
  for(var row:staff){String email=(String)row[1];var x=users.findByEmailIgnoreCase(email).orElseGet(User::new);x.setName((String)row[0]);x.setEmail(email);x.setPasswordHash(staffHash);x.setRole(Role.STAFF);x.setDepartment(d.get(row[2]));x=users.save(x);staffByDepartment.put(x.getDepartment().getId(),x);u.put(email,x);}
  if(complaints.count()==0){Object[][] cs={{"SGP-DEMO-1001","Streetlight not working near Central Park","Electricity","The streetlight has been out for three evenings and the area is difficult to use after sunset.","Central Park, Sector 4",ComplaintStatus.IN_PROGRESS,"ananya.rao@gmail.com","Electricity"},{"SGP-DEMO-1002","Water leakage on residential lane","Water supply","A continuous leak is flooding the lane and affecting the nearby homes.","Lake View Road, Ward 8",ComplaintStatus.ASSIGNED,"kabir.sharma@gmail.com","Water Supply"},{"SGP-DEMO-1003","Missed waste collection","Sanitation","Household waste has not been collected since Monday morning.","Gandhi Nagar, Block B",ComplaintStatus.RESOLVED,"ananya.rao@gmail.com","Sanitation"},{"SGP-DEMO-1004","Pothole creating a safety hazard","Roads","A deep pothole has formed near the school entrance and is unsafe for two-wheelers.","MG Road, Ward 2",ComplaintStatus.ASSIGNED,"priya.nair@gmail.com","Public Works"},{"SGP-DEMO-1005","Blocked storm drain before monsoon","Drainage","The drain beside the community hall is blocked with debris and needs inspection.","Community Hall Road",ComplaintStatus.ASSIGNED,"vikram.singh@gmail.com","Public Works"}};for(var row:cs){var c=new Complaint();c.setReference((String)row[0]);c.setTitle((String)row[1]);c.setCategory((String)row[2]);c.setDescription((String)row[3]);c.setLocation((String)row[4]);c.setStatus((ComplaintStatus)row[5]);c.setCitizen(u.get(row[6]));c.setDepartment(d.get(row[7]));c.setAssignedStaff(staffByDepartment.get(c.getDepartment().getId()));if(c.getStatus()==ComplaintStatus.RESOLVED){c.setRemarks("Collection route updated and supervisor notified.");c.setResolution("Waste was collected on the following morning.");}complaints.save(c);}}
  for(var c:complaints.findAll()){var assigned=staffByDepartment.get(c.getDepartment().getId());if(assigned!=null&&!Objects.equals(c.getAssignedStaff(),assigned)){c.setAssignedStaff(assigned);complaints.save(c);}}
  for(var oldEmail:new String[]{"meera.iyer@sgp.gov.in","rohan.das@sgp.gov.in","nisha.kulkarni@sgp.gov.in"})users.deleteByEmailIgnoreCase(oldEmail);
  if(notifications.count()==0){for(var ref:new String[]{"SGP-DEMO-1001","SGP-DEMO-1003"})complaints.findAll().stream().filter(c->c.getReference().equals(ref)).findFirst().ifPresent(c->{var n=new Notification();n.setUser(u.get("ananya.rao@gmail.com"));n.setComplaint(c);n.setMessage(ref.equals("SGP-DEMO-1003")?"Complaint "+ref+" has been resolved.":"Complaint "+ref+" is now being reviewed by the department.");notifications.save(n);});}
 }
}
