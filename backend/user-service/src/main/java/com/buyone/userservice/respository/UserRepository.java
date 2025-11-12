public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByEmail(String email);
}
