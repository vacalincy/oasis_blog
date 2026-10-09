ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS subtitle text;

UPDATE public.posts
SET 
  subtitle = CASE 
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
  END,

  content = CASE
    WHEN title LIKE '%Analog Revival%' THEN $$<h3>Why Film is Back</h3><p>Film photography isn't just a nostalgia trip; it's a deliberate choice.</p><ul><li><strong>Patience:</strong> You only have 36 shots.</li><li><strong>Imperfection:</strong> Grain adds character to the image.</li><li><strong>Tangibility:</strong> Holding a physical negative in your hands.</li></ul><p>Ultimately, it forces the artist to slow down and consider every single frame before pressing the shutter.</p>$$
    
    WHEN title LIKE '%Defying Gravity%' THEN $$<p>There is a specific kind of silence you only experience above 10,000 feet. The air is thinner, the wind cuts through your layers, and your heartbeat sounds deafening in your ears.</p><p>When athletes push themselves into these extreme altitudes, they aren't just battling the elements—they are battling their own biology. Every step requires a calculated effort.</p><p>The descent, however, makes the grueling climb entirely worth it. Dropping into an untouched bowl of fresh powder provides a brief, fleeting moment of absolute freedom. It is a spiritual experience that defies explanation.</p>$$
    
    WHEN title LIKE '%Minimalist Workspaces%' THEN $$<p class="dropcap">Clutter is the physical manifestation of unmade decisions.</p><p>By stripping a workspace down to its absolute bare essentials, we remove the cognitive load required to navigate our environment. A clean desk doesn't just look good; it actively promotes a quieter, more focused mind.</p>$$
    
    WHEN title LIKE '%Reading a City%' THEN $$<blockquote>"To walk through a city is to read its history through the soles of your feet."</blockquote><p>Urban exploration is a dying art. We rely so heavily on GPS and curated digital guides that we have forgotten how to simply wander.</p><blockquote>"The best secrets are found when you are entirely lost."</blockquote><p>Next time you find yourself in a new metropolis, turn off your phone. Let the architecture and the narrow alleyways guide you.</p>$$
    
    WHEN title LIKE '%Brutalist Typography%' THEN $$<p class="dropcap">Graphic design is experiencing a brutalist renaissance. The clean, hyper-minimalist styles of the last decade are being torn apart by a new generation of creators.</p><blockquote>"You have to destroy the grid before you can truly understand it."</blockquote><h3>Collage Techniques</h3><ul><li><strong>Layering:</strong> Building depth through contrasting textures.</li><li><strong>Typography:</strong> Treating letters as graphical shapes rather than words.</li></ul><p>It is a chaotic, unapologetic visual language that perfectly reflects the modern internet.</p>$$
    
    WHEN title LIKE '%Nature''s Palette%' THEN $$<p>Earth tones ground us. They subconsciously remind our brains of safety, shelter, and the outdoors.</p><h3>The Psychology of Colors</h3><p>When designers utilize muted greens, warm terracottas, and deep browns, they are artificially lowering the cortisol levels of anyone who enters the room.</p><h3>Bringing the Outside In</h3><p>This isn't just about painting a wall green. It's about incorporating raw textures: untreated wood, porous stone, and living plants.</p>$$
    
    WHEN title LIKE '%Virtual Reality%' THEN $$<p>Virtual reality is no longer a gimmick confined to gaming. It is actively rewiring how students comprehend complex spatial subjects like anatomy and engineering.</p><p>By placing a student completely inside a simulated environment, their brain encodes the information as a lived experience rather than abstract data. Retention rates skyrocket when learning becomes experiential rather than theoretical.</p>$$
    
    WHEN title LIKE '%Moment in the Sun%' THEN $$<p class="dropcap">Time is a sculptor, and we are its masterpiece. In a society obsessed with anti-aging creams and rushing from one appointment to the next, we have lost the art of simply waiting.</p><p>Aging is not a decline; it is an accumulation of wisdom, laughter, and survived hardships. A wrinkled face tells a much more compelling story than a smooth one.</p>$$
    
    WHEN title LIKE '%Resilient Architecture%' THEN $$<h3>Building for the Storm</h3><p>Climate change demands entirely new architectural blueprints. The structures we build today must survive the extreme weather of tomorrow.</p><ul><li><strong>Passive Cooling:</strong> Designing airflow to reduce AC reliance.</li><li><strong>Flood Resilience:</strong> Elevating core structural components above water lines.</li></ul><p>We can no longer fight nature; we must build structures that bend and adapt to it.</p>$$
    
    WHEN title LIKE '%Vertical Ice%' THEN $$<blockquote>"Ice is a harsh mirror, reflecting only those brave enough to face it."</blockquote><p>Crevasse climbing is a uniquely terrifying subset of mountaineering. Unlike rock, ice is dynamic. It shifts, groans, and changes density based on the ambient temperature.</p><p>Climbers must trust their entire body weight to a few millimeters of steel kicked into a frozen waterfall.</p>$$
    
    WHEN title LIKE '%Swiss Typography%' THEN $$<p>The Swiss Style, which emerged in the 1950s, brought much-needed order to the chaos of early graphic design.</p><ul><li><strong>The Grid:</strong> A strict mathematical framework for aligning visual elements.</li><li><strong>Sans-Serif:</strong> Utilizing clean, objective typefaces like Helvetica.</li><li><strong>Asymmetry:</strong> Creating dynamic tension without relying on traditionally centered text.</li></ul>$$
    
    WHEN title LIKE '%Mastering Natural Light%' THEN $$<p class="dropcap">Sunlight is the ultimate, unpredictable modifier. No artificial studio strobe can replicate the wrap and quality of a sun obscured by thick, rolling storm clouds.</p><p>Mastering natural light means giving up control. You cannot adjust the power of the sun. Instead, you must adapt to what the sky gives you, moving your subject and finding the pockets of illumination that make a scene sing.</p><p>The golden hour—that brief window just after sunrise and before sunset—provides a horizontal, diffused light that flatters almost any subject. But it requires immense patience, timing, and a bit of luck.</p>$$
    
    WHEN title LIKE '%Modern Building Facades%' THEN $$<p>Raw concrete gets a bad reputation. Often associated with cold, oppressive structures, it is actually a material of immense warmth when utilized alongside lush greenery and warm lighting.</p><p>Modern urban facades are embracing this brutalist approach. The contrast creates a visual sanctuary in the middle of a noisy, chaotic city.</p>$$
    
    WHEN title LIKE '%Chasing the Horizon%' THEN $$<p class="dropcap">A photograph is a pause button on life. It isolates a fraction of a second, preserving a fleeting emotion or landscape.</p><blockquote>"You don't take a photograph, you make it."</blockquote>$$
    
    WHEN title LIKE '%Beyond the Piste%' THEN $$<p>High-altitude backcountry sports require survival skills just as much as athletic ability.</p><ul><li><strong>Splitboards:</strong> Hiking up before you can ride down.</li><li><strong>Beacons:</strong> Essential avalanche safety equipment.</li></ul><p>You are entirely at the mercy of the elements, making every successful run down the mountain a profound victory.</p>$$
    
    WHEN title LIKE '%Concrete Oasis%' THEN $$<blockquote>"The modern urban villa is a paradox."</blockquote><p>It seeks to create an expansive, isolated retreat within the densest cities on earth. By utilizing inward-facing courtyards and massive concrete privacy walls, architects are building introverted homes.</p><blockquote>"True luxury in the modern world is absolute privacy."</blockquote>$$
    
    WHEN title LIKE '%Artificial Intelligence%' THEN $$<p class="dropcap">Inside the tech war room, sleep is a luxury and coffee is a food group. The stakes are impossibly high.</p><p>Tech culture glorifies the grind. A small team of engineers can disrupt billion-dollar industries in a matter of months. However, the human cost of this relentless iteration is rarely discussed.</p>$$
    
    WHEN title LIKE '%Serenity in Blue%' THEN $$<p>Sometimes, a moment of deep comfort is exactly what the soul needs. We cannot subsist on stress, deadlines, and hustle culture alone.</p><p>Coastal living and blue tones trigger a literal chemical reaction in the brain, lowering heart rates and providing a deep, evolutionary sense of peace.</p>$$
    
    WHEN title LIKE '%Symphony in Space%' THEN $$<h3>Acoustic Architecture</h3><p>Behind every great acoustic space is an unseen engineer meticulously balancing frequencies.</p><p>Acoustic architecture is an invisible art form. When done correctly, the listener never notices the structural tweaks, the acoustic panels, or the subtle reverb tails. They just feel the music wash over them perfectly.</p>$$
    
    WHEN title LIKE '%Neon Nights%' THEN $$<p class="dropcap">Cyberpunk cities at night are a dream made real. The glow of neon signs reflecting off wet pavement creates an intoxicating atmosphere.</p><blockquote>"The city speaks in neon, you just have to learn the language."</blockquote><h3>Urban Elements</h3><ul><li><strong>Scale:</strong> Feeling small in a massive metropolis.</li><li><strong>Contrast:</strong> Ancient shrines next to futuristic arcades.</li></ul>$$
    
    WHEN title LIKE '%Solitude at Elevation%' THEN $$<p>Gravity treats everyone equally. We are seeing a surge in athletes tackling absolute solitude at older ages.</p><p>With improved understanding of the human body and recovery metrics, altitude is becoming an arena of intense spiritual achievement regardless of birth year.</p>$$
    
    ELSE $$<p>An in-depth exploration of the themes, techniques, and stories behind this fascinating subject.</p><p>Understanding the core fundamentals is crucial for anyone looking to master these concepts and apply them to their own creative endeavors.</p>$$
END;
