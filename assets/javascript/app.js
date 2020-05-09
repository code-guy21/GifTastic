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
  let contain = $("<div>").css({
    display: "flex",
    "flex-direction": "row",
  });

  let btn = $("<button>")
    .text(topic)
    .attr({
      value: topic,
      class: "topic",
      id: topic,
    })
    .css("flex-grow", "1");

  let remove = $("<button>")
    .text("x")
    .attr({
      class: "remove",
    })
    .css("flex-grow", "1");

  let fav = $("<button>")
    .text("*")
    .attr({
      class: "fav",
    })
    .css("flex-grow", "1");

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
