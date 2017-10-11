# GET
## All courses
- **Required field**:
    - target: courses
- **Optional field**:
    - filter: username -> returns all courses associated with that username
- **Example**:
    - /get?target=courses&filter=my-username

## Users by course
- **Required field**:
    - target: userByCourse
    - courseCode: ...
- **Optional field**:
    - filter: student -> returns all students in that course
    - filter: professor -> returns the professor in that course
- **Example**:
    - /get?target=userByCourse&courseCode=my-code&filter=professor

## User by username
- **Required field**:
    - target: userByUsername
    - username: ...
- **Optional field**:
- **Example**:
    - /get?target=userByUsername&username=my-username


# POST
## Professor adds new course

## Student joins a course


# S3
