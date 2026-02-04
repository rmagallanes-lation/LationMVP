import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { motion } from 'framer-motion';

const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'pt', name: 'Português', flag: '🇧🇷' },
];

export const LanguageToggle = () => {
    const { i18n, t } = useTranslation();

    const changeLanguage = (languageCode: string) => {
        i18n.changeLanguage(languageCode);
    };

    const currentLanguage = languages.find((lang) => lang.code === i18n.language) || languages[0];

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2 h-9 px-3"
                >
                    <Globe className="h-4 w-4" />
                    <span className="hidden sm:inline-block">{currentLanguage.flag} {currentLanguage.code.toUpperCase()}</span>
                    <span className="sm:hidden">{currentLanguage.flag}</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[180px]">
                {languages.map((language) => (
                    <DropdownMenuItem
                        key={language.code}
                        onClick={() => changeLanguage(language.code)}
                        className="cursor-pointer gap-2"
                    >
                        <motion.div
                            className="flex items-center gap-2 w-full"
                            whileHover={{ x: 2 }}
                            transition={{ duration: 0.2 }}
                        >
                            <span className="text-lg">{language.flag}</span>
                            <span className="flex-1">{language.name}</span>
                            {i18n.language === language.code && (
                                <motion.span
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="text-primary"
                                >
                                    ✓
                                </motion.span>
                            )}
                        </motion.div>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
