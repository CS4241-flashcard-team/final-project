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
    - target: coursesByUsername
    - username: ...
- **Optional field**:
- **Example**:
    - /get?target=coursesByUsername&username=my-username

## Users by courseCode
- **Required field**:
    - target: usersByCourseCode
    - courseCode: ...
- **Optional field**:
    - filter: student -> returns all students in that course
    - filter: professor -> returns the professor in that course
- **Example**:
    - /get?target=usersByCourseCode&courseCode=my-code&filter=professor

## Users
- **Required field**:
    - target: users
- **Optional field**:
    - username: ...
- **Example**:
    - /get?target=users&username=my-username


# POST
## Log in
- **Required params**:
    - target: logIn
    - username: ...
    - password: ...
- **Optional params**:
- **Example**:
    - const data = {
        target: 'addCourse',
        username: 'my-username,
        password: 'my-password'
    };
    - /post
    - xhr.send(JSON.stringify(data))

## Professor adds new course
- **Required params**:
    - target: addCourse
    - courseCode: ...
    - name: ...
- **Optional params**:
- **Example**:
    - const data = {
        target: 'addCourse',
        courseCode: 'my-code,
        name: 'my-username'
    };
    - /post
    - xhr.send(JSON.stringify(data))
    
## Student joins a course
- **Required params**:
    - target: addCourse
    - courseCode: ...
    - username: ...
- **Optional params**:
- **Example**:
    - const data = {
        target: 'addCourse',
        courseCode: 'my-code,
        username: 'my-username'
    };
    - /post
    - xhr.send(JSON.stringify(data))

## S3
