let topics = [
  "trending",
  "happy",
  "keanu",
  "smh",
  "dance",
  "dog",
  "awkward",
  "wink",
  "nope",
  "whatever",
];

let favorites = [];

let current;

const API_KEY = "GG3nuwnZU6fm89I1KysFNlx7x9sKXaZH";
const base_url = "https://api.giphy.com/v1/gifs/";

const populate = (data, method) => {
  //loop through each GIF object
  data.forEach((data) => {
    //call addGif function
    method(data);
  });
};

const addTopic = (topic) => {
  let contain = $("<div>")
    .attr({
      id: topic,
      class: "btn-group",
    })
    .css({
      display: "flex",
      "flex-direction": "row",
      height: "30px",
      width: "150px",
    });

  let btn = $("<button>")
    .text(topic)
    .attr({
      value: topic,
      class: "topic",
    })
    .css({
      width: "80%",
    });

  let remove = $("<span>")
    .attr({
      class: "remove",
    })
    .css("width", "20%")
    .append(
      $("<i>")
        .attr({
          class: " fas fa-times",
        })
        .css({
          padding: "5px",
        })
    );

  let fav = $("<span>")
    .attr({
      class: "fav",
    })
    .css("width", "20%")
    .append(
      $("<i>")
        .attr({
          class: " far fa-heart",
        })
        .css({
          padding: "5px",
        })
    );

  contain.append(fav).append(btn).append(remove);

  //add GIF to page
  $("#topics").append(contain);
};

const addGif = (gif) => {
  //create GIF image element
  let img = $("<button>")
    .attr({
      src: gif.images.fixed_height_still.url,
      id: gif.id,
      still: gif.images.fixed_height_still.url,
      animate: gif.images.fixed_height.url,
      state: "still",
      class: "gif",
    })
    .css({
      "background-image": "url(" + gif.images.fixed_height_still.url + ") ",
      "background-size": "100% 100%",
      height: gif.images.fixed_height.height,
      width: gif.images.fixed_height.width,
      position: "relative",
    });

  let rating = $("<div>" + gif.rating + "</div>").attr("class", "rating");

  img.append(rating);
  //add GIF to page
  $("#images").append(img);
};

//handles requests to GIPHY API
const requestGifs = (query) => {
  $.ajax({
    url: query,
    method: "GET",
  })
    .then((response) => {
      console.log(response);
      if (response.data.length === 0) {
        $("#images").html("<div>no GIFs found</div>");
      } else {
        //add GIFS to page
        populate(response.data, addGif);
      }
    })
    .catch((error) => {
      //display error message to page
      $("#images").html("<div>could not retrieve GIFs</div>");
    });
};

//Application starts on document load
$(document).ready(() => {
  //populate topics with buttons
  populate(topics, addTopic);

  $(document).on("click", ".topic", function () {
    let topic = $(this).val();
    if (!current || current !== topic) {
      current = topic;
      let query =
        topic === "trending"
          ? base_url + "trending?api_key=" + API_KEY + "&limit=10"
          : base_url +
            "search?api_key=" +
            API_KEY +
            "&q=" +
            topic +
            "&limit=10";

      //clear previous GIFs
      $("#images").empty();
      requestGifs(query);
    }
  });

  $(document).on("click", ".gif", function () {
    let gif = $(this);
    if (gif.attr("state") === "still") {
      gif.css({
        "background-image": "url(" + gif.attr("animate") + ")",
      });

      gif.attr("state", "animate");
    } else {
      gif.css({
        "background-image": "url(" + gif.attr("still") + ")",
      });
      gif.attr("state", "still");
    }
  });

  $(document).on("click", ".remove", function () {
    let topic = $(this);

    if (topic.closest(".container").attr("id") === "topic-container") {
      let topic_index = topics.indexOf($(this).closest("div").attr("id"));
      if (topic_index !== -1) {
        topics.splice(topic_index, 1);
        $(this).closest("div").remove();
      }
    } else {
      let fav_index = favorites.indexOf($(this).closest("div").attr("id"));
      if (fav_index !== -1) {
        favorites.splice(fav_index, 1);
        $(this).closest("div").remove();
      }
    }
  });

  $(document).on("click", ".fav", function () {
    let topic = $(this).closest("div");

    if (!favorites.includes(topic.attr("id"))) {
      let clone = topic.clone();
      clone.children(".fav").remove();
      clone.appendTo("#favorites");
      favorites.push(clone.attr("id"));
    }
  });

  $("#submit").click(() => {
    event.preventDefault();
    let topic = $("#add").val().toLowerCase().trim();
    if (!topics.includes(topic)) {
      addTopic(topic);
      topics.push(topic);
      $("#add").val("");
    }
  });
});
