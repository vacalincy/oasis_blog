import re

with open('oasis-react/src/pages/PostPage.jsx', 'r') as f:
    content = f.read()

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

if "const COMMENTS_DATA" not in content:
    content = content.replace("export default function PostPage() {", comments_data + "\nexport default function PostPage() {")

# Replace comment list
start_str = '<ul className="comment-list">'
end_str = '</ul>\n\n    </div>\n</section>'

start_idx = content.find(start_str)
end_idx = content.find(end_str)

if start_idx != -1 and end_idx != -1:
    new_comments = start_str + """
            {COMMENTS_DATA.map(comment => (
                <CommentItem key={comment.id} {...comment} />
            ))}
        """
    content = content[:start_idx] + new_comments + content[end_idx:]


# Replace read next
start_str2 = '<div className="read-next__grid">'
end_str2 = '</div>\n\n    </div>\n</section>'

start_idx2 = content.find(start_str2)
end_idx2 = content.find(end_str2)

if start_idx2 != -1 and end_idx2 != -1:
    new_related = start_str2 + """
            {RELATED_POSTS.map(post => (
                <PostCard key={post.id} {...post} />
            ))}
        """
    content = content[:start_idx2] + new_related + content[end_idx2:]

with open('oasis-react/src/pages/PostPage.jsx', 'w') as f:
    f.write(content)
