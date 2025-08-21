
// --- DOM ELEMENT SELECTORS ---
const moodButtons = document.querySelectorAll('.mood-btn');
const quoteWrapper = document.querySelector('.quote-wrapper');
const quoteEl = document.querySelector('.quote');
const personEl = document.querySelector('.person');
const newQuoteBtn = document.getElementById('new-quote-btn');
const bg1 = document.getElementById('bg-1');
const bg2 = document.getElementById('bg-2');
const favoriteBtn = document.getElementById('favorite-btn');
const viewFavoritesBtn = document.getElementById('view-favorites-btn');
const favoritesPanel = document.getElementById('favorites-panel');
const closeFavoritesBtn = document.getElementById('close-favorites-btn');
const favoritesList = document.getElementById('favorites-list');
const customQuoteText = document.getElementById('custom-quote-text');
const customQuotePerson = document.getElementById('custom-quote-person');
const showCustomQuoteBtn = document.getElementById('show-custom-quote');

// --- STATE & DATA ---
let activeBg = 1;
let currentQuote = {};
let currentMood = 'inspirational'; // Default mood on page load

// --- LOCAL DATA LIBRARIES (Quotes and Backgrounds) ---
const quotesByMood = {
    love: [
        { quote: "The best thing to hold onto in life is each other.", person: "Audrey Hepburn" },
        { quote: "To love and be loved is to feel the sun from both sides.", person: "David Viscott" },
        { quote: "You know you're in love when you can't fall asleep because reality is finally better than your dreams.", person: "Dr. Seuss" },
        { quote: "Love is composed of a single soul inhabiting two bodies.", person: "Aristotle" },
        { quote: "If I know what love is, it is because of you.", person: "Hermann Hesse" }
    ],
    happiness: [
        { quote: "For every minute you are angry you lose sixty seconds of happiness.", person: "Ralph Waldo Emerson" },
        { quote: "The purpose of our lives is to be happy.", person: "Dalai Lama" },
        { quote: "Happiness is not something ready made. It comes from your own actions.", person: "Dalai Lama" },
        { quote: "Be happy for this moment. This moment is your life.", person: "Omar Khayyam" },
        { quote: "It is not how much we have, but how much we enjoy, that makes happiness.", person: "Charles Spurgeon" }
    ],
    inspirational: [
        { quote: "The best way to predict the future is to create it.", person: "Peter Drucker" },
        { quote: "Believe you can and you're halfway there.", person: "Theodore Roosevelt" },
        { quote: "The only way to do great work is to love what you do.", person: "Steve Jobs" },
        { quote: "Success is not final, failure is not fatal: it is the courage to continue that counts.", person: "Winston Churchill" },
        { quote: "Everything you’ve ever wanted is on the other side of fear.", person: "George Addair" }
    ],
    wisdom: [
        { quote: "The only true wisdom is in knowing you know nothing.", person: "Socrates" },
        { quote: "The journey of a thousand miles begins with a single step.", person: "Lao Tzu" },
        { quote: "Knowing yourself is the beginning of all wisdom.", person: "Aristotle" },
        { quote: "Yesterday I was clever, so I wanted to change the world. Today I am wise, so I am changing myself.", person: "Rumi" },
        { quote: "The fool doth think he is wise, but the wise man knows himself to be a fool.", person: "William Shakespeare" }
    ]
};

const backgroundsByMood = {
    love: [
        'url(https://images.unsplash.com/photo-1524253482453-1256417d4745?auto=format&fit=crop)',
        'url(https://images.unsplash.com/photo-1502104034323-73316a457a42?auto=format&fit=crop)'
    ],
    happiness: [
        'url(https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop)',
        'url(https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop)'
    ],
    inspirational: [
        'url(https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop)',
        'url(https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop)'
    ],
    wisdom: [
        'url(https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop)',
        'url(https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?auto=format&fit=crop)'
    ]
};

const sentimentKeywords = {
    positive: { color: '#FFD700', words: ['happy', 'success', 'joy', 'love', 'amazing', 'great', 'courage', 'shine'] },
    negative: { color: '#4682B4', words: ['sad', 'failure', 'pain', 'lost', 'never', 'dark', 'alone'] },
    calm: { color: '#2E8B57', words: ['peace', 'calm', 'rest', 'silent', 'still', 'serene', 'breathe'] }
};
const defaultColor = '#556B2F';



/**
 * Displays a new random quote AND background from a specified mood library.
 */
function displayNewQuote(tag) {
    // FIX: Ensure the favorite button is visible for generated quotes.
    favoriteBtn.style.display = 'block';
    
    currentMood = tag;
    moodButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tag === tag);
    });
    
    // FIX: Update the "New Quote" button text to be more descriptive.
    newQuoteBtn.textContent = `New ${tag.charAt(0).toUpperCase() + tag.slice(1)} Quote`;

    const quoteLibrary = quotesByMood[tag];
    const backgroundLibrary = backgroundsByMood[tag];
    if (!quoteLibrary || quoteLibrary.length === 0) return;

    const randomQuoteIndex = Math.floor(Math.random() * quoteLibrary.length);
    const quoteData = quoteLibrary[randomQuoteIndex];
    currentQuote = { id: quoteData.quote, quote: quoteData.quote, person: quoteData.person };
    updateQuoteText(currentQuote.quote, currentQuote.person);
    checkIfFavorited();

    if (backgroundLibrary && backgroundLibrary.length > 0) {
        const randomBgIndex = Math.floor(Math.random() * backgroundLibrary.length);
        const newBackground = backgroundLibrary[randomBgIndex];
        changeBackground(newBackground);
    }
}

/*
 * Updates the quote text in the UI with a fade effect.
 */
function updateQuoteText(quote, person) {
    quoteWrapper.style.opacity = 0;
    setTimeout(() => {
        quoteEl.textContent = `“${quote}”`;
        personEl.textContent = `—${person}`;
        quoteWrapper.style.opacity = 1;
    }, 400);
}

/*
 * Changes the background with a smooth cross-fade effect.
 * This function contains the crucial bug fix.
 */
function changeBackground(newBackground) {
    const hiddenBg = (activeBg === 1) ? bg2 : bg1;
    const activeBgEl = (activeBg === 1) ? bg1 : bg2;

    // FIX: These two lines reset the hidden layer completely before applying a new background.
    // This prevents a solid color from getting "stuck" when you want to show an image next.
    hiddenBg.style.backgroundImage = 'none';
    hiddenBg.style.backgroundColor = 'transparent';

    if (newBackground.startsWith('url')) {
        const img = new Image();
        img.src = newBackground.slice(5, -2);
        img.onload = () => {
            hiddenBg.style.backgroundImage = newBackground;
            activeBgEl.style.opacity = 0;
            hiddenBg.style.opacity = 1;
            activeBg = (activeBg === 1) ? 2 : 1;
        };
    } else {
        hiddenBg.style.backgroundColor = newBackground;
        activeBgEl.style.opacity = 0;
        hiddenBg.style.opacity = 1;
        activeBg = (activeBg === 1) ? 2 : 1;
    }
}

// --- FAVORITES (localStorage) FUNCTIONS ---

/**
 * Retrieves the array of favorite quotes from localStorage.
 * @returns {Array} - The array of favorite quotes.
 */
function getFavorites() {
    return JSON.parse(localStorage.getItem('favoriteQuotes')) || [];
}

/**
 * Adds or removes the current quote from the favorites list.
 */
function toggleFavorite() {
    // CHANGE: This now allows quotes with any ID (including custom ones) to be saved.
    if (!currentQuote.id){ return;
    // ... rest of the function
    }

    let favorites = getFavorites();
    const isFavorited = favorites.some(fav => fav.id === currentQuote.id);

    if (isFavorited) {
        // If it's already a favorite, remove it
        favorites = favorites.filter(fav => fav.id !== currentQuote.id);
    } else {
        // If it's not a favorite, add it
        favorites.push(currentQuote);
    }
    
    // Save the updated list back to localStorage
    localStorage.setItem('favoriteQuotes', JSON.stringify(favorites));
    checkIfFavorited();
}

/**
 * Updates the heart icon's appearance based on whether the current quote is a favorite.
 */
function checkIfFavorited() {
    const favorites = getFavorites();
    const isFavorited = currentQuote.id && favorites.some(fav => fav.id === currentQuote.id);
    favoriteBtn.classList.toggle('favorited', isFavorited);
    favoriteBtn.innerHTML = isFavorited ? '<i class="fas fa-heart"></i>' : '<i class="fa-regular fa-heart"></i>';
}

/**
 * Displays the list of saved quotes in the favorites panel.
 */
function displayFavorites() {
    const favorites = getFavorites();

    // THIS IS THE MOST IMPORTANT FIX:
    // This line clears the list completely before adding the items back.
    // This prevents duplicates from showing up.
    favoritesList.innerHTML = '';

    if (favorites.length === 0) {
        favoritesList.innerHTML = '<p>You haven\'t saved any favorites yet.</p>';
        return;
    }

    favorites.forEach(fav => {
        const item = document.createElement('div');
        item.classList.add('favorite-item');
        item.innerHTML = `<p>"${fav.quote}"</p><span>—${fav.person}</span>`;
        favoritesList.appendChild(item);
    });
}

// --- CUSTOM QUOTE FUNCTIONS ---
function analyzeQuoteSentiment(text) {
    const lowerCaseText = text.toLowerCase();
    for (const sentiment in sentimentKeywords) {
        if (sentimentKeywords[sentiment].words.some(word => lowerCaseText.includes(word))) {
            return sentimentKeywords[sentiment].color;
        }
    }
    return defaultColor;
}

// --- EVENT LISTENERS ---
moodButtons.forEach(button => {
    button.addEventListener('click', () => {
        const selectedTag = button.dataset.tag;
        displayNewQuote(selectedTag);
    });
});
newQuoteBtn.addEventListener('click', () => displayNewQuote(currentMood));
favoriteBtn.addEventListener('click', toggleFavorite);
viewFavoritesBtn.addEventListener('click', () => {
    displayFavorites();
    favoritesPanel.classList.add('open');

});

// THIS IS THE FIX: Add this event listener for the close button
closeFavoritesBtn.addEventListener('click', () => {
    favoritesPanel.classList.remove('open');
});
showCustomQuoteBtn.addEventListener('click', () => {
    const quote = customQuoteText.value || "You forgot to write a quote!";
    const person = customQuotePerson.value || "Anonymous";

    // CHANGE #1: Ensure the favorite button is now visible.
    favoriteBtn.style.display = 'block';

    // CHANGE #2: Give the custom quote a unique ID (using its own text).
    currentQuote = { id: quote, quote, person };
    
    updateQuoteText(quote, person);
    const backgroundColor = analyzeQuoteSentiment(quote);
    changeBackground(backgroundColor);

    // CHANGE #3: Check if this custom quote has been favorited before.
    checkIfFavorited();
});

// --- INITIALIZATION ---
function initializeApp() {
    displayNewQuote('inspirational');
}
document.addEventListener('DOMContentLoaded', initializeApp);