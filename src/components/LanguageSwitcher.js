import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useTranslation } from 'react-i18next';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";
import { Globe } from 'lucide-react';
export function LanguageSwitcher() {
    const { i18n } = useTranslation();
    const languages = [
        { code: 'en', name: 'English' },
        { code: 'nl', name: 'Nederlands' },
    ];
    const handleLanguageChange = (value) => {
        i18n.changeLanguage(value);
        // Store the language preference
        localStorage.setItem('preferredLanguage', value);
    };
    return (_jsxs(Select, { defaultValue: i18n.language, onValueChange: handleLanguageChange, children: [_jsx(SelectTrigger, { className: "w-[140px] bg-white", children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Globe, { className: "h-4 w-4" }), _jsx(SelectValue, {})] }) }), _jsx(SelectContent, { children: languages.map((lang) => (_jsx(SelectItem, { value: lang.code, children: lang.name }, lang.code))) })] }));
}
