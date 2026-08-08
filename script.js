const API = "https://graphql.anilist.co";

const series = [
  [16498, "Shingeki no Kyojin"],
  [38000, "Kimetsu no Yaiba"],
  [21459, "Boku no Hero Academia"],
  [21, "One Piece"],
  [20, "Naruto"],
  [1535, "Death Note"],
  [11061, "Hunter x Hunter"],
  [100166, "Tokyo Ghoul"],
  [113415, "Blue Lock"],
  [101348, "Death Parade"]
];

const movies = [
  [101249, "Demon Slayer: Mugen Train"],
  [16870, "Your Name"],
  [20997, "Dragon Ball Super: Broly"],
  [103047, "Jujutsu Kaisen 0"],
  [97986, "Suzume"],
  [106518, "One Piece Film: Red"]
];

const latestMovies = [
  [21519, "Your Name"],
  [20954, "A Silent Voice"],
  [106731, "Weathering With You"],
  [199, "Spirited Away"],
  [174788, "Look Back"],
  [101921, "Violet Evergarden: The Movie"],
  [116334, "The Quintessential Quintuplets Movie"],
  [97986, "Suzume"],
  [127230, "Demon Slayer: Mugen Train"],
  [100643, "The Garden of Words"],
  [108577, "Ride Your Wave"],
  [99750, "I Want to Eat Your Pancreas"]
];
  const cartoons = [
  [527, "Pokemon"],
  [247, "Doraemon"]
];
  
  
  

  
  

  
  
  
  


  
  
  
  
  
  


function makeCard(anime, movie = false) {
  const title =
    anime.title?.english ||
    anime.title?.romaji ||
    "Anime";

  const score = anime.averageScore
    ? (anime.averageScore / 10).toFixed(1)
    : "0.0";

  const episodes = anime.episodes || "N/A";

  const image =
    anime.coverImage?.extraLarge ||
    anime.coverImage?.large ||
    "";

  return `
    <article class="card">
      <div class="poster">
        <img
          src="${image}"
          alt="${title}"
          loading="lazy"
          onerror="this.style.display='none'"
        >

        <span class="badge">
          ${movie ? "Movie" : "HD"}
        </span>
      </div>

      <div class="card-info">
        <h3 title="${title}">${title}</h3>

        ${
          movie
            ? ""
            : `<p>Episodes: ${episodes}</p>`
        }

        <div class="rating">
          <span>★</span> ${score}
        </div>
      </div>
    </article>
  `;
}

async function fetchAnime(ids) {
  const query = `
    query ($ids: [Int]) {
      Page(perPage: 50) {
        media(id_in: $ids, type: ANIME) {
          id
          title {
            romaji
            english
          }
          episodes
          averageScore
          coverImage {
            large
            extraLarge
          }
        }
      }
    }
  `;

  const response = await fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({
      query: query,
      variables: {
        ids: ids
      }
    })
  });

  if (!response.ok) {
    throw new Error("AniList API error");
  }

  const json = await response.json();

  if (json.errors) {
    throw new Error(json.errors[0].message);
  }

  return json.data?.Page?.media || [];
}

async function loadHome() {
  const seriesGrid = document.querySelector("#series-grid");
  const movieGrid = document.querySelector("#movie-grid");
const cartoonGrid = document.querySelector("#cartoon-grid");
  try {
    if (cartoonGrid) cartoonGrid.innerHTML = `<p class="loading">Loading cartoons...</p>`;
    if (seriesGrid) {
      seriesGrid.innerHTML =
        `<p class="loading">Loading series...</p>`;
    }

    if (movieGrid) {
      movieGrid.innerHTML =
        `<p class="loading">Loading movies...</p>`;
    }

    const [seriesData, movieData, latestMovieData] =
  await Promise.all([
    fetchAnime(series.map(item => item[0])),
    fetchAnime(movies.map(item => item[0])),
    fetchAnime(latestMovies.map(item => item[0]))
  ]);
      
      
    

    if (seriesGrid) {
      const sortedSeries = series
        .map(item =>
          seriesData.find(anime => anime.id === item[0])
        )
        .filter(Boolean);

      seriesGrid.innerHTML = sortedSeries
        .map(anime => makeCard(anime, false))
        .join("");
    }

    if (movieGrid) {
      const sortedMovies = movies
        .map(item =>
          movieData.find(anime => anime.id === item[0])
        )
        .filter(Boolean);

      movieGrid.innerHTML = sortedMovies
        .map(anime => makeCard(anime, true))
        .join("");
    }
const latestMovieGrid = document.querySelector("#latest-movie-grid");

if (latestMovieGrid) {
  const sortedLatestMovies = latestMovies
    .map(item =>
      latestMovieData.find(anime => anime.id === item[0])
    )
    .filter(Boolean);

  latestMovieGrid.innerHTML = sortedLatestMovies
    .map(anime => makeCard(anime, true))
    .join("");
      }
    if (cartoonGrid) {
  const sortedCartoons = cartoons
    .map(item =>
      cartoonData.find(anime => anime.id === item[0])
    )
    .filter(Boolean);

  cartoonGrid.innerHTML = sortedCartoons
    .map(anime => makeCard(anime, false))
    .join("");
             }
  
  } catch (error) {
    console.error("Loading error:", error);

    if (seriesGrid) {
      seriesGrid.innerHTML =
        `<p class="loading">Series load nahi ho paayi.</p>`;
    }

    if (movieGrid) {
      movieGrid.innerHTML =
        `<p class="loading">Movies load nahi ho paayi.</p>`;
    }
  }
}


// SEARCH
const search = document.querySelector("#search");

if (search) {
  search.addEventListener("input", async function () {

    const value = this.value.trim();

    if (value.length < 2) {
      loadHome();
      return;
    }

    const seriesGrid = document.querySelector("#series-grid");
    const movieGrid = document.querySelector("#movie-grid");

    try {
      const query = `
        query ($search: String) {
          Page(perPage: 24) {
            media(
              search: $search
              type: ANIME
              sort: POPULARITY_DESC
            ) {
              id
              title {
                romaji
                english
              }
              episodes
              averageScore
              coverImage {
                large
                extraLarge
              }
            }
          }
        }
      `;

      const response = await fetch(API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          query: query,
          variables: {
            search: value
          }
        })
      });

      const json = await response.json();

      const results =
        json.data?.Page?.media || [];

      if (seriesGrid) {
        seriesGrid.innerHTML = results
          .map(anime => makeCard(anime, false))
          .join("");
      }

      if (movieGrid) {
        movieGrid.innerHTML = "";
      }

    } catch (error) {
      console.error("Search error:", error);
    }
  });
}


// START
document.addEventListener("DOMContentLoaded", loadHome);
