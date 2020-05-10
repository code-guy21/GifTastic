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
  //loop through data
  data.forEach((data) => {
    //call method
    method(data);
  });
};

const addTopic = (value) => {
  //create container for buttons
  let contain = $("<div>").attr({
    id: value,
    class: "btn-group flex row",
  });

  //create topic button
  let topic = $("<span>").text(value).attr({
    value: value,
    class: "topic",
  });

  //create remove button
  let remove = $("<span>")
    .attr({
      class: "remove",
    })
    .append(
      $("<i>")
        .attr({
          class: " fas fa-times",
        })
        .css({
          padding: "15px",
        })
    );

  //create favorite button
  let fav = $("<span>")
    .attr({
      class: "fav",
    })
    .append(
      $("<i>")
        .attr({
          class: " far fa-heart",
        })
        .css({
          padding: "15px",
          color: "red",
        })
    );

  //append buttons to container
  contain.append(fav).append(topic).append(remove);

  //add container to topics page
  $("#topics").append(contain);
};

const addGif = (gif) => {
  //create GIF element
  let btn = $("<button>")
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
      height: gif.images.fixed_height.height,
      width: gif.images.fixed_height.width,
    });

  //create rating element
  let rating = $("<span>" + gif.rating + "</span>").attr("class", "rating");

  //attach rating to GIF
  btn.append(rating);

  //add GIF to page
  $("#images").append(btn);
};

const requestGifs = (query) => {
  $.ajax({
    url: query,
    method: "GET",
  })
    .then((response) => {
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

const remove = (array, btn) => {
  //find the index in array
  let index = array.indexOf(btn.closest("div").attr("id"));

  //check if index was found
  if (index !== -1) {
    //remove element from array
    array.splice(index, 1);

    //remove element from  page
    btn.closest("div").remove();
  }
};

const changeState = (gif, state) => {
  //change background image
  gif.css({
    "background-image": "url(" + gif.attr(state) + ")",
  });

  //change state of GIF
  gif.attr("state", state);
};

//Application starts on document load
$(document).ready(() => {
  //populate topics section
  populate(topics, addTopic);

  //listener for topic buttons
  $(document).on("click", ".topic", function () {
    //store topic
    let topic = $(this).text();

    //check if topic is not currently selected
    if (!current || current !== topic) {
      //hit different endpoint for 'trending' and 'search' topic
      let query =
        topic === "trending"
          ? base_url + "trending?api_key=" + API_KEY + "&limit=10"
          : base_url +
            "search?api_key=" +
            API_KEY +
            "&q=" +
            topic +
            "&limit=10";

      //clear previous GIFs on page
      $("#images").empty();

      //make request to GIPHY API
      requestGifs(query);

      //update currently selected topic
      current = topic;
    }
  });

  //listener for GIF images
  $(document).on("click", ".gif", function () {
    //grab reference to GIF
    let gif = $(this);

    //change state of GIF
    gif.attr("state") === "still"
      ? changeState(gif, "animate")
      : changeState(gif, "still");
  });

  //listener for remove button
  $(document).on("click", ".remove", function () {
    //grab reference to remove button
    let btn = $(this);

    //remove button from favorites or topics section
    btn.closest(".container").attr("id") === "topic-container"
      ? remove(topics, btn)
      : remove(favorites, btn);
  });

  //listener for favorite button
  $(document).on("click", ".fav", function () {
    //grab reference to parent div
    let parent = $(this).closest("div");

    //check if topic is already part of favorites list
    if (!favorites.includes(parent.attr("id"))) {
      //make a clone of parent div
      let clone = parent.clone();

      //remove favorite button from clone
      clone.children(".fav").remove();

      //add clone to favorites section
      $("#favorites").append(clone);

      //add topic to favorites list
      favorites.push(clone.attr("id"));
    }
  });

  //listener for submit button
  $("#submit").click(() => {
    //prevent default HTML behavior
    event.preventDefault();

    //grab value from input field
    let topic = $("#add").val().toLowerCase().trim();

    //check if topic has already been added or if input is empty
    if (!topics.includes(topic) && topic !== "") {
      //add button to topic section on page
      addTopic(topic);

      //add topic to array of topics
      topics.push(topic);

      //clear input field
      $("#add").val("");
    }
  });
});
