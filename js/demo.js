// EchoExit Demo JavaScript - Complete Debugged Version

// Global variables
let currentStep = 1;
const totalSteps = 12;
let userData = {
    name: 'John',
    spouse: 'Sarah',
    motto: 'Living one adventure at a time',
    monthlyTotal: 40.97,
    subscriptions: ['Netflix', 'Spotify', 'Amazon Prime'],
    customSubscriptions: [], // FIXED: Added missing property
    template: 'classic',
    photos: ['Wedding Day', 'Family Vacation', "Kids' Birth"],
    achievements: {
        education: ['MBA from Harvard Business School', 'Founded two successful startups', '30 years in technology leadership'],
        hobbies: ['Climbed 14 mountain peaks', 'Jazz pianist for 20 years', 'Published 3 novels', 'Traveled to 47 countries'],
        family: ['Married 25 wonderful years', 'Raised 3 amazing children', 'Coached little league for 10 years', 'Volunteered at food bank weekly'],
        legacy: ['Always put family first', 'Mentored dozens of young professionals']
    },
    message: '',
    tone: 'warm'
};

// FIXED: Store interval IDs globally to clear them properly
let impactAnimationInterval = null;
let offerCountdownInterval = null;

// Initialize demo when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication first
    checkAuthentication();
    
    calculateTotal();
    updateProgress();
    updatePhotoCount();
    
    // Prevent form submission on Enter key (except in textarea and custom inputs)
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && 
            e.target.tagName !== 'TEXTAREA' && 
            e.target.id !== 'customPrice' && 
            e.target.id !== 'customName' &&
            !e.target.classList.contains('achievement-item')) { // FIXED: Don't trigger on achievement inputs
            e.preventDefault();
            nextStep();
        }
    });
});

// FIXED: Consolidated authentication check
function checkAuthentication() {
    const AUTH_KEY = 'echoexit_staging_auth';
    const AUTH_EXPIRY_KEY = 'echoexit_staging_expiry';
    
    const isAuthenticated = sessionStorage.getItem(AUTH_KEY);
    const authExpiry = sessionStorage.getItem(AUTH_EXPIRY_KEY);
    const now = new Date().getTime();
    
    // If not authenticated or expired, redirect to main page
    if (!isAuthenticated || !authExpiry || now > parseInt(authExpiry)) {
        sessionStorage.removeItem(AUTH_KEY);
        sessionStorage.removeItem(AUTH_EXPIRY_KEY);
        window.location.href = 'index.html';
        return false;
    }
    return true;
}

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
        
        // Clear any running animations when leaving step
        if (currentStep === 4 && impactAnimationInterval) {
            clearInterval(impactAnimationInterval);
            impactAnimationInterval = null;
        }
        
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
        
        // Start countdown on final step
        if (currentStep === 12) {
            startOfferCountdown();
        }
    }
}

function previousStep() {
    if (currentStep > 1) {
        // Clear animations when leaving steps
        if (currentStep === 4 && impactAnimationInterval) {
            clearInterval(impactAnimationInterval);
            impactAnimationInterval = null;
        }
        if (currentStep === 12 && offerCountdownInterval) {
            clearInterval(offerCountdownInterval);
            offerCountdownInterval = null;
        }
        
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
        
        // Save to localStorage for persistence
        try {
            localStorage.setItem('echoexitUserData', JSON.stringify(userData));
        } catch (e) {
            console.warn('Could not save to localStorage:', e);
        }
    } else if (currentStep === 8) {
        // Save achievements
        saveAchievements();
    } else if (currentStep === 9) {
        const finalMessageInput = document.getElementById('finalMessage');
        userData.message = finalMessageInput ? finalMessageInput.value : '';
    }
}

function updateStepSpecificContent() {
    if (currentStep === 4) {
        updateImpactDisplay();
        startImpactAnimation();
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
    
    const oldTotal = userData.monthlyTotal;
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
    
    // Animate the change
    animateCounter('monthlyTotal', oldTotal, userData.monthlyTotal, 500);
    animateCounter('yearlyTotal', oldTotal * 12, userData.monthlyTotal * 12, 500);
}

// FIXED: Enhanced with better validation
function addCustomSubscription() {
    const nameInput = document.getElementById('customName');
    const priceInput = document.getElementById('customPrice');
    
    if (!nameInput || !priceInput) return;
    
    const name = nameInput.value.trim();
    const price = parseFloat(priceInput.value);
    
    // Better validation
    if (name && price > 0 && price < 10000) { // Add reasonable upper limit
        // Check for duplicates
        if (userData.subscriptions.includes(name)) {
            alert('This subscription already exists!');
            return;
        }
        
        // Create new subscription element
        const grid = document.querySelector('.subscriptions-grid');
        const customCard = document.querySelector('.custom-subscription');
        
        if (!grid || !customCard) return;
        
        const customItem = document.createElement('div');
        customItem.className = 'subscription-item selected';
        customItem.innerHTML = `
            <input type="checkbox" checked>
            <div class="subscription-info">
                <span class="subscription-name">${name}</span>
                <span class="subscription-price">$${price.toFixed(2)}/mo</span>
            </div>
        `;
        
        // Add click handler
        customItem.onclick = function() { 
            toggleSubscription(this, name, price); 
        };
        
        // Insert before the custom input card
        grid.insertBefore(customItem, customCard);
        
        // Add to data
        userData.customSubscriptions.push({name, price});
        userData.subscriptions.push(name);
        
        // Clear inputs
        nameInput.value = '';
        priceInput.value = '';
        
        // Recalculate
        calculateTotal();
    } else {
        if (!name) {
            alert('Please enter a service name');
        } else if (price <= 0) {
            alert('Please enter a valid price');
        } else if (price >= 10000) {
            alert('Price seems too high. Please check the amount.');
        }
    }
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

// Animation helper
function animateCounter(elementId, start, end, duration) {
    const element = document.getElementById(elementId);
    if (!element || start === undefined || end === undefined) return;
    
    const startTime = performance.now();
    const difference = end - start;
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const current = start + (difference * progress);
        element.textContent = current.toFixed(2);
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
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

// FIXED: Clear previous interval before starting new one
function startImpactAnimation() {
    // Clear existing counter and interval if any
    const existingCounter = document.getElementById('impactCounter');
    if (existingCounter) existingCounter.remove();
    if (impactAnimationInterval) {
        clearInterval(impactAnimationInterval);
        impactAnimationInterval = null;
    }
    
    if (userData.monthlyTotal > 0) {
        let days = 0;
        const dailyCost = userData.monthlyTotal / 30;
        
        const counterElement = document.createElement('div');
        counterElement.id = 'impactCounter';
        
        // Insert after timeline
        const timeline = document.querySelector('.timeline');
        if (timeline && timeline.parentNode) {
            timeline.parentNode.insertBefore(counterElement, timeline.nextSibling);
        }
        
        // Animate counter
        impactAnimationInterval = setInterval(() => {
            days++;
            const wasted = (dailyCost * days).toFixed(2);
            counterElement.innerHTML = `
                <div style="font-size: 0.9rem;">If nothing changes...</div>
                <div style="font-size: 1.5rem;">$${wasted} will be wasted</div>
                <div style="font-size: 0.8rem;">in just ${days} days</div>
            `;
            
            if (days >= 30 || currentStep !== 4) {
                clearInterval(impactAnimationInterval);
                impactAnimationInterval = null;
            }
        }, 100);
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
    
    // Get the photo name from the second span
    const spans = element.querySelectorAll('span');
    const photoName = spans[1] ? spans[1].textContent : 'Photo';
    
    if (element.classList.contains('selected')) {
        if (!userData.photos.includes(photoName)) {
            userData.photos.push(photoName);
        }
    } else {
        userData.photos = userData.photos.filter(p => p !== photoName);
    }
    
    updatePhotoCount();
}

// Update photo count
function updatePhotoCount() {
    const selected = document.querySelectorAll('.photo-item.selected').length;
    const display = document.getElementById('photoCount');
    if (display) {
        display.textContent = `${selected} photos selected for your memorial`;
    }
}

// Achievement management
function saveAchievements() {
    ['education', 'hobbies', 'family', 'legacy'].forEach(category => {
        userData.achievements[category] = [];
        const categoryElement = document.querySelector(`[data-category="${category}"]`);
        if (categoryElement) {
            const inputs = categoryElement.querySelectorAll('.achievement-items input');
            inputs.forEach(input => {
                if (input.value.trim()) {
                    userData.achievements[category].push(input.value.trim());
                }
            });
        }
    });
    
    // Save to localStorage
    try {
        localStorage.setItem('echoexitUserData', JSON.stringify(userData));
    } catch (e) {
        console.warn('Could not save achievements:', e);
    }
}

function addAchievement(category) {
    const categoryElement = document.querySelector(`[data-category="${category}"]`);
    if (!categoryElement) return;
    
    const container = categoryElement.querySelector('.achievement-items');
    if (container) {
        const newItem = document.createElement('div');
        newItem.className = 'achievement-item';
        newItem.innerHTML = `
            <input type="text" placeholder="Add ${category}..." onblur="saveAchievements()">
            <button class="remove-achievement" onclick="removeAchievement(this)">×</button>
        `;
        container.appendChild(newItem);
        const input = newItem.querySelector('input');
        if (input) input.focus();
    }
}

function removeAchievement(button) {
    if (button && button.parentElement) {
        button.parentElement.remove();
        saveAchievements();
    }
}

// Tone selection functions
function selectTone(element, tone) {
    document.querySelectorAll('.tone-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    element.classList.add('selected');
    userData.tone = tone;
    
    // Update message preview
    const preview = document.getElementById('messagePreview');
    const messageField = document.getElementById('finalMessage');
    
    if (preview) {
        const toneMessages = {
            warm: "To everyone who visits this memorial, thank you for being part of my journey. Life has been an incredible adventure, filled with love, laughter, and countless precious moments...",
            inspirational: "Let my life be a testament to chasing dreams and never giving up. Every challenge was an opportunity, every setback a lesson...",
            humorous: "Well, looks like I finally found a way to get the last word in! If you're reading this, I've gone to the great beyond (hopefully they have WiFi)...",
            formal: "To all who have gathered here in remembrance, I extend my deepest gratitude for your presence in my life...",
            spiritual: "As my spirit transitions to the next realm, I leave you with this message of hope and faith. Death is not an ending but a transformation...",
            poetic: "Like autumn leaves that dance and fall, my time has come to heed the call. But in your hearts, I'll always stay..."
        };
        
        const message = toneMessages[tone] || toneMessages.warm;
        preview.textContent = message;
        
        // Also update the textarea if user hasn't customized it
        if (messageField && !messageField.dataset.customized) {
            messageField.value = message;
        }
    }
}

// Memorial preview functions
function showMemorialSection(section, element) {
    // Hide all sections
    document.querySelectorAll('.memorial-section').forEach(sec => {
        sec.classList.remove('active');
    });
    
    // Remove active from all nav items
    document.querySelectorAll('.memorial-nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Show selected section
    const sectionEl = document.getElementById('memorial-' + section);
    if (sectionEl) {
        sectionEl.classList.add('active');
    }
    
    // Mark nav item as active
    if (element) {
        element.classList.add('active');
    }
}

// FIXED: Added comprehensive null checks
function updateMemorialPreview() {
    // Update basic info with null checks
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
        memorialUrlElement.textContent = userData.name.toLowerCase().replace(/\s+/g, '-') + '-doe';
    }
    if (memorialMessageTextElement) {
        memorialMessageTextElement.textContent = userData.message || 'To everyone who visits this memorial...';
    }
    
    // Update photos
    const photosContainer = document.getElementById('memorialPhotosContainer');
    if (photosContainer && userData.photos) {
        const selectedPhotos = userData.photos.slice(0, 8);
        photosContainer.innerHTML = selectedPhotos.map(photo => {
            const emojis = {
                'Wedding Day': '📸',
                'Family Vacation': '🏖️',
                'Kids\' Birth': '👶',
                'Adventures': '🏔️',
                'Holidays': '🎄',
                'Achievements': '🏆',
                'Friends': '👥',
                'Home': '🏠',
                'Hobbies': '🎨',
                'Travel': '🌅',
                'Celebrations': '🎂',
                'Graduation': '🎓'
            };
            const emoji = emojis[photo] || '📷';
            return `<div class="memorial-photo-item" onclick="alert('Photo: ${photo}')">${emoji} ${photo}</div>`;
        }).join('');
    }
    
    // Update achievements
    const achievementsContainer = document.getElementById('memorialAchievementsContainer');
    if (achievementsContainer && userData.achievements) {
        let achievementsHTML = '';
        const icons = {
            education: '🎓',
            hobbies: '🎨',
            family: '👨‍👩‍👧‍👦',
            legacy: '🌟'
        };
        const titles = {
            education: 'Education & Career',
            hobbies: 'Passions',
            family: 'Family & Community',
            legacy: 'Values & Legacy'
        };
        
        Object.entries(userData.achievements).forEach(([category, items]) => {
            if (items && items.length > 0) {
                achievementsHTML += `
                    <div class="memorial-achievement-group">
                        <h4>${icons[category]} ${titles[category]}</h4>
                        <ul>
                            ${items.map(item => `<li>${item}</li>`).join('')}
                        </ul>
                    </div>
                `;
            }
        });
        achievementsContainer.innerHTML = achievementsHTML;
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

// FIXED: Clear interval properly
function startOfferCountdown() {
    // Check if timer already exists
    if (document.getElementById('offerTimer')) {
        // Clear any existing interval
        if (offerCountdownInterval) {
            clearInterval(offerCountdownInterval);
            offerCountdownInterval = null;
        }
    }
    
    let seconds = 600; // 10 minutes
    
    const timerDisplay = document.getElementById('offerTimer');
    if (!timerDisplay) return;
    
    offerCountdownInterval = setInterval(() => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        
        if (timerDisplay) {
            timerDisplay.innerHTML = `
                <div style="font-size: 0.9rem; color: #4A6B70;">Limited Time Offer</div>
                <div style="font-size: 1.5rem; color: ${seconds < 60 ? '#E53E3E' : '#1DB5B5'};">
                    ${mins}:${secs.toString().padStart(2, '0')}
                </div>
                <div style="font-size: 0.8rem; color: #4A6B70;">50% discount expires soon!</div>
            `;
        }
        
        seconds--;
        
        if (seconds < 0) {
            clearInterval(offerCountdownInterval);
            offerCountdownInterval = null;
            if (timerDisplay) {
                timerDisplay.innerHTML = '<div style="color: #E53E3E;">Offer expired - Regular pricing applies</div>';
            }
        }
    }, 1000);
}

// Sign Up Function
function signUp() {
    // Create modal overlay
    const existingModal = document.querySelector('.signup-modal');
    if (existingModal) existingModal.remove();
    
    const modal = document.createElement('div');
    modal.className = 'signup-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2000;
    `;
    
    modal.innerHTML = `
        <div class="modal-content" style="
            background: white;
            padding: 2.5rem;
            border-radius: 16px;
            max-width: 500px;
            width: 90%;
            text-align: center;
            position: relative;
        ">
            <button onclick="this.closest('.signup-modal').remove()" style="
                position: absolute;
                top: 1rem;
                right: 1rem;
                background: none;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                color: #999;
            ">×</button>
            
            <h2 style="color: #1DB5B5; margin-bottom: 1rem;">Complete Your Legacy Protection</h2>
            <p style="color: #4A6B70; margin-bottom: 1.5rem;">
                ${userData.name}, you'll save $${(userData.monthlyTotal * 12).toFixed(2)}/year for ${userData.spouse}
            </p>
            
            <input type="email" id="modalSignupEmail" placeholder="Enter your email" style="
                width: 100%;
                padding: 1rem;
                border: 2px solid #E2E8F0;
                border-radius: 8px;
                margin-bottom: 1rem;
                font-size: 1rem;
            ">
            
            <button onclick="processModalSignup()" style="
                width: 100%;
                padding: 1rem;
                background: #FDB462;
                color: #1A2B2E;
                border: none;
                border-radius: 8px;
                font-size: 1.1rem;
                font-weight: 700;
                cursor: pointer;
            ">Secure My Legacy Now →</button>
            
            <p style="color: #4A6B70; margin-top: 1rem; font-size: 0.9rem;">
                No payment required during beta • Cancel anytime
            </p>
        </div>
    `;
    
    document.body.appendChild(modal);
    const emailInput = document.getElementById('modalSignupEmail');
    if (emailInput) emailInput.focus();
}

// Process signup from modal
function processModalSignup() {
    const email = document.getElementById('modalSignupEmail');
    if (!email) return;
    
    const emailValue = email.value;
    if (emailValue && emailValue.includes('@')) {
        const modal = document.querySelector('.signup-modal');
        if (!modal) return;
        
        const content = modal.querySelector('.modal-content');
        if (content) {
            content.innerHTML = `
                <div style="font-size: 4rem; color: #48BB78; margin-bottom: 1rem;">✓</div>
                <h2 style="color: #1DB5B5; margin-bottom: 1rem;">Welcome to EchoExit Beta!</h2>
                <p style="color: #4A6B70;">Check ${emailValue} for your exclusive access</p>
                <button onclick="this.closest('.signup-modal').remove()" style="
                    margin-top: 1.5rem;
                    padding: 0.8rem 2rem;
                    background: #1DB5B5;
                    color: white;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: 600;
                ">Got it!</button>
            `;
        }
    } else {
        email.style.borderColor = '#E53E3E';
        setTimeout(() => {
            const emailInput = document.getElementById('modalSignupEmail');
            if (emailInput) emailInput.style.borderColor = '#E2E8F0';
        }, 2000);
    }
}

// Restart demo function
function restartDemo() {
    // Clear any running intervals
    if (impactAnimationInterval) {
        clearInterval(impactAnimationInterval);
        impactAnimationInterval = null;
    }
    if (offerCountdownInterval) {
        clearInterval(offerCountdownInterval);
        offerCountdownInterval = null;
    }
    
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
    
    // Remove custom subscriptions
    userData.customSubscriptions = [];
    
    calculateTotal();
    scrollToTop();
}

function goToMainSite() {
    // Clear any running intervals before leaving
    if (impactAnimationInterval) {
        clearInterval(impactAnimationInterval);
        impactAnimationInterval = null;
    }
    if (offerCountdownInterval) {
        clearInterval(offerCountdownInterval);
        offerCountdownInterval = null;
    }
    
    window.location.href = 'index.html';
}

// Additional helper functions for inline features
function simulateMemoryAdd() {
    const memoriesSection = document.getElementById('memorial-memories');
    if (!memoriesSection) return;
    
    const memoriesContainer = document.getElementById('memories-container');
    if (!memoriesContainer) return;
    
    const memory = document.createElement('div');
    memory.style.cssText = `
        background: #F7FAFC;
        padding: 1rem;
        border-radius: 8px;
        margin: 1rem 0;
        animation: fadeIn 0.5s ease;
    `;
    memory.innerHTML = `
        <strong>Sarah ${userData.spouse === 'Sarah' ? 'Johnson' : userData.spouse}</strong>
        <p style="color: #4A6B70; font-size: 0.9rem; margin-top: 0.5rem;">
            "You were the best friend anyone could ask for. Your laughter still echoes in our hearts 💙"
        </p>
    `;
    
    memoriesContainer.appendChild(memory);
    
    // Switch to memories tab
    showMemorialSection('memories', document.querySelector('.memorial-nav-item:nth-child(4)'));
}

function showFeatureDetails(feature) {
    const details = {
        scheduled: "Schedule messages to be sent on specific dates like birthdays, anniversaries, or holidays. Your loved ones will receive your messages at just the right time, keeping your memory alive for years to come.",
        assets: "Designate who receives your digital photos, documents, cryptocurrency keys, and online accounts. Everything transfers automatically according to your wishes.",
        charity: "Set up recurring donations to causes you care about. Your charitable legacy continues making a difference even after you're gone.",
        book: "Transform your digital memorial into a beautiful hardcover book. Family members receive a physical keepsake with all your photos, stories, and messages."
    };
    
    if (details[feature]) {
        alert(details[feature]);
    }
}

function enhanceMessage() {
    const messageField = document.getElementById('finalMessage');
    if (!messageField) return;
    
    const original = messageField.value;
    const enhanced = original + "\n\nP.S. Remember that love transcends time and space. Though I may not be physically present, my love for you remains eternal. Live fully, laugh often, and know that you carry a piece of my heart with you always.";
    
    messageField.style.background = 'linear-gradient(135deg, rgba(29, 181, 181, 0.05), rgba(23, 153, 155, 0.02))';
    messageField.dataset.customized = 'true';
    
    setTimeout(() => {
        messageField.value = enhanced;
        messageField.style.background = 'white';
    }, 500);
}

// Clean up on page unload
window.addEventListener('beforeunload', function() {
    if (impactAnimationInterval) {
        clearInterval(impactAnimationInterval);
    }
    if (offerCountdownInterval) {
        clearInterval(offerCountdownInterval);
    }
});