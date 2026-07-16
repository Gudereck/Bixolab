import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './ComoFunciona.scss';

export function ComoFunciona() {
  const [activeTab, setActiveTab] = useState<'coletivo' | 'individual'>('coletivo');
  const easeOutPremium = [0.16, 1, 0.3, 1] as const;

  const customTransition = {
    duration: 0.35,
    ease: easeOutPremium,
  };

  // Variants for staggered timeline steps
  const timelineContainerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const timelineStepVariants = {
    hidden: { opacity: 0, y: 16 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring' as const,
        stiffness: 200,
        damping: 18,
      },
    },
  };

  return (
    <section id="como-funciona" className="como-funciona">
      <div className="container">
        <p className="section-label">Processo</p>
        <h2 className="section-title">
          Como <span className="text-gradient">Funciona</span>
        </h2>
        <p className="section-subtitle">
          Do design à entrega, cuidamos de cada detalhe para que sua turma tenha o merch perfeito.
        </p>

        {/* Cards de Processo com Revelação no Scroll via Framer Motion */}
        <div className="steps-grid">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.8, ease: easeOutPremium, delay: 0.08 }}
            className="step-card glass-card"
          >
            <span className="step-number">01</span>
            <div className="step-icon">
              <i className="fa-solid fa-pen-nib"></i>
            </div>
            <h3>Design</h3>
            <p>
              Nossa equipe cria a arte perfeita que representa a sua turma ou curso com um estilo
              colegial premium.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.8, ease: easeOutPremium, delay: 0.16 }}
            className="step-card glass-card"
          >
            <span className="step-number">02</span>
            <div className="step-icon">
              <i className="fa-solid fa-clipboard-check"></i>
            </div>
            <h3>Orçamento</h3>
            <p>
              Fazemos orçamentos para pedidos coletivos ou individuais, adequados para o bolso do
              universitário.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.8, ease: easeOutPremium, delay: 0.24 }}
            className="step-card glass-card"
          >
            <span className="step-number">03</span>
            <div className="step-icon">
              <i className="fa-solid fa-box-open"></i>
            </div>
            <h3>Produção & Entrega</h3>
            <p>
              Usamos tecidos e estampas de alta qualidade para garantir que as camisetas durem toda a
              faculdade.
            </p>
          </motion.div>
        </div>

        {/* Seção de Tipo de Pedido */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.8, ease: easeOutPremium, delay: 0.1 }}
          className="order-type-section"
        >
          <h3 className="order-section-title">Como pedir seu merch</h3>
          <p className="order-section-subtitle">
            Temos condições e fluxos diferentes para pedidos individuais ou em grupo.
          </p>

          {/* Abas (Tabs) */}
          <div className="tabs-container">
            <button
              className={`tab-btn ${activeTab === 'coletivo' ? 'active' : ''}`}
              onClick={() => setActiveTab('coletivo')}
              type="button"
            >
              <i className="fa-solid fa-users"></i> Pedido Coletivo (Turma)
            </button>
            <button
              className={`tab-btn ${activeTab === 'individual' ? 'active' : ''}`}
              onClick={() => setActiveTab('individual')}
              type="button"
            >
              <i className="fa-solid fa-shirt"></i> Pedido Individual
            </button>
          </div>

          {/* Conteúdo da Aba Ativa com Framer Motion (Fade, Slide & Blur) */}
          <div className="tab-content-wrapper glass-card">
            <AnimatePresence mode="wait">
              {activeTab === 'coletivo' && (
                <motion.div
                  key="coletivo"
                  initial={{ opacity: 0, y: 12, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -12, filter: 'blur(4px)' }}
                  transition={customTransition}
                  className="tab-pane"
                >
                  <div className="pane-header">
                    <span className="badge-role">
                      <i className="fa-solid fa-graduation-cap"></i> Fluxo Coletivo
                    </span>
                    <h4>Vai pedir em grupo? Bora organizar isso do jeito certo.</h4>
                    <p>
                      Para pedidos coletivos, nós trabalhamos com um intermediário principal — o nosso{' '}
                      <strong>REPRESENTANTE</strong>. É ele quem representa a turma, reúne os interesses e
                      entra em contato com a gente para dar início ao processo.
                    </p>
                  </div>

                  <div className="timeline-container">
                    <h5 className="timeline-title">
                      <i className="fa-solid fa-bezier-curve"></i> Segue o Fio
                    </h5>

                    {/* Timeline steps animadas com stagger robusto */}
                    <motion.div
                      variants={timelineContainerVariants}
                      initial="hidden"
                      animate="show"
                      className="timeline-steps"
                    >
                      <motion.div variants={timelineStepVariants} className="timeline-step">
                        <div className="step-index-circle">1</div>
                        <div className="step-content">
                          <p>
                            O <strong>REPRESENTANTE</strong> chega no WhatsApp da <strong>BIXO</strong> com um
                            pedido mínimo de <strong>20 camisetas</strong>.
                          </p>
                        </div>
                      </motion.div>

                      <motion.div variants={timelineStepVariants} className="timeline-step">
                        <div className="step-index-circle">2</div>
                        <div className="step-content">
                          <p>
                            A gente define em conjunto todos os detalhes da{' '}
                            <strong>estampa + preferências</strong> da turma.
                          </p>
                        </div>
                      </motion.div>

                      <motion.div variants={timelineStepVariants} className="timeline-step">
                        <div className="step-index-circle">3</div>
                        <div className="step-content">
                          <p>
                            Geramos uma <strong>chave do pedido</strong> exclusiva. Ela vai servir para
                            acompanhar <strong>T-U-D-O</strong> até a entrega.
                          </p>
                        </div>
                      </motion.div>

                      <motion.div variants={timelineStepVariants} className="timeline-step">
                        <div className="step-index-circle">4</div>
                        <div className="step-content">
                          <p>
                            Cada pessoa da turma preenche individualmente o nosso{' '}
                            <strong>formulário</strong> de pedido usando essa chave.
                          </p>
                        </div>
                      </motion.div>

                      <motion.div variants={timelineStepVariants} className="timeline-step">
                        <div className="step-index-circle">5</div>
                        <div className="step-content">
                          <p>
                            Fazemos a parte do acerto inicial, de <strong>50%</strong>. O pagamento pode ser
                            feito no cartão ou via Pix.
                          </p>
                        </div>
                      </motion.div>

                      <motion.div variants={timelineStepVariants} className="timeline-step">
                        <div className="step-index-circle">6</div>
                        <div className="step-content">
                          <p>
                            Quando todo mundo tiver enviado os pedidos e o pagamento (cash), a produção
                            começa oficialmente no <strong>LAB</strong>.
                          </p>
                        </div>
                      </motion.div>
                    </motion.div>
                  </div>

                  <div className="delivery-notice">
                    <i className="fa-regular fa-clock"></i>
                    <span>
                      O prazo de entrega é de <strong>15 a 20 dias úteis</strong> após o fechamento do
                      pedido (a combinar).
                    </span>
                  </div>
                </motion.div>
              )}

              {activeTab === 'individual' && (
                <motion.div
                  key="individual"
                  initial={{ opacity: 0, y: 12, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -12, filter: 'blur(4px)' }}
                  transition={customTransition}
                  className="tab-pane"
                >
                  <div className="pane-header">
                    <span className="badge-role">
                      <i className="fa-solid fa-bag-shopping"></i> Pronta-Entrega
                    </span>
                    <h4>Se você quer só uma camiseta para chamar de sua:</h4>
                    <p>
                      Não tem problema! Fale diretamente com a nossa equipe no WhatsApp. Nós te passamos todos
                      os modelos disponíveis em pronta-entrega e combinamos tudo por lá com rapidez e
                      facilidade.
                    </p>
                  </div>

                  <div className="cta-individual-wrapper">
                    <a
                      href="https://wa.link/cqiozw"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-whatsapp"
                    >
                      <i className="fa-brands fa-whatsapp"></i> Falar com a gente
                    </a>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
