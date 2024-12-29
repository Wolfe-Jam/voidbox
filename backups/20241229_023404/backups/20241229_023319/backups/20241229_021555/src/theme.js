/**
 * Theme management for Voidbox
 */
const ThemeManager = {
    isDark: false,

    init() {
        console.log('🎨 Initializing theme manager');
        // Check stored preference
        const stored = localStorage.getItem('voidbox_theme');
        if (stored === 'dark') {
            this.isDark = true;
            this.apply();
        }
    },

    toggle() {
        console.log('🔄 Toggling theme');
        this.isDark = !this.isDark;
        this.apply();
        localStorage.setItem('voidbox_theme', this.isDark ? 'dark' : 'light');
    },

    apply() {
        console.log('✨ Applying theme:', this.isDark ? 'dark' : 'light');
        document.documentElement.setAttribute('data-theme', this.isDark ? 'dark' : 'light');
    }
};

export default ThemeManager;
