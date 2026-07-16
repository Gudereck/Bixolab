import { motion } from 'framer-motion';
import './Orcamento.scss';

export function Orcamento() {
  const easeOutPremium = [0.16, 1, 0.3, 1] as const;

  return (
    <section id="orcamento" className="orcamento">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.8, ease: easeOutPremium }}
          className="cta-box"
        >
          <p className="section-label">Orçamento</p>
          <h2>Pronto para criar o merch da sua turma?</h2>
          <p>
            Solicite um orçamento sem compromisso. Atendemos pedidos coletivos e individuais com condições
            especiais para universitários.
          </p>
          <div className="cta-actions">
            <a
              href="https://wa.link/cqiozw"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline"
            >
              <i className="fa-brands fa-whatsapp"></i> Falar no WhatsApp
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
