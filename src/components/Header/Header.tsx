import { useState, useEffect } from 'react';
import { Magnetic } from '../Magnetic/Magnetic';
import { DinoIcon } from '../DinoIcon/DinoIcon';
import './Header.scss';

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNavbarScrolled, setIsNavbarScrolled] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' ? 'dark' : 'light';
    }
    return 'light';
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsNavbarScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [theme]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <header className={`navbar ${isNavbarScrolled ? 'scrolled' : ''}`}>
      <div className="container nav-container">
        <div className="logo">
          <a href="#home" className="logo-link" onClick={closeMobileMenu}>
            <DinoIcon className="logo-dino" />
            <span>
              BIXO<span className="text-gradient">LAB</span>
            </span>
          </a>
        </div>

        <nav className={`nav-links ${isMobileMenuOpen ? 'active' : ''}`}>
          <a href="#home" onClick={closeMobileMenu}>
            Home
          </a>
          <a href="#como-funciona" onClick={closeMobileMenu}>
            Como Funciona
          </a>
          <a href="#collab" onClick={closeMobileMenu}>
            Collab
          </a>
          <a href="#orcamento" onClick={closeMobileMenu}>
            Orçamento
          </a>
          <a href="#o-lab" onClick={closeMobileMenu}>
            O Lab
          </a>
        </nav>

        {/* Agrupamento de Ações na Navbar */}
        <div className="nav-actions-wrapper">
          <Magnetic>
            <button
              className="theme-toggle-btn"
              onClick={toggleTheme}
              aria-label={`Alternar para modo ${theme === 'light' ? 'escuro' : 'claro'}`}
              title={`Modo ${theme === 'light' ? 'Escuro' : 'Claro'}`}
            >
              <i className={`fa-solid ${theme === 'light' ? 'fa-moon' : 'fa-sun'}`}></i>
            </button>
          </Magnetic>

          <div className="nav-actions">
            <Magnetic>
              <a
                href="https://wa.link/cqiozw"
                target="_blank"
                rel="noopener noreferrer"
                className="nav-btn-outline"
              >
                <i className="fa-brands fa-whatsapp"></i> Fale com a gente
              </a>
            </Magnetic>
          </div>

          <button
            className="mobile-menu-toggle"
            onClick={toggleMobileMenu}
            aria-expanded={isMobileMenuOpen}
            aria-label="Menu de navegação"
          >
            <i className={`fa-solid ${isMobileMenuOpen ? 'fa-xmark' : 'fa-bars'}`}></i>
          </button>
        </div>
      </div>
    </header>
  );
}
