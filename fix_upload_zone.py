with open('oasis-react/src/assets/css/add-post.css', 'r') as f:
    css = f.read()

# Fix editor-upload-zone
bad_zone = """    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    align-items: center;"""
good_zone = """    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;"""
css = css.replace(bad_zone, good_zone)

# Fix upload-icon-circle
bad_circle = """    display: flex;
    align-items: center;
    justify-content: space-between;
    align-items: center;"""
good_circle = """    display: flex;
    align-items: center;
    justify-content: center;"""
css = css.replace(bad_circle, good_circle)

with open('oasis-react/src/assets/css/add-post.css', 'w') as f:
    f.write(css)

print("Fixed CSS layout bugs")
