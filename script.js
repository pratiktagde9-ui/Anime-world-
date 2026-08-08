const API="https://graphql.anilist.co";

const series=[
  [16498,"Shingeki no Kyojin"],[38000,"Kimetsu no Yaiba"],[101922,"Jujutsu Kaisen"],
  [21459,"Boku no Hero Academia"],[21,"One Piece"],[20,"Naruto: Shippuden"],
  [1535,"Death Note"],[11061,"Hunter x Hunter"],[21087,"One Punch Man"],
  [100166,"Tokyo Ghoul"],[113415,"Blue Lock"],[101348,"Demon Slayer"]
];
const movies=[
 [101249,"Demon Slayer: Mugen Train"],[16870,"Your Name."],[11013,"Jujutsu Kaisen 0"],
 [20997,"Dragon Ball Super: Broly"],[103047,"Suzume"],[97986,"One Piece Film Red"]
];

function card(x,movie=false){
 const title=x.title.english||x.title.romaji||"Anime";
 const score=x.averageScore?(x.averageScore/10).toFixed(1):"—";
 return `<article class="card"><div class="poster"><img src="${x.coverImage.extraLarge||x.coverImage.large}" loading="lazy" alt="${title}"><span class="badge">${movie?"Movie":"HD"}</span></div><div class="card-body"><h3>${title}</h3><p>${movie?"Movie":"Episodes"}: ${x.episodes??"—"}</p><div class="rating">★ ${score}</div></div></article>`;
}
async function fetchIds(ids){
 const query=`query($ids:[Int]){Page(perPage:20){media(id_in:$ids){id title{romaji english} episodes averageScore coverImage{large extraLarge}}}}`;
 const r=await fetch(API,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({query,variables:{ids}})});
 return (await r.json()).data.Page.media||[];
}
async function load(){
 try{
  const [s,m]=await Promise.all([fetchIds(series.map(x=>x[0])),fetchIds(movies.map(x=>x[0]))]);
  document.querySelector("#series-grid").innerHTML=s.map(x=>card(x)).join("");
  document.querySelector("#movie-grid").innerHTML=m.map(x=>card(x,true)).join("");
 }catch(e){
  document.querySelector("#series-grid").innerHTML="<p style='color:#aaa'>Anime data load nahi hua. Internet check karke refresh karo.</p>";
 }
}
document.querySelector("#search").addEventListener("input",async e=>{
 const qv=e.target.value.trim();
 if(qv.length<2){load();return}
 const query=`query($s:String){Page(perPage:18){media(search:$s,type:ANIME,sort:POPULARITY_DESC){id title{romaji english} episodes averageScore coverImage{large extraLarge}}}}`;
 const r=await fetch(API,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({query,variables:{s:qv}})});
 const data=await r.json();
 document.querySelector("#series-grid").innerHTML=(data.data.Page.media||[]).map(x=>card(x)).join("");
});
load();
