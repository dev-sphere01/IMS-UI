import React, { createContext, useState, useContext, useEffect } from 'react';

// Define available themes
const themes = {
  teal: {
    name: 'Teal',
    primary: 'teal',
    secondary: 'cyan',
    accent: 'emerald',
    highlight: 'sky',
    isDark: false,
    colors: {
      primary: {
        50: 'bg-teal-50',
        100: 'bg-teal-100',
        200: 'bg-teal-200',
        300: 'bg-teal-300',
        400: 'bg-teal-400',
        500: 'bg-teal-500',
        600: 'bg-teal-600',
        700: 'bg-teal-700',
        800: 'bg-teal-800',
        900: 'bg-teal-900',
      },
      text: {
        primary: 'text-teal-700',
        secondary: 'text-teal-600',
        light: 'text-teal-500',
        dark: 'text-teal-900',
        white: 'text-white',
      },
      background: {
        page: 'from-white to-teal-50',
        card: 'bg-white',
        header: 'bg-white',
      },
      border: {
        light: 'border-teal-100',
        medium: 'border-teal-200',
        dark: 'border-teal-300',
      },
      gradient: {
        sidebar: 'from-teal-600 to-teal-400',
        topnav: 'from-teal-600 to-teal-400',
        card: 'from-teal-500 to-cyan-500',
      }
    }
  },
  green: {
    name: 'Green',
    primary: 'green',
    secondary: 'emerald',
    accent: 'lime',
    highlight: 'teal',
    isDark: false,
    colors: {
      primary: {
        50: 'bg-green-50',
        100: 'bg-green-100',
        200: 'bg-green-200',
        300: 'bg-green-300',
        400: 'bg-green-400',
        500: 'bg-green-500',
        600: 'bg-green-600',
        700: 'bg-green-700',
        800: 'bg-green-800',
        900: 'bg-green-900',
      },
      text: {
        primary: 'text-green-700',
        secondary: 'text-green-600',
        light: 'text-green-500',
        dark: 'text-green-900',
        white: 'text-white',
      },
      background: {
        page: 'from-white to-green-50',
        card: 'bg-white',
        header: 'bg-white',
      },
      border: {
        light: 'border-green-100',
        medium: 'border-green-200',
        dark: 'border-green-300',
      },
      gradient: {
        sidebar: 'from-green-600 to-green-400',
        topnav: 'from-green-600 to-emerald-500',
        card: 'from-green-500 to-emerald-500',
      }
    }
  },
  purple: {
    name: 'Purple',
    primary: 'purple',
    secondary: 'violet',
    accent: 'fuchsia',
    highlight: 'pink',
    isDark: false,
    colors: {
      primary: {
        50: 'bg-purple-50',
        100: 'bg-purple-100',
        200: 'bg-purple-200',
        300: 'bg-purple-300',
        400: 'bg-purple-400',
        500: 'bg-purple-500',
        600: 'bg-purple-600',
        700: 'bg-purple-700',
        800: 'bg-purple-800',
        900: 'bg-purple-900',
      },
      text: {
        primary: 'text-purple-700',
        secondary: 'text-purple-600',
        light: 'text-purple-500',
        dark: 'text-purple-900',
        white: 'text-white',
      },
      background: {
        page: 'from-white to-purple-50',
        card: 'bg-white',
        header: 'bg-white',
      },
      border: {
        light: 'border-purple-100',
        medium: 'border-purple-200',
        dark: 'border-purple-300',
      },
      gradient: {
        sidebar: 'from-purple-600 to-purple-400',
        topnav: 'from-purple-600 to-violet-500',
        card: 'from-purple-500 to-violet-500',
      }
    }
  },
  blue: {
    name: 'Blue',
    primary: 'blue',
    secondary: 'sky',
    accent: 'indigo',
    highlight: 'cyan',
    isDark: false,
    colors: {
      primary: {
        50: 'bg-blue-50',
        100: 'bg-blue-100',
        200: 'bg-blue-200',
        300: 'bg-blue-300',
        400: 'bg-blue-400',
        500: 'bg-blue-500',
        600: 'bg-blue-600',
        700: 'bg-blue-700',
        800: 'bg-blue-800',
        900: 'bg-blue-900',
      },
      text: {
        primary: 'text-blue-700',
        secondary: 'text-blue-600',
        light: 'text-blue-500',
        dark: 'text-blue-900',
        white: 'text-white',
      },
      background: {
        page: 'from-white to-blue-50',
        card: 'bg-white',
        header: 'bg-white',
      },
      border: {
        light: 'border-blue-100',
        medium: 'border-blue-200',
        dark: 'border-blue-300',
      },
      gradient: {
        sidebar: 'from-blue-600 to-blue-400',
        topnav: 'from-blue-600 to-sky-500',
        card: 'from-blue-500 to-sky-500',
      }
    }
  },
  amber: {
    name: 'Amber',
    primary: 'amber',
    secondary: 'orange',
    accent: 'yellow',
    highlight: 'red',
    isDark: false,
    colors: {
      primary: {
        50: 'bg-amber-50',
        100: 'bg-amber-100',
        200: 'bg-amber-200',
        300: 'bg-amber-300',
        400: 'bg-amber-400',
        500: 'bg-amber-500',
        600: 'bg-amber-600',
        700: 'bg-amber-700',
        800: 'bg-amber-800',
        900: 'bg-amber-900',
      },
      text: {
        primary: 'text-amber-700',
        secondary: 'text-amber-600',
        light: 'text-amber-500',
        dark: 'text-amber-900',
        white: 'text-white',
      },
      background: {
        page: 'from-white to-amber-50',
        card: 'bg-white',
        header: 'bg-white',
      },
      border: {
        light: 'border-amber-100',
        medium: 'border-amber-200',
        dark: 'border-amber-300',
      },
      gradient: {
        sidebar: 'from-amber-600 to-amber-400',
        topnav: 'from-amber-600 to-orange-500',
        card: 'from-amber-500 to-orange-500',
      }
    }
  },
  rose: {
    name: 'Rose',
    primary: 'rose',
    secondary: 'pink',
    accent: 'fuchsia',
    highlight: 'red',
    isDark: false,
    colors: {
      primary: {
        50: 'bg-rose-50',
        100: 'bg-rose-100',
        200: 'bg-rose-200',
        300: 'bg-rose-300',
        400: 'bg-rose-400',
        500: 'bg-rose-500',
        600: 'bg-rose-600',
        700: 'bg-rose-700',
        800: 'bg-rose-800',
        900: 'bg-rose-900',
      },
      text: {
        primary: 'text-rose-700',
        secondary: 'text-rose-600',
        light: 'text-rose-500',
        dark: 'text-rose-900',
        white: 'text-white',
      },
      background: {
        page: 'from-white to-rose-50',
        card: 'bg-white',
        header: 'bg-white',
      },
      border: {
        light: 'border-rose-100',
        medium: 'border-rose-200',
        dark: 'border-rose-300',
      },
      gradient: {
        sidebar: 'from-rose-600 to-rose-400',
        topnav: 'from-rose-600 to-pink-500',
        card: 'from-rose-500 to-pink-500',
      }
    }
  },
  dark: {
    name: 'Dark',
    primary: 'gray',
    secondary: 'slate',
    accent: 'zinc',
    highlight: 'stone',
    isDark: true,
    colors: {
      primary: {
        50: 'bg-gray-800',
        100: 'bg-gray-700',
        200: 'bg-gray-600',
        300: 'bg-gray-500',
        400: 'bg-gray-400',
        500: 'bg-gray-500',
        600: 'bg-gray-600',
        700: 'bg-gray-700',
        800: 'bg-gray-800',
        900: 'bg-gray-900',
      },
      text: {
        primary: 'text-white',
        secondary: 'text-gray-300',
        light: 'text-gray-400',
        dark: 'text-gray-900',
        white: 'text-white',
      },
      background: {
        page: 'from-gray-900 to-gray-800',
        card: 'bg-gray-800',
        header: 'bg-gray-800',
      },
      border: {
        light: 'border-gray-700',
        medium: 'border-gray-600',
        dark: 'border-gray-500',
      },
      gradient: {
        sidebar: 'from-gray-800 to-gray-700',
        topnav: 'from-gray-800 to-gray-700',
        card: 'from-gray-700 to-gray-600',
      }
    }
  },
  darkBlue: {
    name: 'Dark Blue',
    primary: 'blue',
    secondary: 'indigo',
    accent: 'violet',
    highlight: 'purple',
    isDark: true,
    colors: {
      primary: {
        50: 'bg-blue-900',
        100: 'bg-blue-800',
        200: 'bg-blue-700',
        300: 'bg-blue-600',
        400: 'bg-blue-500',
        500: 'bg-blue-500',
        600: 'bg-blue-600',
        700: 'bg-blue-700',
        800: 'bg-blue-800',
        900: 'bg-blue-900',
      },
      text: {
        primary: 'text-white',
        secondary: 'text-blue-200',
        light: 'text-blue-300',
        dark: 'text-blue-900',
        white: 'text-white',
      },
      background: {
        page: 'from-gray-900 to-blue-900',
        card: 'bg-gray-800',
        header: 'bg-gray-800',
      },
      border: {
        light: 'border-blue-800',
        medium: 'border-blue-700',
        dark: 'border-blue-600',
      },
      gradient: {
        sidebar: 'from-blue-900 to-blue-800',
        topnav: 'from-blue-900 to-indigo-800',
        card: 'from-blue-800 to-indigo-800',
      }
    }
  },
  darkPurple: {
    name: 'Dark Purple',
    primary: 'purple',
    secondary: 'violet',
    accent: 'fuchsia',
    highlight: 'pink',
    isDark: true,
    colors: {
      primary: {
        50: 'bg-purple-900',
        100: 'bg-purple-800',
        200: 'bg-purple-700',
        300: 'bg-purple-600',
        400: 'bg-purple-500',
        500: 'bg-purple-500',
        600: 'bg-purple-600',
        700: 'bg-purple-700',
        800: 'bg-purple-800',
        900: 'bg-purple-900',
      },
      text: {
        primary: 'text-white',
        secondary: 'text-purple-200',
        light: 'text-purple-300',
        dark: 'text-purple-900',
        white: 'text-white',
      },
      background: {
        page: 'from-gray-900 to-purple-900',
        card: 'bg-gray-800',
        header: 'bg-gray-800',
      },
      border: {
        light: 'border-purple-800',
        medium: 'border-purple-700',
        dark: 'border-purple-600',
      },
      gradient: {
        sidebar: 'from-purple-900 to-purple-800',
        topnav: 'from-purple-900 to-violet-800',
        card: 'from-purple-800 to-violet-800',
      }
    }
  }
};

// Create the context
const ThemeContext = createContext();

// Create a provider component
export const ThemeProvider = ({ children }) => {
  // Get theme from localStorage or use default
  const [currentTheme, setCurrentTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme && themes[savedTheme] ? savedTheme : 'teal';
  });

  // Change theme function
  const changeTheme = (themeName) => {
    if (themes[themeName]) {
      setCurrentTheme(themeName);
      localStorage.setItem('theme', themeName);

      // Add or remove dark class from document for dark mode
      if (themes[themeName].isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  };

  // Apply dark mode class on initial load
  useEffect(() => {
    if (themes[currentTheme].isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [currentTheme]);

  // Value to be provided to consumers
  const value = {
    currentTheme,
    theme: themes[currentTheme],
    changeTheme,
    themes
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use the theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
