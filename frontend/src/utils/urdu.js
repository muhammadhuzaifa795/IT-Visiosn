// Urdu language detection and utilities

/**
 * Detects if the given text contains Urdu characters or common Urdu words
 */
export function isUrdu(text) {
  if (!text) return false;

  // Check for Arabic/Urdu Unicode range
  const urduRegex = /[\u0600-\u06FF]/;

  // Common Urdu words for detection
  const urduWords = [
    'سلام', 'کیا', 'ہے', 'میں', 'آپ', 'کیسے', 'ہو', 'کر', 'کے', 'سے',
    'نے', 'کو', 'پر', 'اور', 'یہ', 'وہ', 'جو', 'کہ', 'تو', 'بھی',
    'نہیں', 'ہیں', 'تھا', 'تھی', 'گا', 'گی', 'گے', 'دیا', 'لیا',
    'کیا', 'گیا', 'ہوا', 'ہوئی', 'ہوئے', 'کرنا', 'ہونا', 'جانا',
    'آنا', 'دینا', 'لینا', 'کہنا', 'دیکھنا', 'سننا', 'پڑھنا',
    'لکھنا', 'کھانا', 'پینا', 'سونا', 'اٹھنا', 'بیٹھنا', 'چلنا'
  ];

  // Check for Urdu script
  if (urduRegex.test(text)) {
    return true;
  }

  // Check for common Urdu words
  const lowerText = text.toLowerCase();
  return urduWords.some(word => lowerText.includes(word));
}

/**
 * Converts English numbers to Urdu numbers
 */
export function toUrduNumbers(text) {
  const englishToUrdu = {
    '0': '۰',
    '1': '۱',
    '2': '۲',
    '3': '۳',
    '4': '۴',
    '5': '۵',
    '6': '۶',
    '7': '۷',
    '8': '۸',
    '9': '۹'
  };

  return text.replace(/[0-9]/g, match => englishToUrdu[match] || match);
}

/**
 * Converts Urdu numbers to English numbers
 */
export function toEnglishNumbers(text) {
  const urduToEnglish = {
    '۰': '0',
    '۱': '1',
    '۲': '2',
    '۳': '3',
    '۴': '4',
    '۵': '5',
    '۶': '6',
    '۷': '7',
    '۸': '8',
    '۹': '9'
  };

  return text.replace(/[۰-۹]/g, match => urduToEnglish[match] || match);
}

/**
 * Common Urdu greetings and responses
 */
export const urduGreetings = {
  morning: [
    'صبح بخیر',
    'السلام علیکم',
    'آداب عرض ہے'
  ],
  evening: [
    'شام بخیر',
    'السلام علیکم'
  ],
  general: [
    'السلام علیکم',
    'آداب',
    'نمسکار'
  ]
};

/**
 * Common Urdu responses for JARVIS
 */
export const urduResponses = {
  greeting: [
    'وعلیکم السلام! آج میں آپ کی کیسے مدد کر سکتا ہوں؟',
    'آداب! کیا حال ہے؟',
    'سلام! میں JARVIS ہوں، آپ کا AI اسسٹنٹ۔'
  ],
  howAreYou: [
    'میں بہت اچھا ہوں، شکریہ! آپ کیسے ہیں؟',
    'الحمدللہ، سب ٹھیک ہے۔ آپ بتائیں؟',
    'میں تو AI ہوں، ہمیشہ تیار! آپ کا کیا حال ہے؟'
  ],
  help: [
    'میں آپ کی مدد کے لیے حاضر ہوں۔',
    'بتائیں، کیا کام ہے؟',
    'آپ کو کس چیز میں مدد چاہیے؟'
  ],
  thanks: [
    'کوئی بات نہیں!',
    'خوشی ہوئی مدد کر کے۔',
    'آپ کا شکریہ!'
  ],
  goodbye: [
    'اللہ حافظ!',
    'خدا حافظ، اچھا دن گزاریں۔',
    'الوداع! ضرورت ہو تو آواز دیں۔'
  ],
  error: [
    'معذرت، میں سمجھ نہیں سکا۔',
    'معاف کریں، دوبارہ کہیں؟',
    'مجھے یہ سمجھ نہیں آیا۔'
  ],
  processing: [
    'ذرا انتظار کریں...',
    'میں سوچ رہا ہوں...',
    'ایک منٹ...'
  ]
};

/**
 * Navigation commands in Urdu
 */
export const urduNavigationCommands = {
  'ڈیش بورڈ جاؤ': '/dashboard',
  'ڈیش بورڈ کھولو': '/dashboard',
  'میرا پروفائل': '/profile',
  'پروفائل دکھاؤ': '/profile',
  'سی وی بنانا': '/cv-builder',
  'سی وی بلڈر': '/cv-builder',
  'انٹرویو': '/interviews',
  'انٹرویو دکھاؤ': '/interviews',
  'نیٹ ورک': '/network',
  'میرا نیٹ ورک': '/network',
  'گھر جاؤ': '/',
  'ہوم پیج': '/',
  'مین پیج': '/'
};

/**
 * Time-based Urdu greetings
 */
export function getUrduGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) {
    return 'صبح بخیر!';
  } else if (hour < 17) {
    return 'دوپہر بخیر!';
  } else if (hour < 20) {
    return 'شام بخیر!';
  } else {
    return 'رات بخیر!';
  }
}

/**
 * Format time in Urdu
 */
export function formatTimeInUrdu(date = new Date()) {
  const hours = date.getHours();
  const minutes = date.getMinutes();

  const urduHours = toUrduNumbers(hours.toString());
  const urduMinutes = toUrduNumbers(minutes.toString().padStart(2, '0'));

  const period = hours < 12 ? 'صبح' : 'شام';
  const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;

  return `${toUrduNumbers(displayHours.toString())}:${urduMinutes} ${period}`;
}

/**
 * Format date in Urdu
 */
export function formatDateInUrdu(date = new Date()) {
  const months = [
    'جنوری', 'فروری', 'مارچ', 'اپریل', 'مئی', 'جون',
    'جولائی', 'اگست', 'ستمبر', 'اکتوبر', 'نومبر', 'دسمبر'
  ];

  const days = [
    'اتوار', 'پیر', 'منگل', 'بدھ', 'جمعرات', 'جمعہ', 'ہفتہ'
  ];

  const day = days[date.getDay()];
  const dateNum = toUrduNumbers(date.getDate().toString());
  const month = months[date.getMonth()];
  const year = toUrduNumbers(date.getFullYear().toString());

  return `${day}، ${dateNum} ${month} ${year}`;
}

/**
 * Get random response from array
 */
export function getRandomUrduResponse(responses) {
  return responses[Math.floor(Math.random() * responses.length)];
}

/**
 * Clean and normalize Urdu text
 */
export function normalizeUrduText(text) {
  return text
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/[۔،؍؎؏؞؟]/g, '');
}

/**
 * Check if text contains Urdu question words
 */
export function isUrduQuestion(text) {
  const questionWords = ['کیا', 'کیسے', 'کیوں', 'کب', 'کہاں', 'کون', 'کتنا', 'کتنی', 'کتنے'];
  const normalizedText = normalizeUrduText(text.toLowerCase());

  return questionWords.some(word => normalizedText.includes(word));
}

/**
 * Extract Urdu keywords from text
 */
export function extractUrduKeywords(text) {
  const keywords = [];
  const commonWords = ['اور', 'یا', 'کے', 'کو', 'سے', 'میں', 'پر', 'نے', 'کا', 'کی'];

  const words = normalizeUrduText(text).split(' ');

  for (const word of words) {
    if (word.length > 2 && !commonWords.includes(word) && /[\u0600-\u06FF]/.test(word)) {
      keywords.push(word);
    }
  }

  return keywords;
}
export function toRomanUrdu(englishText) {
  const mapping = {
    'hello': 'salam',
    'how are you': 'kaise ho',
    'good': 'acha',
    'bad': 'bura',
    'yes': 'haan',
    'no': 'nahi',
    'please': 'meherbani',
    'thank you': 'shukriya',
    'sorry': 'maaf karo',
    'help': 'madad',
    'time': 'waqt',
    'today': 'aaj',
    'tomorrow': 'kal',
    'yesterday': 'kal'
  };

  let result = englishText.toLowerCase();

  for (const [english, roman] of Object.entries(mapping)) {
    result = result.replace(new RegExp(english, 'g'), roman);
  }

  return result;
}
