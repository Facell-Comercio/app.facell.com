import {Link} from 'react-router-dom'
import { ToggleTheme } from './ui/toogle-theme';

const Navbar = () => {
    return ( <nav className='flex gap-3'>
        <Link to='/'>Home</Link>
        <Link to='/perfil'>Perfil</Link>

        <ToggleTheme/>

    </nav> );
}
 
export default Navbar;