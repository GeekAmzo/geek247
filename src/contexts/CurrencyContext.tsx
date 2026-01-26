import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

type Currency = 'ZAR' | 'USD';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  formatPrice: (zarAmount: number, usdAmount: number) => string;
  symbol: string;
  isLoading: boolean;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

// Exchange rate approximation (ZAR to USD) - update as needed
const ZAR_TO_USD = 0.055;

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<Currency>('ZAR');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Try to detect user's country
    const detectCountry = async () => {
      try {
        // Check localStorage first for user preference
        const savedCurrency = localStorage.getItem('geek247_currency') as Currency;
        if (savedCurrency) {
          setCurrency(savedCurrency);
          setIsLoading(false);
          return;
        }

        // Try to detect from timezone
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        if (timezone.includes('Johannesburg') || timezone.includes('Africa/Johannesburg')) {
          setCurrency('ZAR');
        } else {
          // For other African countries, use USD
          // Common African timezones
          const africanTimezones = [
            'Africa/Lagos', 'Africa/Nairobi', 'Africa/Cairo', 'Africa/Accra',
            'Africa/Casablanca', 'Africa/Algiers', 'Africa/Tunis', 'Africa/Addis_Ababa',
            'Africa/Dar_es_Salaam', 'Africa/Kampala', 'Africa/Lusaka', 'Africa/Harare',
            'Africa/Maputo', 'Africa/Windhoek', 'Africa/Gaborone', 'Africa/Maseru',
            'Africa/Mbabane', 'Africa/Blantyre', 'Africa/Kigali', 'Africa/Bujumbura'
          ];

          if (africanTimezones.some(tz => timezone.includes(tz))) {
            setCurrency('USD');
          } else if (timezone.includes('Africa/')) {
            setCurrency('USD');
          } else {
            // Default to ZAR for non-African visitors (they can switch)
            setCurrency('ZAR');
          }
        }
      } catch (error) {
        console.error('Error detecting country:', error);
        setCurrency('ZAR');
      } finally {
        setIsLoading(false);
      }
    };

    detectCountry();
  }, []);

  const handleSetCurrency = (newCurrency: Currency) => {
    setCurrency(newCurrency);
    localStorage.setItem('geek247_currency', newCurrency);
  };

  const formatPrice = (zarAmount: number, usdAmount: number): string => {
    if (currency === 'ZAR') {
      return `R${zarAmount.toLocaleString()}`;
    }
    return `$${usdAmount.toLocaleString()}`;
  };

  const symbol = currency === 'ZAR' ? 'R' : '$';

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency: handleSetCurrency,
        formatPrice,
        symbol,
        isLoading,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}
