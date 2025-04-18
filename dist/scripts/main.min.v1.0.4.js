(()=>{function I(r){let e=r.textContent?.trim()||"";if(!e)return;r.textContent="",r.classList.add("animated-init"),e.split(/\s+/).forEach((n,s)=>{if(!n)return;if(s>0){let l=document.createTextNode(" ");r.appendChild(l)}let o=document.createElement("span");o.className="word",Array.from(n).forEach((l,i)=>{let c=document.createElement("span");c.className="char",c.textContent=l;let a=s*10+i;c.style.setProperty("--char-index",a.toString()),o.appendChild(c)}),r.appendChild(o)})}function u(r,e={}){let n={...{root:null,rootMargin:"0px",threshold:0},...e};return new IntersectionObserver((o,l)=>{o.forEach(i=>{r(i.target,i.isIntersecting,i,l)})},n)}function h(r,e){let t;return function(...n){clearTimeout(t),t=setTimeout(()=>r.apply(this,n),e)}}function M(r=document){let e=h((s,o,l,i)=>{if(o){let c=s.getAttribute("aria-label")||s.textContent?.slice(0,20)||"[text]";s.classList.add("in-view"),i.unobserve(s)}},100),t=u(e,{threshold:.1}),n=r.querySelectorAll(".scroll-animate:not(.animated-init)");n.length!==0&&n.forEach(s=>{I(s),s.classList.add("animated-init"),t.observe(s)})}function T(r,e){let t;return function(...n){t||(r.apply(this,n),t=!0,setTimeout(()=>t=!1,e))}}function S(r=document,e={}){let t={topThreshold:e.topThreshold||0,bottomThreshold:e.bottomThreshold||0},n=new Set,s=()=>{n.forEach(a=>{let d=a.getBoundingClientRect(),m=window.innerHeight||document.documentElement.clientHeight,p=a.getAttribute("aria-label")||a.textContent?.slice(0,20)||`[${a.tagName}]`;d.top>=-t.topThreshold&&d.top<=m?a.classList.contains("top-in-view")||a.classList.add("top-in-view"):a.classList.contains("top-in-view")&&a.classList.remove("top-in-view"),d.bottom>=0&&d.bottom<=m+t.bottomThreshold?a.classList.contains("bottom-in-view")||a.classList.add("bottom-in-view"):a.classList.contains("bottom-in-view")&&a.classList.remove("bottom-in-view"),a.setAttribute("data-top-position",Math.round(d.top)),a.setAttribute("data-bottom-position",Math.round(d.bottom))})},o=T(s,100);window.addEventListener("scroll",o,{passive:!0}),window.addEventListener("resize",o,{passive:!0});let i=u((a,d,m)=>{let p=a.getAttribute("aria-label")||a.textContent?.slice(0,20)||`[${a.tagName}]`,g=m.intersectionRatio;if(d)a.classList.add("in-view"),g===1?a.classList.add("in-full-view"):a.classList.remove("in-full-view"),n.add(a),s();else{a.classList.remove("in-view","in-full-view");let L=m.boundingClientRect,v=m.rootBounds,x="";v&&(L.bottom<=v.top?x=" (Exited Top)":L.top>=v.bottom&&(x=" (Exited Bottom)")),a.classList.remove("top-in-view","bottom-in-view")}},{threshold:[0,1]}),c=r.querySelectorAll('[data-watch-inview="true"]');return c.length===0&&console.warn("No elements found with [data-watch-inview='true'] within the specified scope."),c.forEach(a=>{i.observe(a),n.add(a)}),s(),{observer:i,cleanup:()=>{window.removeEventListener("scroll",o),window.removeEventListener("resize",o),i.disconnect(),n.clear()}}}function H(r=document){M(r),S(r,{topThreshold:100,bottomThreshold:0})}document.addEventListener("DOMContentLoaded",()=>{H()});var E={async fetchArticles(r,e=5){let t=`https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/@${r}/feed`,n=await fetch(t);if(!n.ok)throw new Error(`HTTP error! status: ${n.status}`);return((await n.json()).items||[]).slice(0,e)}};var w=class extends HTMLElement{constructor(){super(),this.articleTemplate=null,this.debouncedRender=h(this.render.bind(this),300)}connectedCallback(){this.debouncedRender()}async loadTemplate(){if(this.articleTemplate)return this.articleTemplate;try{let e=await fetch("./snippets/article-card.html");if(!e.ok)throw new Error(`HTTP error! status: ${e.status}`);let t=await e.text();return this.articleTemplate=t,t}catch(e){return console.error("Failed to load article card snippet:",e),'<div class="article-card article-card-error"><p>Failed to load article content.</p></div>'}}extractThumbnail(e){if(e.thumbnail&&typeof e.thumbnail=="string"&&e.thumbnail.trim()!=="")return e.thumbnail;let t=e.description?.match(/<img[^>]+src="([^">]+)"/);return t?t[1]:"placeholder-image.jpg"}cleanDescription(e){let t=e?.replace(/<[^>]+>/g,"")||"";return t.substring(0,150)+(t.length>150?"...":"")}async render(){let e=parseInt(this.getAttribute("data-limit"),10)||5,t=this.getAttribute("data-username");if(!t){console.error("MediumArticles: data-username attribute is required.",this),this.innerHTML="<p>Error: Medium username not specified.</p>";return}try{let[n,s]=await Promise.all([E.fetchArticles(t,e),this.loadTemplate()]);(!n||n.length===0)&&console.warn(`No articles found for username: ${t}`);let l=this.querySelector(".swiper-wrapper")||this;n.forEach(i=>{let c=this.extractThumbnail(i),a=this.cleanDescription(i.description),d=new Date(i.pubDate).toLocaleDateString("en-GB",{year:"numeric",month:"short",day:"numeric"}),m=s.replace(/{{\s*article\.guid\s*}}/g,i.guid||"").replace(/{{\s*article\.thumbnail\s*}}/g,c||"").replace(/{{\s*article\.title\s*}}/g,i.title||"Untitled").replace(/{{\s*article\.description\s*}}/g,a||"").replace(/{{\s*article\.author\s*}}/g,i.author||"Unknown Author").replace(/{{\s*article\.pubDate\s*}}/g,d||"").replace(/{{\s*article\.categories\s*}}/g,(i.categories||[]).join(", ")).replace(/{{\s*article\.link\s*}}/g,i.link||"#"),p=document.createElement("div");p.innerHTML=m.trim();let g=p.firstElementChild;g&&l.appendChild(g)}),window.animateText?.(this),new Swiper(this,{slidesPerView:1.15,spaceBetween:24,loop:n.length>1,grabCursor:!0,freeModeMomentum:!1,autoplay:!1,navigation:{nextEl:"#articles-btn-next",prevEl:"#articles-btn-previous"},breakpoints:{768:{slidesPerView:2,spaceBetween:32},968:{slidesPerView:3,spaceBetween:40},1200:{slidesPerView:4,spaceBetween:48}}})}catch(n){console.error("Error fetching or rendering Medium articles:",n),this.innerHTML=`<p>Error loading articles. ${n.message||""}</p>`}}};customElements.define("medium-articles",w);var j=0;function b(){j=window.pageYOffset,document.body.style.overflow="hidden"}function C(){document.body.style.overflow=""}var f=class extends HTMLElement{constructor(){super(),this.isDragging=!1,this._dragStarted=!1,this.startY=0,this.currentY=0,this.startScrollTop=0,this._dragHandleInitiated=!1,this.closeThreshold=150,this.boundHandleTouchStart=this.handleTouchStart.bind(this),this.boundHandleTouchMove=this.handleTouchMove.bind(this),this.boundHandleTouchEnd=this.handleTouchEnd.bind(this),this.boundCloseModal=this.closeModal.bind(this)}connectedCallback(){let e=this.dataset.triggers;if(!e)return;let t=document.querySelectorAll(e);t.length&&t.forEach(n=>{n.addEventListener("click",async()=>{await this.ensureModalLoaded(),this.showModal()})})}disconnectedCallback(){window.removeEventListener("touchmove",this.boundHandleTouchMove),window.removeEventListener("touchend",this.boundHandleTouchEnd)}async ensureModalLoaded(){if(!document.getElementById("modal"))try{let e=await fetch("./snippets/modal.html");if(!e.ok)throw new Error(`HTTP error! status: ${e.status}`);let t=await e.text(),n=document.createElement("div");n.innerHTML=t.trim();let s=n.querySelector("#modal");if(!s)throw new Error("Modal not found in snippet");document.body.appendChild(s),this.attachCloseHandlers(s),this.setupDragFunctionality(s)}catch(e){console.error("Failed to load modal snippet:",e)}}attachCloseHandlers(e){let t=e.querySelector(".modal__close"),n=e.querySelector(".modal__overlay");t?.addEventListener("click",this.boundCloseModal),n?.addEventListener("click",this.boundCloseModal)}setupDragFunctionality(e){if(window.matchMedia("(min-width: 768px)").matches)return;let t=e.querySelector(".modal__content"),n=e.querySelector(".modal__drag-bar"),s=t?.querySelector(".modal__inner-content");if(!t||!n||!s){console.warn("Modal drag setup failed: Missing required elements (.modal__content, .modal__drag-bar, .modal__inner-content)");return}n.setAttribute("aria-label","Drag down to close modal"),n.addEventListener("touchstart",this.boundHandleTouchStart,{passive:!0}),s.addEventListener("touchstart",this.boundHandleTouchStart,{passive:!1}),window.addEventListener("touchmove",this.boundHandleTouchMove,{passive:!1}),window.addEventListener("touchend",this.boundHandleTouchEnd)}handleTouchStart(e){if(e.touches.length>1)return;let t=e.touches[0],n=document.querySelector("#modal .modal__content"),s=n?.querySelector(".modal__inner-content"),o=n?.querySelector(".modal__drag-bar");if(!(!n||!s||!o))if(this.isDragging=!1,this._dragStarted=!1,this._dragHandleInitiated=e.target===o||o.contains(e.target),this.startY=t.clientY,this.startScrollTop=s.scrollTop,this._dragHandleInitiated){let l=window.getComputedStyle(n).transform,i=l==="none"?new DOMMatrix:new DOMMatrix(l);this.currentY=i.m42,this.isDragging=!0}else this.currentY=0}handleTouchMove(e){if(this.startY===0||e.touches.length>1)return;let t=e.touches[0],n=document.querySelector("#modal .modal__content"),s=n?.querySelector(".modal__inner-content");if(!n||!s)return;let o=t.clientY-this.startY;if(this._dragHandleInitiated){this._dragStarted||(n.style.transition="none",n.classList.add("is-dragging"),this._dragStarted=!0),e.preventDefault(),this.performDrag(n,o);return}if(!(o<0)&&o>0){if(this.startScrollTop>0||s.scrollTop>0)return;if(!this._dragStarted){let l=window.getComputedStyle(n).transform,i=l==="none"?new DOMMatrix:new DOMMatrix(l);this.currentY=i.m42,n.style.transition="none",n.classList.add("is-dragging"),this._dragStarted=!0,this.isDragging=!0}e.preventDefault(),this.performDrag(n,o);return}}performDrag(e,t){let n=Math.max(0,this.currentY+t);e.style.transform=`translateY(${n}px)`;let s=document.querySelector("#modal .modal__overlay");if(s){let o=Math.min(1,n/this.closeThreshold);s.style.opacity=Math.max(.3,1-o*.7).toString()}}handleTouchEnd(e){if(this.startY=0,!this._dragStarted){this._dragHandleInitiated=!1;return}let t=document.querySelector("#modal .modal__content");if(!t)return;this.isDragging=!1,this._dragStarted=!1,this._dragHandleInitiated=!1,t.classList.remove("is-dragging");let n=window.getComputedStyle(t).transform;(n==="none"?new DOMMatrix:new DOMMatrix(n)).m42>this.closeThreshold?this.animateAndClose(t):this.resetPosition(t)}animateAndClose(e){if(!e)return;e.style.transition="transform 0.25s ease-out",e.style.transform="translateY(100%)";let t=document.querySelector("#modal .modal__overlay");t&&(t.style.transition="opacity 0.25s ease-out",t.style.opacity="0"),e.addEventListener("transitionend",()=>{this.closeModal(),e.style.transform="",e.style.transition="",t&&(t.style.opacity="",t.style.transition="")},{once:!0})}resetPosition(e){if(!e)return;e.style.transition="transform 0.3s ease",e.style.transform="";let t=document.querySelector("#modal .modal__overlay");t&&(t.style.transition="opacity 0.3s ease",t.style.opacity=""),e.addEventListener("transitionend",()=>{e.style.transition="",t&&(t.style.transition="")},{once:!0})}showModal(){let e=document.getElementById("modal");if(!e)return;let t=e.querySelector(".modal__inner-content");if(!t)return;t.innerHTML="";let n=this.cloneNode(!0);t.append(...n.childNodes),this.dataset.nav==="true"&&this.setupNavigation(e),t.scrollTop=0,requestAnimationFrame(()=>{b(),document.body.classList.add("modal-open"),e.classList.add("is-active");let s=e.querySelector(".modal__content");s&&(s.style.transform="",s.style.transition="");let o=e.querySelector(".modal__overlay");o&&(o.style.opacity="",o.style.transition="")})}closeModal(){let e=document.getElementById("modal");if(!e||!e.classList.contains("is-active"))return;C(),document.body.classList.remove("modal-open"),e.classList.remove("is-active");let t=e.querySelector(".modal__content");t&&(t.style.transform="",t.style.transition="");let n=e.querySelector(".modal__overlay");n&&(n.style.opacity="",n.style.transition="")}};customElements.define("modal-content",f);var A=f;var D=[{id:"patou",largeBlock:!1,name:"Patou",logo:"./assets/images/brand/logo/logo-patou.svg",lifestyleImage:"./assets/images/brand/lifestyle/patou.jpg",website:"https://www.patou.com/",agency:"Fostr",involvement:{progress:2,max:5},modal:{id:"brands-item-patou",description_html:`
        <h2>Patou \u2013 Sustainable Luxury</h2>
        <p>Patou is a Parisian fashion house blending heritage with sustainability. Their collections are known for bold silhouettes, joyful color, and a commitment to eco-conscious practices.</p>
        <h3 class="h4">Contribution</h3>
        <div class="stats">
          <p><strong>Agency: <span>{{ brand.agency }}</span></strong></p>
          <p><strong>Involvement:</strong> {{ brand.involvement_progress }}</p>
        </div>
        <p>I worked on performance tuning and responsive layout tweaks across seasonal collection drops. Collaborated closely with their in-house team on content updates and accessibility improvements.</p>
        <a class="button button--style-1" href="#work">Learn more</a>
        <a class="button button--style-2 button--filled" href="https://www.patou.com/" target="_blank">View Website</a>`}},{id:"triangl",largeBlock:!0,name:"Triangl",logo:"./assets/images/brand/logo/logo-triangl.svg",lifestyleImage:"./assets/images/brand/lifestyle/triangl.jpg",website:"https://triangl.com/",agency:"Fostr",involvement:{progress:2,max:5},modal:{id:"brands-item-triangl",description_html:`
        <h2>TRIANGL \u2013 Swimwear, Reimagined</h2>
        <p>TRIANGL is a globally recognized swimwear brand known for their clean aesthetic, vibrant campaigns, and modern silhouettes.</p>
        <h3 class="h4">Contribution</h3>
        <div class="stats">
          <p><strong>Agency: <span>{{ brand.agency }}</span></strong></p>
          <p><strong>Involvement:</strong> {{ brand.involvement_progress }}</p>
        </div>
        <p>I provided technical support for campaign updates and refreshed components on key landing pages. Work included hero modules, content blocks, and global styling tweaks.</p>
        <a class="button button--style-1" href="#work">Learn more</a>
        <a class="button button--style-2 button--filled" href="https://triangl.com/" target="_blank">View Website</a>`}},{id:"pucci",largeBlock:!1,name:"Pucci",logo:"./assets/images/brand/logo/logo-pucci.svg",lifestyleImage:"./assets/images/brand/lifestyle/pucci.jpg",website:"https://www.pucci.com/",agency:"Fostr",involvement:{progress:2,max:5},modal:{id:"brands-item-pucci",description_html:`
        <h2>Pucci \u2013 A Digital Renaissance</h2>
        <p>Pucci, an icon of Italian fashion, needed a modern online experience to match their vibrant heritage. Their site showcases fluid animations and rich storytelling.</p>
        <h3 class="h4">Contribution</h3>
        <div class="stats">
          <p><strong>Agency: <span>{{ brand.agency }}</span></strong></p>
          <p><strong>Involvement:</strong> {{ brand.involvement_progress }}</p>
        </div>
        <p>I collaborated with the design team to develop interactive page templates, optimized animations, and refined the core layout system for mobile users.</p>
        <a class="button button--style-1" href="#work">Learn more</a>
        <a class="button button--style-2 button--filled" href="https://www.pucci.com/" target="_blank">View Website</a>`}},{id:"victoria-beckham",largeBlock:!1,name:"Victoria Beckham",logo:"./assets/images/brand/logo/logo-victoria-beckham.svg",lifestyleImage:"./assets/images/brand/lifestyle/victoria-beckham.jpg",website:"https://www.victoriabeckham.com/",agency:"Fostr",involvement:{progress:1,max:5},modal:{id:"brands-item-victoria-beckham",description_html:`
        <h2>Victoria Beckham \u2013 Modern Elegance</h2>
        <p>Luxury meets minimalism. I supported backend tweaks and frontend content placement to align with their high-end aesthetic and product storytelling.</p>
        <h3 class="h4">Contribution</h3>
        <div class="stats">
          <p><strong>Agency: <span>{{ brand.agency }}</span></strong></p>
          <p><strong>Involvement:</strong> {{ brand.involvement_progress }}</p>
        </div>
        <p>My involvement included structural content layout adjustments and theme integration during their seasonal site refresh.</p>
        <a class="button button--style-1" href="#work">Learn more</a>
        <a class="button button--style-2 button--filled" href="https://www.victoriabeckham.com/" target="_blank">View Website</a>`}},{id:"kit-and-kaboodal",largeBlock:!1,name:"Kit and Kaboodal",logo:"./assets/images/brand/logo/logo-kit-and-kaboodal.svg",lifestyleImage:"./assets/images/brand/lifestyle/kit-and-kaboodal.jpg",website:"https://www.kitandkaboodal.com/",agency:"Fostr",involvement:{progress:3,max:5},modal:{id:"brands-item-kit-and-kaboodal",description_html:`
        <h2>Elevating a Boutique Experience</h2>
        <p>Kit and Kaboodal is a family-run brand offering relaxed, easy-to-wear fashion for women of all ages. I collaborated closely with their team to help refresh their Shopify storefront while maintaining their warm, approachable aesthetic.</p>
        <h3 class="h4">Contribution</h3>
        <div class="stats">
          <p><strong>Agency: <span>{{ brand.agency }}</span></strong></p>
          <p><strong>Involvement:</strong> {{ brand.involvement_progress }}</p>
        </div>
        <p>My work included rebuilding collection templates, improving product filtering, and refining key customer journeys. The result was a faster, more intuitive site that reflected their brand personality without compromising performance.</p>
        <a class="button button--style-1" href="#work">Learn more</a>
        <a class="button button--style-2 button--filled" href="https://www.kitandkaboodal.com/" target="_blank">View Website</a>`}},{id:"mutt-motorcycles",largeBlock:!1,name:"Mutt Motorcycles",logo:"./assets/images/brand/logo/logo-mutt-motorcycles.svg",lifestyleImage:"./assets/images/brand/lifestyle/mutt-motorcycles.jpg",website:"https://muttmotorcycles.com/",agency:"Cake Agency",involvement:{progress:5,max:5},modal:{id:"brands-item-mutt-motorcycles",description_html:`
        <h2>A Custom Ride for Every Customer</h2>
        <p>Mutt Motorcycles crafts small engine motorcycles with classic styling and a bold identity. I partnered with Cake Agency to help align their digital experience with the gritty, rebellious nature of the brand.</p>
        <h3 class="h4">Contribution</h3>
        <div class="stats">
          <p><strong>Agency: <span>{{ brand.agency }}</span></strong></p>
          <p><strong>Involvement:</strong> {{ brand.involvement_progress }}</p>
        </div>
        <p>I rebuilt core page templates in Shopify, introduced performance boosts for mobile-first browsing, and collaborated on animations that mirror the raw, handcrafted essence of their bikes. This project was full throttle from start to finish.</p>
        <a class="button button--style-1" href="#work">Learn more</a>
        <a class="button button--style-2 button--filled" href="https://muttmotorcycles.com/" target="_blank">View Website</a>`}},{id:"medik8",largeBlock:!1,name:"Medik8",logo:"./assets/images/brand/logo/logo-medik8.svg",lifestyleImage:"./assets/images/brand/lifestyle/medik8.webp",website:"https://www.medik8.com/",agency:"Fostr",involvement:{progress:1,max:5},modal:{id:"brands-item-medik8",description_html:`
        <h2>Medik8 \u2013 Skincare Reimagined</h2>
        <p>
          Medik8 is a premium skincare brand known for its science-backed formulations and commitment to sustainability. Their products focus on delivering visible results without compromising skin health.
        </p>
        <h3 class="h4">Contribution</h3>
        <div class="stats">
          <p><strong>Agency: <span>{{ brand.agency }}</span></strong></p>
          <p><strong>Involvement:</strong> {{ brand.involvement_progress }}</p>
        </div>
        <p>
          I worked closely with the Medik8 team to redesign their Shopify storefront with a modern, responsive layout and improved UX for both mobile and desktop. My responsibilities included performance optimization, integrating flexible content blocks for campaigns, and refining animations to align with their brand aesthetic.
        </p>
        <a class="button button--style-1" href="#work">Learn more</a>
        <a class="button button--style-2 button--filled" href="https://www.medik8.com/" target="_blank">View Website</a>`}},{id:"indu",largeBlock:!0,name:"Indu",logo:"./assets/images/brand/logo/logo-indu.svg",lifestyleImage:"./assets/images/brand/lifestyle/indu.jpg",website:"https://indu.me/",agency:"Fostr",involvement:{progress:5,max:5},modal:{id:"brands-item-indu",description_html:`
        <h2>Wellness Meets Modern Design</h2>
        <p>Indu blends contemporary lifestyle with holistic wellbeing. As part of their launch, I supported the Shopify build with foundational frontend work and best practices to futureproof the store\u2019s structure.</p>
        <h3 class="h4">Contribution</h3>
        <div class="stats">
          <p><strong>Agency: <span>{{ brand.agency }}</span></strong></p>
          <p><strong>Involvement:</strong> {{ brand.involvement_progress }}</p>
        </div>
        <p>While my role on this project was light-touch, I contributed to key layout components and performance enhancements that ensured their online presence matched the calming clarity of the brand.</p>
        <a class="button button--style-1" href="#work">Learn more</a>
        <a class="button button--style-2 button--filled" href="https://indu.me/" target="_blank">View Website</a>`}},{id:"beis",largeBlock:!1,name:"B\xC9IS",logo:"./assets/images/brand/logo/logo-beis.svg",lifestyleImage:"./assets/images/brand/lifestyle/beis.jpg",website:"https://uk.beistravel.com/",agency:"Fostr",involvement:{progress:3,max:5},modal:{id:"brands-item-beis",description_html:`
        <h2>Travel Made Beautiful</h2>
        <p>B\xC9IS delivers stylish travel gear with a cult following. I worked on improving their Shopify frontend to streamline content delivery and enhance mobile performance across high-traffic pages.</p>
        <h3 class="h4">Contribution</h3>
        <div class="stats">
          <p><strong>Agency: <span>{{ brand.agency }}</span></strong></p>
          <p><strong>Involvement:</strong> {{ brand.involvement_progress }}</p>
        </div>
        <p>The project focused on performance auditing, layout cleanup, and modularising components to help the brand\u2019s team easily scale campaigns while keeping speed and UX top of mind.</p>
        <a class="button button--style-1" href="#work">Learn more</a>
        <a class="button button--style-2 button--filled" href="https://uk.beistravel.com/" target="_blank">View Website</a>`}},{id:"pattern",largeBlock:!0,name:"Pattern",logo:"./assets/images/brand/logo/logo-pattern.svg",lifestyleImage:"./assets/images/brand/lifestyle/pattern.jpg",website:"https://pattern.com/",agency:"Fostr",involvement:{progress:2,max:5},modal:{id:"brands-item-pattern",description_html:`
        <h2>A Future-Forward Shopify Experience</h2>
        <p>Pattern offers a suite of home and lifestyle brands built for modern consumers. I helped refine reusable blocks and navigation on their Shopify build to keep things modular and on-brand.</p>
        <h3 class="h4">Contribution</h3>
        <div class="stats">
          <p><strong>Agency: <span>{{ brand.agency }}</span></strong></p>
          <p><strong>Involvement:</strong> {{ brand.involvement_progress }}</p>
        </div>
        <p>This work included frontend enhancements across templates, tighter integration with their CMS setup, and optimisation for scalable storytelling across different product lines.</p>
        <a class="button button--style-1" href="#work">Learn more</a>
        <a class="button button--style-2 button--filled" href="https://pattern.com/" target="_blank">View Website</a>`}},{id:"st-john",largeBlock:!0,name:"St John",logo:"./assets/images/brand/logo/logo-st-john.svg",lifestyleImage:"./assets/images/brand/lifestyle/st-john.jpg",website:"https://www.stjohnknits.com/",agency:"Fostr",involvement:{progress:5,max:5},modal:{id:"brands-item-st-john",description_html:`
        <h2>Luxury Refined for Digital</h2>
        <p>St. John is a heritage fashion brand known for timeless silhouettes and elevated craftsmanship. I contributed to frontend refinement and collaborated on layout adjustments for Shopify sections used across campaigns.</p>
        <h3 class="h4">Contribution</h3>
        <div class="stats">
          <p><strong>Agency: <span>{{ brand.agency }}</span></strong></p>
          <p><strong>Involvement:</strong> {{ brand.involvement_progress }}</p>
        </div>
        <p>This project involved tailoring design components to maintain brand elegance while improving the performance of image-heavy modules and interactive storytelling elements.</p>
        <a class="button button--style-1" href="#work">Learn more</a>
        <a class="button button--style-2 button--filled" href="https://www.stjohnknits.com/" target="_blank">View Website</a>`}},{id:"kjear-weis",largeBlock:!1,name:"Kjaer Weis",logo:"./assets/images/brand/logo/logo-kjaer-weis.svg",lifestyleImage:"./assets/images/brand/lifestyle/kjaer-weis.jpg",website:"https://kjaerweis.com/",agency:"Fostr",involvement:{progress:2,max:5},modal:{id:"brands-item-kjaer-weis",description_html:`
        <h2>Clean Beauty, Clean Code</h2>
        <p>Kjaer Weis blends luxury aesthetics with clean beauty. I was involved in optimising their Shopify theme with a focus on accessibility, flexible content modules, and elegant micro-interactions.</p>
        <h3 class="h4">Contribution</h3>
        <div class="stats">
          <p><strong>Agency: <span>{{ brand.agency }}</span></strong></p>
          <p><strong>Involvement:</strong> {{ brand.involvement_progress }}</p>
        </div>
        <p>The focus was on modernising templates, improving load times on collection pages, and ensuring pixel-perfect alignment with the brand\u2019s minimalist visual direction.</p>
        <a class="button button--style-1" href="#work">Learn more</a>
        <a class="button button--style-2 button--filled" href="https://kjaerweis.com/" target="_blank">View Website</a>`}},{id:"new-era",largeBlock:!0,name:"New Era",logo:"./assets/images/brand/logo/logo-new-era.svg",lifestyleImage:"./assets/images/brand/lifestyle/new-era.jpg",website:"https://www.neweracap.eu/",agency:"Fostr",involvement:{progress:5,max:5},modal:{id:"brands-item-new-era",description_html:`
        <h2>Heritage Meets High Performance</h2>
        <p>New Era's digital presence had to match the legacy of their globally recognised brand. I supported the team by refining the Shopify frontend and improving mobile UX consistency across high-traffic flows.</p>
        <h3 class="h4">Contribution</h3>
        <div class="stats">
          <p><strong>Agency: <span>{{ brand.agency }}</span></strong></p>
          <p><strong>Involvement:</strong> {{ brand.involvement_progress }}</p>
        </div>
        <p>Part of my work included simplifying layout logic and optimising navigation transitions so that the user journey felt seamless\u2014especially across devices and international variants.</p>
        <a class="button button--style-1" href="#work">Learn more</a>
        <a class="button button--style-2 button--filled" href="https://www.neweracap.eu/" target="_blank">View Website</a>`}},{id:"rad",largeBlock:!1,name:"Rad",logo:"./assets/images/brand/logo/logo-rad.svg",lifestyleImage:"./assets/images/brand/lifestyle/rad.jpg",website:"https://rad.co.uk/",agency:"Fostr",involvement:{progress:3,max:5},modal:{id:"brands-item-rad",description_html:`
        <h2>Culture-Driven eCommerce</h2>
        <p>Rad is bold, playful, and full of personality\u2014and the frontend needed to match. I contributed to cleaning up their theme structure and introduced animation tweaks to energise the user experience.</p>
        <h3 class="h4">Contribution</h3>
        <div class="stats">
          <p><strong>Agency: <span>{{ brand.agency }}</span></strong></p>
          <p><strong>Involvement:</strong> {{ brand.involvement_progress }}</p>
        </div>
        <p>I also supported performance profiling and made small-but-mighty changes that helped enhance the visual impact of campaigns without sacrificing load times.</p>
        <a class="button button--style-1" href="#work">Learn more</a>
        <a class="button button--style-2 button--filled" href="https://rad.co.uk/" target="_blank">View Website</a>`}},{id:"rhino-greenhouses",largeBlock:!1,name:"Rhino Greenhouses",logo:"./assets/images/brand/logo/logo-rhino-greenhouses.png",lifestyleImage:"./assets/images/brand/lifestyle/rhino-greenhouses.jpg",website:"https://www.rhino.co.uk/",agency:"Fostr",involvement:{progress:2,max:5},modal:{id:"brands-item-rhino-greenhouses",description_html:`
        <h2>Rooted in Functionality</h2>
        <p>Rhino Greenhouses delivers high-spec garden structures, and the frontend needed to be as robust. I worked on simplifying code, streamlining content blocks, and supporting accessibility best practices.</p>
        <h3 class="h4">Contribution</h3>
        <div class="stats">
          <p><strong>Agency: <span>{{ brand.agency }}</span></strong></p>
          <p><strong>Involvement:</strong> {{ brand.involvement_progress }}</p>
        </div>
        <p>My involvement focused on improving page structure and refining mobile responsiveness for their product-focused content, ensuring it could scale across future content drops and seasonal campaigns.</p>
        <a class="button button--style-1" href="#work">Learn more</a>
        <a class="button button--style-2 button--filled" href="https://www.rhino.co.uk/" target="_blank">View Website</a>`}},{id:"protectapet",largeBlock:!1,name:"Protectapet",logo:"./assets/images/brand/logo/logo-protectapet.png",lifestyleImage:"./assets/images/brand/lifestyle/protectapet.jpg",website:"https://www.protectapet.com/",agency:"Cake Agency",involvement:{progress:3,max:5},modal:{id:"brands-item-protectapet",description_html:`
        <h2>Secure Spaces for Furry Friends</h2>
        <p>Protectapet specialises in protective pet fencing systems, and their site needed to communicate reassurance and clarity. I helped improve content layout structure, ensuring their message came through with ease on mobile and desktop.</p>
        <h3 class="h4">Contribution</h3>
        <div class="stats">
          <p><strong>Agency: <span>{{ brand.agency }}</span></strong></p>
          <p><strong>Involvement:</strong> {{ brand.involvement_progress }}</p>
        </div>
        <p>My role focused on enhancing UX for their product discovery flow and refining custom Liquid sections that allow their team to build trust-driven content around their mission and solutions.</p>
        <a class="button button--style-1" href="#work">Learn more</a>
        <a class="button button--style-2 button--filled" href="https://www.protectapet.com/" target="_blank">View Website</a>`}},{id:"and-sons",largeBlock:!0,name:"And Sons",logo:"./assets/images/brand/logo/logo-and-sons.png",lifestyleImage:"./assets/images/brand/lifestyle/and-sons.jpg",website:"https://andsons.co.uk/",agency:"Cake Agency",involvement:{progress:4,max:5},modal:{id:"brands-item-and-sons",description_html:`
        <h2>Tailoring a Story-Driven Experience</h2>
        <p>And Sons is a premium brand with a strong sense of identity. I worked on extending their Shopify theme to support custom visual storytelling blocks, as well as refining typography and layout across PDPs and landing pages.</p>
        <h3 class="h4">Contribution</h3>
        <div class="stats">
          <p><strong>Agency: <span>{{ brand.agency }}</span></strong></p>
          <p><strong>Involvement:</strong> {{ brand.involvement_progress }}</p>
        </div>
        <p>The project required strong attention to design consistency and performance, especially on image-heavy templates. I also helped simplify how content could be managed internally using flexible, reusable Liquid components.</p>
        <a class="button button--style-1" href="#work">Learn more</a>
        <a class="button button--style-2 button--filled" href="https://andsons.co.uk/" target="_blank">View Website</a>`}},{id:"pandco",largeBlock:!1,name:"Pandco",logo:"./assets/images/brand/logo/logo-pandco.svg",lifestyleImage:"./assets/images/brand/lifestyle/pandco.jpg",website:"https://pandco.com/",agency:"Cake Agency",involvement:{progress:2,max:5},modal:{id:"brands-item-pandco",description_html:`
        <h2>Raw and Refined eCommerce</h2>
        <p>P&Co needed a Shopify theme that could carry the rawness of their brand while remaining refined in execution. I contributed to UI consistency, conversion-focused layout tweaks, and product grid flexibility.</p>
        <h3 class="h4">Contribution</h3>
        <div class="stats">
          <p><strong>Agency: <span>{{ brand.agency }}</span></strong></p>
          <p><strong>Involvement:</strong> {{ brand.involvement_progress }}</p>
        </div>
        <p>My work also touched on adjusting animations, updating mobile navigation patterns, and improving the custom section architecture so that their team could move faster with future seasonal drops.</p>
        <a class="button button--style-1" href="#work">Learn more</a>
        <a class="button button--style-2 button--filled" href="https://pandco.com/" target="_blank">View Website</a>`}},{id:"pangaia",largeBlock:!0,name:"Pangaia",logo:"./assets/images/brand/logo/logo-pangaia.svg",lifestyleImage:"./assets/images/brand/lifestyle/pangaia.jpg",website:"https://pangaia.com/",agency:"Fostr",involvement:{progress:5,max:5},modal:{id:"brands-item-pangaia",description_html:`
        <h2>Earth-First Innovation</h2>
        <p>Pangaia\u2019s bold sustainability mission demanded a fast, flexible, and visually clean storefront. I supported their frontend with improvements to their Shopify theme structure, focusing on content hierarchy and performance.</p>
        <h3 class="h4">Contribution</h3>
        <div class="stats">
          <p><strong>Agency: <span>{{ brand.agency }}</span></strong></p>
          <p><strong>Involvement:</strong> {{ brand.involvement_progress }}</p>
        </div>
        <p>This included fine-tuning reusable content blocks and refining the way collections and storytelling pages loaded across devices, ensuring speed without sacrificing creative flexibility.</p>
        <a class="button button--style-1" href="#work">Learn more</a>
        <a class="button button--style-2 button--filled" href="https://pangaia.com/" target="_blank">View Website</a>`}},{id:"bad-monday",largeBlock:!1,name:"bad-monday",logo:"./assets/images/brand/logo/logo-bad-monday.svg",lifestyleImage:"./assets/images/brand/lifestyle/bad-monday.jpg",website:"https://bad-monday.com/",agency:"Cage Agency",involvement:{progress:5,max:5},modal:{id:"brands-item-bad-monday",description_html:`
        <h2>Earth-First Innovation</h2>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec a diam lectus. Sed sit amet ipsum mauris. Maecenas congue ligula ac quam viverra nec consectetur ante hendrerit. Donec et mollis dolor. Praesent et diam eget libero egestas mattis sit amet vitae augue.</p>
        <h3 class="h4">Contribution</h3>
        <div class="stats">
          <p><strong>Agency: <span>{{ brand.agency }}</span></strong></p>
          <p><strong>Involvement:</strong> {{ brand.involvement_progress }}</p>
        </div>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec a diam lectus. Sed sit amet ipsum mauris. Maecenas congue ligula ac quam viverra nec consectetur ante hendrerit. Donec et mollis dolor. Praesent et diam eget libero egestas mattis sit amet vitae augue.</p>
        <a class="button button--style-1" href="#work">Learn more</a>
        <a class="button button--style-2 button--filled" href="https://bad-monday.com/" target="_blank">View Website</a>`}},{id:"goose-and-gander",largeBlock:!1,name:"goose-and-gander",logo:"./assets/images/brand/logo/logo-goose-and-gander.svg",lifestyleImage:"./assets/images/brand/lifestyle/goose-and-gander.jpg",website:"https://gooseandgander.com/",agency:"Cage Agency",involvement:{progress:5,max:5},modal:{id:"brands-item-goose-and-gander",description_html:`
        <h2>Earth-First Innovation</h2>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec a diam lectus. Sed sit amet ipsum mauris. Maecenas congue ligula ac quam viverra nec consectetur ante hendrerit. Donec et mollis dolor. Praesent et diam eget libero egestas mattis sit amet vitae augue.</p>
        <h3 class="h4">Contribution</h3>
        <div class="stats">
          <p><strong>Agency: <span>{{ brand.agency }}</span></strong></p>
          <p><strong>Involvement:</strong> {{ brand.involvement_progress }}</p>
        </div>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec a diam lectus. Sed sit amet ipsum mauris. Maecenas congue ligula ac quam viverra nec consectetur ante hendrerit. Donec et mollis dolor. Praesent et diam eget libero egestas mattis sit amet vitae augue.</p>
        <a class="button button--style-1" href="#work">Learn more</a>
        <a class="button button--style-2 button--filled" href="https://gooseandgander.com/" target="_blank">View Website</a>`}},{id:"dancing-leopard",largeBlock:!1,name:"dancing-leopard",logo:"./assets/images/brand/logo/logo-dancing-leopard.svg",lifestyleImage:"./assets/images/brand/lifestyle/dancing-leopard.jpg",website:"https://dancingleopard.com/",agency:"Cage Agency",involvement:{progress:5,max:5},modal:{id:"brands-item-dancing-leopard",description_html:`
        <h2>Earth-First Innovation</h2>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec a diam lectus. Sed sit amet ipsum mauris. Maecenas congue ligula ac quam viverra nec consectetur ante hendrerit. Donec et mollis dolor. Praesent et diam eget libero egestas mattis sit amet vitae augue.</p>
        <h3 class="h4">Contribution</h3>
        <div class="stats">
          <p><strong>Agency: <span>{{ brand.agency }}</span></strong></p>
          <p><strong>Involvement:</strong> {{ brand.involvement_progress }}</p>
        </div>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec a diam lectus. Sed sit amet ipsum mauris. Maecenas congue ligula ac quam viverra nec consectetur ante hendrerit. Donec et mollis dolor. Praesent et diam eget libero egestas mattis sit amet vitae augue.</p>
        <a class="button button--style-1" href="#work">Learn more</a>
        <a class="button button--style-2 button--filled" href="https://dancingleopard.com/" target="_blank">View Website</a>`}}],y=D;function B(r=0,e=5){let t=document.createElement("div");t.className="progress-blocks",t.setAttribute("aria-label",`Progress: ${r} out of ${e}`);for(let n=0;n<e;n++){let s=document.createElement("span");s.className="block",n<r&&(s.classList.add("filled"),s.setAttribute("data-index",n)),t.appendChild(s)}return t}var k=class extends A{_keyHandler=null;async ensureModalLoaded(){if(!document.getElementById("modal"))try{let e=await fetch("./snippets/modal-brand.html");if(!e.ok)throw new Error(`HTTP error! status: ${e.status}`);let t=await e.text(),n=document.createElement("div");n.innerHTML=t.trim();let s=n.querySelector("#modal");if(!s)throw new Error("Modal structure (#modal) not found in snippet: ./snippets/modal-brand.html");document.body.appendChild(s),this.attachCloseHandlers(s),this.setupDragFunctionality(s)}catch(e){console.error("Failed to load modal-brand snippet:",e)}}async showModal(){await this.ensureModalLoaded();let e=document.getElementById("modal");if(!e){console.error("Cannot show modal: #modal element not found.");return}let t=e.querySelector(".modal__inner-content");if(!t){console.error("Cannot show modal: .modal__inner-content element not found.");return}t.innerHTML="";let n=this.getAttribute("data-brand-id");if(!n){console.error("ModalBrand: data-brand-id attribute is missing.",this),t.innerHTML="<p>Error: Brand ID not specified.</p>";return}let s=y.find(o=>o.id===n);s?(this.populateBrandContent(t,s),this.dataset.nav==="true"&&this.setupNavigation(e)):(console.error(`Brand data not found for ID: ${n}`),t.innerHTML="<p>Brand information not available.</p>"),requestAnimationFrame(()=>{b(),document.body.classList.add("modal-open"),e.classList.add("is-active");let o=e.querySelector(".progress-blocks");o&&setTimeout(()=>{o.classList.add("in-view")},300)})}populateBrandContent(e,t){let n=document.createElement("img");n.src=t.lifestyleImage||"placeholder-image.jpg",n.alt=`${t.name||"Brand"} lifestyle image`;let s=document.createElement("div");s.classList.add("modal__brand-image-wrapper"),s.appendChild(n),e.appendChild(s);let o=document.createElement("div");o.classList.add("modal__container");let l=document.createElement("img");l.src=t.logo||"",l.alt=`${t.name||"Brand"} logo`,l.classList.add("modal__brand-logo"),o.appendChild(l);let i=document.createElement("div"),c=t.modal?.description_html||"<p>No description available.</p>",a=t.involvement?B(t.involvement.progress,t.involvement.max).outerHTML:"",d=c.replace(/{{\s*brand\.involvement_progress\s*}}/g,a).replace(/{{\s*brand\.agency\s*}}/g,t.agency||"N/A");i.innerHTML=d,o.appendChild(i),e.appendChild(o)}setupNavigation(e){let t=Array.from(document.querySelectorAll("modal-content-brand[data-nav='true']")),n=t.indexOf(this);if(n===-1)return;let s=(n+1)%t.length,o=(n-1+t.length)%t.length,l=e.querySelector(".modal__nav--next"),i=e.querySelector(".modal__nav--prev");l&&(l.onclick=null,l.onclick=()=>t[s].showModal()),i&&(i.onclick=null,i.onclick=()=>t[o].showModal()),this._keyHandler&&window.removeEventListener("keydown",this._keyHandler),this._keyHandler=c=>{e.classList.contains("is-active")&&(c.key==="ArrowRight"?(c.preventDefault(),t[s].showModal()):c.key==="ArrowLeft"?(c.preventDefault(),t[o].showModal()):c.key==="Escape"&&(c.preventDefault(),this.closeModal()))},window.addEventListener("keydown",this._keyHandler)}closeModal(){super.closeModal(),this._keyHandler&&(window.removeEventListener("keydown",this._keyHandler),this._keyHandler=null)}};customElements.define("modal-content-brand",k);var _=class extends HTMLElement{constructor(){super()}connectedCallback(){this.render()}async loadTemplate(){if(this._template)return this._template;try{let t=await(await fetch("./snippets/brand-card.html")).text();return this._template=t,t}catch(e){return console.error("Failed to load brand card snippet:",e),""}}async render(){let e=this,t=await this.loadTemplate();t&&y.forEach(n=>{let s=t.replace(/{{\s*brand\.key\s*}}/g,n.id).replace(/{{\s*brand\.logo\s*}}/g,n.logo).replace(/{{\s*brand\.lifestyleImage\s*}}/g,n.lifestyleImage).replace(/{{\s*brand\.name\s*}}/g,n.name),o=document.createElement("div");o.innerHTML=s;let l=o.firstElementChild;n.largeBlock&&l.classList.add("large-block"),e.appendChild(l)})}};customElements.define("brand-cards",_);})();
