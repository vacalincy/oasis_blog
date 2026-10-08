import re

# 1. Update DashboardPage.jsx
with open('oasis-react/src/pages/DashboardPage.jsx', 'r') as f:
    content = f.read()

# Specifically in the drafts pane
# The simplest way is to find the draft pane block and replace `/post/` with `/edit-post/` inside it.
draft_pane_start = content.find("activeTab === 'drafts'")
saved_pane_start = content.find("activeTab === 'saved'")
if draft_pane_start != -1 and saved_pane_start != -1:
    draft_pane_content = content[draft_pane_start:saved_pane_start]
    new_draft_pane = draft_pane_content.replace("`/post/${post.id}`", "`/edit-post/${post.id}`")
    content = content[:draft_pane_start] + new_draft_pane + content[saved_pane_start:]
    
with open('oasis-react/src/pages/DashboardPage.jsx', 'w') as f:
    f.write(content)

# 2. Update AddPostPage.jsx
with open('oasis-react/src/pages/AddPostPage.jsx', 'r') as f:
    content = f.read()

# Add state
if "const [originalStatus, setOriginalStatus] = useState('draft');" not in content:
    content = content.replace("const [activeSubCats, setActiveSubCats] = useState([]);", "const [activeSubCats, setActiveSubCats] = useState([]);\n  const [originalStatus, setOriginalStatus] = useState('draft');")

# In fetchPost
content = content.replace("setCoverImage(data.cover_image || null);", "setCoverImage(data.cover_image || null);\n                setOriginalStatus(data.status || 'draft');")

# Fix footer rendering
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
                  ) : (
                      <>
                          <button 
                            className="btn-danger" 
                            style={{ padding: '12px 24px', borderRadius: '100px', fontWeight: '600', backgroundColor: '#FEE2E2', color: '#DC2626', border: 'none' }}
                            disabled={isSaving}
                            onClick={handleDelete}
                          >
                            {isSaving ? 'Deleting...' : 'Delete Post'}
                          </button>
                          <button 
                            className="btn-primary-rounded"
                            disabled={!isValid || isSaving}
                            onClick={() => savePost('published')}
                          >
                            {isSaving ? 'Saving...' : 'Save Changes'}
                          </button>
                      </>
                  )}"""

new_footer = """                  {!isEditing ? (
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
                  ) : (
                      <>
                          <button 
                            className="btn-danger" 
                            style={{ padding: '12px 24px', borderRadius: '100px', fontWeight: '600', backgroundColor: '#FEE2E2', color: '#DC2626', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
                            disabled={isSaving}
                            onClick={handleDelete}
                          >
                            {isSaving ? 'Deleting...' : 'Delete Post'}
                          </button>
                          
                          {originalStatus === 'draft' ? (
                              <>
                                  <button 
                                    className="btn-ghost-rounded"
                                    disabled={!isValid || isSaving}
                                    onClick={() => savePost('draft')}
                                  >
                                    {isSaving ? 'Saving...' : 'Save Draft'}
                                  </button>
                                  <button 
                                    className="btn-primary-rounded"
                                    disabled={!isValid || isSaving}
                                    onClick={() => savePost('published')}
                                  >
                                    {isSaving ? 'Publishing...' : 'Publish'}
                                  </button>
                              </>
                          ) : (
                              <button 
                                className="btn-primary-rounded"
                                disabled={!isValid || isSaving}
                                onClick={() => savePost('published')}
                              >
                                {isSaving ? 'Saving...' : 'Save Changes'}
                              </button>
                          )}
                      </>
                  )}"""

content = content.replace(old_footer, new_footer)

with open('oasis-react/src/pages/AddPostPage.jsx', 'w') as f:
    f.write(content)

print("Draft logic fixed!")
