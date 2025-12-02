(() => {
  const relatedGroups = [
    {
      name: 'residential',
      match: ['residential'],
      heading: 'Home Security Services',
      cards: [
        {
          title: 'Emergency Safe Opening',
          description: 'Damage-free openings and repairs when locks fail or keys break.',
          url: '/residential-break-in-repair-service/',
          accent: '#b86adf',
        },
        {
          title: 'High-Security Lock Upgrades',
          description: 'Modern hardware that keeps intruders out and families safe.',
          url: '/high-security-lock-upgrades-service/',
          accent: '#5871f7',
        },
        {
          title: 'Smart Lock Installation',
          description: 'Keyless access with mobile control and audit trails.',
          url: '/residential-smart-lock-installation-service/',
          accent: '#f67c5f',
        },
        {
          title: 'Residential Lock Change',
          description: 'Rekeying and replacements tailored to every door in the house.',
          url: '/residential-lock-change-service/',
          accent: '#21b4a2',
        },
      ],
    },
    {
      name: 'commercial',
      match: ['commercial', 'business-security', 'retail'],
      heading: 'Business Security Services',
      cards: [
        {
          title: 'Commercial Locksmith Overview',
          description: 'Master key systems, hardware upgrades, and compliance help.',
          url: '/commercial/',
          accent: '#f67c5f',
        },
        {
          title: 'Secure Your Business Dreams',
          description: 'Layered protection strategies for offices and storefronts.',
          url: '/unlocking-westchesters-potential-secure-your-business-dreams-with-alpha-locks-and-safe/',
          accent: '#5890f7',
        },
        {
          title: 'Advanced Security Solutions',
          description: 'High-tech locks and access control for growing teams.',
          url: '/protect-your-passion-advanced-security-solutions-for-westchesters-small-businesses-with-alpha-locks-and-safe/',
          accent: '#2cbfae',
        },
        {
          title: 'Retail & Property Support',
          description: 'Rekeys, roll-down gate repairs, and after-hours emergency help.',
          url: '/unlock-peace-of-mind-your-partner-in-property-management-security-%f0%9f%8f%a2%f0%9f%94%90/',
          accent: '#b86adf',
        },
      ],
    },
    {
      name: 'automotive',
      match: ['automotive', 'car-key', 'locked-out-of-your-car', 'lost-car-keys', 'car-lockout'],
      heading: 'Automotive Locksmith Help',
      cards: [
        {
          title: 'Locked Out of Your Car?',
          description: 'Fast, scratch-free openings anywhere in Westchester.',
          url: '/locked-out-of-your-car-heres-your-stress-free-guide-to-getting-back-in/',
          accent: '#21b4a2',
        },
        {
          title: 'Car Key Replacement',
          description: 'On-the-spot cutting and programming for most vehicles.',
          url: '/alpha-locks-and-safe-car-key-make/',
          accent: '#f67c5f',
        },
        {
          title: 'Lost Keys Lifesavers',
          description: 'Mobile techs recreate and program smart fobs quickly.',
          url: '/lost-car-keys-in-westchester-alpha-locks-to-the-rescue-%f0%9f%9a%97%f0%9f%94%91/',
          accent: '#b86adf',
        },
        {
          title: 'Tarrytown Key Experts',
          description: 'Neighborhood pros for remotes, ignitions, and lock repairs.',
          url: '/tarrytowns-car-key-heroes-alpha-locks-safe-where-service-meets-smiles-%f0%9f%9a%97%f0%9f%94%91%e2%9c%a8/',
          accent: '#5890f7',
        },
      ],
    },
    {
      name: 'service-areas',
      match: ['service-areas', 'locksmith-services-in-'],
      heading: 'Local Service Areas',
      cards: [
        {
          title: 'Ardsley Locksmith Services',
          description: 'Full-service support for homes, cars, and storefronts.',
          url: '/locksmith-services-in-ardsley-westchester-county/',
          accent: '#b86adf',
        },
        {
          title: 'Chappaqua Locksmiths',
          description: 'Rapid-response lockouts and proactive security upgrades.',
          url: '/locksmith-services-in-chappaqua-westchester-county/',
          accent: '#21b4a2',
        },
        {
          title: 'Hartsdale Locksmith Pros',
          description: 'Local experts dedicated to keeping every block secure.',
          url: '/securing-hartsdale-your-local-locksmith-lifeline-%f0%9f%8f%a1%f0%9f%94%90/',
          accent: '#f67c5f',
        },
        {
          title: 'White Plains & Beyond',
          description: 'Community-focused techs serving the entire county.',
          url: '/locked-out-in-white-plains-alpha-locks-is-your-key-to-peace-of-mind-%f0%9f%94%90%f0%9f%a7%a1%ef%b8%8f/',
          accent: '#5890f7',
        },
      ],
    },
    {
      name: 'emergency',
      match: ['emergency', '24-7', 'lockout'],
      heading: '24/7 Emergency Response',
      cards: [
        {
          title: 'Residential Emergency Help',
          description: 'Night-and-day lock repairs, rekeys, and board-ups.',
          url: '/residential-24-hour-emergency-locksmith-service/',
          accent: '#5890f7',
        },
        {
          title: 'Rapid Lockout Relief',
          description: 'Mobile locksmiths dispatched in minutes across Westchester.',
          url: '/locked-out-alpha-locks-and-safe-your-fast-friendly-westchester-rescue-team/',
          accent: '#f67c5f',
        },
        {
          title: 'Always Ready in NY',
          description: 'Trusted 24/7 help for homes, autos, storefronts, and safes.',
          url: '/always-ready-your-24-7-emergency-locksmith-in-westchester-ny-%f0%9f%9a%aa%f0%9f%94%91/',
          accent: '#b86adf',
        },
        {
          title: 'Break-In Repair Support',
          description: 'Secure doors, safes, and gates immediately after incidents.',
          url: '/residential-break-in-repair-service/',
          accent: '#21b4a2',
        },
      ],
    },
    {
      name: 'general',
      match: [],
      heading: 'Popular Locksmith Services',
      cards: [
        {
          title: 'Book a Service Visit',
          description: 'Explore our full catalog of residential, commercial, and auto work.',
          url: '/services/',
          accent: '#b86adf',
        },
        {
          title: 'Contact Alpha Locks & Safe',
          description: 'Call, text, or schedule online—whatever fits your day.',
          url: '/contact-us/',
          accent: '#21b4a2',
        },
        {
          title: 'Your First Choice for Locksmiths',
          description: 'See why Westchester trusts our local, friendly experts.',
          url: '/your-first-choice-for-locksmith/',
          accent: '#5890f7',
        },
        {
          title: 'Emergency Lockout Specialists',
          description: 'Fast dispatch teams for homes, autos, and businesses.',
          url: '/locked-out-alpha-locks-and-safe-your-fast-friendly-westchester-rescue-team/',
          accent: '#f67c5f',
        },
      ],
    },
  ];

  const normalizePath = () => {
    try {
      return decodeURIComponent(window.location.pathname || '').toLowerCase();
    } catch (error) {
      return (window.location.pathname || '').toLowerCase();
    }
  };

  const pickGroup = (path) => {
    return (
      relatedGroups.find((group) => group.match.some((token) => path.includes(token))) ||
      relatedGroups.find((group) => group.name === 'general')
    );
  };

  const injectStyles = () => {
    if (document.getElementById('related-pages-style')) {
      return;
    }

    const style = document.createElement('style');
    style.id = 'related-pages-style';
    style.textContent = `
      .related-pages {
        margin: 0;
        padding: clamp(2rem, 5vw, 4rem) clamp(1rem, 4vw, 3rem);
        background: #ffd952;
        font-family: inherit;
      }

      .related-pages__inner {
        max-width: 1200px;
        margin: 0 auto;
      }

      .related-pages__title {
        font-size: clamp(2rem, 4vw, 2.7rem);
        font-weight: 600;
        color: #1a1f36;
        margin: 0;
        display: flex;
        flex-wrap: wrap;
        align-items: baseline;
        gap: 0.5rem;
      }

      .related-pages__title span {
        background: #3667ff;
        color: #fff;
        padding: 0.1em 0.7em;
        border-radius: 0.35em;
        font-weight: 700;
        letter-spacing: 0.05em;
      }

      .related-pages__grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
        gap: clamp(1rem, 2vw, 1.75rem);
        margin-top: clamp(1.5rem, 3vw, 2.5rem);
      }

      .related-card {
        border-radius: 1.5rem;
        overflow: hidden;
        background: #fff4c2;
        box-shadow: 0 20px 35px rgba(0, 0, 0, 0.1);
        text-decoration: none;
        color: #1e2433;
        display: flex;
        flex-direction: column;
        min-height: 330px;
        transition: transform 200ms ease, box-shadow 200ms ease;
      }

      .related-card:hover,
      .related-card:focus-visible {
        transform: translateY(-6px);
        box-shadow: 0 25px 40px rgba(0, 0, 0, 0.15);
      }

      .related-card__art {
        flex: 0 0 180px;
        background: radial-gradient(circle at 20% 20%, var(--related-card-accent, #5f76ff), #1e2433);
      }

      .related-card__body {
        padding: 1.25rem 1.5rem 1.75rem;
        display: flex;
        flex-direction: column;
        gap: 0.65rem;
      }

      .related-card__title {
        font-size: 1.15rem;
        margin: 0;
        font-weight: 600;
        color: #111530;
      }

      .related-card__copy {
        margin: 0;
        font-size: 0.98rem;
        line-height: 1.5;
        color: #3b405a;
      }
    `;

    document.head.appendChild(style);
  };

  const renderRelatedSection = () => {
    const path = normalizePath();
    if (!path || path === '/' || path === '/index.html') {
      return;
    }
    const group = pickGroup(path);
    if (!group || !Array.isArray(group.cards) || !group.cards.length) {
      return;
    }

    injectStyles();

    const section = document.createElement('section');
    section.className = 'related-pages';
    section.setAttribute('aria-labelledby', 'related-pages-title');

    const wrapper = document.createElement('div');
    wrapper.className = 'related-pages__inner';

    const title = document.createElement('h2');
    title.className = 'related-pages__title';
    title.id = 'related-pages-title';
    title.innerHTML = `<span>Related</span>${group.heading}`;

    const grid = document.createElement('div');
    grid.className = 'related-pages__grid';

    group.cards.forEach((card) => {
      if (!card || !card.url) {
        return;
      }

      const link = document.createElement('a');
      link.className = 'related-card';
      link.href = card.url;
      link.setAttribute('data-related-card', card.title);

      const art = document.createElement('div');
      art.className = 'related-card__art';
      art.style.setProperty('--related-card-accent', card.accent || '#5f76ff');

      const body = document.createElement('div');
      body.className = 'related-card__body';

      const heading = document.createElement('h3');
      heading.className = 'related-card__title';
      heading.textContent = card.title;

      const copy = document.createElement('p');
      copy.className = 'related-card__copy';
      copy.textContent = card.description || '';

      body.appendChild(heading);
      body.appendChild(copy);

      link.appendChild(art);
      link.appendChild(body);
      grid.appendChild(link);
    });

    wrapper.appendChild(title);
    wrapper.appendChild(grid);
    section.appendChild(wrapper);

    const footer = document.querySelector('footer');
    if (footer && footer.parentNode) {
      footer.parentNode.insertBefore(section, footer);
    } else {
      document.body.appendChild(section);
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderRelatedSection);
  } else {
    renderRelatedSection();
  }
})();
