import re

with open('oasis-react/src/assets/css/add-post.css', 'r') as f:
    css = f.read()

css = css.replace("justify-content: center;", "justify-content: space-between;\n    align-items: center;")
css = css.replace("gap: 20px;", "gap: 20px;\n    width: 100%;")

with open('oasis-react/src/assets/css/add-post.css', 'w') as f:
    f.write(css)

with open('oasis-react/src/pages/AddPostPage.jsx', 'r') as f:
    js = f.read()

js = js.replace('className="btn-ghost" \n                            style={{ padding: \'12px 24px\', borderRadius: \'100px\', fontWeight: \'600\' }}', 'className="btn-ghost-rounded"')
js = js.replace('className="btn-primary" \n                            style={{ padding: \'12px 24px\', borderRadius: \'100px\', fontWeight: \'600\' }}', 'className="btn-primary-rounded"')

with open('oasis-react/src/pages/AddPostPage.jsx', 'w') as f:
    f.write(js)

print("Buttons fixed")
