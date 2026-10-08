import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabaseClient';

const categoryData = {
  "Travel & Outdoors": ["Mountain Hiking", "Alpine Routes", "Gear & Preparation", "Travel Logistics", "Other"],
  "Photography & Film": ["Camera Settings", "Landscape & Nature", "Video & Slow-Motion", "Post-Production", "Other"],
  "Design & Interfaces": ["Figma Mastery", "Minimalist UI", "Typography", "UX Case Studies", "Other"],
  "Science & Technology": ["Ecosystems & Devices", "Audio & Streaming Systems", "Software & Tools", "Tech Trends", "Other"],
  "Music & Culture": ["Progressive & Classic Rock", "Alternative & Synthpop", "Artist Retrospectives", "Music Theory & Meaning", "Other"],
  "Food & Culinary": ["Healthy Grains", "Cheese & Veggie Bowls", "Quick Everyday Meals", "Culinary Chemistry", "Other"],
  "Automotive & Mobility": ["Classic & Sports Cars", "Ownership & Insurance", "Driving Culture", "Road Trips", "Other"],
  "Education & Lifestyle": ["Student Life", "Financial Logistics", "Productivity", "Career & Freelance", "Other"],
  "Literature & Culture": ["Dystopian Fiction", "Literary Influences", "Modern Prose", "Art & Society", "Other"],
  "Sports & Movement": ["Action & Extreme", "Fitness & Lifestyle", "Pro & Competitive", "Body & Recovery", "Other"],
  "Other": ["Other"]
};

export default function AddPostPage() {
  const addToast = useToast();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [bodyContent, setBodyContent] = useState('');
  const { user } = useAuth();
  const [coverImage, setCoverImage] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);
  
  const [activeMainCat, setActiveMainCat] = useState(null);
  const [activeSubCats, setActiveSubCats] = useState([]);
  
  const fileInputRef = useRef(null);

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

    const savePost = async (status) => {
    if (!user) {
        addToast('You must be logged in to post.', 'error');
        return;
    }
    
    setIsSaving(true);
    try {
        let uploadedImageUrl = null;
        
        // 1. Upload image if exists
        if (coverFile) {
            const fileName = `${user.id}-${Date.now()}.jpg`;
            const { error: uploadError } = await supabase.storage
                .from('avatars') // reusing the avatars bucket but putting it in a covers folder
                .upload(`covers/${fileName}`, coverFile);
                
            if (uploadError) throw uploadError;
            
            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(`covers/${fileName}`);
                
            uploadedImageUrl = publicUrl;
        }

        // 2. Save to database
        const { error: dbError } = await supabase
            .from('posts')
            .insert({
                author_id: user.id,
                title: title,
                subtitle: subtitle,
                content: bodyContent,
                category: activeMainCat + (activeSubCats.length > 0 ? ' - ' + activeSubCats.join(', ') : ''),
                cover_image: uploadedImageUrl,
                status: status
            });
            
        if (dbError) throw dbError;
        
        addToast(status === 'published' ? 'Post published successfully!' : 'Saved as draft.', 'success');
        navigate('/dashboard');
        
    } catch (error) {
        addToast(error.message, 'error');
    } finally {
        setIsSaving(false);
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
            className="borderless-input editor-body" 
            data-placeholder="Tell the story behind this shot..."
            onInput={(e) => setBodyContent(e.currentTarget.innerHTML)}
            style={{ minHeight: "300px" }}
          ></div>

          {/* Action Footer */}
          <div className="editor-footer">
              <Link to="/dashboard" className="btn-cancel">Cancel</Link>
              <div className={`tooltip-wrapper ${!isValid ? 'show-tooltip' : ''}`} data-tooltip={tooltipMessage}>
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
                    {isSaving ? 'Publishing...' : 'Publish Story'}
                  </button>
              </div>
          </div>
          
      </main>
      <Footer />
    </div>
  );
}
