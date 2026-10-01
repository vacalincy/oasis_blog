import re

with open('oasis-react/src/pages/PostPage.jsx', 'r') as f:
    content = f.read()

# Add PostCard import
if 'import PostCard' not in content:
    content = content.replace("import Footer from '../components/Footer';", "import Footer from '../components/Footer';\nimport PostCard from '../components/PostCard';")

# Find the read-next section
start_marker = '<section className="read-next">'
end_marker = '</section>'

start_idx = content.find(start_marker)
end_idx = content.find(end_marker, start_idx) + len(end_marker)

related_data = """
const RELATED_POSTS = [
    {
        id: 1,
        title: "The Architecture of Silence: Finding Peace in Brutalism",
        image: "/assets/images/content/011.jpg",
        category: "Architecture",
        author: "Marcus Chen",
        date: "Oct 10, 2023",
        isoDate: "2023-10-10"
    },
    {
        id: 2,
        title: "Japanese Woodworking and the Philosophy of Perfection",
        image: "/assets/images/content/008.jpg",
        category: "Design",
        author: "Sarah Jenkins",
        date: "Oct 05, 2023",
        isoDate: "2023-10-05"
    },
    {
        id: 3,
        title: "Monochrome Spaces: Why Less Color Can Mean More",
        image: "/assets/images/content/010.jpg",
        category: "Interior",
        author: "Elena Rostova",
        date: "Sep 28, 2023",
        isoDate: "2023-09-28"
    }
];
"""

if "const RELATED_POSTS" not in content:
    content = content.replace("export default function PostPage() {", related_data + "\nexport default function PostPage() {")


new_section = """<section className="read-next">
    <div className="container">
        <h2 className="read-next__title">Read Next</h2>
        <div className="read-next__grid">
            {RELATED_POSTS.map(post => (
                <PostCard key={post.id} {...post} />
            ))}
        </div>
    </div>
</section>"""

content = content[:start_idx] + new_section + content[end_idx:]

with open('oasis-react/src/pages/PostPage.jsx', 'w') as f:
    f.write(content)
