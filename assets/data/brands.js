const brands = [
  {
    id: "patou",
    largeBlock: false,
    name: "Patou",
    logo: "./assets/images/logos/logo-patou.svg",
    lifestyleImage: "./assets/images/brand-lifestyle/patou.jpg",
    website: "https://www.patou.com/",
    agency: "Fostr",
    involvement: {
      progress: 3,
      max: 5
    },
    modal: {
      id: "brands-item-patou",
      description_html: `
        <h2>Patou – Sustainable Luxury</h2>
        <p>Patou is a Parisian fashion house blending heritage with sustainability. Their collections are known for bold silhouettes, joyful color, and a commitment to eco-conscious practices.</p>
        <h3 class="h4">Contribution</h3>
        <div class="stats">
          <p><strong>Agency: <span>Fostr</span></strong></p>
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
    logo: "./assets/images/logos/logo-triangl.svg",
    lifestyleImage: "./assets/images/brand-lifestyle/triangl.jpg",
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
          <p><strong>Agency: <span>Fostr</span></strong></p>
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
    logo: "./assets/images/logos/logo-pucci.svg",
    lifestyleImage: "./assets/images/brand-lifestyle/pucci.jpg",
    website: "https://www.pucci.com/",
    agency: "Fostr",
    involvement: {
      progress: 4,
      max: 5
    },
    modal: {
      id: "brands-item-pucci",
      description_html: `
        <h2>Pucci – A Digital Renaissance</h2>
        <p>Pucci, an icon of Italian fashion, needed a modern online experience to match their vibrant heritage. Their site showcases fluid animations and rich storytelling.</p>
        <h3 class="h4">Contribution</h3>
        <div class="stats">
          <p><strong>Agency: <span>Fostr</span></strong></p>
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
    logo: "./assets/images/logos/logo-victoria-beckham.svg",
    lifestyleImage: "./assets/images/brand-lifestyle/victoria-beckham.jpg",
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
          <p><strong>Agency: <span>Fostr</span></strong></p>
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
    "logo": "./assets/images/logos/logo-kit-and-kaboodal.svg",
    "lifestyleImage": "./assets/images/brand-lifestyle/kit-and-kaboodal.jpg",
    "website": "https://www.kitandkaboodal.com/",
    "agency": "Fostr",
    "involvement": {
      "progress": 4,
      "max": 5
    },
    "modal": {
      "id": "brands-item-kit-and-kaboodal",
      "description_html": `
        <h2>Loreum Ipsum, Lorem Ipsum</h2>
        <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. In distinctio numquam quos repudiandae voluptate delectus maiores. Debitis sit alias ipsum, doloremque modi harum porro pariatur qui et sed culpa atque?</p>
        <h3 class="h4">Contribution</h3>
        <div class="stats">
          <p><strong>Agency: <span>Fostr</span></strong></p>
          <p><strong>Involvement:</strong> {{ brand.involvement_progress }}</p>
        </div>
        <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. In distinctio numquam quos repudiandae voluptate delectus maiores. Debitis sit alias ipsum, doloremque modi harum porro pariatur qui et sed culpa atque?</p>
        <a class="button button--style-1" href="#work">Learn more</a>
        <a class="button button--style-2 button--filled" href="https://www.kitandkaboodal.com/" target="_blank">View Website</a>`
    }
  },
  {
    "id": "mutt-motorcycles",
    "largeBlock": false,
    "name": "Mutt Motorcycles",
    "logo": "./assets/images/logos/logo-mutt-motorcycles.svg",
    "lifestyleImage": "./assets/images/brand-lifestyle/mutt-motorcycles.jpg",
    "website": "https://muttmotorcycles.com/",
    "agency": "Fostr",
    "involvement": {
      "progress": 5,
      "max": 5
    },
    "modal": {
      "id": "brands-item-mutt-motorcycles",
      "description_html": `
        <h2>Loreum Ipsum, Lorem Ipsum</h2>
        <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. In distinctio numquam quos repudiandae voluptate delectus maiores. Debitis sit alias ipsum, doloremque modi harum porro pariatur qui et sed culpa atque?</p>
        <h3 class="h4">Contribution</h3>
        <div class="stats">
          <p><strong>Agency: <span>Fostr</span></strong></p>
          <p><strong>Involvement:</strong> {{ brand.involvement_progress }}</p>
        </div>
        <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. In distinctio numquam quos repudiandae voluptate delectus maiores. Debitis sit alias ipsum, doloremque modi harum porro pariatur qui et sed culpa atque?</p>
        <a class="button button--style-1" href="#work">Learn more</a>
        <a class="button button--style-2 button--filled" href="https://muttmotorcycles.com/" target="_blank">View Website</a>`
    }
  },
  {
    "id": "medik8",
    "largeBlock": false,
    "name": "Medik8",
    "logo": "./assets/images/logos/logo-medik8.svg",
    "lifestyleImage": "./assets/images/brand-lifestyle/medik8.webp",
    "website": "https://www.medik8.com/",
    "agency": "Fostr",
    "involvement": {
      "progress": 2,
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
          <p><strong>Agency: <span>Fostr</span></strong></p>
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
    "logo": "./assets/images/logos/logo-indu.svg",
    "lifestyleImage": "./assets/images/brand-lifestyle/indu.jpg",
    "website": "https://indu.me/",
    "agency": "Fostr",
    "involvement": {
      "progress": 1,
      "max": 5
    },
    "modal": {
      "id": "brands-item-indu",
      "description_html": `
        <h2>Loreum Ipsum, Lorem Ipsum</h2>
        <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. In distinctio numquam quos repudiandae voluptate delectus maiores. Debitis sit alias ipsum, doloremque modi harum porro pariatur qui et sed culpa atque?</p>
        <h3 class="h4">Contribution</h3>
        <div class="stats">
          <p><strong>Agency: <span>Fostr</span></strong></p>
          <p><strong>Involvement:</strong> {{ brand.involvement_progress }}</p>
        </div>
        <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. In distinctio numquam quos repudiandae voluptate delectus maiores. Debitis sit alias ipsum, doloremque modi harum porro pariatur qui et sed culpa atque?</p>
        <a class="button button--style-1" href="#work">Learn more</a>
        <a class="button button--style-2 button--filled" href="https://indu.me/" target="_blank">View Website</a>`
    }
  },
  {
    "id": "beis",
    "largeBlock": false,
    "name": "BÉIS",
    "logo": "./assets/images/logos/logo-beis.svg",
    "lifestyleImage": "./assets/images/brand-lifestyle/beis.jpg",
    "website": "https://uk.beistravel.com/",
    "agency": "Fostr",
    "involvement": {
      "progress": 2,
      "max": 5
    },
    "modal": {
      "id": "brands-item-beis",
      "description_html": `
        <h2>Loreum Ipsum, Lorem Ipsum</h2>
        <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. In distinctio numquam quos repudiandae voluptate delectus maiores. Debitis sit alias ipsum, doloremque modi harum porro pariatur qui et sed culpa atque?</p>
        <h3 class="h4">Contribution</h3>
        <div class="stats">
          <p><strong>Agency: <span>Fostr</span></strong></p>
          <p><strong>Involvement:</strong> {{ brand.involvement_progress }}</p>
        </div>
        <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. In distinctio numquam quos repudiandae voluptate delectus maiores. Debitis sit alias ipsum, doloremque modi harum porro pariatur qui et sed culpa atque?</p>
        <a class="button button--style-1" href="#work">Learn more</a>
        <a class="button button--style-2 button--filled" href="https://uk.beistravel.com/" target="_blank">View Website</a>`
    }
  },
  {
    "id": "pattern",
    "largeBlock": true,
    "name": "Pattern",
    "logo": "./assets/images/logos/logo-pattern.svg",
    "lifestyleImage": "./assets/images/brand-lifestyle/pattern.jpg",
    "website": "https://pattern.com/",
    "agency": "Fostr",
    "involvement": {
      "progress": 2,
      "max": 5
    },
    "modal": {
      "id": "brands-item-pattern",
      "description_html": `
        <h2>Loreum Ipsum, Lorem Ipsum</h2>
        <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. In distinctio numquam quos repudiandae voluptate delectus maiores. Debitis sit alias ipsum, doloremque modi harum porro pariatur qui et sed culpa atque?</p>
        <h3 class="h4">Contribution</h3>
        <div class="stats">
          <p><strong>Agency: <span>Fostr</span></strong></p>
          <p><strong>Involvement:</strong> {{ brand.involvement_progress }}</p>
        </div>
        <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. In distinctio numquam quos repudiandae voluptate delectus maiores. Debitis sit alias ipsum, doloremque modi harum porro pariatur qui et sed culpa atque?</p>
        <a class="button button--style-1" href="#work">Learn more</a>
        <a class="button button--style-2 button--filled" href="https://pattern.com/" target="_blank">View Website</a>`
    }
  },
  {
    "id": "st-john",
    "largeBlock": true,
    "name": "St John",
    "logo": "./assets/images/logos/logo-st-john.svg",
    "lifestyleImage": "./assets/images/brand-lifestyle/st-john.jpg",
    "website": "https://www.stjohnknits.com/",
    "agency": "Fostr",
    "involvement": {
      "progress": 2,
      "max": 5
    },
    "modal": {
      "id": "brands-item-st-john",
      "description_html": `
        <h2>Loreum Ipsum, Lorem Ipsum</h2>
        <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. In distinctio numquam quos repudiandae voluptate delectus maiores. Debitis sit alias ipsum, doloremque modi harum porro pariatur qui et sed culpa atque?</p>
        <h3 class="h4">Contribution</h3>
        <div class="stats">
          <p><strong>Agency: <span>Fostr</span></strong></p>
          <p><strong>Involvement:</strong> {{ brand.involvement_progress }}</p>
        </div>
        <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. In distinctio numquam quos repudiandae voluptate delectus maiores. Debitis sit alias ipsum, doloremque modi harum porro pariatur qui et sed culpa atque?</p>
        <a class="button button--style-1" href="#work">Learn more</a>
        <a class="button button--style-2 button--filled" href="https://www.stjohnknits.com/" target="_blank">View Website</a>`
    }
  },
  {
    "id": "kjear-weis",
    "largeBlock": false,
    "name": "Kjaer Weis",
    "logo": "./assets/images/logos/logo-kjaer-weis.svg",
    "lifestyleImage": "./assets/images/brand-lifestyle/kjaer-weis.jpg",
    "website": "https://kjaerweis.com/",
    "agency": "Fostr",
    "involvement": {
      "progress": 4,
      "max": 5
    },
    "modal": {
      "id": "brands-item-kjaer-weis",
      "description_html": `
        <h2>Loreum Ipsum, Lorem Ipsum</h2>
        <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. In distinctio numquam quos repudiandae voluptate delectus maiores. Debitis sit alias ipsum, doloremque modi harum porro pariatur qui et sed culpa atque?</p>
        <h3 class="h4">Contribution</h3>
        <div class="stats">
          <p><strong>Agency: <span>Fostr</span></strong></p>
          <p><strong>Involvement:</strong> {{ brand.involvement_progress }}</p>
        </div>
        <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. In distinctio numquam quos repudiandae voluptate delectus maiores. Debitis sit alias ipsum, doloremque modi harum porro pariatur qui et sed culpa atque?</p>
        <a class="button button--style-1" href="#work">Learn more</a>
        <a class="button button--style-2 button--filled" href="https://kjaerweis.com/" target="_blank">View Website</a>`
    }
  },
  {
    "id": "new-era",
    "largeBlock": true,
    "name": "New Era",
    "logo": "./assets/images/logos/logo-new-era.svg",
    "lifestyleImage": "./assets/images/brand-lifestyle/new-era.jpg",
    "website": "https://www.neweracap.eu/",
    "agency": "Fostr",
    "involvement": {
      "progress": 2,
      "max": 5
    },
    "modal": {
      "id": "brands-item-new-era",
      "description_html": `
        <h2>Loreum Ipsum, Lorem Ipsum</h2>
        <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. In distinctio numquam quos repudiandae voluptate delectus maiores. Debitis sit alias ipsum, doloremque modi harum porro pariatur qui et sed culpa atque?</p>
        <h3 class="h4">Contribution</h3>
        <div class="stats">
          <p><strong>Agency: <span>Fostr</span></strong></p>
          <p><strong>Involvement:</strong> {{ brand.involvement_progress }}</p>
        </div>
        <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. In distinctio numquam quos repudiandae voluptate delectus maiores. Debitis sit alias ipsum, doloremque modi harum porro pariatur qui et sed culpa atque?</p>
        <a class="button button--style-1" href="#work">Learn more</a>
        <a class="button button--style-2 button--filled" href="https://www.neweracap.eu/" target="_blank">View Website</a>`
    }
  },
  {
    "id": "rad",
    "largeBlock": false,
    "name": "Rad",
    "logo": "./assets/images/logos/logo-rad.svg",
    "lifestyleImage": "./assets/images/brand-lifestyle/rad.jpg",
    "website": "https://rad.co.uk/",
    "agency": "Fostr",
    "involvement": {
      "progress": 3,
      "max": 5
    },
    "modal": {
      "id": "brands-item-rad",
      "description_html": `
        <h2>Loreum Ipsum, Lorem Ipsum</h2>
        <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. In distinctio numquam quos repudiandae voluptate delectus maiores. Debitis sit alias ipsum, doloremque modi harum porro pariatur qui et sed culpa atque?</p>
        <h3 class="h4">Contribution</h3>
        <div class="stats">
          <p><strong>Agency: <span>Fostr</span></strong></p>
          <p><strong>Involvement:</strong> {{ brand.involvement_progress }}</p>
        </div>
        <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. In distinctio numquam quos repudiandae voluptate delectus maiores. Debitis sit alias ipsum, doloremque modi harum porro pariatur qui et sed culpa atque?</p>
        <a class="button button--style-1" href="#work">Learn more</a>
        <a class="button button--style-2 button--filled" href="https://rad.co.uk/" target="_blank">View Website</a>`
    }
  },
  {
    "id": "rhino-greenhouses",
    "largeBlock": false,
    "name": "Rhino Greenhouses",
    "logo": "./assets/images/logos/logo-rhino-greenhouses.png",
    "lifestyleImage": "./assets/images/brand-lifestyle/rhino-greenhouses.jpg",
    "website": "https://www.rhino.co.uk/",
    "agency": "Fostr",
    "involvement": {
      "progress": 2,
      "max": 5
    },
    "modal": {
      "id": "brands-item-rhino-greenhouses",
      "description_html": `
        <h2>Loreum Ipsum, Lorem Ipsum</h2>
        <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. In distinctio numquam quos repudiandae voluptate delectus maiores. Debitis sit alias ipsum, doloremque modi harum porro pariatur qui et sed culpa atque?</p>
        <h3 class="h4">Contribution</h3>
        <div class="stats">
          <p><strong>Agency: <span>Fostr</span></strong></p>
          <p><strong>Involvement:</strong> {{ brand.involvement_progress }}</p>
        </div>
        <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. In distinctio numquam quos repudiandae voluptate delectus maiores. Debitis sit alias ipsum, doloremque modi harum porro pariatur qui et sed culpa atque?</p>
        <a class="button button--style-1" href="#work">Learn more</a>
        <a class="button button--style-2 button--filled" href="https://www.rhino.co.uk/" target="_blank">View Website</a>`
    }
  },
  {
    "id": "protectapet",
    "largeBlock": false,
    "name": "Protectapet",
    "logo": "./assets/images/logos/logo-protectapet.png",
    "lifestyleImage": "./assets/images/brand-lifestyle/protectapet.jpg",
    "website": "https://www.protectapet.com/",
    "agency": "Fostr",
    "involvement": {
      "progress": 1,
      "max": 5
    },
    "modal": {
      "id": "brands-item-protectapet",
      "description_html": `
        <h2>Loreum Ipsum, Lorem Ipsum</h2>
        <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. In distinctio numquam quos repudiandae voluptate delectus maiores. Debitis sit alias ipsum, doloremque modi harum porro pariatur qui et sed culpa atque?</p>
        <h3 class="h4">Contribution</h3>
        <div class="stats">
          <p><strong>Agency: <span>Fostr</span></strong></p>
          <p><strong>Involvement:</strong> {{ brand.involvement_progress }}</p>
        </div>
        <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. In distinctio numquam quos repudiandae voluptate delectus maiores. Debitis sit alias ipsum, doloremque modi harum porro pariatur qui et sed culpa atque?</p>
        <a class="button button--style-1" href="#work">Learn more</a>
        <a class="button button--style-2 button--filled" href="https://www.protectapet.com/" target="_blank">View Website</a>`
    }
  },
  {
    "id": "and-sons",
    "largeBlock": true,
    "name": "And Sons",
    "logo": "./assets/images/logos/logo-and-sons.png",
    "lifestyleImage": "./assets/images/brand-lifestyle/and-sons.jpg",
    "website": "https://andsons.co.uk/",
    "agency": "Fostr",
    "involvement": {
      "progress": 2,
      "max": 5
    },
    "modal": {
      "id": "brands-item-and-sons",
      "description_html": `
        <h2>Loreum Ipsum, Lorem Ipsum</h2>
        <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. In distinctio numquam quos repudiandae voluptate delectus maiores. Debitis sit alias ipsum, doloremque modi harum porro pariatur qui et sed culpa atque?</p>
        <h3 class="h4">Contribution</h3>
        <div class="stats">
          <p><strong>Agency: <span>Fostr</span></strong></p>
          <p><strong>Involvement:</strong> {{ brand.involvement_progress }}</p>
        </div>
        <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. In distinctio numquam quos repudiandae voluptate delectus maiores. Debitis sit alias ipsum, doloremque modi harum porro pariatur qui et sed culpa atque?</p>
        <a class="button button--style-1" href="#work">Learn more</a>
        <a class="button button--style-2 button--filled" href="https://andsons.co.uk/" target="_blank">View Website</a>`
    }
  },
  {
    "id": "pandco",
    "largeBlock": false,
    "name": "Pandco",
    "logo": "./assets/images/logos/logo-pandco.svg",
    "lifestyleImage": "./assets/images/brand-lifestyle/pandco.jpg",
    "website": "https://pandco.com/",
    "agency": "Fostr",
    "involvement": {
      "progress": 2,
      "max": 5
    },
    "modal": {
      "id": "brands-item-pandco",
      "description_html": `
        <h2>Loreum Ipsum, Lorem Ipsum</h2>
        <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. In distinctio numquam quos repudiandae voluptate delectus maiores. Debitis sit alias ipsum, doloremque modi harum porro pariatur qui et sed culpa atque?</p>
        <h3 class="h4">Contribution</h3>
        <div class="stats">
          <p><strong>Agency: <span>Fostr</span></strong></p>
          <p><strong>Involvement:</strong> {{ brand.involvement_progress }}</p>
        </div>
        <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. In distinctio numquam quos repudiandae voluptate delectus maiores. Debitis sit alias ipsum, doloremque modi harum porro pariatur qui et sed culpa atque?</p>
        <a class="button button--style-1" href="#work">Learn more</a>
        <a class="button button--style-2 button--filled" href="https://pandco.com/" target="_blank">View Website</a>`
    }
  },
  {
    "id": "pangaia",
    "largeBlock": true,
    "name": "Pangaia",
    "logo": "./assets/images/logos/logo-pangaia.svg",
    "lifestyleImage": "./assets/images/brand-lifestyle/pangaia.jpg",
    "website": "https://pangaia.com/",
    "agency": "Fostr",
    "involvement": {
      "progress": 2,
      "max": 5
    },
    "modal": {
      "id": "brands-item-pangaia",
      "description_html": `
        <h2>Loreum Ipsum, Lorem Ipsum</h2>
        <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. In distinctio numquam quos repudiandae voluptate delectus maiores. Debitis sit alias ipsum, doloremque modi harum porro pariatur qui et sed culpa atque?</p>
        <h3 class="h4">Contribution</h3>
        <div class="stats">
          <p><strong>Agency: <span>Fostr</span></strong></p>
          <p><strong>Involvement:</strong> {{ brand.involvement_progress }}</p>
        </div>
        <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. In distinctio numquam quos repudiandae voluptate delectus maiores. Debitis sit alias ipsum, doloremque modi harum porro pariatur qui et sed culpa atque?</p>
        <a class="button button--style-1" href="#work">Learn more</a>
        <a class="button button--style-2 button--filled" href="https://pangaia.com/" target="_blank">View Website</a>`
    }
  }    
]

export default brands;