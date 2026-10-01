import re

with open('oasis-react/src/pages/PostPage.jsx', 'r') as f:
    content = f.read()

# Add useState import
content = content.replace("import React from 'react';", "import React, { useState } from 'react';")

# Add showCommentsModal state
content = content.replace("  const addToast = useToast();", "  const addToast = useToast();\n  const [showCommentsModal, setShowCommentsModal] = useState(false);")

# Update view all button
content = content.replace("<button className=\"comments__view-all\" data-modal-target=\"comments-modal\">", "<button className=\"comments__view-all\" onClick={() => setShowCommentsModal(true)}>")

# Update comment form
content = content.replace("<form className=\"comment-form\">", "<form className=\"comment-form\" onSubmit={(e) => { e.preventDefault(); addToast('Comment submitted!', 'success'); }}>")

# Update modal wrapper
content = content.replace("<div className=\"comments-modal\" id=\"comments-modal\">", "{showCommentsModal && (\n<div className=\"comments-modal active\" id=\"comments-modal\" onClick={(e) => { if (e.target.id === 'comments-modal') setShowCommentsModal(false); }}>")

# Update modal close button
content = content.replace("<button className=\"comments-modal__close\" aria-label=\"Close\">✕</button>", "<button className=\"comments-modal__close\" aria-label=\"Close\" onClick={() => setShowCommentsModal(false)}>✕</button>")

# Find where to close the modal condition
content = content.replace("    </div>\n</div>\n\n{/* ============================================= */}\n{/* READ NEXT START", "    </div>\n</div>\n)}\n\n{/* ============================================= */}\n{/* READ NEXT START")

with open('oasis-react/src/pages/PostPage.jsx', 'w') as f:
    f.write(content)
