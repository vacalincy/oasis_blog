with open('oasis-react/src/pages/AddPostPage.jsx', 'r') as f:
    content = f.read()

old_footer = """                  {!isEditing ? (
                      <>
                          <button 
                            className="btn-ghost-rounded"
                            disabled={!isValid || isSaving}
                            onClick={() => savePost('draft')}
                          >
                            {isSaving ? 'Saving...' : 'Save as Draft'}
                          </button>
                          <button 
                            className="btn-primary-rounded"
                            disabled={!isValid || isSaving}
                            onClick={() => savePost('published')}
                          >
                            {isSaving ? 'Publishing...' : 'Publish'}
                          </button>
                      </>
                  )"""

new_footer = """                  {!isEditing ? (
                      <>
                          <button 
                            className="btn-primary-rounded"
                            disabled={!isValid || isSaving}
                            onClick={() => savePost('draft')}
                          >
                            {isSaving ? 'Saving...' : 'Save as Draft'}
                          </button>
                      </>
                  )"""

content = content.replace(old_footer, new_footer)

with open('oasis-react/src/pages/AddPostPage.jsx', 'w') as f:
    f.write(content)

print("Publish button removed from new posts")
