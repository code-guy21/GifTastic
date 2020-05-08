let topics = [""];
let query =
  "http://api.giphy.com/v1/gifs/trending?api_key=GG3nuwnZU6fm89I1KysFNlx7x9sKXaZH&limit=10";
let total = 0;

const populateGifs = (gifs) => {
  //loop through each GIF object
  gifs.forEach((gif) => {
    //add another row if row exceeds 5 elements
    if (total % 5 === 0) {
      let row = $("<div>").attr({
        class: "row flex",
        id: total / 5,
      });

      $("#images").append(row);
    }

    //create GIF image element
    let img = $("<img>").attr({
      src: gif.images.original.url,
      id: gif.id,
      width: "20%",
    });

    //append GIF to appropriate row
    $(".row#" + Math.floor(total / 5)).append(img);

    //increase total amount of GIFS on page
    total++;
  });
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

//Application starts on document loaded
$(document).ready(() => {
  //initial API request to populate page
  requestGifs(query);
});
