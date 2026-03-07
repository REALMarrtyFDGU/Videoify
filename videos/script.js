async function initVideoify() {
    const urlParams = new URLSearchParams(window.location.search);
    const videoId = urlParams.get('id');
    const targetLang = urlParams.get('lang')?.toLowerCase();

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
        
        let matchedVideo = null;
        let originalVideo = null;

        entries.forEach(([displayName, fileName]) => {
            const option = document.createElement('option');
            const fullUrl = `${basePath}${fileName}.mp4`;
            option.value = fullUrl;
            option.textContent = displayName;
            selector.appendChild(option);

            // 1. Check if this is the 'Original' version to set as our ultimate backup
            if (displayName.toLowerCase().includes('original')) {
                originalVideo = { url: fullUrl, index: selector.options.length - 1 };
            }

            // 2. Check if this matches the URL ?lang= parameter
            if (targetLang && displayName.toLowerCase().includes(targetLang)) {
                matchedVideo = { url: fullUrl, index: selector.options.length - 1 };
            }
        });

        if (matchedVideo) {
            iframe.src = matchedVideo.url;
            selector.selectedIndex = matchedVideo.index;
        } else if (originalVideo) {
            iframe.src = originalVideo.url;
            selector.selectedIndex = originalVideo.index;
        } else {
            iframe.src = `${basePath}${entries[0][1]}.mp4`;
            selector.selectedIndex = 0;
        }

        selector.addEventListener('change', (e) => {
            iframe.src = e.target.value;
            const newLang = e.target.options[e.target.selectedIndex].textContent.split(' ')[0].toLowerCase();
            const newUrl = new URL(window.location);
            newUrl.searchParams.set('lang', newLang);
            window.history.replaceState({}, '', newUrl);
        });

    } catch (error) {
        console.error("Error:", error);
    }
}

window.addEventListener('DOMContentLoaded', initVideoify);
