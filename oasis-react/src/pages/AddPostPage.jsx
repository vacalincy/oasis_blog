import React, { useState, useRef } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { supabase } from '../supabaseClient';
import { CATEGORIES } from '../constants/categories';

const categoryData = CATEGORIES.reduce((acc, cat) => {
  acc[cat.name] = [...cat.subcategories.map(s => typeof s === 'string' ? s : s.name), "Other"];
  return acc;
}, {});

export default function AddPostPage() {
  const addToast = useToast();
  const navigate = useNavigate();
  const { createNotification } = useNotifications();
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [bodyContent, setBodyContent] = useState('');
  const { user } = useAuth();
  const [coverImage, setCoverImage] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [savingType, setSavingType] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);
  
  const [activeMainCat, setActiveMainCat] = useState(null);
  const [activeSubCats, setActiveSubCats] = useState([]);
  const [originalStatus, setOriginalStatus] = useState('draft');
  
  const fileInputRef = useRef(null);
  const editorRef = useRef(null);
  
  const { id } = useParams();
  const isEditing = !!id;

  React.useEffect(() => {
    if (id) {
        const fetchPost = async () => {
            const { data } = await supabase.from('posts').select('*').eq('id', id).single();
            if (data) {
                setTitle(data.title || '');
                setSubtitle(data.subtitle || '');
                setBodyContent(data.content || '');
                if (editorRef.current && data.content) {
                    editorRef.current.innerHTML = data.content;
                }
                setCoverImage(data.cover_image || null);
                setOriginalStatus(data.status || 'draft');
                
                if (data.category) {
                    const parts = data.category.split(' - ');
                    setActiveMainCat(parts[0]);
                    if (parts.length > 1) {
                        setActiveSubCats(parts[1].split(', '));
                    }
                }
            }
        };
        fetchPost();
    }
  }, [id]);

  // Validation
  let missingFields = [];
  if (!title.trim()) missingFields.push('title');
  if (!coverImage) missingFields.push('picture');
  if (!subtitle.trim()) missingFields.push('subtitle');
  if (!activeMainCat || activeSubCats.length === 0) missingFields.push('category');
  if (!bodyContent.trim()) missingFields.push('main text');

  const isValid = missingFields.length === 0;
  let tooltipMessage = "";
  if (!isValid) {
      if (missingFields.length > 1) {
          tooltipMessage = "Please fill out all required fields to continue.";
      } else {
          tooltipMessage = "Please add a " + missingFields[0] + " to continue.";
      }
  }

  const handleFile = (file) => {
    if (file && file.type.startsWith('image/')) {
      setCoverImage(URL.createObjectURL(file));
      setCoverFile(file);
    }
  };

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

    
  const handleConfirmDelete = async () => {
    setSavingType(status);
    try {
        const { error } = await supabase.from('posts').delete().eq('id', id);
        if (error) {
            addToast('Error deleting post: ' + error.message, 'error');
            setSavingType(null);
            setShowDeleteModal(false);
            return;
        }
        addToast('Post deleted successfully', 'success');
        setShowDeleteModal(false);
        navigate('/dashboard');
    } catch (err) {
        addToast('Error deleting post: ' + err.message, 'error');
        setSavingType(null);
        setShowDeleteModal(false);
    }
  };

  const savePost = async (status) => {
    if (!user) {
        addToast('You must be logged in to post.', 'error');
        return;
    }
    
    setSavingType(status);
    try {
        let uploadedImageUrl = null;
        
        // 1. Upload image if exists
        if (coverFile) {
            const fileName = `${user.id}-${Date.now()}.jpg`;
            const { error: uploadError } = await supabase.storage
                .from('avatars') // reusing the avatars bucket but putting it in a covers folder
                .upload(`covers/${fileName}`, coverFile);
                
            if (uploadError) {
                addToast('Error uploading image: ' + uploadError.message, 'error');
                setSavingType(null);
                return;
            }
            
            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(`covers/${fileName}`);
                
            uploadedImageUrl = publicUrl;
        }

        // 2. Save to database
        const postData = {
            author_id: user.id,
            title: title,
            subtitle: subtitle,
            content: bodyContent,
            category: activeMainCat + (activeSubCats.length > 0 ? ' - ' + activeSubCats.join(', ') : ''),
            cover_image: uploadedImageUrl || coverImage,
            status: status
        };
        
        let dbError;
        let savedPostId = id;
        if (isEditing) {
            const { data, error } = await supabase.from('posts').update(postData).eq('id', id).select();
            dbError = error;
            if (data && data[0]) savedPostId = data[0].id;
        } else {
            const { data, error } = await supabase.from('posts').insert(postData).select();
            dbError = error;
            if (data && data[0]) savedPostId = data[0].id;
        }
            
        if (dbError) {
            addToast('Error saving post: ' + dbError.message, 'error');
            setSavingType(null);
            return;
        }
        
        if (status === 'published' && savedPostId) {
            try {
                await createNotification({
                    userId: user.id,
                    type: 'system',
                    postId: savedPostId,
                    content: `Your post "${title}" was published successfully.`
                });
            } catch (notifErr) {
                console.warn('System notification skipped:', notifErr);
            }
        }

        addToast(status === 'published' ? 'Post published successfully!' : 'Saved as draft.', 'success');
        
        if (status === 'published') {
            if (savedPostId) {
                navigate(`/post/${savedPostId}`);
            } else {
                navigate('/discover');
            }
        } else {
            navigate('/dashboard');
        }
        
    } catch (error) {
        addToast(error.message, 'error');
    } finally {
        setSavingType(null);
    }
  };

  const formatText = (command, value = null) => {
    document.execCommand(command, false, value);
  };

  return (
    <div className="add-post-page">
      <Header />
      
      <main className="editor-main" id="editor-container">
          {/* Story Title */}
          <input 
            type="text" 
            className="borderless-input editor-title" 
            placeholder="Story Title" 
            aria-label="Story Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          {/* Upload Zone */}
          <div 
            className={`editor-upload-zone ${coverImage ? 'has-image' : ''} ${isDragActive ? 'drag-active' : ''}`}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setIsDragActive(true); }}
            onDragLeave={(e) => { e.preventDefault(); setIsDragActive(false); }}
            onDrop={onDrop}
            style={coverImage ? { backgroundImage: `url('${coverImage}')`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
          >
              <input 
                type="file" 
                ref={fileInputRef}
                hidden 
                accept="image/*" 
                onChange={(e) => {
                    if (e.target.files.length > 0) handleFile(e.target.files[0]);
                }}
              />
              <div className="upload-icon-circle">
                  <div className="dynamic-icon" style={{ WebkitMaskImage: "url('/assets/images/icons/upload-03.svg')", width: "24px", height: "24px" }}></div>
              </div>
              <p>Drag and drop your high-res image here or click to browse</p>
          </div>

          {/* Subtitle */}
          <input 
            type="text" 
            className="borderless-input editor-subtitle" 
            placeholder="Subtitle.." 
            aria-label="Subtitle"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
          />

          {/* Categories */}
          <div className="category-wrapper" style={{ marginTop: "32px" }}>
              <div className="editor-tags-scrollable" id="main-categories-row">
                  {Object.keys(categoryData).map(mainCat => (
                      <button 
                        key={mainCat} 
                        className={`tag main-tag ${activeMainCat === mainCat ? 'active' : ''}`}
                        onClick={() => {
                            setActiveMainCat(mainCat);
                            setActiveSubCats([]);
                        }}
                      >
                          {mainCat}
                      </button>
                  ))}
              </div>
              
              <div className="editor-tags-scrollable" id="sub-categories-row" style={{ marginTop: "16px", opacity: activeMainCat ? 1 : 0, transition: 'opacity 0.2s ease' }}>
                  {activeMainCat && categoryData[activeMainCat].map(subCat => (
                      <button 
                        key={subCat} 
                        className={`tag ${activeSubCats.includes(subCat) ? 'active' : ''}`}
                        onClick={() => {
                            if (activeSubCats.includes(subCat)) {
                                setActiveSubCats(activeSubCats.filter(c => c !== subCat));
                            } else {
                                setActiveSubCats([...activeSubCats, subCat]);
                            }
                        }}
                      >
                          {subCat}
                      </button>
                  ))}
              </div>
          </div>

          {/* Formatting Toolbar */}
          <div className="editor-toolbar" id="format-toolbar">
              <button className="toolbar-btn font-serif" style={{ fontWeight: "bold" }} onClick={() => formatText('bold')}>B</button>
              <button className="toolbar-btn font-serif" style={{ fontStyle: "italic" }} onClick={() => formatText('italic')}>I</button>
              <button className="toolbar-btn" onClick={() => {
                  const url = prompt("Enter link URL:");
                  if (url) formatText('createLink', url);
              }}>
                  <span className="dynamic-icon" style={{ WebkitMaskImage: "url('/assets/images/icons/upload-03.svg')", width: "18px", height: "18px" }}></span>
              </button>
              <button className="toolbar-btn" style={{ fontWeight: "bold", fontSize: "0.9rem" }} onClick={() => formatText('formatBlock', 'H2')}>H2</button>
              <button className="toolbar-btn font-serif" style={{ fontWeight: "bold", fontSize: "1.2rem" }} onClick={() => formatText('formatBlock', 'BLOCKQUOTE')}>"</button>
          </div>

          {/* Body Content */}
          <div 
            contentEditable="true" 
            ref={editorRef} className="borderless-input editor-body" 
            data-placeholder="Tell the story behind this shot..."
            onInput={(e) => setBodyContent(e.currentTarget.innerHTML)}
            style={{ minHeight: "300px" }}
          ></div>

          {/* Action Footer */}
          <div className="editor-footer">
              <Link to="/dashboard" className="btn-cancel">{isEditing ? 'Discard Changes' : 'Cancel'}</Link>
              <div className={`tooltip-wrapper ${!isValid ? 'show-tooltip' : ''}`} data-tooltip={tooltipMessage} style={{ display: 'flex', gap: '16px' }}>
                  
                  {!isEditing ? (
                      <>
                          <button 
                            className="btn-ghost-rounded"
                            disabled={!isValid || savingType !== null}
                            onClick={() => savePost('draft')}
                            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                          >
                            {savingType === 'draft' ? <><svg className="spinner" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width: '16px', height: '16px', animation: 'spin 1s linear infinite'}}><circle cx="12" cy="12" r="10" strokeOpacity="0.25"/><path d="M12 2a10 10 0 0 1 10 10"/></svg> Saving...</> : 'Save as Draft'}
                          </button>
                          <button 
                            className="btn-primary-rounded"
                            disabled={!isValid || savingType !== null}
                            onClick={() => savePost('published')}
                            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                          >
                            {savingType === 'published' ? <><svg className="spinner" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width: '16px', height: '16px', animation: 'spin 1s linear infinite'}}><circle cx="12" cy="12" r="10" strokeOpacity="0.25"/><path d="M12 2a10 10 0 0 1 10 10"/></svg> Publishing...</> : 'Publish'}
                          </button>
                      </>
                  ) : (
                      <>
                          <button 
                            className="btn-danger" 
                            style={{ padding: '12px 24px', borderRadius: '100px', fontWeight: '600', backgroundColor: '#FEE2E2', color: '#DC2626', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
                            disabled={(savingType !== null)}
                            onClick={() => setShowDeleteModal(true)}
                          >
                            {(savingType !== null) ? 'Deleting...' : 'Delete Post'}
                          </button>
                          
                          {originalStatus === 'draft' ? (
                              <>
                                  <button 
                                    className="btn-ghost-rounded"
                                    disabled={!isValid || savingType !== null}
                                    onClick={() => savePost('draft')}
                                    style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                                  >
                                    {savingType === 'draft' ? <><svg className="spinner" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width: '16px', height: '16px', animation: 'spin 1s linear infinite'}}><circle cx="12" cy="12" r="10" strokeOpacity="0.25"/><path d="M12 2a10 10 0 0 1 10 10"/></svg> Saving...</> : 'Save Draft'}
                                  </button>
                                  <button 
                                    className="btn-primary-rounded"
                                    disabled={!isValid || savingType !== null}
                                    onClick={() => savePost('published')}
                                    style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                                  >
                                    {savingType === 'published' ? <><svg className="spinner" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width: '16px', height: '16px', animation: 'spin 1s linear infinite'}}><circle cx="12" cy="12" r="10" strokeOpacity="0.25"/><path d="M12 2a10 10 0 0 1 10 10"/></svg> Publishing...</> : 'Publish'}
                                  </button>
                              </>
                          ) : (
                              <button 
                                className="btn-primary-rounded"
                                disabled={!isValid || savingType !== null}
                                onClick={() => savePost('published')}
                                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                              >
                                {savingType === 'published' ? <><svg className="spinner" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width: '16px', height: '16px', animation: 'spin 1s linear infinite'}}><circle cx="12" cy="12" r="10" strokeOpacity="0.25"/><path d="M12 2a10 10 0 0 1 10 10"/></svg> Saving...</> : 'Save Changes'}
                              </button>
                          )}
                      </>
                  )}
              </div>
          </div>
      <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </main>
      
      {showDeleteModal && (
          <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
              <div style={{ backgroundColor: 'var(--color-bg)', padding: '24px', borderRadius: '16px', maxWidth: '400px', width: '90%', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
                  <h3 style={{ marginTop: 0, color: 'var(--color-text-main)', fontSize: '1.2rem', marginBottom: '12px' }}>Delete Post</h3>
                  <p style={{ color: 'var(--color-text-secondary)', marginBottom: '24px', lineHeight: 1.5 }}>Are you sure you want to delete this post? This action cannot be undone.</p>
                  <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                      <button onClick={() => setShowDeleteModal(false)} style={{ padding: '8px 20px', borderRadius: '20px', border: '1px solid #eef2f6', background: 'transparent', color: 'var(--color-text-main)', cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
                      <button onClick={handleConfirmDelete} style={{ padding: '8px 20px', borderRadius: '20px', border: 'none', background: '#ef4444', color: 'white', cursor: 'pointer', fontWeight: 600 }}>{(savingType !== null) ? "..." : "Delete"}</button>
                  </div>
              </div>
          </div>
      )}
<Footer />
    </div>
  );
}
