package demo.todo;

import org.springframework.boot.SpringApplication;

/** Runs the service locally on a Testcontainers Postgres, for development without a database. */
public class TestBackendApplication {

  /** Boots the service with the test containers. */
  public static void main(String[] args) {
    SpringApplication.from(BackendApplication::main)
        .with(TestcontainersConfiguration.class)
        .run(args);
  }
}
