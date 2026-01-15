import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Minimal translation resources for the MVP
const resources = {
  tr: {
    translation: {
      "search.placeholder": "Proje ara...",
      "categories.general": "Genel",
      "categories.agriculture": "Tarım",
      "categories.technology": "Teknoloji",
      "categories.social": "Sosyal",
      "categories.culture": "Kültür",
      "categories.health": "Sağlık",
      "categories.disaster": "Afet Yönetimi",
      "categories.urban": "Kentleşme",
      "categories.all": "Tümü"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "tr", 
    fallbackLng: "tr",
    interpolation: {
      escapeValue: false 
    }
  });

export default i18n;
