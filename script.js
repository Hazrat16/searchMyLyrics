const form = document.getElementById("form");
const search = document.getElementById("search");
const result = document.getElementById("result");
const more = document.getElementById("more");

const apiURL = "https://api.lyrics.ovh";

// Search by song name or artist
async function searchSong(term) {
  const res = await fetch(`${apiURL}/suggest/${term}`);
  const data = await res.json();

  //console.log(data);
  showData(data);
}

// Show data and artist DOM
function showData(data) {
  console.log(data);
  result.innerHTML = `
    <ul class="songs">
        ${data.data
          .map(
            (song) => `<li>
            <span>
                <strong>${song.artist.name}</strong> - ${song.title}
            </span>
            <button class="btn" data-artist="${song.artist.name}" data-songtitle="${song.title}">Lyrics</button>
        </li> `
          )
          .join("")}
    
    </ul>
    `;
  if (data.prev || data.next) {
    more.innerHTML = `
        ${
          data.prev
            ? `<button class="btn" onclick="getMoreSongs('${data.prev}')">Prev</button>`
            : ""
        }
        ${
          data.next
            ? `<button class="btn" onclick="getMoreSongs('${data.next}')">Next</button>`
            : ""
        }
        `;
  } else {
    more.innerHTML = "";
  }
}

async function getMoreSongs(url) {
  const res = await fetch(`https://cors-anywhere.herokuapp.com/${url}`);
  const data = await res.json();

  //console.log(data);
  showData(data);
}

//Get lyrics for songs
async function getLyrics(artist, songTitle) {
  const res = await fetch(`${apiURL}/v1/${artist}/${songTitle}`);
  const data = await res.json();

  const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, "<br>");

  result.innerHTML = `<h2><strong>${artist}</strong> - ${songTitle}</h2><span>${lyrics}</span>`;

  more.innerHTML = ``;
  //console.log(data);
  showData(data);
}

// Event listeners
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const searchTerm = search.value.trim();

  if (!searchTerm) {
    alert("Please type in search box.");
  } else {
    searchSong(searchTerm);
  }
});

// Get Lyrics button click
result.addEventListener("click", (e) => {
  const clickedEl = e.target;
  if (clickedEl.tagName === "BUTTON") {
    const artist = clickedEl.getAttribute("data-artist");
    const songTitle = clickedEl.getAttribute("data-songtitle");

    getLyrics(artist, songTitle);
  }
});
