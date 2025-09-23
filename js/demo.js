// EchoExit Demo JavaScript - Complete Functionality

// Global variables
let currentStep = 1;
const totalSteps = 12;
let userData = {
    name: 'John',
    spouse: 'Sarah',
    motto: 'Living one adventure at a time',
    monthlyTotal: 40.97,
    subscriptions: ['Netflix', 'Spotify', 'Amazon Prime'],
    template: 'classic',
    photos: ['Wedding Day', 'Family Vacation', "Kids' Birth"],
    achievements: {
        education: ['MBA from Harvard Business School', 'Founded two successful startups'],
        hobbies: ['Climbed 14 mountain peaks', 'Jazz pianist for 20 years'],
        family: ['Married 25 wonderful years', 'Coached little league for 10 years']
    },
    message: '',
    tone: 'warm'
};

// Initialize demo when page loads
document.addEventListener('DOMContentLoaded', function() {
    calculateTotal();
    updateProgress();
    
    // Prevent form submission on Enter key (except in textarea)
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
            e.preventDefault();
            nextStep();
        }
    });
});

// Progress and navigation functions
function updateProgress() {
    const progress = (currentStep / totalSteps) * 100;
    const progressBar = document.getElementById('progressBar');
    if (progressBar) {
        progressBar.style.width = progress + '%';
    }
    
    // Update step dots
    document.querySelectorAll('.step-dot').forEach((dot, index) => {
        if (index < currentStep) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
    
    // Update header title based on section
    const mainTitle = document.getElementById('mainTitle');
    if (mainTitle) {
        if (currentStep <= 4) {
            mainTitle.textContent = 'Your Digital Death Calculator';
        } else if (currentStep <= 11) {
            mainTitle.textContent = 'Your Digital Memorial Builder';
        } else {
            mainTitle.textContent = 'Your Complete Digital Legacy';
        }
    }
}

function nextStep() {
    if (currentStep < totalSteps) {
        // Save data from current step
        saveCurrentStepData();
        
        // Hide current step
        const currentStepElement = document.getElementById('step' + currentStep);
        if (currentStepElement) {
            currentStepElement.classList.remove('active');
        }
        
        // Show next step
        currentStep++;
        const nextStepElement = document.getElementById('step' + currentStep);
        if (nextStepElement) {
            nextStepElement.classList.add('active');
        }
        
        // Update displays for specific steps
        updateStepSpecificContent();
        
        updateProgress();
        
        // Scroll to top of demo
        scrollToTop();
    }
}

function previousStep() {
    if (currentStep > 1) {
        const currentStepElement = document.getElementById('step' + currentStep);
        if (currentStepElement) {
            currentStepElement.classList.remove('active');
        }
        
        currentStep--;
        const prevStepElement = document.getElementById('step' + currentStep);
        if (prevStepElement) {
            prevStepElement.classList.add('active');
        }
        
        updateProgress();
        scrollToTop();
    }
}

function saveCurrentStepData() {
    if (currentStep === 2) {
        const userNameInput = document.getElementById('userName');
        const spouseNameInput = document.getElementById('spouseName');
        const lifeMottoInput = document.getElementById('lifeMotto');
        
        userData.name = userNameInput ? userNameInput.value || 'Friend' : 'Friend';
        userData.spouse = spouseNameInput ? spouseNameInput.value || 'Your loved one' : 'Your loved one';
        userData.motto = lifeMottoInput ? lifeMottoInput.value || 'A life well lived' : 'A life well lived';
    } else if (currentStep === 9) {
        const finalMessageInput = document.getElementById('finalMessage');
        userData.message = finalMessageInput ? finalMessageInput.value : '';
    }
}

function updateStepSpecificContent() {
    if (currentStep === 4) {
        updateImpactDisplay();
    } else if (currentStep === 10) {
        updateMemorialPreview();
    } else if (currentStep === 12) {
        updateFinalSummary();
    }
}

function scrollToTop() {
    const demoContainer = document.querySelector('.demo-container');
    if (demoContainer) {
        demoContainer.scrollIntoView({ behavior: 'smooth' });
    }
}

// Subscription management functions
function toggleSubscription(element, name, price) {
    const checkbox = element.querySelector('input[type="checkbox"]');
    if (!checkbox) return;
    
    checkbox.checked = !checkbox.checked;
    
    if (checkbox.checked) {
        element.classList.add('selected');
        if (!userData.subscriptions.includes(name)) {
            userData.subscriptions.push(name);
        }
    } else {
        element.classList.remove('selected');
        userData.subscriptions = userData.subscriptions.filter(s => s !== name);
    }
    
    calculateTotal();
}

function calculateTotal() {
    let total = 0;
    const checkedBoxes = document.querySelectorAll('.subscription-item input:checked');
    
    checkedBoxes.forEach(checkbox => {
        const priceElement = checkbox.parentElement.querySelector('.subscription-price');
        if (priceElement) {
            const priceText = priceElement.textContent;
            const price = parseFloat(priceText.replace('$', '').replace('/mo', ''));
            if (!isNaN(price)) {
                total += price;
            }
        }
    });
    
    userData.monthlyTotal = total;
    
    // Update display elements
    const monthlyTotalElement = document.getElementById('monthlyTotal');
    const yearlyTotalElement = document.getElementById('yearlyTotal');
    
    if (monthlyTotalElement) {
        monthlyTotalElement.textContent = total.toFixed(2);
    }
    if (yearlyTotalElement) {
        yearlyTotalElement.textContent = (total * 12).toFixed(2);
    }
}

// Impact display functions
function updateImpactDisplay() {
    const monthly = userData.monthlyTotal;
    const yearly = monthly * 12;
    
    const monthlyImpactElement = document.getElementById('monthlyImpact');
    const yearlyImpactElement = document.getElementById('yearlyImpact');
    const spouseDisplayElement = document.getElementById('spouseDisplay');
    
    if (monthlyImpactElement) {
        monthlyImpactElement.textContent = monthly.toFixed(2);
    }
    if (yearlyImpactElement) {
        yearlyImpactElement.textContent = yearly.toFixed(2);
    }
    if (spouseDisplayElement) {
        spouseDisplayElement.textContent = userData.spouse;
    }
}

// Template selection functions
function selectTemplate(element, template) {
    document.querySelectorAll('.template-card').forEach(card => {
        card.classList.remove('selected');
    });
    element.classList.add('selected');
    userData.template = template;
}

// Photo selection functions
function togglePhoto(element) {
    element.classList.toggle('selected');
    const photoName = element.textContent.trim();
    
    if (element.classList.contains('selected')) {
        if (!userData.photos.includes(photoName)) {
            userData.photos.push(photoName);
        }
    } else {
        userData.photos = userData.photos.filter(p => p !== photoName);
    }
}

// Tone selection functions
function selectTone(element, tone) {
    document.querySelectorAll('.tone-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    element.classList.add('selected');
    userData.tone = tone;
}

// Memorial preview functions
function showMemorialSection(section) {
    document.querySelectorAll('.memorial-section').forEach(sec => {
        sec.classList.remove('active');
    });
    document.querySelectorAll('.memorial-nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    const sectionElement = document.getElementById('memorial-' + section);
    if (sectionElement) {
        sectionElement.classList.add('active');
    }
    
    // Add active class to clicked nav item
    if (event && event.target) {
        event.target.classList.add('active');
    }
}

function updateMemorialPreview() {
    const memorialNameElement = document.getElementById('memorialName');
    const memorialMottoElement = document.getElementById('memorialMotto');
    const memorialUrlElement = document.getElementById('memorialUrl');
    const memorialMessageTextElement = document.getElementById('memorialMessageText');
    
    if (memorialNameElement) {
        memorialNameElement.textContent = userData.name + ' Doe';
    }
    if (memorialMottoElement) {
        memorialMottoElement.textContent = userData.motto;
    }
    if (memorialUrlElement) {
        memorialUrlElement.textContent = userData.name.toLowerCase() + '-doe';
    }
    if (memorialMessageTextElement) {
        memorialMessageTextElement.textContent = userData.message || 'To everyone who visits this memorial...';
    }
}

// Final summary functions
function updateFinalSummary() {
    const yearly = userData.monthlyTotal * 12;
    
    const summaryNameElement = document.getElementById('summaryName');
    const summaryYearlyElement = document.getElementById('summaryYearly');
    const summaryAccountsElement = document.getElementById('summaryAccounts');
    
    if (summaryNameElement) {
        summaryNameElement.textContent = userData.name;
    }
    if (summaryYearlyElement) {
        summaryYearlyElement.textContent = yearly.toFixed(2);
    }
    if (summaryAccountsElement) {
        summaryAccountsElement.textContent = userData.subscriptions.length;
    }
}

// Action functions
function signUp() {
    alert(userData.name + '! Your digital legacy is secured. Redirecting to secure checkout...');
    // In production, this would redirect to actual signup
    // window.location.href = '/signup';
    
    // Optional: redirect to main site waitlist
    // window.location.href = '/#waitlist';
}

function restartDemo() {
    currentStep = 1;
    
    // Hide all steps
    document.querySelectorAll('.step').forEach(step => step.classList.remove('active'));
    
    // Show first step
    const firstStep = document.getElementById('step1');
    if (firstStep) {
        firstStep.classList.add('active');
    }
    
    updateProgress();
    
    // Reset form values
    const userNameInput = document.getElementById('userName');
    const spouseNameInput = document.getElementById('spouseName');
    const lifeMottoInput = document.getElementById('lifeMotto');
    
    if (userNameInput) userNameInput.value = 'John';
    if (spouseNameInput) spouseNameInput.value = 'Sarah';
    if (lifeMottoInput) lifeMottoInput.value = 'Living one adventure at a time';
    
    // Reset subscriptions
    document.querySelectorAll('.subscription-item').forEach(item => {
        const checkbox = item.querySelector('input');
        const nameElement = item.querySelector('.subscription-name');
        
        if (checkbox && nameElement) {
            const name = nameElement.textContent;
            if (['Netflix', 'Spotify', 'Amazon Prime'].includes(name)) {
                checkbox.checked = true;
                item.classList.add('selected');
            } else {
                checkbox.checked = false;
                item.classList.remove('selected');
            }
        }
    });
    
    // Reset template selection
    document.querySelectorAll('.template-card').forEach(card => {
        card.classList.remove('selected');
    });
    const firstTemplate = document.querySelector('.template-card');
    if (firstTemplate) {
        firstTemplate.classList.add('selected');
    }
    
    // Reset photo selection
    document.querySelectorAll('.photo-item').forEach(item => {
        const photoText = item.textContent.trim();
        if (photoText.includes('Wedding Day') || photoText.includes('Family Vacation') || photoText.includes('Kids\' Birth')) {
            item.classList.add('selected');
        } else {
            item.classList.remove('selected');
        }
    });
    
    // Reset tone selection
    document.querySelectorAll('.tone-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    const firstTone = document.querySelector('.tone-btn');
    if (firstTone) {
        firstTone.classList.add('selected');
    }
    
    // Reset user data
    userData = {
        name: 'John',
        spouse: 'Sarah',
        motto: 'Living one adventure at a time',
        monthlyTotal: 40.97,
        subscriptions: ['Netflix', 'Spotify', 'Amazon Prime'],
        template: 'classic',
        photos: ['Wedding Day', 'Family Vacation', "Kids' Birth"],
        achievements: {
            education: ['MBA from Harvard Business School', 'Founded two successful startups'],
            hobbies: ['Climbed 14 mountain peaks', 'Jazz pianist for 20 years'],
            family: ['Married 25 wonderful years', 'Coached little league for 10 years']
        },
        message: '',
        tone: 'warm'
    };
    
    calculateTotal();
    scrollToTop();
}

function goToMainSite() {
    // In production, this would go to the main site
    window.location.href = '/';
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Analytics tracking (optional)
function trackEvent(eventName, properties) {
    properties = properties || {};
    // In production, integrate with your analytics platform
    console.log('Event tracked:', eventName, properties);
    
    // Example for Google Analytics
    // if (typeof gtag !== 'undefined') {
    //     gtag('event', eventName, properties);
    // }
    
    // Example for Mixpanel
    // if (typeof mixpanel !== 'undefined') {
    //     mixpanel.track(eventName, properties);
    // }
}

// Error handling
window.addEventListener('error', function(e) {
    console.error('Demo error:', e.error);
    
    // Optional: send error to tracking service
    // trackEvent('demo_error', {
    //     message: e.error.message,
    //     stack: e.error.stack,
    //     step: currentStep
    // });
});

// Performance monitoring
function measurePerformance() {
    if ('performance' in window) {
        const navigation = performance.getEntriesByType('navigation')[0];
        if (navigation) {
            const loadTime = navigation.loadEventEnd - navigation.loadEventStart;
            
            console.log('Demo load time:', loadTime + 'ms');
            
            // Optional: track performance
            // trackEvent('demo_performance', {
            //     load_time: loadTime,
            //     dom_content_loaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart
            // });
        }
    }
}

// Call performance measurement on load
document.addEventListener('DOMContentLoaded', measurePerformance);

// Enhanced accessibility features
function enhanceAccessibility() {
    // Add ARIA labels to interactive elements
    document.querySelectorAll('.subscription-item').forEach((item, index) => {
        item.setAttribute('role', 'checkbox');
        item.setAttribute('aria-checked', item.classList.contains('selected'));
        item.setAttribute('tabindex', '0');
        
        // Add keyboard navigation
        item.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                item.click();
            }
        });
    });
    
    // Add ARIA labels to template cards
    document.querySelectorAll('.template-card').forEach((card, index) => {
        card.setAttribute('role', 'radio');
        card.setAttribute('aria-checked', card.classList.contains('selected'));
        card.setAttribute('tabindex', '0');
        
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                card.click();
            }
        });
    });
    
    // Add focus management for step navigation
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', function() {
            // Focus management after step change
            setTimeout(() => {
                const activeStep = document.querySelector('.step.active h2');
                if (activeStep) {
                    activeStep.focus();
                }
            }, 100);
        });
    });
}

// Initialize accessibility features
document.addEventListener('DOMContentLoaded', enhanceAccessibility);