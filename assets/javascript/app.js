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
  //create GIF image element
  let img = $("<img>").attr({
    src: gif.images.fixed_height.url,
    id: gif.id,
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
  //initial API request to populate page with trending GIFs
  requestGifs(base_url + "trending?api_key=" + API_KEY + "&limit=10");
  //populate topics with buttons
  populate(topics, addTopic);

  $(document).on("click", ".topic", function () {
    let topic = $(this).val();
    let query;

    if (topic === "trending") {
      query = base_url + "trending?api_key=" + API_KEY + "&limit=10";
    } else {
      query =
        base_url + "search?api_key=" + API_KEY + "&q=" + topic + "&limit=10";
    }
    requestGifs(query);
  });
});
