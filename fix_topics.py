import re

with open('oasis-react/src/pages/TopicsPage.jsx', 'r') as f:
    content = f.read()

topics_data = """
const TOPICS_DATA = [
    {
        id: 1,
        image: "/assets/images/content/topic-architecture.jpg",
        date: "Jan 8, 2025 · 6 min read",
        isoDate: "2025-01-08",
        title: "Reading a City Through Its Old Signs",
        author: "Bastian Voss",
        posClass: "topic-card--pos-1"
    },
    {
        id: 2,
        image: "/assets/images/content/topic-street.jpg",
        date: "Jan 11, 2025 · 4 min read",
        isoDate: "2025-01-11",
        title: "A Moment, Held in One Hand",
        author: "Jack Murphy",
        posClass: "topic-card--pos-2"
    },
    {
        id: 3,
        image: "/assets/images/content/topic-main.jpg",
        date: "Jan 12, 2025 · 8 min read",
        isoDate: "2025-01-12",
        title: "The Art of Doing Nothing at All",
        author: "Nikita Pisarenko",
        posClass: "topic-card--main"
    },
    {
        id: 4,
        image: "/assets/images/content/topic-minimal.jpg",
        date: "Jan 9, 2025 · 5 min read",
        isoDate: "2025-01-09",
        title: "White Space: Letting Your Mind Breathe",
        author: "Hojol Rahman",
        posClass: "topic-card--pos-3"
    },
    {
        id: 5,
        image: "/assets/images/content/topic-nature.jpg",
        date: "Jan 10, 2025 · 7 min read",
        isoDate: "2025-01-10",
        title: "Textures of the Forest Floor",
        author: "Satu Amrita",
        posClass: "topic-card--pos-4"
    }
];
"""

if "const TOPICS_DATA" not in content:
    content = content.replace("export default function TopicsPage() {", topics_data + "\nexport default function TopicsPage() {")

start_str = '<div className="topic-hero__cards" ref={cardsWrapRef}>'
end_str = '</div>\n\n        <div className="topic-hero__text"'

start_idx = content.find(start_str)
end_idx = content.find(end_str)

if start_idx != -1 and end_idx != -1:
    new_cards = start_str + """
            {TOPICS_DATA.map(topic => (
                <div key={topic.id} className={`topic-card ${topic.posClass}`}>
                    <img loading="lazy" src={topic.image} alt={topic.title} />
                    <div className="topic-card__caption">
                        <time dateTime={topic.isoDate}>{topic.date}</time>
                        <p>{topic.title}</p>
                        <span className="topic-card__author">{topic.author}</span>
                    </div>
                </div>
            ))}
        """
    content = content[:start_idx] + new_cards + content[end_idx:]

with open('oasis-react/src/pages/TopicsPage.jsx', 'w') as f:
    f.write(content)
