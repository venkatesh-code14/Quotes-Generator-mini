/**
 * Smart Quote Generator
 * This version uses a sidebar for mood selection and a local library of quotes
 * for a fast, reliable, and user-friendly experience.
 */

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
        { quote: "I have decided to stick with love. Hate is too great a burden to bear.", person: "Martin Luther King Jr." },
        { quote: "To love and be loved is to feel the sun from both sides.", person: "David Viscott" },
        { quote: "You know you're in love when you can't fall asleep because reality is finally better than your dreams.", person: "Dr. Seuss" },
        { quote: "The giving of love is an education in itself.", person: "Eleanor Roosevelt" },
        { quote: "Love is composed of a single soul inhabiting two bodies.", person: "Aristotle" },
        { quote: "To be brave is to love someone unconditionally, without expecting anything in return.", person: "Madonna" },
        { quote: "The art of love is largely the art of persistence.", person: "Albert Ellis" },
        { quote: "If I know what love is, it is because of you.", person: "Hermann Hesse" },
        { quote: "Love is not just looking at each other, it's looking in the same direction.", person: "Antoine de Saint-Exupéry" }
    ],
    happiness: [
        { quote: "For every minute you are angry you lose sixty seconds of happiness.", person: "Ralph Waldo Emerson" },
        { quote: "The purpose of our lives is to be happy.", person: "Dalai Lama" },
        { quote: "Happiness is not something ready made. It comes from your own actions.", person: "Dalai Lama" },
        { quote: "The very act of accepting responsibility is a source of happiness.", person: "His Holiness the 14th Dalai Lama" },
        { quote: "Happiness is when what you think, what you say, and what you do are in harmony.", person: "Mahatma Gandhi" },
        { quote: "There is only one happiness in this life, to love and be loved.", person: "George Sand" },
        { quote: "The greatest happiness you can have is knowing that you do not necessarily require happiness.", person: "William Saroyan" },
        { quote: "Be happy for this moment. This moment is your life.", person: "Omar Khayyam" },
        { quote: "Happiness depends upon ourselves.", person: "Aristotle" },
        { quote: "It is not how much we have, but how much we enjoy, that makes happiness.", person: "Charles Spurgeon" }
    ],
    inspirational: [
        { quote: "The best way to predict the future is to create it.", person: "Peter Drucker" },
        { quote: "Believe you can and you're halfway there.", person: "Theodore Roosevelt" },
        { quote: "The only way to do great work is to love what you do.", person: "Steve Jobs" },
        { quote: "Success is not final, failure is not fatal: it is the courage to continue that counts.", person: "Winston Churchill" },
        { quote: "It does not matter how slowly you go as long as you do not stop.", person: "Confucius" },
        { quote: "Everything you’ve ever wanted is on the other side of fear.", person: "George Addair" },
        { quote: "Hardships often prepare ordinary people for an extraordinary destiny.", person: "C.S. Lewis" },
        { quote: "The future belongs to those who believe in the beauty of their dreams.", person: "Eleanor Roosevelt" },
        { quote: "You are never too old to set another goal or to dream a new dream.", person: "C.S. Lewis" },
        { quote: "What you get by achieving your goals is not as important as what you become by achieving your goals.", person: "Zig Ziglar" }
    ],
    wisdom: [
        { quote: "The only true wisdom is in knowing you know nothing.", person: "Socrates" },
        { quote: "The journey of a thousand miles begins with a single step.", person: "Lao Tzu" },
        { quote: "Knowing yourself is the beginning of all wisdom.", person: "Aristotle" },
        { quote: "Count your age by friends, not years. Count your life by smiles, not tears.", person: "John Lennon" },
        { quote: "The unexamined life is not worth living.", person: "Socrates" },
        { quote: "Turn your wounds into wisdom.", person: "Oprah Winfrey" },
        { quote: "Yesterday I was clever, so I wanted to change the world. Today I am wise, so I am changing myself.", person: "Rumi" },
        { quote: "It is the mark of an educated mind to be able to entertain a thought without accepting it.", person: "Aristotle" },
        { quote: "The fool doth think he is wise, but the wise man knows himself to be a fool.", person: "William Shakespeare" },
        { quote: "Never let your sense of morals prevent you from doing what is right.", person: "Isaac Asimov" }
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

// --- CORE FUNCTIONS ---

/**
 * Displays a new random quote AND background from a specified mood library.
 * This is the central function for updating content.
 * @param {string} tag - The category of quote to display (e.g., 'love').
 */
function displayNewQuote(tag) {
    currentMood = tag; // Update the current mood
    
    // Visually update the active button in the sidebar
    moodButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tag === tag);
    });

    const quoteLibrary = quotesByMood[tag];
    const backgroundLibrary = backgroundsByMood[tag];
    if (!quoteLibrary || quoteLibrary.length === 0) return;

    // --- Select and display a random quote ---
    const randomQuoteIndex = Math.floor(Math.random() * quoteLibrary.length);
    const quoteData = quoteLibrary[randomQuoteIndex];
    currentQuote = { id: quoteData.quote, quote: quoteData.quote, person: quoteData.person };
    updateQuoteText(currentQuote.quote, currentQuote.person);
    checkIfFavorited();

    // --- Select and apply a random background for the chosen mood ---
    if (backgroundLibrary && backgroundLibrary.length > 0) {
        const randomBgIndex = Math.floor(Math.random() * backgroundLibrary.length);
        const newBackground = backgroundLibrary[randomBgIndex];
        changeBackground(newBackground);
    }
}

/**
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

/**
 * Changes the background with a smooth cross-fade effect.
 */
function changeBackground(newBackground) {
    const hiddenBg = (activeBg === 1) ? bg2 : bg1;
    const activeBgEl = (activeBg === 1) ? bg1 : bg2;
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
function getFavorites() { return JSON.parse(localStorage.getItem('favoriteQuotes')) || []; }

function toggleFavorite() {
    if (!currentQuote.id || currentQuote.id === 'custom') return;
    let favorites = getFavorites();
    const isFavorited = favorites.some(fav => fav.id === currentQuote.id);

    if (isFavorited) {
        favorites = favorites.filter(fav => fav.id !== currentQuote.id);
    } else {
        favorites.push(currentQuote);
    }
    localStorage.setItem('favoriteQuotes', JSON.stringify(favorites));
    checkIfFavorited();
}

function checkIfFavorited() {
    const favorites = getFavorites();
    const isFavorited = currentQuote.id && favorites.some(fav => fav.id === currentQuote.id);
    favoriteBtn.classList.toggle('favorited', isFavorited);
    favoriteBtn.innerHTML = isFavorited ? '<i class="fas fa-heart"></i>' : '<i class="fa-regular fa-heart"></i>';
}

function displayFavorites() {
    const favorites = getFavorites();
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

newQuoteBtn.addEventListener('click', () => displayNewQuote(currentMood)); // Get another quote from the current mood
favoriteBtn.addEventListener('click', toggleFavorite);
viewFavoritesBtn.addEventListener('click', () => {
    displayFavorites();
    favoritesPanel.classList.add('open');
});
closeFavoritesBtn.addEventListener('click', () => {
    favoritesPanel.classList.remove('open');
});
showCustomQuoteBtn.addEventListener('click', () => {
    const quote = customQuoteText.value || "You forgot to write a quote!";
    const person = customQuotePerson.value || "Anonymous";
    currentQuote = { id: 'custom', quote, person };
    updateQuoteText(quote, person);
    const backgroundColor = analyzeQuoteSentiment(quote);
    changeBackground(backgroundColor);
    checkIfFavorited();
});


// --- INITIALIZATION ---
/**
 * Sets up the application when the page first loads.
 * Displays a default quote so the page isn't empty.
 */
function initializeApp() {
    // Load an inspirational quote by default
    displayNewQuote('inspirational');
}

document.addEventListener('DOMContentLoaded', initializeApp);