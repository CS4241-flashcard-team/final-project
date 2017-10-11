var http = require('http')
    , qs = require('querystring')
    , fs = require('fs')
    , url = require('url')
    , port = process.env.PORT || 8080;

// database
const pg = require('pg');
const dbURL = process.env.DATABASE_URL + "?ssl=true";

// aws
const aws = require('aws-sdk');
const S3_BUCKET = process.env.S3_BUCKET;

var server = http.createServer(function (req, res) {
    var uri = url.parse(req.url)

    switch (uri.pathname) {
        case '/':
            sendFile(res, 'public/index.html');
            break;
        case '/index.html':
            sendFile(res, 'public/index.html');
            break;
        case '/get':
            const target = qs.parse(uri.query).target;
            if (target === 'courses') {
                getCourses(res, uri);
            }
            if (target === 'coursesByUsername') {
                getCoursesByUsername(res, uri);
            }
            if (target === 'usersByCourseCode') {
                getUsersByCourseCode(res, uri);
            }
            if (target === 'users') {
                getUsers(res, uri);
            }
            break;
        case '/post':
            var postData = '';
            req.on('data', function (d) {
                postData += d;
                // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
                if (postData.length > 1e6) {
                    // FLOOD ATTACK OR FAULTY CLIENT, NUKE REQUEST
                    req.connection.destroy();
                }
            });
            req.on('end', function () {
                var data = JSON.parse(postData);
                if (data.target === 'logIn') {
                    logIn(res, data.username, data.password);
                }
                if (data.target === 'addCourse') {
                    addToCoursesDb(res, data.courseCode, data.name);
                    addToEnrollmentsDb(res, data.courseCode, data.username);
                }
                if (data.target === 'joinCourse') {
                    addToEnrollmentsDb(res, data.courseCode, data.username);
                }
            });
            break;
        case '/s3':
            var action = qs.parse(uri.query).action;
            if (action === 'put') {
                s3put(res, uri);
            }
            if (action === 'delete') {
                s3delete(res, uri);
            }
            break;
        case '/profilePage.html':
            sendFile(res, 'public/profilePage.html')
            break
        case '/signUpForm.html':
            sendFile(res, 'public/signUpForm.html')
            break
        case '/classCatalog.html':
            sendFile(res, 'public/classCatalog.html')
            break
        case '/css/style.css':
            sendFile(res, 'public/css/style.css', 'text/css')
            break
        case '/css/SignupProfileStyle.css':
            sendFile(res, 'public/css/SignupProfileStyle.css', 'text/css')
            break
        case '/css/classCatalogStyle.css':
            sendFile(res, 'public/css/classCatalogStyle.css', 'text/css')
            break
        case '/js/scripts.js':
            sendFile(res, 'public/js/scripts.js', 'text/javascript')
            break
        case '/js/SignUpscripts.js':
            sendFile(res, 'public/js/SignUpscripts.js', 'text/javascript')
            break
        case '/js/classCatalogScripts.js':
            sendFile(res, 'public/js/classCatalogScripts.js', 'text/javascript')
            break
        default:
            res.end('404 not found')
    }
})

server.listen(port);
console.log('listening on ' + port);

function upperFirstLet(str) {
    var words = str.replace(/^\s+|\s+$/g, "").toLowerCase().split(' '); // remove leading and trailing space
    for (var i = 0; i < words.length; i++) {
        words[i] = words[i].split('');
        words[i][0] = words[i][0].toUpperCase();
        words[i] = words[i].join('');
    }
    return words.join(' ');
}

function getCourses(res, uri) {
    const client = new pg.Client(dbURL);
    const courseCode = qs.parse(uri.query).courseCode;

    var query = "SELECT * FROM courses";
    if (courseCode) {
        query += ` WHERE code = '${courseCode}'`;
    }
    query += ";";

    client.connect(function (err, client, done) {
        if (err) {
            console.log('Connect to db failed');
            console.error(err);
        } else {
            client.query(query, function (err, result) {
                client.end();
                if (err) {
                    console.error("all query failed", err);
                    res.writeHead(500, {"Content-type": "text/plain"});
                    res.end(JSON.stringify({message: upperFirstLet(err.message)}));
                } else {
                    res.writeHead(200, {"Content-type": "application/json"});
                    res.end(JSON.stringify(result.rows));
                }
            });
        }
    });
}

function getCoursesByUsername(res, uri) {
    const client = new pg.Client(dbURL);
    const username = qs.parse(uri.query).username;

    if (typeof username === 'undefined') {
        console.log("Username is empty");
        res.writeHead(500, {"Content-type": "text/plain"});
        res.end(JSON.stringify({message: upperFirstLet("Username is empty")}));
        return;
    }

    var query = `SELECT * FROM courses INNER JOIN enrollments ON courses.code = enrollments.coursecode WHERE username = '${username}'`;

    client.connect(function (err, client, done) {
        if (err) {
            console.log('Connect to db failed');
            console.error(err);
        } else {
            client.query(query, function (err, result) {
                client.end();
                if (err) {
                    console.error("all query failed", err);
                    res.writeHead(500, {"Content-type": "text/plain"});
                    res.end(JSON.stringify({message: upperFirstLet(err.message)}));
                } else {
                    res.writeHead(200, {"Content-type": "application/json"});
                    res.end(JSON.stringify(result.rows));
                }
            });
        }
    });
}

function getUsersByCourseCode(res, uri) {
    const client = new pg.Client(dbURL);
    const courseCode = qs.parse(uri.query).courseCode;
    const filter = qs.parse(uri.query).filter;

    if (typeof courseCode === 'undefined') {
        console.log("Course code is empty");
        res.writeHead(500, {"Content-type": "text/plain"});
        res.end(JSON.stringify({message: upperFirstLet("Course code is empty")}));
        return;
    }

    var query = `SELECT * FROM users INNER JOIN enrollments ON users.username = enrollments.username WHERE coursecode = '${courseCode}'`;
    if (filter === 'student') {
        query += " AND acctype = 'student'"
    } else if (filter === 'professor') {
        query += " AND acctype = 'professor'"
    }
    query += " ORDER BY lastname;";

    client.connect(function (err, client, done) {
        if (err) {
            console.log('Connect to db failed');
            console.error(err);
        } else {
            client.query(query, function (err, result) {
                client.end();
                if (err) {
                    console.error("all query failed", err);
                    res.writeHead(500, {"Content-type": "text/plain"});
                    res.end(JSON.stringify({message: upperFirstLet(err.message)}));
                } else {
                    res.writeHead(200, {"Content-type": "application/json"});
                    res.end(JSON.stringify(result.rows));
                }
            });
        }
    });
}

function getUsers(res, uri) {
    const client = new pg.Client(dbURL);
    const username = qs.parse(uri.query).username;

    var query = "SELECT * FROM users";
    if (username) {
        query += ` WHERE username = '${username}'`;
    }
    query += " ORDER BY lastname;";

    client.connect(function (err, client, done) {
        if (err) {
            console.log('Connect to db failed');
            console.error(err);
        } else {
            client.query(query, function (err, result) {
                client.end();
                if (err) {
                    console.error("all query failed", err);
                    res.writeHead(500, {"Content-type": "text/plain"});
                    res.end(JSON.stringify({message: upperFirstLet(err.message)}));
                } else {
                    res.writeHead(200, {"Content-type": "application/json"});
                    res.end(JSON.stringify(result.rows));
                }
            });
        }
    });
}

function logIn(res, username, password) {
    const client = new pg.Client(dbURL);
    client.connect(function (err, client, done) {
        if (err) {
            console.log('Connect to db failed')
            console.error(err);
        } else {
            const query = `INSERT INTO courses VALUES ('${courseCode}', '${upperFirstLet(name)}');`;
            client.query(query, function (err, result) {
                client.end();
                if (err) {
                    res.writeHead(500, {"Content-type": "text/plain"});
                    res.end(JSON.stringify({message: upperFirstLet(err.message)}));
                } else {
                    res.writeHead(200, {"Content-type": "application/json"});
                    res.end();
                }
            });
        }
    });
}

function addToCoursesDb(res, courseCode, name) {
    const client = new pg.Client(dbURL);
    client.connect(function (err, client, done) {
        if (err) {
            console.log('Connect to db failed')
            console.error(err);
        } else {
            const query = `INSERT INTO courses VALUES ('${courseCode}', '${upperFirstLet(name)}');`;
            client.query(query, function (err, result) {
                client.end();
                if (err) {
                    res.writeHead(500, {"Content-type": "text/plain"});
                    res.end(JSON.stringify({message: upperFirstLet(err.message)}));
                } else {
                    res.writeHead(200, {"Content-type": "application/json"});
                    res.end();
                }
            });
        }
    });
}

function addToEnrollmentsDb(res, courseCode, username) {
    const client = new pg.Client(dbURL);
    client.connect(function (err, client, done) {
        if (err) {
            console.log('Connect to db failed')
            console.error(err);
        } else {
            const query = `INSERT INTO enrollments VALUES ('${courseCode}', '${username}');`;
            client.query(query, function (err, result) {
                client.end();
                if (err) {
                    res.writeHead(500, {"Content-type": "text/plain"});
                    res.end(JSON.stringify({message: upperFirstLet(err.message)}));
                } else {
                    res.writeHead(200, {"Content-type": "application/json"});
                    res.end();
                }
            });
        }
    });
}

function s3put(res, uri) {
    const s3 = new aws.S3();
    const fileName = qs.parse(uri.query).fileName;
    const s3Params = {
        Bucket: S3_BUCKET,
        Key: fileName
    };

    s3.putObject(s3Params, (err, data) => {
        if(err){
            res.writeHead(500, {"Content-type": "text/plain"});
            res.end(JSON.stringify({message: upperFirstLet(err.message)}));
        } else {
            res.writeHead(200, {"Content-type": "application/json"});
            res.end();
        }
    });
}

function s3delete(res, uri) {
    const s3 = new aws.S3();
    const fileName = qs.parse(uri.query).fileName;
    const s3Params = {
        Bucket: S3_BUCKET,
        Key: fileName
    };

    s3.deleteObject(s3Params, (err, data) => {
        if(err){
            res.writeHead(500, {"Content-type": "text/plain"});
            res.end(JSON.stringify({message: upperFirstLet(err.message)}));
        } else {
            res.writeHead(200, {"Content-type": "application/json"});
            res.end();
        }
    });
}

function sendFile(res, filename, contentType) {
    contentType = contentType || 'text/html';

    fs.readFile(filename, function (error, content) {
        res.writeHead(200, {'Content-type': contentType})
        res.end(content, 'utf-8')
    })
}
