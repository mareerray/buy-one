import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponse {
    private String id;
    private String name;
    private String email;
    private String role;
    private String avatar;
    
    // Optional: Exclude fields you don’t want exposed in the API
    
    // Optional: Add status, creation date, etc. for audit and UX
}
