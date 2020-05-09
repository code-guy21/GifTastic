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
  let img = $("<img>").attr({
    src: gif.images.fixed_height_still.url,
    id: gif.id,
    still: gif.images.fixed_height_still.url,
    animate: gif.images.fixed_height.url,
    state: "still",
  });

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
    let query =
      topic === "trending"
        ? base_url + "trending?api_key=" + API_KEY + "&limit=10"
        : base_url + "search?api_key=" + API_KEY + "&q=" + topic + "&limit=10";

    requestGifs(query);
  });

  $(document).on("click", "img", function () {
    let gif = $(this);
    if (gif.attr("state") === "still") {
      gif.attr("src", gif.attr("animate"));
      gif.attr("state", "animate");
    } else {
      gif.attr("src", gif.attr("still"));
      gif.attr("state", "still");
    }
  });
});
