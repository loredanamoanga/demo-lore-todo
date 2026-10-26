package demo.todo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/** The team todo service: the walking skeleton exposes only the actuator health endpoint. */
@SpringBootApplication
public class BackendApplication {

  /** Boots the service. */
  public static void main(String[] args) {
    SpringApplication.run(BackendApplication.class, args);
  }
}
