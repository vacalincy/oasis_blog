import re

with open('oasis-react/src/pages/PostPage.jsx', 'r') as f:
    content = f.read()

if 'import CommentItem' not in content:
    content = content.replace("import PostCard from '../components/PostCard';", "import PostCard from '../components/PostCard';\nimport CommentItem from '../components/CommentItem';")

comments_data = """
const COMMENTS_DATA = [
    {
        id: 1,
        author: "Marcus Chen",
        avatar: "/assets/images/avatars/marcus.jpg",
        time: "2 hours ago",
        isoTime: "2023-10-12T10:00",
        text: "The quote about material honesty really struck a chord. I've been trying to renovate my studio and the urge to just paint over raw concrete is strong, but there's something so beautiful about leaving it exposed.",
        hasReplies: false
    },
    {
        id: 2,
        author: "Elena Rodriguez",
        avatar: "/assets/images/avatars/elena.jpg",
        time: "5 hours ago",
        isoTime: "2023-10-12T05:00",
        text: "Great read. Though I'd argue that true minimalism is a luxury of those who don't have to hoard items out of necessity. It's an aesthetic that requires a certain level of privilege to maintain perfectly.",
        hasReplies: true
    }
];
"""

if "const COMMENTS_DATA" not in content:
    content = content.replace("export default function PostPage() {", comments_data + "\nexport default function PostPage() {")


start_marker = '<ul className="comment-list">'
end_marker = '</ul>'
start_idx = content.find(start_marker)
end_idx = content.find(end_marker, start_idx) + len(end_marker)

new_list = """<ul className="comment-list">
            {COMMENTS_DATA.map(comment => (
                <CommentItem key={comment.id} {...comment} />
            ))}
        </ul>"""

content = content[:start_idx] + new_list + content[end_idx:]

with open('oasis-react/src/pages/PostPage.jsx', 'w') as f:
    f.write(content)
