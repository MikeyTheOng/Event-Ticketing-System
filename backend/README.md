# EventJar Backend

Run `main` in `EventJarApplication.java` to start the application.

This repository implements these features:

- Spring Boot & JPA
- Sqlite database (`app.db`)
- Request exception handlers
- Lombok to reduce boilerplate code, e.g. getters and setters
- Jackson for JSON serialization
- Docker to run the application

## Development

### Creating a new entity

1. Create Entity - e.g. `entities/Book.java`
2. Create JpaRepository for the entity, to manage data - e.g. `respository/BookRepository.java`
3. Create Service for functions to get entity data using JpaRepository - e.g. `services/BookService.java`
4. Create Controller to expose Service functions via a REST API - e.g. `controllers/BookController.java`
