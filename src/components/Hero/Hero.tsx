import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DinoIcon } from '../DinoIcon/DinoIcon';
import { Magnetic } from '../Magnetic/Magnetic';
import './Hero.scss';

export function Hero() {
  const [activeColor, setActiveColor] = useState<'green' | 'cream' | 'charcoal'>('green');

  const colors = [
    { id: 'green', name: 'Verde Bixo', hex: '#1b4332' },
    { id: 'cream', name: 'Creme College', hex: '#e9dcc4' },
    { id: 'charcoal', name: 'Grafite Lenda', hex: '#2c332e' },
  ] as const;

  return (
    <>
      <section id="home" className="hero">
        <div className="hero-bg-elements">
          <div className="grid-pattern"></div>
          <div className="glow-orb orb-1"></div>
          <div className="glow-orb orb-2"></div>
        </div>

        <div className="container hero-container">
          <div className="hero-content">
            <div className="badge animate-fade-up">
              <DinoIcon className="badge-dino" /> Desde 2016
            </div>
            <h1 className="hero-title animate-fade-up delay-1">
              Bixo Hoje,<br />
              <span className="text-gradient">Lenda Amanhã.</span>
            </h1>
            <p className="hero-subtitle animate-fade-up delay-2">
              As camisetas mais legais da sua vida, na fase mais legal da sua vida.
            </p>
            <div className="hero-cta animate-fade-up delay-3">
              <Magnetic>
                <a href="#como-funciona" className="btn-primary">
                  Como Funciona
                </a>
              </Magnetic>
              <a
                href="https://forms.gle/UrhEj3qoyig9MP3t8"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost"
              >
                Pedidos Coletivos <i className="fa-solid fa-arrow-right"></i>
              </a>
            </div>
            <div className="hero-stats animate-fade-up delay-3">
              <div className="stat">
                <strong>10+</strong>
                <span>Anos de história</span>
              </div>
              <div className="stat">
                <strong>500+</strong>
                <span>Turmas atendidas</span>
              </div>
              <div className="stat">
                <strong>1ª</strong>
                <span>Loja física</span>
              </div>
            </div>
          </div>

          <div className="hero-image animate-fade-up delay-2">
            <div className="hero-photo-wrapper">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeColor}
                  initial={{ scale: 0.95, opacity: 0.8, filter: 'blur(3px)' }}
                  animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
                  exit={{ scale: 0.95, opacity: 0.8, filter: 'blur(3px)' }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                  className="hero-photo glass-card"
                >
                  <img
                    src="images/hero-shirt.jpg"
                    alt="Grupo de universitários usando camisetas da turma"
                    loading="eager"
                  />
                  <div className={`hero-photo-color-overlay ${activeColor}`} />
                </motion.div>
              </AnimatePresence>
              <div className="floating-tag">
                <i className="fa-solid fa-graduation-cap"></i> Camisetas de Turma
              </div>
            </div>

            {/* Seletor de Cores */}
            <div className="color-selector-wrapper">
              <span className="color-label">Cores do Merch:</span>
              <div className="color-buttons">
                {colors.map((color) => (
                  <Magnetic key={color.id} range={35} strength={0.35}>
                    <button
                      className={`color-btn ${activeColor === color.id ? 'active' : ''}`}
                      onClick={() => setActiveColor(color.id)}
                      style={{ '--color-hex': color.hex } as React.CSSProperties}
                      aria-label={`Mudar cor para ${color.name}`}
                      title={color.name}
                    />
                  </Magnetic>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Marquee */}
      <div className="marquee-section" aria-hidden="true">
        <div className="marquee">
          <div className="marquee-track">
            <span>Estilo Colegial</span>
            <span className="dot">•</span>
            <span>Qualidade Premium</span>
            <span className="dot">•</span>
            <span>Design Personalizado</span>
            <span className="dot">•</span>
            <span>Entrega Garantida</span>
            <span className="dot">•</span>
          </div>
          <div className="marquee-track">
            <span>Estilo Colegial</span>
            <span className="dot">•</span>
            <span>Qualidade Premium</span>
            <span className="dot">•</span>
            <span>Design Personalizado</span>
            <span className="dot">•</span>
            <span>Entrega Garantida</span>
            <span className="dot">•</span>
          </div>
        </div>
      </div>
    </>
  );
}
