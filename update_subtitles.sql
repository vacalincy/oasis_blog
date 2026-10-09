ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS subtitle text;

UPDATE public.posts
SET subtitle = CASE 
    WHEN title LIKE '%Analog Revival%' THEN 'Exploring the tactical feel of vintage gear and why analog is making a massive comeback.'
    WHEN title LIKE '%Defying Gravity%' THEN 'Mental grit, pushing physical boundaries, and defying gravity on the mountain.'
    WHEN title LIKE '%Minimalist Workspaces%' THEN 'How raw materials and minimalist aesthetics are shaping the new definition of focus.'
    WHEN title LIKE '%Reading a City%' THEN 'Navigating the hidden streets of mega-cities and the culture of urban exploration.'
    WHEN title LIKE '%Brutalist Typography%' THEN 'How grids, whitespace, and brutalist layouts are redefining modern visual communication.'
    WHEN title LIKE '%Nature''s Palette%' THEN 'A deep dive into preserving natural elements and the romantic allure of earth tones.'
    WHEN title LIKE '%Virtual Reality%' THEN 'The beautiful intersection of art and science, and how tech is rewiring education.'
    WHEN title LIKE '%Moment in the Sun%' THEN 'Breaking the monotone: expressive choices and the timeless stories written in waiting.'
    WHEN title LIKE '%Resilient Architecture%' THEN 'Designing for the future: climate-resilient structures and sustainable materials.'
    WHEN title LIKE '%Vertical Ice%' THEN 'Mental fortitude and pushing limits in the dangerous world of crevasse climbing.'
    WHEN title LIKE '%Swiss Typography%' THEN 'Before the 1950s, graphic design was largely decorative. Then the grid changed everything.'
    WHEN title LIKE '%Mastering Natural Light%' THEN 'Capturing fleeting moments: the art of working with natural sunlight in photography.'
    WHEN title LIKE '%Modern Building Facades%' THEN 'Raw concrete gets a bad reputation, but it is actually a material of immense warmth.'
    WHEN title LIKE '%Chasing the Horizon%' THEN 'A photographic journey capturing surreal moments and vast landscapes.'
    WHEN title LIKE '%Beyond the Piste%' THEN 'Backcountry survival skills and the spiritual experience of untouched powder.'
    WHEN title LIKE '%Concrete Oasis%' THEN 'Designing urban villas that serve as expansive, isolated retreats in dense cities.'
    WHEN title LIKE '%Artificial Intelligence%' THEN 'Inside the war room: the high-stakes culture of modern tech and artificial intelligence.'
    WHEN title LIKE '%Serenity in Blue%' THEN 'The psychology of comfort, coastal living, and finding peace in the modern world.'
    WHEN title LIKE '%Symphony in Space%' THEN 'The unseen engineer: meticulously balancing frequencies and acoustic architecture.'
    WHEN title LIKE '%Neon Nights%' THEN 'Tokyo at night is a cyberpunk dream made real. The glow of neon signs is intoxicating.'
    WHEN title LIKE '%Solitude at Elevation%' THEN 'Extreme cold changes the way we think. Finding absolute solitude at 12,000 feet.'
    ELSE 'An in-depth exploration of the themes, techniques, and stories behind this fascinating subject.'
END;
