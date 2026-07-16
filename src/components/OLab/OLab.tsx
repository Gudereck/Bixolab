import { motion } from 'framer-motion';
import { DinoIcon } from '../DinoIcon/DinoIcon';
import './OLab.scss';

export function OLab() {
  const easeOutPremium = [0.16, 1, 0.3, 1] as const;

  return (
    <section id="o-lab" className="o-lab">
      <div className="container">
        <div className="lab-grid">
          <motion.div
            initial={{ opacity: 0, clipPath: 'inset(0 0 100% 0)' }}
            whileInView={{ opacity: 1, clipPath: 'inset(0 0 0% 0)' }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 1.2, ease: easeOutPremium, delay: 0.08 }}
            className="lab-image"
          >
            <div className="image-wrapper-outer">
              {/* Peek Dino Mascot espiando por trás da foto */}
              <motion.div
                className="peeking-dino-mascot-wrapper"
                initial={{ y: 35, rotate: 18 }}
                whileInView={{ y: 0, rotate: 18 }}
                whileHover={{ y: -15, rotate: 8 }}
                transition={{ type: 'spring', stiffness: 180, damping: 10 }}
              >
                <DinoIcon className="peeking-dino-mascot" />
              </motion.div>

              <div className="image-wrapper">
                <img src="images/lab-store.jpg" alt="Loja de uniformes e camisetas universitárias" loading="lazy" />
                <div className="lab-overlay"></div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.8, ease: easeOutPremium, delay: 0.16 }}
            className="lab-content"
          >
            <p className="section-label">Nossa história</p>
            <h2 className="section-title text-left">
              O <span className="text-gradient">Lab</span>
            </h2>
            <p className="lead-text">
              Parece até que a gente tá chegando agora, mas na verdade a Bixo existe desde 2016.
            </p>
            <p>
              Acompanhamos milhares de alunos em sua jornada acadêmica, fazendo o merch de centenas de clientes
              e assim seguimos, agora pela primeira vez com uma loja física animal pra receber vocês, nossos
              queridos bixos e bixetes. Nos vemos lá!
            </p>

            <div className="location-box glass-card">
              <i className="fa-solid fa-location-dot"></i>
              <div>
                <strong>Nossa Loja</strong>
                <span>Av Antonio Neto, 2688 — Divinópolis, MG</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
