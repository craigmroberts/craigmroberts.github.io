/**
 * Custom Swiper build with only needed modules
 * Reduces bundle size from ~150KB to ~40-50KB
 */

// Import Swiper core
import Swiper from 'swiper';

// Import only the modules you need
import { Navigation, Autoplay, FreeMode } from 'swiper/modules';

// Configure Swiper to use the modules
Swiper.use([Navigation, Autoplay, FreeMode]);

// Export for global use
window.Swiper = Swiper;
