var http = require('http')
    , qs = require('querystring')
    , fs = require('fs')
    , url = require('url')
    , port = 8080;

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
            if (target === 'userByCourse') {
                getUserByCourse(res, uri);
            }
            if (target === 'userByUsername') {
                getUserByUsername(res, uri);
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
                // console.log(data)
                if (data.type === 'add') {
                    handleAdd(res, data.name, data.pic);
                }
            });
            break;
            break;
        case '/s3':
            var action = qs.parse(uri.query).action;
            if (action === 'get') {
                s3get(res, uri);
            } else if (action === 'put') {
                s3put(res, uri);
            } else {
                console.log("Unknown s3 action")
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

server.listen(process.env.PORT || port);
console.log('listening on 8080');

function upperFirstLet(str) {
    var words = str.replace(/^\s+|\s+$/g, "").toLowerCase().split(' '); // remove leading and trailing space
    for (var i = 0; i < words.length; i++) {
        words[i] = words[i].split('');
        words[i][0] = words[i][0].toUpperCase();
        words[i] = words[i].join('');
    }
    return words.join(' ');
}

function getUserByCourse(res, uri) {
    var client = new pg.Client(dbURL);
    var courseCode = qs.parse(uri.query).courseCode;
    var filter = qs.parse(uri.query).filter;
    var query = "SELECT * FROM users INNER JOIN enrollments ON users.username = enrollments.username";

    if (typeof courseCode === 'undefined') {
        console.log("Course code is empty");
        res.writeHead(500, {"Content-type": "text/plain"});
        res.end(JSON.stringify({message: upperFirstLet("Course code is empty")}));
        return;
    }

    if (filter === 'student') {
        query += " WHERE acctype = 'student';"
    } else if (filter === 'professor') {
        query += " WHERE acctype = 'professor';"
    } else {
        query += ";";
    }

    client.connect(function (err, client, done) {
        if (err) {
            console.log('Connect to db failed')
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

function handleAdd(res, name, pic) {
    var client = new pg.Client(dbURL);
    client.connect(function (err, client, done) {
        if (err) {
            console.log('Connect to db failed')
            console.error(err);
        } else {
            var query = "INSERT INTO puppies VALUES ('" + upperFirstLet(name) + "', '" + pic + "');";
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

function s3get(res, uri) {
    const s3 = new aws.S3();
    const fileName = qs.parse(uri.query).fileName;

    const s3Params = {
        Bucket: S3_BUCKET,
        Key: fileName,
        Expires: 60
    };

    s3.getSignedUrl('getObject', s3Params, (err, data) => {
        if(err){
            res.writeHead(500, {"Content-type": "text/plain"});
            return res.end(JSON.stringify({message: upperFirstLet(err.message)}));
        }
        const returnData = {
            signedRequest: data,
            url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`
        };
    res.write(JSON.stringify(returnData));
    res.end();
});
}

function s3put(res, uri) {
    const s3 = new aws.S3();
    const fileName = qs.parse(uri.query).fileName;
    const fileType = qs.parse(uri.query).fileType;
    const s3Params = {
        Bucket: S3_BUCKET,
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
            url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`
        };
    res.write(JSON.stringify(returnData));
    res.end();
});
}

function sendFile(res, filename, contentType) {
    contentType = contentType || 'text/html';

    fs.readFile(filename, function (error, content) {
        res.writeHead(200, {'Content-type': contentType})
        res.end(content, 'utf-8')
    })
}
