# Alpha Locks and Safe - AI Coding Assistant Instructions

## Project Overview
WordPress locksmith business website using Elementor page builder, optimized for SEO and local search. The site serves Alpha Locks and Safe, providing 24/7 emergency locksmith services across Westchester County, NY.

## Architecture & Key Technologies

### Core Stack
- **CMS**: WordPress 6.8+ with Hello Elementor theme
- **Page Builder**: Elementor Pro for visual design and layout management
- **SEO**: Yoast SEO Premium with comprehensive schema markup
- **Performance**: 10Web Speed Optimizer + WP Smush for image optimization
- **Analytics**: Google Tag Manager, Matomo self-hosted analytics
- **Reviews**: Trustpilot integration for customer testimonials

### Critical File Structure
- **Static Export**: Site appears to use Simply Static plugin - pages exist as both dynamic WordPress and static HTML
- **Service Pages**: Location-based landing pages follow pattern `/locksmith-services-in-{city}-westchester-county/`
- **Content Types**: Residential, Commercial, Automotive service categories with dedicated sections
- **Media**: Background images and service photos in `/wp-content/uploads/`

## Content Strategy Patterns

### Local SEO Architecture
The site uses a hub-and-spoke model for local SEO:
- **Hub Pages**: Main service categories (`/residential/`, `/commercial/`, `/automotive/`)
- **Location Spokes**: City-specific pages targeting "locksmith services in [City], NY" keywords
- **Service Spokes**: Specific service pages (emergency, rekey, installation, etc.)

### Schema Implementation
Every page includes comprehensive JSON-LD schema:
- LocalBusiness markup with service areas
- Breadcrumb navigation
- Service-specific schema for each offering
- Review aggregation from Trustpilot

### Content Conventions
- **Headlines**: Use emoji icons (🔐, 🏡, 🚗) for visual appeal and local search optimization
- **Service Areas**: All content emphasizes Westchester County coverage with specific city mentions
- **CTAs**: Phone number `(929) 367-6689` prominently featured
- **Brand Colors**: Yellow accent (#F0ED40) for CTAs and highlights, dark backgrounds for contrast

## Development Workflows

### Elementor Customizations
- Custom CSS in Elementor Pro handles responsive design breakpoints
- Global color scheme uses CSS custom properties
- Template parts for header/footer consistency
- Widget styling relies on Elementor's built-in responsive controls

### SEO Optimization Process
1. **Schema Generation**: Yoast handles automatic schema, manual JSON-LD for enhanced markup
2. **Local Optimization**: Each location page targets specific city + "locksmith" combinations
3. **Meta Optimization**: Titles follow pattern "🔐 Service in City, NY | Alpha Locks"
4. **Sitemap Management**: XML sitemaps auto-generated, includes location and service taxonomies

### Performance Considerations
- **Image Optimization**: WebP format preferred, lazy loading enabled
- **Caching Strategy**: 10Web optimizer handles page caching and minification
- **Static Generation**: Simply Static creates static versions for improved load times
- **Third-party Scripts**: Trustpilot and analytics loaded asynchronously

## Maintenance Patterns

### Content Updates
- **New Service Areas**: Copy existing location page structure, update city references and schema
- **Service Additions**: Add to main category pages, create dedicated landing pages if significant
- **Review Integration**: Trustpilot widgets embedded via shortcodes in Elementor

### Plugin Dependencies
- **Critical**: Elementor Pro (licensing required), Yoast SEO Premium, 10Web Speed Optimizer
- **Nice-to-have**: Trustpilot Reviews, WP Smush, Google Site Kit
- **Development**: WP File Manager for quick edits, UpdraftPlus for backups

## Common Tasks & Shortcuts

### Adding New Location Pages
1. Duplicate existing location page in WordPress admin
2. Update page title, URL slug, and schema data
3. Replace city references in content and meta descriptions
4. Verify Yoast SEO score and update focus keyword

### Elementor Template Management
- Header/footer managed through Elementor Theme Builder
- Service page layouts use shared templates with location variables
- Global widgets defined once, reused across location pages

### Analytics & Monitoring
- **Matomo**: Self-hosted at `/wp-content/plugins/matomo/app/matomo.php`
- **Search Console**: Connected via Google Site Kit
- **Local Rankings**: Monitor "locksmith [city] ny" keywords for each service area

## Business Context Notes
- **Emergency Focus**: 24/7 availability is key differentiator, emphasized in all content
- **Local Authority**: Westchester County expertise, family-owned business angle
- **Service Range**: Residential, commercial, automotive with emergency response
- **Trust Signals**: Licensing, insurance, Better Business Bureau, local testimonials