import { motion } from 'framer-motion';
import { Moon, Palette, Sun } from 'lucide-react';
import { useApp, ThemePreset } from '@/context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const themes: { value: ThemePreset; label: string; swatches: string[]; description: string }[] = [
  {
    value: 'sunrise',
    label: 'Sunrise Spice',
    swatches: ['hsl(4 90% 58%)', 'hsl(28 100% 55%)', 'hsl(45 100% 52%)'],
    description: 'Warm, energetic canteen palette with high contrast.',
  },
  {
    value: 'ocean',
    label: 'Ocean Fresh',
    swatches: ['hsl(198 84% 42%)', 'hsl(186 83% 41%)', 'hsl(168 68% 42%)'],
    description: 'Cool and clean tones for a calmer browsing experience.',
  },
  {
    value: 'forest',
    label: 'Forest Basil',
    swatches: ['hsl(150 54% 34%)', 'hsl(39 86% 49%)', 'hsl(26 84% 50%)'],
    description: 'Earthy green palette inspired by fresh ingredients.',
  },
  {
    value: 'cocoa',
    label: 'Cocoa Roast',
    swatches: ['hsl(14 74% 45%)', 'hsl(30 89% 48%)', 'hsl(45 85% 52%)'],
    description: 'Rich cafe-inspired tones with bold accent highlights.',
  },
];

const SettingsPage = () => {
  const { isDark, toggleTheme, themePreset, setThemePreset } = useApp();

  return (
    <div className="container py-6 px-4 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="font-display text-2xl text-gradient mb-2">Personal Settings</h1>
        <p className="text-muted-foreground text-sm">Adjust colors and appearance for your preferred ordering experience.</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Sun className="w-4 h-4" />
                Appearance Mode
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">Switch between light and dark base mode.</p>
              <Button
                onClick={toggleTheme}
                variant="outline"
                className="w-full justify-start gap-2"
              >
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                {isDark ? 'Use Light Mode' : 'Use Dark Mode'}
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Palette className="w-4 h-4" />
                Theme Palette
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {themes.map((theme) => {
                  const selected = themePreset === theme.value;
                  return (
                    <button
                      key={theme.value}
                      type="button"
                      onClick={() => setThemePreset(theme.value)}
                      className={`text-left rounded-xl border p-3 transition-all ${
                        selected ? 'border-primary shadow-md bg-primary/5' : 'border-border hover:border-primary/40'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-semibold text-sm">{theme.label}</p>
                        {selected && <span className="text-xs text-primary font-semibold">Selected</span>}
                      </div>
                      <div className="flex items-center gap-1.5 mb-2">
                        {theme.swatches.map((swatch) => (
                          <span
                            key={swatch}
                            className="w-6 h-6 rounded-full border border-black/10"
                            style={{ background: swatch }}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground">{theme.description}</p>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default SettingsPage;
