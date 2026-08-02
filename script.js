const searchInput=document.getElementById("searchInput");
const searchButton=document.getElementById("searchBtn");
const searchMessage=document.getElementById("searchMessage");
const watchButton=document.getElementById("watchBtn");
const menuButton=document.getElementById("menuBtn");

function searchAnime(){
 const text=searchInput.value.trim();
 searchMessage.textContent=text?`"${text}" ke results search kiye ja rahe hain...`:"Please enter an anime name.";
}
searchButton.addEventListener("click",searchAnime);
searchInput.addEventListener("keydown",e=>{if(e.key==="Enter")searchAnime()});
watchButton.addEventListener("click",()=>document.getElementById("new").scrollIntoView({behavior:"smooth"}));
document.querySelectorAll(".scroll-btn").forEach(button=>button.addEventListener("click",()=>{
 const target=document.getElementById(button.dataset.target);
 if(target)target.scrollBy({left:500,behavior:"smooth"});
}));
menuButton.addEventListener("click",()=>alert("Mobile menu coming soon!"));
document.querySelectorAll(".anime-card").forEach(card=>card.addEventListener("click",()=>{
 alert(card.querySelector("h3").textContent+" details page coming soon!");
}));
