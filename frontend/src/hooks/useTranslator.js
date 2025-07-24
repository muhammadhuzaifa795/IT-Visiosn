import { useState } from 'react';

const useTranslator = () => {
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationError, setTranslationError] = useState(null);

  const translateText = async (text, fromLang = 'ur', toLang = 'en') => {
    if (!text.trim()) return '';
    
    setIsTranslating(true);
    setTranslationError(null);

    try {
      // Using Google Translate API (you can replace with your preferred translation service)
      const response = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${fromLang}|${toLang}`
      );
      
      if (!response.ok) {
        throw new Error('Translation service unavailable');
      }
      
      const data = await response.json();
      
      if (data.responseStatus === 200) {
        return data.responseData.translatedText;
      } else {
        throw new Error('Translation failed');
      }
    } catch (error) {
      console.error('Translation error:', error);
      setTranslationError(error.message);
      
      // Fallback: Simple character replacement for basic Urdu words
      const urduToEnglishMap = {
        'سلام': 'hello',
        'شکریہ': 'thank you',
        'نام': 'name',
        'کام': 'work',
        'گھر': 'home',
        'پانی': 'water',
        'کھانا': 'food',
        'کتاب': 'book',
        'اسکول': 'school',
        'دوست': 'friend',
        'خوش': 'happy',
        'اچھا': 'good',
        'برا': 'bad',
        'بڑا': 'big',
        'چھوٹا': 'small'
      };
      
      let translatedText = text;
      Object.entries(urduToEnglishMap).forEach(([urdu, english]) => {
        translatedText = translatedText.replace(new RegExp(urdu, 'g'), english);
      });
      
      return translatedText !== text ? translatedText : text;
    } finally {
      setIsTranslating(false);
    }
  };

  const detectLanguage = (text) => {
    // Simple Urdu detection based on Unicode ranges
    const urduRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/;
    return urduRegex.test(text);
  };

  return {
    translateText,
    detectLanguage,
    isTranslating,
    translationError
  };
};

export default useTranslator;