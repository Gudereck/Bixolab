import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './FAQ.scss';

interface FAQItem {
  question: string;
  answer: string;
}

export function FAQ() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const easeOutPremium = [0.16, 1, 0.3, 1] as const;

  const faqs: FAQItem[] = [
    {
      question: 'Qual é o pedido mínimo para turmas?',
      answer: 'O pedido mínimo para pedidos coletivos (turma/curso) é de 20 camisetas do mesmo modelo e cor. Isso nos permite garantir os preços especiais de atacado e otimizar o lab de produção.',
    },
    {
      question: 'Vocês criam a estampa ou eu preciso enviar pronta?',
      answer: 'Nós criamos a arte para você! Temos uma equipe de design focada no estilo colegial premium. Após fechar o pedido com o representante, desenvolvemos a estampa de forma 100% personalizada e sem custo adicional.',
    },
    {
      question: 'Qual é o prazo de entrega?',
      answer: 'O prazo padrão de produção e entrega no LAB é de 15 a 20 dias úteis a partir do momento em que todos os pedidos individuais da turma são preenchidos e o sinal de 50% é confirmado.',
    },
    {
      question: 'Quais são as formas de pagamento disponíveis?',
      answer: 'Para facilitar a vida do universitário, cada pessoa da turma paga individualmente. Aceitamos Pix, Boleto Bancário e Cartões de Crédito (com parcelamento em até 12x).',
    },
  ];

  const handleToggle = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <section id="faq" className="faq">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.8, ease: easeOutPremium }}
        className="container faq-container"
      >
        <p className="section-label">Dúvidas</p>
        <h2 className="section-title">Perguntas <span className="text-gradient">Frequentes</span></h2>
        <p className="section-subtitle">
          Tudo o que você precisa saber sobre o processo de criação, produção e entrega do merch da sua turma.
        </p>

        <div className="faq-list">
          {faqs.map((faq, index) => {
            const isExpanded = expandedIndex === index;
            return (
              <div key={index} className={`faq-item glass-card ${isExpanded ? 'expanded' : ''}`}>
                <button
                  className="faq-question"
                  onClick={() => handleToggle(index)}
                  aria-expanded={isExpanded}
                >
                  <span>{faq.question}</span>
                  <span className="faq-icon-wrapper">
                    <i className={`fa-solid ${isExpanded ? 'fa-minus' : 'fa-plus'}`}></i>
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: easeOutPremium }}
                      style={{ overflow: 'hidden' }}
                    >
                      <div className="faq-answer">
                        <p>{faq.answer}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}
