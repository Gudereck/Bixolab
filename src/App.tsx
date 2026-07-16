import { Header } from './components/Header/Header';
import { Hero } from './components/Hero/Hero';
import { ComoFunciona } from './components/ComoFunciona/ComoFunciona';
import { Galeria } from './components/Galeria/Galeria';
import { Collab } from './components/Collab/Collab';
import { Orcamento } from './components/Orcamento/Orcamento';
import { OLab } from './components/OLab/OLab';
import { FAQ } from './components/FAQ/FAQ';
import { Footer } from './components/Footer/Footer';
import { BackToTopDino } from './components/BackToTopDino/BackToTopDino';
import './styles.scss';

function App() {
  return (
    <div className="app-wrapper">
      <Header />
      <Hero />
      <ComoFunciona />
      <Galeria />
      <Collab />
      <Orcamento />
      <OLab />
      <FAQ />
      <Footer />
      <BackToTopDino />
    </div>
  );
}

export default App;
