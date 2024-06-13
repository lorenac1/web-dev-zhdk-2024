const SPOTIFY_CLIENT_ID = "67b411e20d594f30bf7a8d3bbde54285";
const SPOTIFY_CLIENT_SECRET = "161fc5e3df004b95af3ba8c62f3eaf54";
const PLAYLIST_ID = "0EQAoKj5GHNrTxQByO03NE?si=02877923dc964489";
const container = document.querySelector('div[data-js="tracks"]');

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
        addTracksToPage(data.tracks.items);
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
  container.appendChild(ul);
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

fetchAccessToken();

// Scroll button functionality
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