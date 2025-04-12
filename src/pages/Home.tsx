import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../lib/auth';
import { useDiscordAuth } from '../lib/discord';

const Home = () => {
  const { isAuthenticated } = useAuthStore();
  const { login } = useDiscordAuth();
  const [currentLetterIndex, setCurrentLetterIndex] = React.useState(-1);

  const title = "DYBLIT";

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentLetterIndex((prev) => (prev + 1) % (title.length + 1));
    }, 150); // Más rápido: reducido de 2000ms a 150ms

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative min-h-[80vh] flex flex-col items-center justify-center">
      {/* Floating Cloud */}
      <motion.img
        src="/assets/clouds.png"
        alt="Floating Cloud"
        className="absolute w-96" // Más grande: cambiado de w-64 a w-96
        animate={{
          y: [0, -30, 0], // Más movimiento vertical
          x: [-20, 20, -20], // Más movimiento horizontal
          rotate: [-2, 2, -2] // Añadido rotación suave
        }}
        transition={{
          duration: 8, // Más lento: aumentado de 6s a 8s
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{
          filter: 'brightness(0.8) contrast(1.2)'
        }}
      />

      {/* Animated Title */}
      <div className="text-6xl md:text-8xl font-bold relative z-10 flex">
        {title.split('').map((letter, index) => (
          <AnimatePresence key={index} mode="wait">
            <motion.span
              initial={{ opacity: 1, y: 0 }}
              animate={{
                opacity: currentLetterIndex === index ? 0 : 1,
                y: currentLetterIndex === index ? 20 : 0
              }}
              exit={{ opacity: 0, y: -20 }}
              transition={{
                duration: 0.2, // Más rápido: reducido de 0.3s a 0.2s
                ease: "easeInOut"
              }}
              className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-orange-400"
              style={{ width: '1em', textAlign: 'center' }}
              whileHover={{
                scale: 1.2,
                transition: { duration: 0.2 }
              }}
            >
              {letter}
            </motion.span>
          </AnimatePresence>
        ))}
      </div>

      {/* Start Now Button */}
      {!isAuthenticated && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          onClick={() => login()}
          className="mt-12 px-8 py-4 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl text-white font-bold text-xl shadow-lg hover:shadow-red-500/20 transition-all duration-300 hover:scale-105"
        >
          START NOW
        </motion.button>
      )}
    </div>
  );
};

export default Home;