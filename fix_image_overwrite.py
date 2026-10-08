import re

with open('oasis-react/src/pages/AddPostPage.jsx', 'r') as f:
    content = f.read()

content = content.replace("cover_image: uploadedImageUrl,", "cover_image: uploadedImageUrl || coverImage,")

with open('oasis-react/src/pages/AddPostPage.jsx', 'w') as f:
    f.write(content)

print("Image overwrite bug fixed!")
