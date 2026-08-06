const API_URL = "https://graphql.anilist.co";

const query = `
query {
  Page(page: 1, perPage: 12) {
    media(type: ANIME, sort: POPULARITY_DESC) {
      id
      episodes
      averageScore
      coverImage {
        large
      }
      title {
        romaji
      }
    }
  }
}
`;

async function loadAnime() {
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ query })
    });

    const data = await res.json();

    const cards = document.querySelector(".cards");
    cards.innerHTML = "";

    data.data.Page.media.forEach(anime => {
      cards.innerHTML += `
        <div class="card" onclick="window.location.href='details.html?id=${anime.id}'">
          <img src="${anime.coverImage.large}" alt="${anime.title.romaji}" style="width:100%;border-radius:10px;">
          <h3>${anime.title.romaji}</h3>
          <p>Episodes: ${anime.episodes ?? "?"}</p>
          <p>⭐ ${anime.averageScore ?? "N/A"}</p>
        </div>
      `;
    });

  } catch (err) {
    console.error(err);
  }
}

loadAnime();

const search = document.getElementById("search");

search.addEventListener("keyup", async () => {

  const value = search.value.trim();

  if (value === "") {
    loadAnime();
    return;
  }

  const searchQuery = `
  query {
    Page(page: 1, perPage: 12) {
      media(search: "${value}", type: ANIME) {
        id
        episodes
        averageScore
        coverImage {
          large
        }
        title {
          romaji
        }
      }
    }
  }`;

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ query: searchQuery })
    });

    const data = await res.json();

    const cards = document.querySelector(".cards");
    cards.innerHTML = "";

    data.data.Page.media.forEach(anime => {
      cards.innerHTML += `
        <div class="card" onclick="window.location.href='details.html?id=${anime.id}'">
          <img src="${anime.coverImage.large}" style="width:100%;border-radius:10px;">
          <h3>${anime.title.romaji}</h3>
          <p>Episodes: ${anime.episodes ?? "?"}</p>
          <p>⭐ ${anime.averageScore ?? "N/A"}</p>
        </div>
      `;
    });

  } catch (err) {
    console.error(err);
  }

});

// Trending Anime
const trendingBox = document.querySelector(".trending.cards");

if (trendingBox) {
  fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      query: `
      query {
        Page(page: 1, perPage: 6) {
          media(type: ANIME, sort: TRENDING_DESC) {
            id
            title { romaji }
            coverImage { large }
            episodes
            averageScore
          }
        }
      }`
    })
  })
  .then(res => res.json())
  .then(data => {
    trendingBox.innerHTML = "";

    data.data.Page.media.forEach(anime => {
      trendingBox.innerHTML += `
        <div class="card" onclick="window.location.href='details.html?id=${anime.id}'">
          <img src="${anime.coverImage.large}" style="width:100%;border-radius:10px;">
          <h3>${anime.title.romaji}</h3>
          <p>Episodes: ${anime.episodes ?? "?"}</p>
          <p>⭐ ${anime.averageScore ?? "N/A"}</p>
        </div>
      `;
    });
  })
  .catch(console.error);
}

