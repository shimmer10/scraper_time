/************************************
 * App File for Events
 * 
 * @author Jennifer Grace
 * 
 * 08-01-2019
 ************************************/

// get articles as json
$.getJSON("/articles", function (data) {
    for (var i = 0; i < data.length; i++) {
        $("#articles").append("<div class=\"row\"><div class=\"col-sm-12\" id=\"article-info\"> <h2 class=\"text-center\" id=\"headline\">" + data[i].headline + "</h2><h4 class=\"text-center\" id=\"summary\">" + data[i].summary + "</h4></div>"
            + "<div class=\"col-sm-12\" id=\"article-link\"> <a class=\"btn btn-primary\" href=\"https://www.bbc.com" + data[i].url + "\" role=\"button\">Go To Article</a></div>" +
            "<div class=\"col-sm-12\" id=\"comment-link\" data-id='" + data[i]._id + "'> <a class=\"btn btn-secondary\" role=\"button\">Write a Comment</a></div></div>");
    }
});

$(document).on("click", "#comment-link", function () {
    $("#comments").empty();

    var thisId = $(this).attr("data-id");

    $.ajax({
        method: "GET",
        url: "/articles/" + thisId
    })
        .then(function (data) {
            $("#comments").append("<h2>" + data.headline + "</h2>");
            $("#comments").append("<input id='titleinput' name='title' >");
            $("#comments").append("<textarea id='bodyinput' name='body'></textarea>");
            $("#comments").append("<button data-id='" + data._id + "' id='savecomment'>Save Comment</button>");

            if (data.comment) {
                $("#titleinput").val(data.comment.title);
                $("#bodyinput").val(data.comment.body);
            }
        });
});

$(document).on("click", "#savecomment", function () {
    var thisId = $(this).attr("data-id");
    // console.log("id: " + $(this).attr("data-id"));
    // console.log("title input: " + $("#titleinput").val());
    // console.log("body input: " + $("#bodyinput").val());


    $.ajax({
        method: "POST",
        url: "/articles/" + thisId,
        data: {
            title: $("#titleinput").val(),
            body: $("#bodyinput").val()
        }
    })
        .then(function (data) {
            console.log(data);
            console.log("in here");
            $("#comments").empty();
        });

    $("#titleinput").val("");
    $("#bodyinput").val("");
})