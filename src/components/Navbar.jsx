import { Link, useLocation } from 'react-router-dom';
import aruLogo from '../assets/aru-logo.png';

const Navbar = () => {
    const location = useLocation();

    return (
        <nav className="navbar">
            <div className="nav-container">
                <Link to="/" className="nav-logo">
                    <img src={aruLogo} alt="ARU Logo" />
                </Link>

                <div className="nav-links">
                    <Link
                        to="/"
                        className={location.pathname === '/' ? 'active' : ''}
                    >
                        Inicio
                    </Link>
                    <Link
                        to="/como-funciona"
                        className={location.pathname === '/como-funciona' ? 'active' : ''}
                    >
                        Cómo funciona
                    </Link>
                    <Link
                        to="/nosotros"
                        className={location.pathname === '/nosotros' ? 'active' : ''}
                    >
                        Nosotros
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
