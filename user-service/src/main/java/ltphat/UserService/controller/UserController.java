package ltphat.UserService.controller;

import ltphat.UserService.model.User;
import ltphat.UserService.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
import java.util.Optional;

@RestController
public class UserController {
    @Autowired
    private UserRepository userRepository;

    @GetMapping("/exist")
    public ResponseEntity<?> isUserExist(@RequestParam String username, @RequestParam String email) {
        Optional<User> userByEmail = userRepository.findByEmail(email);
        Optional<User> userByUsername = userRepository.findByUsername(username);

        return ResponseEntity.ok(Map.of(
                "emailExists", userByEmail.isPresent(),
                "usernameExists", userByUsername.isPresent()
        ));
    }
}
