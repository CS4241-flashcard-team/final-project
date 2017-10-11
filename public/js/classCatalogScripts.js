function initCatalog() {
    getAllUsers();
}


function getAllUsers() {
    console.log("getting puppies")
    var xhr = new XMLHttpRequest();
    xhr.responseType = "json";
    xhr.open("GET", "/get", true);
    xhr.onload = function() {
        if (this.status === 200) {
            buildList(this.response);
        }
    };
    xhr.send();
}

var thumbnailTemplate = _.template(
    '<div class="col-md-4">' +
    '<div class="thumbnail">' +
    '<div class="picContainer">' +
    '<img id="<%= username %> pic" class="img-responsive img-rounded" src="" style="max-height: 250px">' +
    '</div>' +
    '<div class="caption">' +
    '<p><%= name %></p>' +
    '</div>' +
    '</div>' +
    '</div>'
);

function buildList(list) {
    var i, toAppendString = "";
    for (i = 0; i < list.length; i++) {
        toAppendString += thumbnailTemplate(list[i]);
    }
    document.querySelector("#catalogRow").innerHTML = toAppendString;

    getPicsSignedRequests(list, 0);
}

function getPicsSignedRequests(list, index) {
    var name = list[index].name;
    var pic = list[index].pic;

    const xhr = new XMLHttpRequest();
    xhr.open('GET', `/s3?action=get&fileName=${pic}`);
    xhr.onreadystatechange = () => {
        if(xhr.readyState === 4){
            if(xhr.status === 200){
                const response = JSON.parse(xhr.responseText);
                getAndShowPic(response.signedRequest, response.url, name + ' ' + pic + ' pic');
            }
            else{
                alert('Could not get signed URL.');
            }
        }
    };
    xhr.send();

    if (index < list.length - 1) {
        index += 1;
        getPicsSignedRequests(list, index);
    } else {
        const thumbnails = document.getElementsByClassName('thumbnail');
        for (var i = 0; i < thumbnails.length; i++){
            thumbnails[i].addEventListener("mouseover", function () {
                this.style.background = 'gray';
            });
            thumbnails[i].addEventListener("mouseout", function () {
                this.style.background = 'white';
            });
            thumbnails[i].addEventListener("click", function () {
                $("#displayModal").modal('toggle');
                const nameNode = this.lastChild.cloneNode(true);
                const picNode = this.firstChild.firstChild.cloneNode(true);
                picNode.style.maxHeight = null;
                picNode.style.height = '400px';
                document.getElementById("display-title").innerText = nameNode.innerText;
                document.getElementById("display-body").innerHTML = '';
                document.getElementById("display-body").appendChild(picNode);
            })
        }
    }
}

function getAndShowPic(signedRequest, url, id) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', signedRequest);
    xhr.onreadystatechange = () => {
        if(xhr.readyState === 4){
            if(xhr.status === 200){
                document.getElementById(id).src = url;
            }
            else{
                alert('Could not show image');
            }
        }
    };
    xhr.send();
}