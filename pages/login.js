import Link from 'next/link';
import { useState } from 'react';
import baseUrl from '../helper/baseUrl';
import cookie from 'js-cookie';
import { useRouter } from 'next/router';

//npm install bcryptjs jsonwebtoken js-cookie
const login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter()

  const userLogin = async (e)=>{
    e.preventDefault()
   const res = await fetch(`${baseUrl}/api/login`, { 
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        email,
        password
      })
    })
    const res2 = await res.json()
    if(res2.error)
    {
      M.toast({html: res2.error, classes:"red"})
    }else{
      console.log(res2)
     cookie.set('token',res2.token)
     cookie.set('user',res2.user)
     router.push('/dashbord')
    }
  }

    return (
      <>
      <div className="container cart authcard celter-align">
        <h1>Login</h1>
        <form onSubmit={(e)=>userLogin(e)}>
        <input type="email" placeholder="email" value={email} onChange={(e)=>setEmail(e.target.value)} />
        <input type="password" placeholder="password" value={password} onChange={(e)=>setPassword(e.target.value)} />
        <button className="btn waves-effect waves-light #ef6c00 orange darken-3" type="submit" >Login
        <i className="material-icons right">forward</i>
        </button>
        <Link href="/signup"><a><h6>Don't have account?</h6></a></Link>
        </form>
        </div>
      </>
    )
  }
  
  export default login;
  