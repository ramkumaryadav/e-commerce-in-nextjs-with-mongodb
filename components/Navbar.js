import Link from 'next/link';
import {useRouter} from 'next/router';
import {parseCookies} from 'nookies';
import cookie from 'js-cookie';

const Navbar = () => {
    // this function use for active menu when click to menu start here
        const router = useRouter();
        // tokan for user
        const cookies = parseCookies();
        const user =  cookies.user ? JSON.parse(cookies.user) : "" //JSON.parse
        
  // active menu code start here 
    function isActive(route){
     if(route == router.pathname)
     {
         return "active";
     }
     else ""
    }
       // this function use for active menu when click to menu end here

    return (
        <>
        <nav>
        <div className="nav-wrapper #ef6c00 orange darken-3">
            <Link href="/" ><a className="brand-logo left">e-commerce</a></Link>
            <ul id="nav-mobile" className="right"> 
            <li className={isActive('/cart')}><Link href="/cart"><a>Cart</a></Link></li>
            {
                // only admin can see this link
            user.role == 'admin' && user.role == 'root' &&
            <>
            <li className={isActive('/create')}><Link href="/create"><a>Create</a></Link></li>
            </>
            }
            {
            user ? 
            <>
             <li className={isActive('/account')}><Link href="/account"><a>Account</a></Link></li>
             <li className={isActive('/dashbord')}><Link href="/dashbord"><a>Dashbord</a></Link></li>
             <li ><button className="btn red" onClick={()=>{
             cookie.remove('token')
             cookie.remove('user')
             router.push('/login')
             }}>logout</button></li>
             </>
            : 
            <>
            <li className={isActive('/login')}><Link href="/login"><a>Login</a></Link></li>
            <li className={isActive('/signup')}><Link href="/signup"><a>Signup</a></Link></li>
            </>
            }
            </ul>
        </div>
        </nav>
        </>
    )
}

export default Navbar;
