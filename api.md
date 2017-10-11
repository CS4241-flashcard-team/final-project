# GET
## Courses
- **Required field**:
    - target: courses
- **Optional field**:
    - courseCode: ...
- **Example**:
    - /get?target=courses&courseCode=my-code

## Courses by username
- **Required field**:
    - target: courseByUsername
    - username: ...
- **Optional field**:
- **Example**:
    - /get?target=courses&username=my-username

## Users by courseCode
- **Required field**:
    - target: userByCourseCode
    - courseCode: ...
- **Optional field**:
    - filter: student -> returns all students in that course
    - filter: professor -> returns the professor in that course
- **Example**:
    - /get?target=userByCourse&courseCode=my-code&filter=professor

## Users
- **Required field**:
    - target: userByUsername
- **Optional field**:
    - username: ...
- **Example**:
    - /get?target=userByUsername&username=my-username


# POST
## Professor adds new course

## Student joins a course


# S3
