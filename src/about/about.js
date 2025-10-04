// Simple and clean about page JavaScript
document.addEventListener('DOMContentLoaded', () => {
  // Add smooth scroll behavior
  document.documentElement.style.scrollBehavior = 'smooth';
  
  // Add subtle animation to avatar on page load
  const avatar = document.querySelector('.avatar');
  if (avatar) {
    avatar.style.opacity = '0';
    avatar.style.transform = 'scale(0.8)';
    
    setTimeout(() => {
      avatar.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
      avatar.style.opacity = '1';
      avatar.style.transform = 'scale(1)';
    }, 200);
  }
  
  // Add fade-in animation to content
  const content = document.querySelector('.intro-content');
  if (content) {
    content.style.opacity = '0';
    content.style.transform = 'translateY(30px)';
    
    setTimeout(() => {
      content.style.transition = 'opacity 1s ease, transform 1s ease';
      content.style.opacity = '1';
      content.style.transform = 'translateY(0)';
    }, 600);
  }
  
  // Add hover effect to social links
  const socialLinks = document.querySelectorAll('.social-links a');
  socialLinks.forEach(link => {
    link.addEventListener('mouseenter', () => {
      link.style.transform = 'translateY(-3px) scale(1.1)';
    });
    
    link.addEventListener('mouseleave', () => {
      link.style.transform = 'translateY(0) scale(1)';
    });
  });

  // Navigation blur effect - same as index page
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('mouseenter', () => {
      document.querySelectorAll('.nav-link').forEach(other => {
        if (other !== link) {
          other.classList.add('blurred');
        }
      });
    });
    link.addEventListener('mouseleave', () => {
      document.querySelectorAll('.nav-link').forEach(other => {
        other.classList.remove('blurred');
      });
    });
  });

  // Dynamic navigation animation control - same as index page
  const dynamicNav = document.querySelector('.dynamic-nav');
  if (dynamicNav) {
    dynamicNav.addEventListener('mouseenter', () => {
      dynamicNav.classList.remove('shrink-anim');
    });
    dynamicNav.addEventListener('mouseleave', () => {
      dynamicNav.classList.add('shrink-anim');
      // Animation ends and removes class to avoid repeated triggers
      dynamicNav.addEventListener('animationend', function handler() {
        dynamicNav.classList.remove('shrink-anim');
        dynamicNav.removeEventListener('animationend', handler);
      });
    });
  }
});