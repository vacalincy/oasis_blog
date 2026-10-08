import re

with open('oasis-react/src/pages/AddPostPage.jsx', 'r') as f:
    content = f.read()

# Fix the button onClick handlers
content = content.replace("onClick={() => handleSave('draft')}", "onClick={() => savePost('draft')}")
content = content.replace("onClick={() => handleSave('published')}", "onClick={() => savePost('published')}")

# Now inject handleDelete. I will inject it right before savePost
delete_func = """
  const handleDelete = async () => {
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

"""
if "const handleDelete" not in content:
    content = content.replace("const savePost = async (status) => {", delete_func + "  const savePost = async (status) => {")

with open('oasis-react/src/pages/AddPostPage.jsx', 'w') as f:
    f.write(content)

print("Button actions fixed!")
