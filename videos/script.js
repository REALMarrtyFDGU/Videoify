async function initVideoify() {
    const urlParams = new URLSearchParams(window.location.search);
    const videoId = urlParams.get('id');
    const targetLang = urlParams.get('lang')?.toLowerCase();

    if (!videoId) return;

    const base = `https://realmarrtyfdgu.github.io/Videoify/videos/${videoId}/`;
    const langUrl = `${base}dubs/languages.json`;
    const titleUrl = `${base}dubs/title.json`;

    try {
        const [langRes, titleRes] = await Promise.all([
            fetch(langUrl),
            fetch(titleUrl)
        ]);

        const languages = await langRes.json();
        const titles = await titleRes.json();
        
        const selector = document.getElementById('language-selector');
        const iframe = document.getElementById('video-frame');
        const displayTitle = document.getElementById('current-video-title');
        
        if (!selector || !iframe) return;

        selector.innerHTML = '';
        const entries = Object.entries(languages);
        
        let matchedVideo = null;
        let originalVideo = null;

        entries.forEach(([displayName, fileName]) => {
            const option = document.createElement('option');
            const fullUrl = `${base}${fileName}.mp4`;
            
            // Logic: Strip country from locale
            // If fileName is 'bowalkingde-DE', we get 'de-DE', then strip to 'de'
            const fullLocale = fileName.match(/[a-z]{2}-[A-Z]{2}$/) ? fileName.slice(-5) : fileName.slice(-2);
            const langCode = fullLocale.split('-')[0].toLowerCase();
            
            option.value = fullUrl;
            option.dataset.title = titles[langCode] || "Video";
            option.textContent = displayName;
            selector.appendChild(option);

            if (displayName.toLowerCase().includes('original')) {
                originalVideo = { url: fullUrl, index: selector.options.length - 1, title: option.dataset.title };
            }

            if (targetLang && displayName.toLowerCase().includes(targetLang)) {
                matchedVideo = { url: fullUrl, index: selector.options.length - 1, title: option.dataset.title };
            }
        });

        const updateDisplay = (url, index, title) => {
            iframe.src = url;
            selector.selectedIndex = index;
            displayTitle.textContent = title;
        };

        // Set initial state
        if (matchedVideo) {
            updateDisplay(matchedVideo.url, matchedVideo.index, matchedVideo.title);
        } else if (originalVideo) {
            updateDisplay(originalVideo.url, originalVideo.index, originalVideo.title);
        } else if (entries.length > 0) {
            const first = selector.options[0];
            updateDisplay(first.value, 0, first.dataset.title);
        }

        selector.addEventListener('change', (e) => {
            const selected = e.target.options[e.target.selectedIndex];
            updateDisplay(e.target.value, e.target.selectedIndex, selected.dataset.title);
            
            // Sync URL parameter
            const newLang = selected.textContent.split(' ')[0].toLowerCase();
            const newUrl = new URL(window.location);
            newUrl.searchParams.set('lang', newLang);
            window.history.replaceState({}, '', newUrl);
        });

    } catch (error) {
        console.error("Videoify Error:", error);
    }
}

window.addEventListener('DOMContentLoaded', initVideoify);
