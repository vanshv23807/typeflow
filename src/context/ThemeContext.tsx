import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeName, CaretStyle, FontFamily } from '../types';
import { sound } from '../services/sound';

interface ThemeContextType {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
  caretStyle: CaretStyle;
  setCaretStyle: (style: CaretStyle) => void;
  fontFamily: FontFamily;
  setFontFamily: (font: FontFamily) => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  liveHud: boolean;
  setLiveHud: (enabled: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeName>(() => {
    return (localStorage.getItem('typeflow_theme') as ThemeName) || 'midnight';
  });

  const [caretStyle, setCaretStyleState] = useState<CaretStyle>(() => {
    return (localStorage.getItem('typeflow_caret') as CaretStyle) || 'line';
  });

  const [fontFamily, setFontFamilyState] = useState<FontFamily>(() => {
    return (localStorage.getItem('typeflow_font') as FontFamily) || 'mono';
  });

  const [soundEnabled, setSoundEnabledState] = useState<boolean>(() => {
    const s = localStorage.getItem('typeflow_sound');
    return s === null ? true : s === 'true';
  });

  const [liveHud, setLiveHudState] = useState<boolean>(() => {
    const h = localStorage.getItem('typeflow_live_hud');
    return h === null ? true : h === 'true';
  });

  const setTheme = (t: ThemeName) => {
    setThemeState(t);
    localStorage.setItem('typeflow_theme', t);
    document.documentElement.setAttribute('data-theme', t);
  };

  const setCaretStyle = (c: CaretStyle) => {
    setCaretStyleState(c);
    localStorage.setItem('typeflow_caret', c);
  };

  const setFontFamily = (f: FontFamily) => {
    setFontFamilyState(f);
    localStorage.setItem('typeflow_font', f);
  };

  const setSoundEnabled = (s: boolean) => {
    setSoundEnabledState(s);
    localStorage.setItem('typeflow_sound', String(s));
    sound.enabled = s;
  };

  const setLiveHud = (h: boolean) => {
    setLiveHudState(h);
    localStorage.setItem('typeflow_live_hud', String(h));
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    sound.enabled = soundEnabled;
  }, [theme, soundEnabled]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        caretStyle,
        setCaretStyle,
        fontFamily,
        setFontFamily,
        soundEnabled,
        setSoundEnabled,
        liveHud,
        setLiveHud
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
