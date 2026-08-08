const API_URL = "https://graphql.anilist.co";

async function loadAnime() {
  const query = `
  query {
    Page(page: 1, perPage: 12) {
      media(type: ANIME, sort: POPULARITY_DESC) {
        id
        title { romaji }
        coverImage { large }
        episodes
        averageScore
      }
    }
  }`;

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ query })
    });

    const json = await res.json();
    const cards = document.querySelector(".cards");
    if (!cards) return;

    cards.innerHTML = "";

    json.data.Page.media.forEach(anime => {
      cards.innerHTML += `
      <div class="card">
        <img src="${anime.coverImage.large}" alt="${anime.title.romaji}">
        <h3>${anime.title.romaji}</h3>
        <p>Episodes: ${anime.episodes || "?"}</p>
        <p>⭐ ${anime.averageScore || "N/A"}</p>
      </div>`;
    });
    

  } catch (e) {
    console.error(e);
  }
}

window.addEventListener("load", loadAnime);
const searchInput = document.querySelector(".search-input");

if (searchInput) {
  searchInput.addEventListener("input", async () => {
    const value = searchInput.value.trim();
    if (!value) {
      loadAnime();
      return;
    }

    const query = `
      query {
        Page(page: 1, perPage: 12) {
          media(search: "${value.replace(/"/g, '\\"')}", type: ANIME) {
            id
            title { romaji }
            coverImage { large }
            episodes
            averageScore
          }
        }
      }
    `;

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query })
      });

      const json = await res.json();
      const cards = document.querySelector(".cards");
      if (!cards) return;

      cards.innerHTML = "";

      json.data.Page.media.forEach(anime => {
        cards.innerHTML += `
          <div class="card">
            <img src="${anime.coverImage.large}" alt="${anime.title.romaji}">
            <h3>${anime.title.romaji}</h3>
            <p>Episodes: ${anime.episodes || "?"}</p>
            <p>⭐ ${anime.averageScore || "N/A"}</p>
          </div>
        `;
      });
    } catch (e) {
      console.error(e);
    }
  });
               }
