import re

with open('oasis-react/src/pages/AddPostPage.jsx', 'r') as f:
    content = f.read()

# 1. Add handleDelete function
delete_fn = """  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    setIsSaving(true);
    try {
        const { error } = await supabase.from('posts').delete().eq('id', id);
        if (error) throw error;
        addToast('Post deleted successfully', 'success');
        navigate('/dashboard');
    } catch (err) {
        addToast('Error deleting post: ' + err.message, 'error');
        setIsSaving(false);
    }
  };

  const handleSave = async (status) => {"""
content = content.replace("  const handleSave = async (status) => {", delete_fn)

# 2. Replace the editor-footer block
old_footer_pattern = r'<div className="editor-footer">.*?</main>'
new_footer = """<div className="editor-footer">
              <Link to="/dashboard" className="btn-cancel">{isEditing ? 'Discard Changes' : 'Cancel'}</Link>
              <div className={`tooltip-wrapper ${!isValid ? 'show-tooltip' : ''}`} data-tooltip={tooltipMessage} style={{ display: 'flex', gap: '16px' }}>
                  
                  {!isEditing ? (
                      <>
                          <button 
                            className="btn-ghost" 
                            style={{ padding: '12px 24px', borderRadius: '100px', fontWeight: '600' }}
                            disabled={!isValid || isSaving}
                            onClick={() => handleSave('draft')}
                          >
                            {isSaving ? 'Saving...' : 'Save as Draft'}
                          </button>
                          <button 
                            className="btn-primary" 
                            style={{ padding: '12px 24px', borderRadius: '100px', fontWeight: '600' }}
                            disabled={!isValid || isSaving}
                            onClick={() => handleSave('published')}
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
                            className="btn-primary" 
                            style={{ padding: '12px 24px', borderRadius: '100px', fontWeight: '600' }}
                            disabled={!isValid || isSaving}
                            onClick={() => handleSave('published')}
                          >
                            {isSaving ? 'Saving...' : 'Save Changes'}
                          </button>
                      </>
                  )}
              </div>
          </div>
      </main>"""

content = re.sub(r'<div className="editor-footer">.*?</main>', new_footer, content, flags=re.DOTALL)

with open('oasis-react/src/pages/AddPostPage.jsx', 'w') as f:
    f.write(content)

print("Footer fixed!")
