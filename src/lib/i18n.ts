import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Language = 'en' | 'es';

interface LanguageState {
  language: Language;
  setLanguage: (lang: Language) => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      language: 'en',
      setLanguage: (lang) => set({ language: lang }),
    }),
    {
      name: 'language-store',
    }
  )
);

export const translations = {
  en: {
    nav: {
      earn: 'EARN',
      dashboard: 'DASHBOARD',
      withdraw: 'WITHDRAW',
      support: 'SUPPORT',
      login: 'LOGIN'
    },
    welcome: {
      title: 'Welcome to FF Rewards!',
      message: 'Join our Discord community for more information and updates.',
      discord: 'Join Discord',
      close: 'Close'
    },
    home: {
      title: 'Earn Free Fire Diamonds',
      subtitle: 'Complete offers and surveys to earn free diamonds',
      features: {
        earn: {
          title: 'Earn Diamonds',
          description: 'Complete offers from our advertising partners and earn diamonds instantly'
        },
        withdraw: {
          title: 'Fast Withdrawals',
          description: 'Withdraw your diamonds directly to your Free Fire account'
        },
        daily: {
          title: 'Daily Offers',
          description: 'New offers every day to maximize your earnings'
        }
      },
      login: 'Login with Discord'
    },
    support: {
      description: 'Find answers to commonly asked questions about FF Rewards',
      faq: {
        title: 'Frequently Asked Questions',
        questions: [
          {
            q: 'How do I earn diamonds?',
            a: 'You can earn diamonds by completing offers from our advertising partners. Each completed offer will reward you with a specific amount of diamonds.'
          },
          {
            q: 'How long do withdrawals take?',
            a: 'Withdrawals are typically processed within 24 hours. Once approved, diamonds are sent directly to your Free Fire account.'
          },
          {
            q: 'What is the minimum withdrawal amount?',
            a: 'The minimum withdrawal amount is 100 diamonds. This helps us process withdrawals more efficiently.'
          },
          {
            q: 'Why was my withdrawal rejected?',
            a: 'Withdrawals may be rejected if the Free Fire ID is incorrect or if there are suspicious activities on the account. Contact support for more information.'
          }
        ]
      }
    }
  },
  es: {
    nav: {
      earn: 'GANAR',
      dashboard: 'PANEL',
      withdraw: 'RETIRAR',
      support: 'SOPORTE',
      login: 'ENTRAR'
    },
    welcome: {
      title: '¡Bienvenido a FF Rewards!',
      message: 'Únete a nuestra comunidad de Discord para más información y actualizaciones.',
      discord: 'Unirse a Discord',
      close: 'Cerrar'
    },
    home: {
      title: 'Gana Diamantes Free Fire',
      subtitle: 'Completa ofertas y encuestas para ganar diamantes gratis',
      features: {
        earn: {
          title: 'Gana Diamantes',
          description: 'Completa ofertas de nuestros socios publicitarios y gana diamantes instantáneamente'
        },
        withdraw: {
          title: 'Retiros Rápidos',
          description: 'Retira tus diamantes directamente a tu cuenta de Free Fire'
        },
        daily: {
          title: 'Ofertas Diarias',
          description: 'Nuevas ofertas todos los días para maximizar tus ganancias'
        }
      },
      login: 'Iniciar sesión con Discord'
    },
    support: {
      description: 'Encuentra respuestas a preguntas frecuentes sobre FF Rewards',
      faq: {
        title: 'Preguntas Frecuentes',
        questions: [
          {
            q: '¿Cómo gano diamantes?',
            a: 'Puedes ganar diamantes completando ofertas de nuestros socios publicitarios. Cada oferta completada te recompensará con una cantidad específica de diamantes.'
          },
          {
            q: '¿Cuánto tardan los retiros?',
            a: 'Los retiros generalmente se procesan dentro de las 24 horas. Una vez aprobados, los diamantes se envían directamente a tu cuenta de Free Fire.'
          },
          {
            q: '¿Cuál es el monto mínimo de retiro?',
            a: 'El monto mínimo de retiro es de 100 diamantes. Esto nos ayuda a procesar los retiros de manera más eficiente.'
          },
          {
            q: '¿Por qué fue rechazado mi retiro?',
            a: 'Los retiros pueden ser rechazados si el ID de Free Fire es incorrecto o si hay actividades sospechosas en la cuenta. Contacta a soporte para más información.'
          }
        ]
      }
    }
  }
};