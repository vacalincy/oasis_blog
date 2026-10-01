import re

with open('oasis-react/src/pages/PopularPage.jsx', 'r') as f:
    content = f.read()

popular_data = """
const POPULAR_PICKS = [
    {
        id: 1,
        title: "Warm Palettes & Natural Textures",
        badge: "Design & Interfaces",
        excerpt: "How to draw inspiration from extreme landscapes to build",
        image: "/assets/images/content/dunes.jpg",
        link: "/post"
    },
    {
        id: 2,
        title: "Alpine Routes: The Ultimate Hiking Guide",
        badge: "Travel & Outdoors",
        excerpt: "Planning your next mountain hike with essential gear checklists",
        image: "/assets/images/content/lake-mountains.jpg",
        link: "/post"
    },
    {
        id: 3,
        title: "Future of Film: Digital vs Analog",
        badge: "Photography",
        excerpt: "Why modern directors are returning to 35mm film in 2024",
        image: "/assets/images/content/cinema.jpg",
        link: "/post"
    }
];
"""

if "const POPULAR_PICKS" not in content:
    content = content.replace("export default function PopularPage() {", popular_data + "\nexport default function PopularPage() {")

start_str = '<div className="editors-picks__grid">'
end_str = '</div>\n    </div>\n</section>'

start_idx = content.find(start_str)
end_idx = content.find(end_str)

if start_idx != -1 and end_idx != -1:
    new_grid = start_str + """
            {POPULAR_PICKS.map(pick => (
                <article key={pick.id} className="pick-card">
                    <Link to={pick.link} className="pick-card__image">
                        <img loading="lazy" src={pick.image} alt={pick.title} />
                    </Link>
                    <div className="pick-card__overlay">
                        <span className="pick-card__badge">{pick.badge}</span>
                        <h3 className="pick-card__title">
                            <Link to={pick.link}>{pick.title}</Link>
                        </h3>
                        <div className="pick-card__footer">
                            <p className="pick-card__excerpt">{pick.excerpt}</p>
                            <Link to={pick.link} className="pick-card__arrow" aria-label="Read article">
                                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </Link>
                        </div>
                    </div>
                </article>
            ))}
        """
    content = content[:start_idx] + new_grid + content[end_idx:]

with open('oasis-react/src/pages/PopularPage.jsx', 'w') as f:
    f.write(content)
