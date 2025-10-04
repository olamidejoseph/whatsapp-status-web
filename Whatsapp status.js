// Clear console on load for clean debugging
console.clear();

// ===== DOM ELEMENTS =====
const statusText = document.getElementById('statusText');
const fontSelect = document.getElementById('fontSelect');
const fontSize = document.getElementById('fontSize');
const sizeValue = document.getElementById('sizeValue');
const fontColor = document.getElementById('fontColor');
const alignSelect = document.getElementById('alignSelect');
const bgColor = document.getElementById('bgColor');
const gradientBtn = document.getElementById('gradientBtn');
const bgImageUpload = document.getElementById('bgImageUpload');
const clearImageBtn = document.getElementById('clearImageBtn');
const preview = document.getElementById('preview');
const previewText = document.getElementById('previewText');
const downloadBtn = document.getElementById('downloadBtn');
const effectBtns = document.querySelectorAll('.effect-btn');

// ===== APPLICATION STATE =====
let currentEffect = 'normal';

// ===== INITIALIZATION =====
console.log('🚀 WhatsApp Status Maker Initialized');
updatePreview();

// ===== EVENT LISTENERS =====
statusText.addEventListener('input', updatePreview);
fontSelect.addEventListener('change', updatePreview);
fontSize.addEventListener('input', updatePreview);
fontColor.addEventListener('input', updatePreview);
alignSelect.addEventListener('change', updatePreview);
bgColor.addEventListener('input', setBackgroundColor);
gradientBtn.addEventListener('click', generateRandomGradient);
bgImageUpload.addEventListener('change', handleImageUpload);
clearImageBtn.addEventListener('click', clearBackgroundImage);
downloadBtn.addEventListener('click', downloadImage);

// Text effect buttons
effectBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        effectBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        currentEffect = this.dataset.effect;
        updatePreview();
    });
});

// Gradient preset buttons
document.querySelectorAll('.gradient').forEach(gradient => {
    gradient.addEventListener('click', function() {
        const gradientValue = this.dataset.gradient;
        console.log('Applying gradient preset:', gradientValue);
        
        // Clear all background properties first
        preview.style.background = 'none';
        preview.style.backgroundColor = 'transparent';
        preview.style.backgroundImage = 'none';
        
        // Apply gradient
        preview.style.background = gradientValue;
        
        // Clear file input
        bgImageUpload.value = '';
    });
});

// ===== CORE FUNCTIONS =====

function updatePreview() {
    previewText.textContent = statusText.value || 'Hello World! 🌟';
    previewText.style.fontFamily = fontSelect.value;
    previewText.style.fontSize = fontSize.value + 'px';
    previewText.style.color = fontColor.value;
    previewText.style.textAlign = alignSelect.value;
    sizeValue.textContent = fontSize.value + 'px';
    applyTextEffect();
}

function applyTextEffect() {
    // Reset all effects
    previewText.style.fontWeight = 'normal';
    previewText.style.fontStyle = 'normal';
    previewText.style.textDecoration = 'none';
    previewText.style.textShadow = 'none';
    
    switch(currentEffect) {
        case 'bold':
            previewText.style.fontWeight = 'bold';
            break;
        case 'italic':
            previewText.style.fontStyle = 'italic';
            break;
        case 'shadow':
            previewText.style.textShadow = '2px 2px 8px rgba(0,0,0,0.4)';
            break;
        case 'underline':
            previewText.style.textDecoration = 'underline';
            break;
    }
}

function generateRandomGradient() {
    const hue1 = Math.floor(Math.random() * 360);
    const hue2 = (hue1 + 60 + Math.floor(Math.random() * 120)) % 360;
    const hue3 = (hue2 + 60 + Math.floor(Math.random() * 120)) % 360;
    
    const gradient = `linear-gradient(135deg, 
        hsl(${hue1}, 80%, 60%), 
        hsl(${hue2}, 80%, 60%), 
        hsl(${hue3}, 80%, 60%)
    )`;
    
    console.log('Generated random gradient:', gradient);
    
    // Clear all background properties
    preview.style.background = 'none';
    preview.style.backgroundColor = 'transparent';
    preview.style.backgroundImage = 'none';
    
    // Apply gradient
    preview.style.background = gradient;
    
    // Clear file input
    bgImageUpload.value = '';
}

function setBackgroundColor() {
    const color = bgColor.value;
    console.log('Setting background color:', color);
    
    // Clear all background properties
    preview.style.background = 'none';
    preview.style.backgroundColor = 'transparent';
    preview.style.backgroundImage = 'none';
    
    // Apply solid color
    preview.style.backgroundColor = color;
    
    // Clear file input
    bgImageUpload.value = '';
}

function handleImageUpload(event) {
    const file = event.target.files[0];
    if (file) {
        console.log('Image selected:', file.name);
        const reader = new FileReader();
        
        reader.onload = function(e) {
            console.log('Applying image as background');
            
            // Clear all background properties
            preview.style.background = 'none';
            preview.style.backgroundColor = 'transparent';
            
            // Apply image
            preview.style.backgroundImage = `url(${e.target.result})`;
            preview.style.backgroundSize = 'cover';
            preview.style.backgroundPosition = 'center';
            preview.style.backgroundRepeat = 'no-repeat';
        };
        
        reader.readAsDataURL(file);
    }
}

function updateImageOpacityBasedOnText() {
    const previewText = document.getElementById('previewText');
    const previewSection = document.getElementById('preview');
    
    const textColor = getComputedStyle(previewText).color;
    const rgb = textColor.match(/\d+/g);
    
    if (rgb) {
        const brightness = (parseInt(rgb[0]) * 0.299 + 
                           parseInt(rgb[1]) * 0.587 + 
                           parseInt(rgb[2]) * 0.114);
        const brightnessPercent = (brightness / 255) * 100;
        
        // Invert: dark text = higher opacity, light text = lower opacity
        const opacity = Math.max(0.2, Math.min(0.8, brightnessPercent / 100));
        
        previewSection.style.setProperty('--image-opacity', opacity);
    }
}

function clearBackgroundImage() {
    console.log('Clearing background image');
    
    // Clear file input
    bgImageUpload.value = '';
    
    // Clear all background properties and restore default
    preview.style.backgroundImage = 'none';
    preview.style.background = 'linear-gradient(135deg, #667eea, #764ba2)';
    preview.style.backgroundSize = 'auto';
}

function downloadImage() {
    console.log('Starting image download process');
    
    const originalText = downloadBtn.innerHTML;
    downloadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating...';
    downloadBtn.disabled = true;
    
    html2canvas(preview, {
        scale: 2,
        useCORS: true,
        backgroundColor: null,
        logging: false
    }).then(canvas => {
        const link = document.createElement('a');
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        link.download = `whatsapp-status-${timestamp}.png`;
        link.href = canvas.toDataURL('image/png');
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        console.log('✅ Image downloaded successfully');
        
        downloadBtn.innerHTML = originalText;
        downloadBtn.disabled = false;
        
    }).catch(error => {
        console.error('❌ Error generating image:', error);
        downloadBtn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Try Again';
        downloadBtn.disabled = false;
        
        setTimeout(() => {
            downloadBtn.innerHTML = originalText;
        }, 2000);
    });
}

// Debug: Check if elements are properly connected
console.log('Preview element:', preview);
console.log('Gradient button:', gradientBtn);
console.log('Background color input:', bgColor);
console.log('Image upload:', bgImageUpload);

console.log('✅ WhatsApp Status Maker Ready!');