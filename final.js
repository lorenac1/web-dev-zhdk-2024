const SPOTIFY_CLIENT_ID = "67b411e20d594f30bf7a8d3bbde54285";
const SPOTIFY_CLIENT_SECRET = "161fc5e3df004b95af3ba8c62f3eaf54";
const PLAYLIST_ID = "0EQAoKj5GHNrTxQByO03NE?si=02877923dc964489";
const container = document.querySelector('div[data-js="tracks"]');
const genreContainer = document.querySelector('.genre-container');
const allSongsButton = document.getElementById('allSongsButton');

let allTracksData = []; // Store all tracks data globally

function fetchPlaylist(token, playlistId) {
  fetch(`https://api.spotify.com/v1/playlists/${playlistId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.tracks && data.tracks.items) {
        allTracksData = data.tracks.items; // Store all tracks data globally
        addTracksToPage(allTracksData); // Display all tracks initially
        createArtistButtons(allTracksData); // Create artist buttons
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function addTracksToPage(items) {
  const ul = document.createElement("ul");
  items.forEach((item) => {
    const li = document.createElement("li");
    const albumImageUrl = item.track.album.images[0].url; 
    li.innerHTML = `
      <img src="${albumImageUrl}" alt="Album cover">
      <p>${item.track.name} by ${item.track.artists
      .map((artist) => artist.name)
      .join(", ")}</p>
      <audio controls src="${item.track.preview_url}"></audio>
    `;
    ul.appendChild(li);
  });
  container.innerHTML = ''; // Clear existing content
  container.appendChild(ul);
}


// createArtistButtons(items): This function creates artist filter buttons based on the unique artists found in the items array.

function createArtistButtons(items) {
  const artists = new Set();
  //array
  items.forEach((item) => {
    item.track.artists.forEach((artist) => {
      //adds the name
      artists.add(artist.name);
    });
  });


  artists.forEach((artist) => {
    const button = document.createElement("button");
    //Sets the button's text to the artist's name.
    button.textContent = artist;
    //Adds a click event listener to the button
    button.addEventListener("click", () => {
      filterTracksByArtist(artist);
    });
    // Appends the button to the genreContainer element in the DOM
    genreContainer.appendChild(button);
  });
}

//filterTracksByArtist(artistName): This function filters allTracksData to find tracks by a specific artistName and updates the displayed tracks on the page using addTracksToPage.

function filterTracksByArtist(artistName) {
  //all.... Filters the allTracksData array to include only the items that meet the specified condition.
  const filteredTracks = allTracksData.filter((item) => {
    // Checks if at least one artist in the track.artists array of the current item has a name that matches artistName. 
    return item.track.artists.some((artist) => artist.name === artistName);
  });

  addTracksToPage(filteredTracks);
}

//showAllSongs(): This function displays all tracks (allTracksData) on the page by calling addTracksToPage(allTracksData).
function showAllSongs() {
  addTracksToPage(allTracksData);
}

function fetchAccessToken() {
  fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `grant_type=client_credentials&client_id=${SPOTIFY_CLIENT_ID}&client_secret=${SPOTIFY_CLIENT_SECRET}`,
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.access_token) {
        fetchPlaylist(data.access_token, PLAYLIST_ID);
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

//BUTTONS RIGHT AND LEFT

fetchAccessToken();
//code part 2
//Scroll Right Button: When the button with the ID scrollRightButton is clicked, the main element will scroll 300 pixels to the right smoothly.
//Scroll Left Button: When the button with the ID scrollLeftButton is clicked, the main element will scroll 300 pixels to the left smoothly.
// Scroll button functionality remains unchanged
document.getElementById("scrollRightButton").addEventListener("click", () => {
  document.getElementById("main").scrollBy({
    top: 0,
    left: 300,
    behavior: "smooth",
  });
});

document.getElementById("scrollLeftButton").addEventListener("click", () => {
  document.getElementById("main").scrollBy({
    top: 0,
    left: -300,
    behavior: "smooth",
  });
});


//allSongsButton: This is a reference to a button element with the ID allSongsButton, which will trigger the display of all songs when clicked.
// Event listener for "Show All Songs" button
allSongsButton.addEventListener("click", () => {
  showAllSongs();
});
