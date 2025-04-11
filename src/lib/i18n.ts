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
      earn: 'Earn',
      dashboard: 'Dashboard',
      withdraw: 'Withdraw',
      support: 'Support'
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
    earn: {
      title: 'Earn Diamonds',
      subtitle: 'Choose any of our offerwalls to start earning diamonds. Complete surveys, try apps, and more.',
      guaranteed: {
        title: 'Guaranteed Rewards',
        description: 'All completed offers are verified and rewarded automatically. Diamonds will be added to your account instantly.'
      },
      tips: {
        title: 'Important Tips',
        list: [
          'Use real information in surveys',
          'Complete offers until the end',
          'Don\'t use VPN or fake data'
        ]
      },
      button: 'Earn'
    },
    support: {
      title: 'Support Center',
      description: 'Need help? We\'re here for you!',
      categories: {
        faq: 'Frequently Asked Questions',
        contact: 'Contact Us',
        discord: 'Join our Discord'
      },
      faq: {
        title: 'FAQ',
        questions: [
          {
            q: 'How do I earn diamonds?',
            a: 'Complete offers from our offerwall partners. Each completed offer rewards you with diamonds.'
          },
          {
            q: 'When will I receive my diamonds?',
            a: 'Diamonds are credited automatically after offer completion, usually within a few minutes.'
          },
          {
            q: 'How do I withdraw my diamonds?',
            a: 'Go to the withdraw page, enter your Free Fire ID and the amount of diamonds you want to withdraw.'
          }
        ]
      }
    },
    withdraw: {
      title: 'Withdraw Diamonds',
      freeFireId: 'Free Fire ID',
      amount: 'Amount of Diamonds',
      submit: 'Request Withdrawal',
      important: 'Important Information',
      tips: [
        'Withdrawals are processed within 24 hours.',
        'Make sure to enter your Free Fire ID correctly.',
        'Minimum withdrawal amount is 100 diamonds.'
      ]
    }
  },
  es: {
    nav: {
      earn: 'Ganar',
      dashboard: 'Panel',
      withdraw: 'Retirar',
      support: 'Soporte'
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
    earn: {
      title: 'Ganar Diamantes',
      subtitle: 'Elige cualquiera de nuestros offerwalls para empezar a ganar diamantes. Completa encuestas, prueba aplicaciones y más.',
      guaranteed: {
        title: 'Recompensas Garantizadas',
        description: 'Todas las ofertas completadas son verificadas y recompensadas automáticamente. Los diamantes se añadirán a tu cuenta al instante.'
      },
      tips: {
        title: 'Consejos Importantes',
        list: [
          'Usa información real en las encuestas',
          'Completa las ofertas hasta el final',
          'No uses VPN o datos falsos'
        ]
      },
      button: 'Ganar'
    },
    support: {
      title: 'Centro de Soporte',
      description: '¿Necesitas ayuda? ¡Estamos aquí para ti!',
      categories: {
        faq: 'Preguntas Frecuentes',
        contact: 'Contáctanos',
        discord: 'Únete a Discord'
      },
      faq: {
        title: 'Preguntas Frecuentes',
        questions: [
          {
            q: '¿Cómo gano diamantes?',
            a: 'Completa ofertas de nuestros socios de offerwall. Cada oferta completada te recompensa con diamantes.'
          },
          {
            q: '¿Cuándo recibiré mis diamantes?',
            a: 'Los diamantes se acreditan automáticamente después de completar la oferta, generalmente en unos minutos.'
          },
          {
            q: '¿Cómo retiro mis diamantes?',
            a: 'Ve a la página de retiro, ingresa tu ID de Free Fire y la cantidad de diamantes que deseas retirar.'
          }
        ]
      }
    },
    withdraw: {
      title: 'Retirar Diamantes',
      freeFireId: 'ID de Free Fire',
      amount: 'Cantidad de Diamantes',
      submit: 'Solicitar Retiro',
      important: 'Información Importante',
      tips: [
        'Los retiros se procesan en un plazo de 24 horas.',
        'Asegúrate de ingresar correctamente tu ID de Free Fire.',
        'El monto mínimo de retiro es de 100 diamantes.'
      ]
    }
  }
};