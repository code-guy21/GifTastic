let topics = [
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

const populateGifs = (gifs) => {
  //loop through each GIF object
  gifs.forEach((gif) => {
    //call addGif function
    addGif(gif);
  });
};

const addGif = (gif) => {
  //create GIF image element
  let img = $("<img>").attr({
    src: gif.images.original.url,
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
      populateGifs(response.data);
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
});
