// import '../swiper/swiper-bundle.min.js';
import './init/inViewAnimations.js';
import './init/brandsSwiper.js';
import './components/MediumArticles.js';
import './components/ModalContent.js';
import './components/ModalBrand.js';
import './components/BrandCards.js';
import './components/BehanceCards.js';
import { initWebVitals } from './helpers/performance/webVitals.js';
import { initFocusVisible } from './helpers/accessibility/a11yUtils.js';

// Initialize performance monitoring
initWebVitals();

// Initialize accessibility features
initFocusVisible();
