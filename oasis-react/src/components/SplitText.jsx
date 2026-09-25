import React from 'react';

export default function SplitText({ text, delayOffset = 0, stagger = 0.04 }) {
    if (!text) return null;
    const words = text.split(/\s+/);
    return (
        <>
            {words.map((word, i) => (
                <span 
                    key={i} 
                    className="split-word" 
                    style={{ transitionDelay: `${delayOffset + (i * stagger)}s` }}
                >
                    {word}&nbsp;
                </span>
            ))}
        </>
    );
}
