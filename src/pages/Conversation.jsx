import Navbar from '../components/Navbar';
import '../styles/Navbar.css';

const Conversation = () => {
    return (
        <div>
            <Navbar />
            <div style={{ padding: '4rem', textAlign: 'center' }}>
                <h1 style={{ color: 'var(--navy-dark)', marginBottom: '1rem' }}>Modo Conversación</h1>
                <p style={{ color: 'var(--gray)' }}>Esta página estará disponible próximamente.</p>
            </div>
        </div>
    );
};

export default Conversation;
