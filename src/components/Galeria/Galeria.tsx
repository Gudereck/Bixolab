import { motion } from 'framer-motion';
import './Galeria.scss';

export function Galeria() {
  const easeOutPremium = [0.16, 1, 0.3, 1] as const;

  return (
    <section id="galeria" className="galeria">
      <div className="container">
        <p className="section-label">Uniformes</p>
        <h2 className="section-title">
          Merch <span className="text-gradient">Universitário</span>
        </h2>
        <p className="section-subtitle">
          Camisetas de turma, estampas exclusivas e produção pensada para a vida na faculdade.
        </p>

        <div className="gallery-grid">
          <motion.figure
            initial={{ opacity: 0, clipPath: 'inset(0 0 100% 0)' }}
            whileInView={{ opacity: 1, clipPath: 'inset(0 0 0% 0)' }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 1.2, ease: easeOutPremium, delay: 0.08 }}
            className="gallery-item"
          >
            <img
              src="images/gallery-1.jpg"
              alt="Produção de estampas para camisetas universitárias"
              loading="lazy"
            />
            <figcaption>Produção artesanal</figcaption>
          </motion.figure>
          
          <motion.figure
            initial={{ opacity: 0, clipPath: 'inset(0 0 100% 0)' }}
            whileInView={{ opacity: 1, clipPath: 'inset(0 0 0% 0)' }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 1.2, ease: easeOutPremium, delay: 0.16 }}
            className="gallery-item gallery-item--tall"
          >
            <img
              src="images/gallery-2.jpg"
              alt="Estudantes universitários no campus"
              loading="lazy"
            />
            <figcaption>Vida universitária</figcaption>
          </motion.figure>
          
          <motion.figure
            initial={{ opacity: 0, clipPath: 'inset(0 0 100% 0)' }}
            whileInView={{ opacity: 1, clipPath: 'inset(0 0 0% 0)' }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 1.2, ease: easeOutPremium, delay: 0.24 }}
            className="gallery-item"
          >
            <img
              src="images/gallery-3.jpg"
              alt="Formatura universitária com turma reunida"
              loading="lazy"
            />
            <figcaption>Formatura & turmas</figcaption>
          </motion.figure>
        </div>
      </div>
    </section>
  );
}
