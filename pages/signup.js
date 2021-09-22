import Link from 'next/link';
import { useState } from 'react';
import baseUrl from '../helper/baseUrl';
import { useRouter } from 'next/router';

//npm install bcryptjs jsonwebtoken js-cookie
const signup = () => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()
  

    const userSignup = async (e)=>{
      e.preventDefault()
     const res = await fetch(`${baseUrl}/api/signup`, {
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({
          name,
          email,
          password
        })
      }) 
      const res2 = await res.json()
      if(res2.error){
        M.toast({html: res2.error, classes:"red"})
      }else{
        M.toast({html: res2.message, classes:"green"})
        router.push('/login')
      }
    }
    return (
      <>
      <div className="container cart authcard celter-align">
        <h1>Signup</h1>
        <form onSubmit={(e)=>userSignup(e)}>
        <input type="text" placeholder="Name" value={name} onChange={(e)=>setName(e.target.value)} />
        <input type="email" placeholder="email" value={email} onChange={(e)=>setEmail(e.target.value)} />
        <input type="password" placeholder="password" value={password} onChange={(e)=>setPassword(e.target.value)} />
        <button className="btn waves-effect waves-light #ef6c00 orange darken-3" type="submit" >Signup
        <i className="material-icons right">forward</i>
        </button>
        <Link href="/login"><a><h6>Already have account?</h6></a></Link>
        </form>
        </div>
      </>
    )
  }
  
  export default signup;
  