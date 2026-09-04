import re

css_file = 'assets/css/dashboard.css'
with open(css_file, 'r') as f:
    css = f.read()

# 1. Replace .following-modal
old_modal = re.search(r'\.following-modal\s*{[^}]*}', css).group(0)
new_modal = """.following-modal {
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.4);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 480px;
  display: flex;
  flex-direction: column;
  transform: scale(1);
  transition: transform var(--transition);
}"""

# Since my previous regex might have missed properties I want to keep (like max-width),
# wait, .modal-content has max-width etc, and following-modal is just a class attached to it.
# Let's check what properties .modal-content actually has right now.
