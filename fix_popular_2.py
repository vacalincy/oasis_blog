import re

with open('oasis-react/src/pages/PopularPage.jsx', 'r') as f:
    content = f.read()

start_str = '<div className="container popular-picks__grid">'
end_str = '</div>\n</section>'

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
