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
    '<img id="<%= username %> pic" class="img-responsive img-rounded" src="https://s3.amazonaws.com/cs4241-fp/<%= picname %>" style="max-height: 250px">' +
    '</div>' +
    '<div class="caption">' +
    '<p><%= firstname %> <%= lastname %></p>' +
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
}
