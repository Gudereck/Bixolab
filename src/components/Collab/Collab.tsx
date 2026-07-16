import { motion } from 'framer-motion';
import { Magnetic } from '../Magnetic/Magnetic';
import './Collab.scss';

export function Collab() {
  const easeOutPremium = [0.16, 1, 0.3, 1] as const;

  return (
    <section id="collab" className="collab">
      <div className="container">
        <div className="collab-grid">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.8, ease: easeOutPremium }}
            className="collab-content"
          >
            <p className="section-label">Parcerias</p>
            <h2 className="section-title">
              Collab <span className="text-gradient">Bixo Lab</span>
            </h2>
            <p>
              Quer levar a identidade da Bixo Lab para o seu evento, atlética ou projeto? Fazemos parcerias
              personalizadas com marcas, universidades e coletivos.
            </p>
            <p>Criamos peças exclusivas que conectam sua comunidade com o estilo colegial que só a gente faz.</p>

            <div className="collab-features">
              <div className="feature-item">
                <div className="feature-icon">
                  <i className="fa-solid fa-handshake"></i>
                </div>
                <div>
                  <strong>Parcerias exclusivas</strong>
                  <span>Designs únicos para o seu evento ou marca</span>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon">
                  <i className="fa-solid fa-users"></i>
                </div>
                <div>
                  <strong>Produção em escala</strong>
                  <span>Do pedido pequeno ao grande lote para atléticas</span>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon">
                  <i className="fa-solid fa-palette"></i>
                </div>
                <div>
                  <strong>Identidade visual</strong>
                  <span>Arte original alinhada com a sua marca</span>
                </div>
              </div>
            </div>

            <Magnetic>
              <a
                href="https://wa.link/cqiozw"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
              >
                <i className="fa-brands fa-whatsapp"></i> Quero fazer Collab
              </a>
            </Magnetic>
          </motion.div>

          {/* Cards de collab animados sequencialmente no scroll */}
          <div className="collab-visual">
            <motion.div
              initial={{ opacity: 0, clipPath: 'inset(0 0 100% 0)' }}
              whileInView={{ opacity: 1, clipPath: 'inset(0 0 0% 0)' }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 1.2, ease: easeOutPremium, delay: 0.08 }}
              className="collab-card glass-card"
            >
              <img src="images/collab-university.jpg" alt="Parcerias com universidades" loading="lazy" />
              <span>Universidades</span>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, clipPath: 'inset(0 0 100% 0)' }}
              whileInView={{ opacity: 1, clipPath: 'inset(0 0 0% 0)' }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 1.2, ease: easeOutPremium, delay: 0.16 }}
              className="collab-card glass-card"
            >
              <img src="images/collab-athletics.jpg" alt="Parcerias com atléticas" loading="lazy" />
              <span>Atléticas</span>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, clipPath: 'inset(0 0 100% 0)' }}
              whileInView={{ opacity: 1, clipPath: 'inset(0 0 0% 0)' }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 1.2, ease: easeOutPremium, delay: 0.24 }}
              className="collab-card glass-card"
            >
              <img src="images/collab-events.jpg" alt="Parcerias com eventos" loading="lazy" />
              <span>Eventos</span>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
