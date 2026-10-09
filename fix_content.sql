INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('posts', 'posts', true) ON CONFLICT (id) DO NOTHING;

UPDATE public.posts
SET 
  title = CASE 
    WHEN cover_image LIKE '%q1.jpg%' THEN 'The Vinyl Revival: Analog Sound in a Digital Age'
    WHEN cover_image LIKE '%q2.jpg%' THEN 'Mastering the Mix: Inside the Audio Studio'
    WHEN cover_image LIKE '%q3.jpg%' THEN 'Symbiosis: Nature Meets Portrait Photography'
    WHEN cover_image LIKE '%q4.jpg%' THEN 'Deconstructing Faces: Digital Collage Art'
    WHEN cover_image LIKE '%q5.jpg%' THEN 'Lost in the Stacks: The Allure of Antique Books'
    WHEN cover_image LIKE '%q6.jpg%' THEN 'Chords in the Dark: The Indie Music Scene'
    WHEN cover_image LIKE '%q7.jpg%' THEN 'Timeless: Stories from the Clockmaker''s Room'
    WHEN cover_image LIKE '%q8.jpg%' THEN 'Rewiring the Brain: Advances in Neuroplasticity'
    WHEN cover_image LIKE '%q9.jpg%' THEN 'The Last Archivist: Preserving Paper History'
    WHEN cover_image LIKE '%q10.jpg%' THEN 'Street Food Symphony: Flavors of the Night Market'
    WHEN cover_image LIKE '%q11.jpg%' THEN 'Reflections of Ice: Extreme Winter Photography'
    WHEN cover_image LIKE '%q12.jpg%' THEN 'Expressive Fashion: Breaking the Monotone'
    WHEN cover_image LIKE '%q13.jpg%' THEN 'Age is Just a Number: Senior Rock Climbing'
    WHEN cover_image LIKE '%q14.jpg%' THEN 'Concrete Oasis: Designing Urban Villas'
    WHEN cover_image LIKE '%q15.jpg%' THEN 'Neon Dreams: Urban Exploration in Tokyo'
    WHEN cover_image LIKE '%q16.jpg%' THEN 'Colorful Chemistry: The Art of Science'
    WHEN cover_image LIKE '%q17.jpg%' THEN 'Carb Loading: The Psychology of Comfort Food'
    WHEN cover_image LIKE '%q18.jpg%' THEN 'Glory Hurts: The Mental Game of Pro Sports'
    WHEN cover_image LIKE '%q19.jpg%' THEN 'The War Room: Inside High-Stakes Tech Startups'
    WHEN cover_image LIKE '%swiss-typography%' THEN 'Swiss Typography: The Grid That Changed the World'
    WHEN cover_image LIKE '%resilient-architecture%' THEN 'Resilient Architecture: Building for a Changing Climate'
    WHEN cover_image LIKE '%snowboard%' THEN 'Defying Gravity: High-Altitude Snowboarding'
    WHEN cover_image LIKE '%natural-light%' THEN 'Mastering Natural Light in Photography'
    WHEN cover_image LIKE '%villa%' THEN 'Concrete Oasis: Designing Urban Villas'
    ELSE title
  END,
  
  category = CASE 
    WHEN cover_image LIKE '%q1.jpg%' OR cover_image LIKE '%q2.jpg%' OR cover_image LIKE '%q6.jpg%' THEN 'Music & Audio'
    WHEN cover_image LIKE '%q3.jpg%' OR cover_image LIKE '%q11.jpg%' OR cover_image LIKE '%natural-light%' THEN 'Photography & Film'
    WHEN cover_image LIKE '%q4.jpg%' OR cover_image LIKE '%swiss-typography%' THEN 'Design & Art'
    WHEN cover_image LIKE '%q5.jpg%' OR cover_image LIKE '%q9.jpg%' THEN 'Literature & History'
    WHEN cover_image LIKE '%q7.jpg%' OR cover_image LIKE '%q12.jpg%' THEN 'Lifestyle & People'
    WHEN cover_image LIKE '%q8.jpg%' OR cover_image LIKE '%q16.jpg%' THEN 'Science & Tech'
    WHEN cover_image LIKE '%q10.jpg%' OR cover_image LIKE '%q17.jpg%' THEN 'Food & Culture'
    WHEN cover_image LIKE '%q13.jpg%' OR cover_image LIKE '%q18.jpg%' OR cover_image LIKE '%snowboard%' THEN 'Action & Extreme'
    WHEN cover_image LIKE '%q14.jpg%' OR cover_image LIKE '%resilient-architecture%' OR cover_image LIKE '%villa%' THEN 'Architecture'
    WHEN cover_image LIKE '%q15.jpg%' OR cover_image LIKE '%q19.jpg%' THEN 'Urban & Tech'
    ELSE category
  END,
  
  content = $$
<p class="dropcap">Every great movement begins with a shift in perspective. What we see on the surface is rarely the full story, and to truly understand the mechanics of change, we must look deeper into the underlying structures that govern our world.</p>

<p>In recent years, there has been a noticeable shift back towards authenticity. Whether it is in the raw textures of brutalist architecture, the analog warmth of a vinyl record, or the unedited reality of documentary photography, audiences are craving something real.</p>

<blockquote>"Perfection is finally dead. We are entering the era of beautiful flaws."</blockquote>

<h3>The Philosophy of Restraint</h3>
<p>One of the core tenets of this modern philosophy is restraint. It is much easier to add another layer of decoration than it is to refine a single junction until it is flawless. By rejecting artificial finishes, spaces and creations achieve a grounded authenticity that resonates on a subconscious level.</p>

<ul>
    <li><strong>Material Honesty:</strong> Letting materials speak for themselves.</li>
    <li><strong>Intentional Imperfection:</strong> Embracing the natural wear and tear of objects.</li>
    <li><strong>Focus on Function:</strong> stripping away the unnecessary to reveal the core purpose.</li>
</ul>

<p>This approach requires immense restraint. The elegance we perceive in minimalist spaces or raw artistic expressions is often the result of rigorous, unseen labor. It’s about making the difficult look effortless.</p>

<p>As we continue to navigate an increasingly digital and artificial landscape, these anchors to reality become more important than ever. They remind us of our humanity, our connection to the physical world, and the beauty of things that are simply what they appear to be.</p>
  $$;
