import '../css/style.css';
import { initScene } from './scene.js';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
    initScene();

    // Intro Animation (Robust - ensure visibility at end)
    const tl = gsap.timeline();
    tl.from('.glass-panel', {
        y: 50, opacity: 0, duration: 1, ease: 'power3.out', stagger: 0.2, clearProps: "all"
    });

    // 3D Features Interaction
    // We might want to animate them in, but let's keep it simple for robustness first.
    // Ensure 3D components can find new DOM elements.

    // Modal Logic
    // Preloader Control
    window.addEventListener('load', () => {
        const preloader = document.getElementById('preloader');
        if (preloader) {
            preloader.classList.add('fade-out');
            setTimeout(() => preloader.remove(), 500);
        }
    });

    const bookBtns = document.querySelectorAll('.book-trigger');
    const modal = document.getElementById('booking-modal');
    const closeModal = document.getElementById('close-modal');
    const widgetContainer = document.getElementById('widget-container');

    const iframeCode = '<iframe src="https://konfhub.com/widget/demo-event-b69465e8?desc=true&secondaryBg=0A0F1E&ticketBg=0A0F1E&borderCl=00F3FF&bg=020205&fontColor=FFFFFF&ticketCl=FFFFFF&btnColor=00F3FF&fontFamily=Orbitron&borderRadius=10&widget_type=quick&screen=2&tickets=68146&ticketId=68146%7C1" id="konfhub-widget" title="Register for Event" width="100%" height="500"></iframe>';

    if (bookBtns.length > 0 && modal && closeModal) {
        bookBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                modal.classList.add('active'); // CSS handles display
                if (!widgetContainer.innerHTML) {
                    widgetContainer.innerHTML = iframeCode;
                }
            });
        });


        const hideModal = () => modal.classList.remove('active');
        closeModal.addEventListener('click', hideModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) hideModal();
        });
    }
});
