import re

with open('oasis-react/src/pages/DiscoverPage.jsx', 'r') as f:
    content = f.read()

# find <div className="posts-grid"> and replace everything until </div>\n\n        <button className="load-more-btn">
pattern = re.compile(r'(<div className="posts-grid">).*?(</div>\s*<button className="load-more-btn">)', re.DOTALL)
replacement = r'\1\n                    {DISCOVER_POSTS.map(post => (\n                        <PostCard key={post.id} {...post} />\n                    ))}\n                \2'

new_content = pattern.sub(replacement, content)

with open('oasis-react/src/pages/DiscoverPage.jsx', 'w') as f:
    f.write(new_content)
