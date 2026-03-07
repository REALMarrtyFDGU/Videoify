async function initVideoify() {
    const urlParams = new URLSearchParams(window.location.search);
    const videoId = urlParams.get('id');
    let targetLang = urlParams.get('lang')?.toLowerCase();

    if (!videoId) return;

    const jsonUrl = `https://realmarrtyfdgu.github.io/Videoify/videos/${videoId}/dubs/languages.json`;
    const basePath = `https://realmarrtyfdgu.github.io/Videoify/videos/${videoId}/`;

    try {
        const response = await fetch(jsonUrl);
        const languages = await response.json();
        
        const selector = document.getElementById('language-selector');
        const iframe = document.getElementById('video-frame');
        if (!selector || !iframe) return;

        selector.innerHTML = '';
        const entries = Object.entries(languages);
        let initialVideo = null;

        entries.forEach(([displayName, fileName], index) => {
            const option = document.createElement('option');
            const fullUrl = `${basePath}${fileName}.mp4`;
            option.value = fullUrl;
            option.textContent = displayName;
            // Store the "clean" name for URL updating later
            option.dataset.langName = displayName.split(' ')[0].toLowerCase(); 
            selector.appendChild(option);

            const isMatch = targetLang && displayName.toLowerCase().includes(targetLang);

            if (isMatch) {
                initialVideo = fullUrl;
                option.selected = true;
            } else if (index === 0 && !initialVideo) {
                initialVideo = fullUrl;
            }
        });

        iframe.src = initialVideo;

        // --- THE POLISH: Update URL on Change ---
        selector.addEventListener('change', (e) => {
            const selectedOption = e.target.options[e.target.selectedIndex];
            iframe.src = e.target.value;

            // Get a clean version of the language name (e.g., "Nederlands")
            const newLang = selectedOption.dataset.langName;
            
            // Update the URL without reloading the page
            const newUrl = new URL(window.location);
            newUrl.searchParams.set('lang', newLang);
            window.history.replaceState({}, '', newUrl);
        });

    } catch (error) {
        console.error("Error:", error);
    }
}

window.addEventListener('DOMContentLoaded', initVideoify);
