// Hamburger menu functionality
document.addEventListener('DOMContentLoaded', () => {
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const navList = document.getElementById('navList');
  
  if (hamburgerBtn) {
    hamburgerBtn.addEventListener('click', () => {
      hamburgerBtn.classList.toggle('active');
      navList.classList.toggle('show');
    });
  }
  
  // Close the menu when clicking outside
  document.addEventListener('click', (event) => {
    if (hamburgerBtn && 
        navList.classList.contains('show') && 
        !event.target.closest('nav') && 
        event.target !== hamburgerBtn) {
      navList.classList.remove('show');
      hamburgerBtn.classList.remove('active');
    }
  });
  
  // Add aria-expanded attribute to improve accessibility
  if (hamburgerBtn) {
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    hamburgerBtn.addEventListener('click', () => {
      const expanded = hamburgerBtn.getAttribute('aria-expanded') === 'true' || false;
      hamburgerBtn.setAttribute('aria-expanded', !expanded);
    });
  }

  // Theme toggle functionality
  const themeToggleBtn = document.getElementById('theme-toggle');
  
  // Check for saved theme preference or use system preference
  const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
  const savedTheme = localStorage.getItem('theme');
  
  // Function to set theme
  const setTheme = (isDark) => {
    if (isDark) {
      document.body.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };
  
  // Apply saved theme or use system preference
  if (savedTheme === 'dark' || (!savedTheme && prefersDarkScheme.matches)) {
    setTheme(true);
  } else {
    setTheme(false);
  }
  
  // Toggle theme when button is clicked
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const isDarkMode = document.body.classList.contains('dark');
      setTheme(!isDarkMode);
    });
  }
  
  // Listen for system theme changes
  prefersDarkScheme.addEventListener('change', (event) => {
    // Only auto-switch if the user hasn't manually selected a theme
    if (!localStorage.getItem('theme')) {
      setTheme(event.matches);
    }
  });
});