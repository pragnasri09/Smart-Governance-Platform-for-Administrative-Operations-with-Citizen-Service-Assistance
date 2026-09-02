package in.gov.sgp.security;
import io.jsonwebtoken.Claims; import in.gov.sgp.model.Role; import in.gov.sgp.repository.UserRepository; import jakarta.servlet.*; import jakarta.servlet.http.*; import org.springframework.security.authentication.UsernamePasswordAuthenticationToken; import org.springframework.security.core.authority.SimpleGrantedAuthority; import org.springframework.security.core.context.SecurityContextHolder; import org.springframework.stereotype.Component; import org.springframework.web.filter.OncePerRequestFilter; import java.io.IOException; import java.util.List;
@Component public class JwtAuthFilter extends OncePerRequestFilter {
 private final JwtService jwt; private final UserRepository users; public JwtAuthFilter(JwtService jwt,UserRepository users){this.jwt=jwt;this.users=users;}
 protected void doFilterInternal(HttpServletRequest req,HttpServletResponse res,FilterChain chain)throws ServletException,IOException{
  String h=req.getHeader("Authorization"); if(h!=null&&h.startsWith("Bearer ")){try{Claims c=jwt.parse(h.substring(7));long id=Long.parseLong(c.getSubject());if(id<=0)throw new IllegalArgumentException("Invalid subject");var user=users.findById(id).orElseThrow();Role role=user.getRole();var auth=new UsernamePasswordAuthenticationToken(Long.toString(id),null,List.of(new SimpleGrantedAuthority("ROLE_"+role.name())));auth.setDetails(c);SecurityContextHolder.getContext().setAuthentication(auth);}catch(Exception ignored){}}
  chain.doFilter(req,res);
 }
}
