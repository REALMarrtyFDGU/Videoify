async function initVideoify() {
    const urlParams = new URLSearchParams(window.location.search);
    const videoId = urlParams.get('id');

    if (!videoId) {
        console.error("No video ID found in URL.");
        return;
    }

    const jsonUrl = `https://realmarrtyfdgu.github.io/Videoify/videos/${videoId}/dubs/languages.json`;
    const basePath = `https://realmarrtyfdgu.github.io/Videoify/videos/${videoId}/`;

    try {
        const response = await fetch(jsonUrl);
        const languages = await response.json();
        
        const selector = document.getElementById('language-selector');
        const iframe = document.getElementById('video-frame');
        selector.innerHTML = '';
        const entries = Object.entries(languages);
        entries.forEach(([displayName, fileName], index) => {
            const option = document.createElement('option');
            option.value = `${basePath}${fileName}.mp4`;
            option.textContent = displayName;
            selector.appendChild(option);
            if (index === 0) {
                iframe.src = option.value;
            }
        });
        selector.addEventListener('change', (e) => {
            if (e.target.value) {
                iframe.src = e.target.value;
            }
        });
    } catch (error) {
        console.error("Error loading dubs:", error);
    }
}

initVideoify();
