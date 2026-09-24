const SITE_NAV={cv:"/Augustine%20cv%202026.pdf",links:[["About","/#about"],["Work","/#work"],["Experience","/#experience"],["Contact","/#contact"]]};
class SiteHeader extends HTMLElement{
 connectedCallback(){
  const work=/^\/(ripple-docs|secuviz|work|projects|case-studies)(\/|$)/.test(location.pathname);
  this.innerHTML=`<header class="site-header"><a class="site-logo" href="/#home" aria-label="Augustine Kariuki home">AK<span>.</span></a><nav class="site-nav" aria-label="Main navigation">${SITE_NAV.links.map(([l,h])=>`<a href="${h}" class="${work&&l==="Work"?"active":""}">${l}</a>`).join("")}</nav><a class="site-cv" href="${SITE_NAV.cv}" download>Download CV <span>↓</span></a><button class="site-menu-toggle" aria-expanded="false" aria-controls="site-mobile-menu">Menu</button></header><div class="site-mobile-menu" id="site-mobile-menu">${SITE_NAV.links.map(([l,h])=>`<a href="${h}">${l}</a>`).join("")}<a class="mobile-cv" href="${SITE_NAV.cv}" download>Download CV ↓</a></div>`;
  const toggle=this.querySelector(".site-menu-toggle"),menu=this.querySelector(".site-mobile-menu");
  toggle.onclick=()=>{const open=this.classList.toggle("menu-open");toggle.setAttribute("aria-expanded",open);toggle.textContent=open?"Close":"Menu"};
  this.querySelectorAll("a").forEach(a=>a.addEventListener("click",e=>{
   const u=new URL(a.href,location.href);
   if(location.pathname==="/"&&u.pathname==="/"&&u.hash){
    const target=document.querySelector(u.hash);
    if(target){e.preventDefault();target.scrollIntoView({behavior:"smooth",block:"start"});history.replaceState(null,"",u.hash)}
   }
   this.classList.remove("menu-open");toggle.setAttribute("aria-expanded","false");toggle.textContent="Menu";
  }));
  if(location.pathname==="/"){
   const sections=[...SITE_NAV.links].map(([l,h])=>[l,document.querySelector(new URL(h,location.origin).hash)]).filter(x=>x[1]);
   const setActive=()=>{let active="";for(const [l,s] of sections)if(s.getBoundingClientRect().top<=150)active=l;this.querySelectorAll(".site-nav a").forEach(a=>a.classList.toggle("active",a.textContent===active))};
   addEventListener("scroll",setActive,{passive:true});setActive();
  }
 }
}
customElements.define("site-header",SiteHeader);
