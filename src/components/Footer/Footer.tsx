import { DinoIcon } from '../DinoIcon/DinoIcon';
import './Footer.scss';

export function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <a href="#home" className="logo-link">
              <DinoIcon className="logo-dino" />
              <h3>
                BIXO<span className="text-gradient">LAB</span>
              </h3>
            </a>
            <p>As camisetas mais legais da sua vida, na fase mais legal da sua vida.</p>
          </div>

          <div className="footer-links">
            <h4>Navegação</h4>
            <a href="#home">Home</a>
            <a href="#como-funciona">Como Funciona</a>
            <a href="#collab">Collab</a>
            <a href="#orcamento">Orçamento</a>
            <a href="#o-lab">O Lab</a>
          </div>

          <div className="footer-contact">
            <h4>Contato</h4>
            <a href="mailto:contato@bixolab.com.br">
              <i className="fa-solid fa-envelope"></i> contato@bixolab.com.br
            </a>
            <a href="https://wa.link/cqiozw" target="_blank" rel="noopener noreferrer">
              <i className="fa-brands fa-whatsapp"></i> (37) 99116-4812
            </a>
            <a href="https://www.instagram.com/bixolab/" target="_blank" rel="noopener noreferrer">
              <i className="fa-brands fa-instagram"></i> @bixolab
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Bixo Lab. Todos os direitos reservados.</p>
          <p>Bixo Hoje, Lenda Amanhã.</p>
        </div>
      </div>
    </footer>
  );
}
