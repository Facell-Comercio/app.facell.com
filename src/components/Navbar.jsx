import {Link} from 'react-router-dom'

const Navbar = () => {
    return ( <nav className='flex gap-3'>
        <Link to='/'>Home</Link>
        <Link to='/perfil'>Perfil</Link>

        <Link to='/colab/1'>Colaborador 1</Link>
        <Link to='/colab/2'>Colaborador 2</Link>
        <Link to='/colab/3'>Colaborador 3</Link>

    </nav> );
}
 
export default Navbar;