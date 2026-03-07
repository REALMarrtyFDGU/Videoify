async function initVideoify() {
    const urlParams = new URLSearchParams(window.location.search);
    const videoId = urlParams.get('id');
    const targetLang = urlParams.get('lang')?.toLowerCase();

    console.log("Video ID:", videoId);
    console.log("Target Lang:", targetLang);

    if (!videoId) return;

    const jsonUrl = `https://realmarrtyfdgu.github.io/Videoify/videos/${videoId}/dubs/languages.json`;
    const basePath = `https://realmarrtyfdgu.github.io/Videoify/videos/${videoId}/`;

    try {
        const response = await fetch(jsonUrl);
        const languages = await response.json();
        console.log("JSON Loaded:", languages);
        
        const selector = document.getElementById('language-selector');
        const iframe = document.getElementById('video-frame');
        
        if (!selector || !iframe) {
            console.error("Could not find selector or iframe in HTML!");
            return;
        }

        selector.innerHTML = '';
        const entries = Object.entries(languages);
        let matchedSource = null;

        entries.forEach(([displayName, fileName], index) => {
            const option = document.createElement('option');
            const fullUrl = `${basePath}${fileName}.mp4`;
            option.value = fullUrl;
            option.textContent = displayName;
            selector.appendChild(option);

            // Improved check: matches "Nederlands" or "nederlands"
            if (targetLang && displayName.toLowerCase().includes(targetLang)) {
                matchedSource = fullUrl;
                option.selected = true;
                console.log("Found match:", displayName);
            }
        });

        // Use match if found, otherwise default to first entry
        const finalUrl = matchedSource || `${basePath}${entries[0][1]}.mp4`;
        iframe.src = finalUrl;
        console.log("Setting iframe src to:", finalUrl);

        selector.addEventListener('change', (e) => {
            iframe.src = e.target.value;
        });

    } catch (error) {
        console.error("Failed to load or parse JSON:", error);
    }
}

// Ensures HTML is ready before running
window.addEventListener('DOMContentLoaded', initVideoify);
