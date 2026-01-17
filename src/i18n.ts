import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Minimal translation resources for the MVP
// Minimal translation resources
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
      "categories.all": "Tümü",
      "home.title": "Seyhan Proje Portalı",
      "home.found_projects": "{{count}} Proje Bulundu",
      "home.found_projects_intent": "{{count}} Proje Bulundu ({{intent}} için önerilen)",
      "home.no_projects": "Aradığınız kriterlere uygun proje bulunamadı.",
      "project.similar": "Benzer Projeler",
      "footer.rights": "Seyhan Belediyesi. Tüm hakları saklıdır.",
      "footer.powered": "Yapay Zeka Destekli Proje Portalı v1.0"
    }
  },
  en: {
    translation: {
      "search.placeholder": "Search projects...",
      "categories.general": "General",
      "categories.agriculture": "Agriculture",
      "categories.technology": "Technology",
      "categories.social": "Social",
      "categories.culture": "Culture",
      "categories.health": "Health",
      "categories.disaster": "Disaster Management",
      "categories.urban": "Urbanization",
      "categories.all": "All",
      "home.title": "Seyhan Project Portal",
      "home.found_projects": "{{count}} Projects Found",
      "home.found_projects_intent": "{{count}} Projects Found (Suggested for {{intent}})",
      "home.no_projects": "No projects found matching your criteria.",
      "project.similar": "Similar Projects",
      "footer.rights": "Seyhan Municipality. All rights reserved.",
      "footer.powered": "AI-Powered Project Portal v1.0"
    }
  }
};

const savedLanguage = typeof window !== 'undefined' ? localStorage.getItem('i18nextLng') : null;

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: savedLanguage || "tr", 
    fallbackLng: "tr",
    interpolation: {
      escapeValue: false 
    },
    keySeparator: false,
    nsSeparator: false
  });

export default i18n;
