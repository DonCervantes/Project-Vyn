import { useLanguage } from "@/i18n/useLanguage";
import type { SupportedLanguage } from "@/i18n/constants";

/** Small ES / EN pill toggle for page headers. Persists via useLanguage. */
const LanguageToggle = () => {
  const { language, changeLanguage, supportedLanguages } = useLanguage();

  return (
    <div
      className="flex items-center gap-0.5 bg-secondary rounded-full p-0.5 text-[11px] font-bold shrink-0"
      role="group"
      aria-label="Language"
      data-testid="language-toggle"
    >
      {supportedLanguages.map((lang: SupportedLanguage) => (
        <button
          key={lang}
          type="button"
          onClick={() => changeLanguage(lang)}
          aria-pressed={language === lang}
          data-testid={`lang-${lang}`}
          className={`px-2.5 py-1 rounded-full uppercase tracking-wide transition-colors ${
            language === lang
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {lang}
        </button>
      ))}
    </div>
  );
};

export default LanguageToggle;
