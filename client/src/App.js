import './App.css';
import AppRouter from './AppRouter';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  return (
    <div>
        <Header/>
        <AppRouter/>
        <Footer/>
    </div>
  );
}

export default App;
