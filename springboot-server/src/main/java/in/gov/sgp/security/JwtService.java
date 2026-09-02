package in.gov.sgp.security;
import io.jsonwebtoken.*; import io.jsonwebtoken.security.Keys; import in.gov.sgp.model.User; import org.springframework.beans.factory.annotation.Value; import org.springframework.stereotype.Service; import javax.crypto.SecretKey; import java.util.*; 
@Service public class JwtService {
 private final SecretKey key; private final long expiration;
 public JwtService(@Value("${app.jwt.secret}") String secret,@Value("${app.jwt.expiration-ms:28800000}") long expiration){key=Keys.hmacShaKeyFor(secret.getBytes(java.nio.charset.StandardCharsets.UTF_8));this.expiration=expiration;}
 public String create(User u){return Jwts.builder().subject(u.getId().toString()).claim("role",u.getRole().name()).claim("email",u.getEmail()).claim("name",u.getName()).issuedAt(new Date()).expiration(new Date(System.currentTimeMillis()+expiration)).signWith(key).compact();}
 public Claims parse(String token){return Jwts.parser().verifyWith(key).build().parseSignedClaims(token).getPayload();}
}
