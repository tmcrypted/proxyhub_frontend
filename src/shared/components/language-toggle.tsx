import type { Language } from "@/shared/locales";
import { Button } from "./ui/button";
import { useTranslation } from "react-i18next";
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";

const languages = [
  { code: "en" as Language, name: "English" },
  { code: "ru" as Language, name: "Русский" },
];

export function LanguageToggle() {
  const { i18n } = useTranslation();


  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="flex items-center gap-2">
          <span>
            {languages
              .find((lang) => lang.code === i18n.language)
              ?.code.toUpperCase() || "EN"}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[180px]">
        <DropdownMenuRadioGroup
          value={i18n.language}
          onValueChange={(value) => i18n.changeLanguage(value as Language)}
        >
          {languages.map((language) => (
            <DropdownMenuRadioItem key={language.code} value={language.code}>
              {language.name}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
