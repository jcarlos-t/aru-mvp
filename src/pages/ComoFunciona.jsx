import Navbar from '../components/Navbar';
import '../styles/Navbar.css';

const ComoFunciona = () => {
    return (
        <div>
            <Navbar />
            <div style={{ padding: '4rem', textAlign: 'center' }}>
                <h1 style={{ color: 'var(--navy-dark)', marginBottom: '1rem' }}>Cómo Funciona</h1>
                <p style={{ color: 'var(--gray)' }}>Esta página estará disponible próximamente.</p>
            </div>
        </div>
    );
};

export default ComoFunciona;
