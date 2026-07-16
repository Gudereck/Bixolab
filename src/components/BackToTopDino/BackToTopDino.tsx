import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DinoIcon } from '../DinoIcon/DinoIcon';
import './BackToTopDino.scss';

export function BackToTopDino() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    toggleVisibility(); // Initial check

    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          onClick={scrollToTop}
          className="back-to-top-dino glass-card"
          aria-label="Voltar para o topo"
          title="Voltar para o topo"
          whileHover="hover"
          whileTap="tap"
        >
          {/* Dino Mascot with interactive hover wiggle */}
          <motion.div
            variants={{
              hover: {
                rotate: [0, -12, 10, -8, 6, 0],
                transition: { duration: 0.5, ease: 'easeInOut' },
              },
              tap: { scale: 0.9 },
            }}
          >
            <DinoIcon className="back-to-top-icon" />
          </motion.div>
          
          <span className="tooltip-text">Topo</span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
