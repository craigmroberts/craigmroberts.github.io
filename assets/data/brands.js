const brands = [
  {
    id: "patou",
    largeBlock: false,
    name: "Patou",
    logo: "./assets/images/brand/logo/logo-patou.svg",
    lifestyleImage: "./assets/images/brand/lifestyle/patou.jpg",
    website: "https://www.patou.com/",
    agency: "Fostr",
    involvement: {
      progress: 2,
      max: 5
    },
    modal: {
      id: "brands-item-patou",
      description_html: `
        <h2>Patou – Sustainable Luxury</h2>
        <p>Patou is a Parisian fashion house blending heritage with sustainability. Their collections are known for bold silhouettes, joyful color, and a commitment to eco-conscious practices.</p>
        <h3 class="h4">Contribution</h3>
        <div class="stats">
          <p><strong>Agency: <span>{{ brand.agency }}</span></strong></p>
          <p><strong>Involvement:</strong> {{ brand.involvement_progress }}</p>
        </div>
        <p>I worked on performance tuning and responsive layout tweaks across seasonal collection drops. Collaborated closely with their in-house team on content updates and accessibility improvements.</p>
        <a class="button button--style-1" href="#work">Learn more</a>
        <a class="button button--style-2 button--filled" href="https://www.patou.com/" target="_blank">View Website</a>`
    }
  },
  {
    id: "triangl",
    largeBlock: true,
    name: "Triangl",
    logo: "./assets/images/brand/logo/logo-triangl.svg",
    lifestyleImage: "./assets/images/brand/lifestyle/triangl.jpg",
    website: "https://triangl.com/",
    agency: "Fostr",
    involvement: {
      progress: 2,
      max: 5
    },
    modal: {
      id: "brands-item-triangl",
      description_html: `
        <h2>TRIANGL – Swimwear, Reimagined</h2>
        <p>TRIANGL is a globally recognized swimwear brand known for their clean aesthetic, vibrant campaigns, and modern silhouettes.</p>
        <h3 class="h4">Contribution</h3>
        <div class="stats">
          <p><strong>Agency: <span>{{ brand.agency }}</span></strong></p>
          <p><strong>Involvement:</strong> {{ brand.involvement_progress }}</p>
        </div>
        <p>I provided technical support for campaign updates and refreshed components on key landing pages. Work included hero modules, content blocks, and global styling tweaks.</p>
        <a class="button button--style-1" href="#work">Learn more</a>
        <a class="button button--style-2 button--filled" href="https://triangl.com/" target="_blank">View Website</a>`
    }
  },
  {
    id: "pucci",
    largeBlock: false,
    name: "Pucci",
    logo: "./assets/images/brand/logo/logo-pucci.svg",
    lifestyleImage: "./assets/images/brand/lifestyle/pucci.jpg",
    website: "https://www.pucci.com/",
    agency: "Fostr",
    involvement: {
      progress: 2,
      max: 5
    },
    modal: {
      id: "brands-item-pucci",
      description_html: `
        <h2>Pucci – A Digital Renaissance</h2>
        <p>Pucci, an icon of Italian fashion, needed a modern online experience to match their vibrant heritage. Their site showcases fluid animations and rich storytelling.</p>
        <h3 class="h4">Contribution</h3>
        <div class="stats">
          <p><strong>Agency: <span>{{ brand.agency }}</span></strong></p>
          <p><strong>Involvement:</strong> {{ brand.involvement_progress }}</p>
        </div>
        <p>I collaborated with the design team to develop interactive page templates, optimized animations, and refined the core layout system for mobile users.</p>
        <a class="button button--style-1" href="#work">Learn more</a>
        <a class="button button--style-2 button--filled" href="https://www.pucci.com/" target="_blank">View Website</a>`
    }
  },
  {
    id: "victoria-beckham",
    largeBlock: false,
    name: "Victoria Beckham",
    logo: "./assets/images/brand/logo/logo-victoria-beckham.svg",
    lifestyleImage: "./assets/images/brand/lifestyle/victoria-beckham.jpg",
    website: "https://www.victoriabeckham.com/",
    agency: "Fostr",
    involvement: {
      progress: 1,
      max: 5
    },
    modal: {
      id: "brands-item-victoria-beckham",
      description_html: `
        <h2>Victoria Beckham – Modern Elegance</h2>
        <p>Luxury meets minimalism. I supported backend tweaks and frontend content placement to align with their high-end aesthetic and product storytelling.</p>
        <h3 class="h4">Contribution</h3>
        <div class="stats">
          <p><strong>Agency: <span>{{ brand.agency }}</span></strong></p>
          <p><strong>Involvement:</strong> {{ brand.involvement_progress }}</p>
        </div>
        <p>My involvement included structural content layout adjustments and theme integration during their seasonal site refresh.</p>
        <a class="button button--style-1" href="#work">Learn more</a>
        <a class="button button--style-2 button--filled" href="https://www.victoriabeckham.com/" target="_blank">View Website</a>`
    }
  },
  {
    "id": "kit-and-kaboodal",
    "largeBlock": false,
    "name": "Kit and Kaboodal",
    "logo": "./assets/images/brand/logo/logo-kit-and-kaboodal.svg",
    "lifestyleImage": "./assets/images/brand/lifestyle/kit-and-kaboodal.jpg",
    "website": "https://www.kitandkaboodal.com/",
    "agency": "Fostr",
    "involvement": {
      "progress": 3,
      "max": 5
    },
    "modal": {
      "id": "brands-item-kit-and-kaboodal",
      "description_html": `
        <h2>Elevating a Boutique Experience</h2>
        <p>Kit and Kaboodal is a family-run brand offering relaxed, easy-to-wear fashion for women of all ages. I collaborated closely with their team to help refresh their Shopify storefront while maintaining their warm, approachable aesthetic.</p>
        <h3 class="h4">Contribution</h3>
        <div class="stats">
          <p><strong>Agency: <span>{{ brand.agency }}</span></strong></p>
          <p><strong>Involvement:</strong> {{ brand.involvement_progress }}</p>
        </div>
        <p>My work included rebuilding collection templates, improving product filtering, and refining key customer journeys. The result was a faster, more intuitive site that reflected their brand personality without compromising performance.</p>
        <a class="button button--style-1" href="#work">Learn more</a>
        <a class="button button--style-2 button--filled" href="https://www.kitandkaboodal.com/" target="_blank">View Website</a>`

    }
  },
  {
    "id": "mutt-motorcycles",
    "largeBlock": false,
    "name": "Mutt Motorcycles",
    "logo": "./assets/images/brand/logo/logo-mutt-motorcycles.svg",
    "lifestyleImage": "./assets/images/brand/lifestyle/mutt-motorcycles.jpg",
    "website": "https://muttmotorcycles.com/",
    "agency": "Cake Agency",
    "involvement": {
      "progress": 5,
      "max": 5
    },
    "modal": {
      "id": "brands-item-mutt-motorcycles",
      "description_html": `
        <h2>A Custom Ride for Every Customer</h2>
        <p>Mutt Motorcycles crafts small engine motorcycles with classic styling and a bold identity. I partnered with Cake Agency to help align their digital experience with the gritty, rebellious nature of the brand.</p>
        <h3 class="h4">Contribution</h3>
        <div class="stats">
          <p><strong>Agency: <span>{{ brand.agency }}</span></strong></p>
          <p><strong>Involvement:</strong> {{ brand.involvement_progress }}</p>
        </div>
        <p>I rebuilt core page templates in Shopify, introduced performance boosts for mobile-first browsing, and collaborated on animations that mirror the raw, handcrafted essence of their bikes. This project was full throttle from start to finish.</p>
        <a class="button button--style-1" href="#work">Learn more</a>
        <a class="button button--style-2 button--filled" href="https://muttmotorcycles.com/" target="_blank">View Website</a>`
    }
  },
  {
    "id": "medik8",
    "largeBlock": false,
    "name": "Medik8",
    "logo": "./assets/images/brand/logo/logo-medik8.svg",
    "lifestyleImage": "./assets/images/brand/lifestyle/medik8.webp",
    "website": "https://www.medik8.com/",
    "agency": "Fostr",
    "involvement": {
      "progress": 1,
      "max": 5
    },
    "modal": {
      "id": "brands-item-medik8",
      "description_html": `
        <h2>Medik8 – Skincare Reimagined</h2>
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
        <a class="button button--style-2 button--filled" href="https://www.medik8.com/" target="_blank">View Website</a>`
    }
  },
  {
    "id": "indu",
    "largeBlock": true,
    "name": "Indu",
    "logo": "./assets/images/brand/logo/logo-indu.svg",
    "lifestyleImage": "./assets/images/brand/lifestyle/indu.jpg",
    "website": "https://indu.me/",
    "agency": "Fostr",
    "involvement": {
      "progress": 5,
      "max": 5
    },
    "modal": {
      "id": "brands-item-indu",
      "description_html": `
        <h2>Wellness Meets Modern Design</h2>
        <p>Indu blends contemporary lifestyle with holistic wellbeing. As part of their launch, I supported the Shopify build with foundational frontend work and best practices to futureproof the store’s structure.</p>
        <h3 class="h4">Contribution</h3>
        <div class="stats">
          <p><strong>Agency: <span>{{ brand.agency }}</span></strong></p>
          <p><strong>Involvement:</strong> {{ brand.involvement_progress }}</p>
        </div>
        <p>While my role on this project was light-touch, I contributed to key layout components and performance enhancements that ensured their online presence matched the calming clarity of the brand.</p>
        <a class="button button--style-1" href="#work">Learn more</a>
        <a class="button button--style-2 button--filled" href="https://indu.me/" target="_blank">View Website</a>`

    }
  },
  {
    "id": "beis",
    "largeBlock": false,
    "name": "BÉIS",
    "logo": "./assets/images/brand/logo/logo-beis.svg",
    "lifestyleImage": "./assets/images/brand/lifestyle/beis.jpg",
    "website": "https://uk.beistravel.com/",
    "agency": "Fostr",
    "involvement": {
      "progress": 3,
      "max": 5
    },
    "modal": {
      "id": "brands-item-beis",
      "description_html": `
        <h2>Travel Made Beautiful</h2>
        <p>BÉIS delivers stylish travel gear with a cult following. I worked on improving their Shopify frontend to streamline content delivery and enhance mobile performance across high-traffic pages.</p>
        <h3 class="h4">Contribution</h3>
        <div class="stats">
          <p><strong>Agency: <span>{{ brand.agency }}</span></strong></p>
          <p><strong>Involvement:</strong> {{ brand.involvement_progress }}</p>
        </div>
        <p>The project focused on performance auditing, layout cleanup, and modularising components to help the brand’s team easily scale campaigns while keeping speed and UX top of mind.</p>
        <a class="button button--style-1" href="#work">Learn more</a>
        <a class="button button--style-2 button--filled" href="https://uk.beistravel.com/" target="_blank">View Website</a>`

    }
  },
  {
    "id": "pattern",
    "largeBlock": true,
    "name": "Pattern",
    "logo": "./assets/images/brand/logo/logo-pattern.svg",
    "lifestyleImage": "./assets/images/brand/lifestyle/pattern.jpg",
    "website": "https://pattern.com/",
    "agency": "Fostr",
    "involvement": {
      "progress": 2,
      "max": 5
    },
    "modal": {
      "id": "brands-item-pattern",
      "description_html": `
        <h2>A Future-Forward Shopify Experience</h2>
        <p>Pattern offers a suite of home and lifestyle brands built for modern consumers. I helped refine reusable blocks and navigation on their Shopify build to keep things modular and on-brand.</p>
        <h3 class="h4">Contribution</h3>
        <div class="stats">
          <p><strong>Agency: <span>{{ brand.agency }}</span></strong></p>
          <p><strong>Involvement:</strong> {{ brand.involvement_progress }}</p>
        </div>
        <p>This work included frontend enhancements across templates, tighter integration with their CMS setup, and optimisation for scalable storytelling across different product lines.</p>
        <a class="button button--style-1" href="#work">Learn more</a>
        <a class="button button--style-2 button--filled" href="https://pattern.com/" target="_blank">View Website</a>`
    }
  },
  {
    "id": "st-john",
    "largeBlock": true,
    "name": "St John",
    "logo": "./assets/images/brand/logo/logo-st-john.svg",
    "lifestyleImage": "./assets/images/brand/lifestyle/st-john.jpg",
    "website": "https://www.stjohnknits.com/",
    "agency": "Fostr",
    "involvement": {
      "progress": 5,
      "max": 5
    },
    "modal": {
      "id": "brands-item-st-john",
      "description_html": `
        <h2>Luxury Refined for Digital</h2>
        <p>St. John is a heritage fashion brand known for timeless silhouettes and elevated craftsmanship. I contributed to frontend refinement and collaborated on layout adjustments for Shopify sections used across campaigns.</p>
        <h3 class="h4">Contribution</h3>
        <div class="stats">
          <p><strong>Agency: <span>{{ brand.agency }}</span></strong></p>
          <p><strong>Involvement:</strong> {{ brand.involvement_progress }}</p>
        </div>
        <p>This project involved tailoring design components to maintain brand elegance while improving the performance of image-heavy modules and interactive storytelling elements.</p>
        <a class="button button--style-1" href="#work">Learn more</a>
        <a class="button button--style-2 button--filled" href="https://www.stjohnknits.com/" target="_blank">View Website</a>`
    }
  },
  {
    "id": "kjear-weis",
    "largeBlock": false,
    "name": "Kjaer Weis",
    "logo": "./assets/images/brand/logo/logo-kjaer-weis.svg",
    "lifestyleImage": "./assets/images/brand/lifestyle/kjaer-weis.jpg",
    "website": "https://kjaerweis.com/",
    "agency": "Fostr",
    "involvement": {
      "progress": 2,
      "max": 5
    },
    "modal": {
      "id": "brands-item-kjaer-weis",
      "description_html": `
        <h2>Clean Beauty, Clean Code</h2>
        <p>Kjaer Weis blends luxury aesthetics with clean beauty. I was involved in optimising their Shopify theme with a focus on accessibility, flexible content modules, and elegant micro-interactions.</p>
        <h3 class="h4">Contribution</h3>
        <div class="stats">
          <p><strong>Agency: <span>{{ brand.agency }}</span></strong></p>
          <p><strong>Involvement:</strong> {{ brand.involvement_progress }}</p>
        </div>
        <p>The focus was on modernising templates, improving load times on collection pages, and ensuring pixel-perfect alignment with the brand’s minimalist visual direction.</p>
        <a class="button button--style-1" href="#work">Learn more</a>
        <a class="button button--style-2 button--filled" href="https://kjaerweis.com/" target="_blank">View Website</a>`
    }
  },
  {
    "id": "new-era",
    "largeBlock": true,
    "name": "New Era",
    "logo": "./assets/images/brand/logo/logo-new-era.svg",
    "lifestyleImage": "./assets/images/brand/lifestyle/new-era.jpg",
    "website": "https://www.neweracap.eu/",
    "agency": "Fostr",
    "involvement": {
      "progress": 5,
      "max": 5
    },
    "modal": {
      "id": "brands-item-new-era",
      "description_html": `
        <h2>Heritage Meets High Performance</h2>
        <p>New Era's digital presence had to match the legacy of their globally recognised brand. I supported the team by refining the Shopify frontend and improving mobile UX consistency across high-traffic flows.</p>
        <h3 class="h4">Contribution</h3>
        <div class="stats">
          <p><strong>Agency: <span>{{ brand.agency }}</span></strong></p>
          <p><strong>Involvement:</strong> {{ brand.involvement_progress }}</p>
        </div>
        <p>Part of my work included simplifying layout logic and optimising navigation transitions so that the user journey felt seamless—especially across devices and international variants.</p>
        <a class="button button--style-1" href="#work">Learn more</a>
        <a class="button button--style-2 button--filled" href="https://www.neweracap.eu/" target="_blank">View Website</a>`
    }
  },
  {
    "id": "rad",
    "largeBlock": false,
    "name": "Rad",
    "logo": "./assets/images/brand/logo/logo-rad.svg",
    "lifestyleImage": "./assets/images/brand/lifestyle/rad.jpg",
    "website": "https://rad.co.uk/",
    "agency": "Fostr",
    "involvement": {
      "progress": 3,
      "max": 5
    },
    "modal": {
      "id": "brands-item-rad",
      "description_html": `
        <h2>Culture-Driven eCommerce</h2>
        <p>Rad is bold, playful, and full of personality—and the frontend needed to match. I contributed to cleaning up their theme structure and introduced animation tweaks to energise the user experience.</p>
        <h3 class="h4">Contribution</h3>
        <div class="stats">
          <p><strong>Agency: <span>{{ brand.agency }}</span></strong></p>
          <p><strong>Involvement:</strong> {{ brand.involvement_progress }}</p>
        </div>
        <p>I also supported performance profiling and made small-but-mighty changes that helped enhance the visual impact of campaigns without sacrificing load times.</p>
        <a class="button button--style-1" href="#work">Learn more</a>
        <a class="button button--style-2 button--filled" href="https://rad.co.uk/" target="_blank">View Website</a>`
    }
  },
  {
    "id": "rhino-greenhouses",
    "largeBlock": false,
    "name": "Rhino Greenhouses",
    "logo": "./assets/images/brand/logo/logo-rhino-greenhouses.png",
    "lifestyleImage": "./assets/images/brand/lifestyle/rhino-greenhouses.jpg",
    "website": "https://www.rhino.co.uk/",
    "agency": "Fostr",
    "involvement": {
      "progress": 2,
      "max": 5
    },
    "modal": {
      "id": "brands-item-rhino-greenhouses",
      "description_html": `
        <h2>Rooted in Functionality</h2>
        <p>Rhino Greenhouses delivers high-spec garden structures, and the frontend needed to be as robust. I worked on simplifying code, streamlining content blocks, and supporting accessibility best practices.</p>
        <h3 class="h4">Contribution</h3>
        <div class="stats">
          <p><strong>Agency: <span>{{ brand.agency }}</span></strong></p>
          <p><strong>Involvement:</strong> {{ brand.involvement_progress }}</p>
        </div>
        <p>My involvement focused on improving page structure and refining mobile responsiveness for their product-focused content, ensuring it could scale across future content drops and seasonal campaigns.</p>
        <a class="button button--style-1" href="#work">Learn more</a>
        <a class="button button--style-2 button--filled" href="https://www.rhino.co.uk/" target="_blank">View Website</a>`
    }
  },
  {
    "id": "protectapet",
    "largeBlock": false,
    "name": "Protectapet",
    "logo": "./assets/images/brand/logo/logo-protectapet.png",
    "lifestyleImage": "./assets/images/brand/lifestyle/protectapet.jpg",
    "website": "https://www.protectapet.com/",
    "agency": "Cake Agency",
    "involvement": {
      "progress": 3,
      "max": 5
    },
    "modal": {
      "id": "brands-item-protectapet",
      "description_html": `
        <h2>Secure Spaces for Furry Friends</h2>
        <p>Protectapet specialises in protective pet fencing systems, and their site needed to communicate reassurance and clarity. I helped improve content layout structure, ensuring their message came through with ease on mobile and desktop.</p>
        <h3 class="h4">Contribution</h3>
        <div class="stats">
          <p><strong>Agency: <span>{{ brand.agency }}</span></strong></p>
          <p><strong>Involvement:</strong> {{ brand.involvement_progress }}</p>
        </div>
        <p>My role focused on enhancing UX for their product discovery flow and refining custom Liquid sections that allow their team to build trust-driven content around their mission and solutions.</p>
        <a class="button button--style-1" href="#work">Learn more</a>
        <a class="button button--style-2 button--filled" href="https://www.protectapet.com/" target="_blank">View Website</a>`
    }
  },
  {
    "id": "and-sons",
    "largeBlock": true,
    "name": "And Sons",
    "logo": "./assets/images/brand/logo/logo-and-sons.png",
    "lifestyleImage": "./assets/images/brand/lifestyle/and-sons.jpg",
    "website": "https://andsons.co.uk/",
    "agency": "Cake Agency",
    "involvement": {
      "progress": 4,
      "max": 5
    },
    "modal": {
      "id": "brands-item-and-sons",
      "description_html": `
        <h2>Tailoring a Story-Driven Experience</h2>
        <p>And Sons is a premium brand with a strong sense of identity. I worked on extending their Shopify theme to support custom visual storytelling blocks, as well as refining typography and layout across PDPs and landing pages.</p>
        <h3 class="h4">Contribution</h3>
        <div class="stats">
          <p><strong>Agency: <span>{{ brand.agency }}</span></strong></p>
          <p><strong>Involvement:</strong> {{ brand.involvement_progress }}</p>
        </div>
        <p>The project required strong attention to design consistency and performance, especially on image-heavy templates. I also helped simplify how content could be managed internally using flexible, reusable Liquid components.</p>
        <a class="button button--style-1" href="#work">Learn more</a>
        <a class="button button--style-2 button--filled" href="https://andsons.co.uk/" target="_blank">View Website</a>`
    }
  },
  {
    "id": "pandco",
    "largeBlock": false,
    "name": "Pandco",
    "logo": "./assets/images/brand/logo/logo-pandco.svg",
    "lifestyleImage": "./assets/images/brand/lifestyle/pandco.jpg",
    "website": "https://pandco.com/",
    "agency": "Cake Agency",
    "involvement": {
      "progress": 2,
      "max": 5
    },
    "modal": {
      "id": "brands-item-pandco",
      "description_html": `
        <h2>Raw and Refined eCommerce</h2>
        <p>P&Co needed a Shopify theme that could carry the rawness of their brand while remaining refined in execution. I contributed to UI consistency, conversion-focused layout tweaks, and product grid flexibility.</p>
        <h3 class="h4">Contribution</h3>
        <div class="stats">
          <p><strong>Agency: <span>{{ brand.agency }}</span></strong></p>
          <p><strong>Involvement:</strong> {{ brand.involvement_progress }}</p>
        </div>
        <p>My work also touched on adjusting animations, updating mobile navigation patterns, and improving the custom section architecture so that their team could move faster with future seasonal drops.</p>
        <a class="button button--style-1" href="#work">Learn more</a>
        <a class="button button--style-2 button--filled" href="https://pandco.com/" target="_blank">View Website</a>`
    }
  },
  {
    "id": "pangaia",
    "largeBlock": true,
    "name": "Pangaia",
    "logo": "./assets/images/brand/logo/logo-pangaia.svg",
    "lifestyleImage": "./assets/images/brand/lifestyle/pangaia.jpg",
    "website": "https://pangaia.com/",
    "agency": "Fostr",
    "involvement": {
      "progress": 5,
      "max": 5
    },
    "modal": {
      "id": "brands-item-pangaia",
      "description_html": `
        <h2>Earth-First Innovation</h2>
        <p>Pangaia’s bold sustainability mission demanded a fast, flexible, and visually clean storefront. I supported their frontend with improvements to their Shopify theme structure, focusing on content hierarchy and performance.</p>
        <h3 class="h4">Contribution</h3>
        <div class="stats">
          <p><strong>Agency: <span>{{ brand.agency }}</span></strong></p>
          <p><strong>Involvement:</strong> {{ brand.involvement_progress }}</p>
        </div>
        <p>This included fine-tuning reusable content blocks and refining the way collections and storytelling pages loaded across devices, ensuring speed without sacrificing creative flexibility.</p>
        <a class="button button--style-1" href="#work">Learn more</a>
        <a class="button button--style-2 button--filled" href="https://pangaia.com/" target="_blank">View Website</a>`
    }
  },
  {
    "id": "bad-monday",
    "largeBlock": false,
    "name": "bad-monday",
    "logo": "./assets/images/brand/logo/logo-bad-monday.svg",
    "lifestyleImage": "./assets/images/brand/lifestyle/bad-monday.jpg",
    "website": "https://bad-monday.com/",
    "agency": "Cage Agency",
    "involvement": {
      "progress": 5,
      "max": 5
    },
    "modal": {
      "id": "brands-item-bad-monday",
      "description_html": `
        <h2>Earth-First Innovation</h2>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec a diam lectus. Sed sit amet ipsum mauris. Maecenas congue ligula ac quam viverra nec consectetur ante hendrerit. Donec et mollis dolor. Praesent et diam eget libero egestas mattis sit amet vitae augue.</p>
        <h3 class="h4">Contribution</h3>
        <div class="stats">
          <p><strong>Agency: <span>{{ brand.agency }}</span></strong></p>
          <p><strong>Involvement:</strong> {{ brand.involvement_progress }}</p>
        </div>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec a diam lectus. Sed sit amet ipsum mauris. Maecenas congue ligula ac quam viverra nec consectetur ante hendrerit. Donec et mollis dolor. Praesent et diam eget libero egestas mattis sit amet vitae augue.</p>
        <a class="button button--style-1" href="#work">Learn more</a>
        <a class="button button--style-2 button--filled" href="https://bad-monday.com/" target="_blank">View Website</a>`
    }
  },
  {
    "id": "goose-and-gander",
    "largeBlock": false,
    "name": "goose-and-gander",
    "logo": "./assets/images/brand/logo/logo-goose-and-gander.svg",
    "lifestyleImage": "./assets/images/brand/lifestyle/goose-and-gander.jpg",
    "website": "https://gooseandgander.com/",
    "agency": "Cage Agency",
    "involvement": {
      "progress": 5,
      "max": 5
    },
    "modal": {
      "id": "brands-item-goose-and-gander",
      "description_html": `
        <h2>Earth-First Innovation</h2>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec a diam lectus. Sed sit amet ipsum mauris. Maecenas congue ligula ac quam viverra nec consectetur ante hendrerit. Donec et mollis dolor. Praesent et diam eget libero egestas mattis sit amet vitae augue.</p>
        <h3 class="h4">Contribution</h3>
        <div class="stats">
          <p><strong>Agency: <span>{{ brand.agency }}</span></strong></p>
          <p><strong>Involvement:</strong> {{ brand.involvement_progress }}</p>
        </div>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec a diam lectus. Sed sit amet ipsum mauris. Maecenas congue ligula ac quam viverra nec consectetur ante hendrerit. Donec et mollis dolor. Praesent et diam eget libero egestas mattis sit amet vitae augue.</p>
        <a class="button button--style-1" href="#work">Learn more</a>
        <a class="button button--style-2 button--filled" href="https://gooseandgander.com/" target="_blank">View Website</a>`
    }
  },
  {
    "id": "dancing-leopard",
    "largeBlock": false,
    "name": "dancing-leopard",
    "logo": "./assets/images/brand/logo/logo-dancing-leopard.svg",
    "lifestyleImage": "./assets/images/brand/lifestyle/dancing-leopard.jpg",
    "website": "https://dancingleopard.com/",
    "agency": "Cage Agency",
    "involvement": {
      "progress": 5,
      "max": 5
    },
    "modal": {
      "id": "brands-item-dancing-leopard",
      "description_html": `
        <h2>Earth-First Innovation</h2>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec a diam lectus. Sed sit amet ipsum mauris. Maecenas congue ligula ac quam viverra nec consectetur ante hendrerit. Donec et mollis dolor. Praesent et diam eget libero egestas mattis sit amet vitae augue.</p>
        <h3 class="h4">Contribution</h3>
        <div class="stats">
          <p><strong>Agency: <span>{{ brand.agency }}</span></strong></p>
          <p><strong>Involvement:</strong> {{ brand.involvement_progress }}</p>
        </div>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec a diam lectus. Sed sit amet ipsum mauris. Maecenas congue ligula ac quam viverra nec consectetur ante hendrerit. Donec et mollis dolor. Praesent et diam eget libero egestas mattis sit amet vitae augue.</p>
        <a class="button button--style-1" href="#work">Learn more</a>
        <a class="button button--style-2 button--filled" href="https://dancingleopard.com/" target="_blank">View Website</a>`
    }
  }
]

export default brands;