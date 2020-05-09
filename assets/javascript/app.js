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

let current;

const API_KEY = "GG3nuwnZU6fm89I1KysFNlx7x9sKXaZH";
const base_url = "http://api.giphy.com/v1/gifs/";

const populate = (data, method) => {
  //loop through each GIF object
  data.forEach((data) => {
    //call addGif function
    method(data);
  });
};

const addTopic = (topic) => {
  let btn = $("<button>").text(topic).attr({
    value: topic,
    class: "topic",
  });

  //add GIF to page
  $("#topics").append(btn);
};

const addGif = (gif) => {
  console.log(gif);
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
      "background-image": "url(" + gif.images.fixed_height_still.url + ")",
      "background-size": "cover",
      height: gif.images.fixed_height.height,
      width: gif.images.fixed_height.width,
      position: "relative",
    });

  let rating = $("<div>" + gif.rating + "</div>").css({
    color: "white",
    position: "absolute",
    bottom: "0px",
    left: "0px",
    "font-size": "15px",
    background: "black",
  });

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
      //add GIFS to page
      populate(response.data, addGif);
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
});
