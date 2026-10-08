with open('oasis-react/src/pages/AddPostPage.jsx', 'r') as f:
    content = f.read()

old_db_block = """        let dbError;
        if (isEditing) {
            const { error } = await supabase.from('posts').update(postData).eq('id', id);
            dbError = error;
        } else {
            const { error } = await supabase.from('posts').insert(postData);
            dbError = error;
        }
            
        if (dbError) throw dbError;
        
        addToast(status === 'published' ? 'Post published successfully!' : 'Saved as draft.', 'success');
        navigate('/dashboard');"""

new_db_block = """        let dbError;
        let savedPostId = id;
        if (isEditing) {
            const { data, error } = await supabase.from('posts').update(postData).eq('id', id).select().single();
            dbError = error;
            if (data) savedPostId = data.id;
        } else {
            const { data, error } = await supabase.from('posts').insert(postData).select().single();
            dbError = error;
            if (data) savedPostId = data.id;
        }
            
        if (dbError) throw dbError;
        
        addToast(status === 'published' ? 'Post published successfully!' : 'Saved as draft.', 'success');
        
        if (status === 'published') {
            navigate(`/post/${savedPostId}`);
        } else {
            navigate('/dashboard');
        }"""

content = content.replace(old_db_block, new_db_block)

with open('oasis-react/src/pages/AddPostPage.jsx', 'w') as f:
    f.write(content)

print("Navigate logic fixed!")
