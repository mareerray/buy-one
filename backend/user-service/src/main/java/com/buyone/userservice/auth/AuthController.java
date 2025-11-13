@RestController
@RequestMapping("/auth")
public class AuthController {
    private final AuthService authService;
    
    public AuthController(AuthService authService) {
        this.authService = authService;
    }
    
    @PostMapping("/register")
    public ResponseEntity<UserResponse> register(@RequestBody @Valid RegisterUserRequest request) {
        UserResponse created = authService.register(request);
        return ResponseEntity.status(201).body(created); // "201 Created" on success
    }
    
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody @Valid LoginRequest request) {
        LoginResponse response = authService.login(request); // includes token, message, and UserResponse
        return ResponseEntity.ok(response); // "200 OK" with login payload
    }
}
