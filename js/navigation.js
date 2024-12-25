document.addEventListener('DOMContentLoaded', function() {
    // Get all nav links
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Add click handler to each link
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Hide all content sections
            document.querySelectorAll('.content').forEach(content => {
                content.style.display = 'none';
            });
            
            // Show the selected content
            const targetId = this.getAttribute('data-page');
            document.getElementById(targetId).style.display = 'block';
            
            // Update active state
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Show default page
    document.querySelector('[data-page="Home"]').click();
}); 