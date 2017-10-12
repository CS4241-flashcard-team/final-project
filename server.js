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
const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME;

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
                const data = JSON.parse(postData);
                if (data.target === 'logIn') {
                    logIn(res, data.username, data.password);
                }
                if (data.target === 'newUser') {
                    addNewUser(res, data.username, data.password, data.firstname, data.lastname, data.picname, data.acctype);
                }
                if (data.target === 'updateUser') {
                    updateUser(res, data.username, data.password, data.firstname, data.lastname, data.picname, data.acctype);
                }
                if (data.target === 'addCourse') {
                    addToCoursesDb(res, data.courseCode, data.name, data.username);
                }
                if (data.target === 'joinCourse') {
                    addToEnrollmentsDb(res, data.courseCode, data.username);
                }
                if (data.target === 'unjoinCourse') {
                    removeFromEnrollmentsDb(res, data.courseCode, data.username);
                }
            });
            break;
        case '/s3':
            const action = qs.parse(uri.query).action;
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
        case '/game.html':
            sendFile(res, 'public/game.html')
            break
        case '/dashboard.html':
            sendFile(res, 'public/dashboard.html')
            break
        case '/blank.jpg':
            sendFile(res, 'public/blank.jpg')
            break
        case '/audio/tick.mp3':
            sendFile(res, 'public/audio/tick.mp3')
            break
        case '/audio/game.mp3':
            sendFile(res, 'public/audio/game.mp3')
            break
        case '/audio/click.wav':
            sendFile(res, 'public/audio/click.wav')
            break
        case '/audio/error.mp3':
            sendFile(res, 'public/audio/error.mp3')
            break
        case '/audio/end.mp3':
            sendFile(res, 'public/audio/end.mp3')
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
        case '/css/gameStyle.css':
            sendFile(res, 'public/css/gameStyle.css', 'text/css')
            break
        case '/js/scripts.js':
            sendFile(res, 'public/js/scripts.js', 'text/javascript')
            break
        case '/js/index.js':
            sendFile(res, 'public/js/index.js', 'text/javascript')
            break
        case '/js/SignUpscripts.js':
            sendFile(res, 'public/js/SignUpscripts.js', 'text/javascript')
            break
        case '/js/classCatalogScripts.js':
            sendFile(res, 'public/js/classCatalogScripts.js', 'text/javascript')
            break
		case '/js/profilePostScripts.js':
            sendFile(res, 'public/js/profilePostScripts.js', 'text/javascript')
            break
        case '/js/game.js':
            sendFile(res, 'public/js/game.js', 'text/javascript')
            break
        case '/js/dashboard.js':
            sendFile(res, 'public/js/dashboard.js', 'text/javascript')
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
    query += " ORDER BY code;";

    client.connect(function (err, client, done) {
        if (err) {
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
        res.writeHead(500, {"Content-type": "text/plain"});
        res.end(JSON.stringify({message: upperFirstLet("Username is empty")}));
        return;
    }

    var query = `SELECT * FROM courses INNER JOIN enrollments ON courses.code = enrollments.coursecode WHERE username = '${username}' ORDER BY code`;

    client.connect(function (err, client, done) {
        if (err) {
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
            console.error(err);
        } else {
            const query = `SELECT password FROM users WHERE username = '${username}';`;
            client.query(query, function (err, result) {
                client.end();
                if (err) {
                    res.writeHead(500, {"Content-type": "text/plain"});
                    res.end(JSON.stringify({message: upperFirstLet(err.message)}));
                } else {
                    if (result.rows.length === 0) {
                        res.writeHead(400, {"Content-type": "text/plain"});
                        res.end(JSON.stringify({message: upperFirstLet("Wrong username or password")}));
                        return;
                    }

                    const response = JSON.parse(JSON.stringify(result.rows[0]));
                    if (response.password === password) {
                        res.writeHead(200, {"Content-type": "application/json"});
                        res.end();
                    } else {
                        res.writeHead(400, {"Content-type": "text/plain"});
                        res.end(JSON.stringify({message: upperFirstLet("Wrong username or password")}));
                    }
                }
            });
        }
    });
}

function addNewUser(res, username, password, firstname, lastname, picname, acctype) {
    const client = new pg.Client(dbURL);
    client.connect(function (err, client, done) {
        if (err) {
            console.error(err);
        } else {
            const query = `INSERT INTO users VALUES ('${username}', '${password}', '${upperFirstLet(firstname)}', '${upperFirstLet(lastname)}', '${picname}', '${acctype}');`;
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

function updateUser(res, username, password, firstname, lastname, picname, acctype) {
    const client = new pg.Client(dbURL);
    client.connect(function (err, client, done) {
        if (err) {
            console.error(err);
        } else {
            const query = `UPDATE users SET password='${password}', firstname='${upperFirstLet(firstname)}', lastname='${upperFirstLet(lastname)}', picname='${picname}', acctype='${acctype}' WHERE username='${username}';`;
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

function addToCoursesDb(res, courseCode, name, username) {
    const client = new pg.Client(dbURL);
    client.connect(function (err, client, done) {
        if (err) {
            console.error(err);
        } else {
            const query1 = `INSERT INTO courses VALUES ('${courseCode}', '${upperFirstLet(name)}');`;
            client.query(query1, function (err, result) {
                client.end();
                if (err) {
                    res.writeHead(500, {"Content-type": "text/plain"});
                    res.end(JSON.stringify({message: upperFirstLet(err.message)}));
                } else {
                    addToEnrollmentsDb(res, courseCode, username);
                }
            });
        }
    });
}

function addToEnrollmentsDb(res, courseCode, username) {
    const client = new pg.Client(dbURL);
    client.connect(function (err, client, done) {
        if (err) {
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

function removeFromEnrollmentsDb(res, courseCode, username) {
    const client = new pg.Client(dbURL);
    client.connect(function (err, client, done) {
        if (err) {
            console.error(err);
        } else {
            const query = `DELETE FROM enrollments WHERE coursecode='${courseCode}' AND username='${username}';`;
            client.query(query, function (err, result) {
                client.end();
                if (err) {
                    console.log(err.message)
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
    const fileType = qs.parse(uri.query).fileType;
    const s3Params = {
        Bucket: S3_BUCKET_NAME,
        Key: fileName,
        Expires: 60,
        ContentType: fileType,
        ACL: 'public-read'
    };

    s3.getSignedUrl('putObject', s3Params, (err, data) => {
        if(err){
            res.writeHead(500, {"Content-type": "text/plain"});
            return res.end(JSON.stringify({message: upperFirstLet(err.message)}));
        }
        const returnData = {
            signedRequest: data,
            url: `https://${S3_BUCKET_NAME}.s3.amazonaws.com/${fileName}`
        };
        res.write(JSON.stringify(returnData));
        res.end();
    });
}

function s3delete(res, uri) {
    const s3 = new aws.S3();
    const fileName = qs.parse(uri.query).fileName;
    const s3Params = {
        Bucket: S3_BUCKET_NAME,
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
        res.writeHead(200, {'Content-type': contentType});
        res.end(content, 'utf-8')
    })
}
