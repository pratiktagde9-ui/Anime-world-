const API_URL = "https://graphql.anilist.co";

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
    if (!cards) return;

    cards.innerHTML = "";

    data.data.Page.media.forEach(anime => {
      cards.innerHTML += `
        <div class="card">
          <img src="${anime.coverImage.large}" alt="${anime.title.romaji}">
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
