export function startCountdown(targetDateString) {
    const countdownContainer = document.getElementById('countdown-container');
    if (!countdownContainer) return;

    const targetDate = new Date(targetDateString).getTime();

    function updateTimer() {
        const now = new Date().getTime();
        const distance = targetDate - now;

        if (distance < 0) {
            countdownContainer.innerHTML = '<div class="countdown-expired" style="font-family: var(--font-heading); font-size: 1.5rem; color: var(--accent-primary);">EVENT STARTED</div>';
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        updateElement('days', days);
        updateElement('hours', hours);
        updateElement('minutes', minutes);
        updateElement('seconds', seconds);
    }

    function updateElement(id, value) {
        const el = document.getElementById(id);
        if (el) {
            el.innerText = String(value).padStart(2, '0');
        }
    }

    setInterval(updateTimer, 1000);
    updateTimer(); // Initial call
}
