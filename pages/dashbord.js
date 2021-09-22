import { parseCookies } from "nookies";

const dashbord = () => {
    return (
        <>
           <h1>Welcome to dashbord page</h1> 
        </>
    )
}
// when we are using (getServerSideProps) then we have not use router - we use location for redirevtion 
export async function getServerSideProps(ctx){
    const {token} = parseCookies(ctx)
    if(!token){
        const {res} = ctx
        res.writeHead(302,{location:"/login"})
        res.end()
    }
    return {
        props:{}
    }
}

export default dashbord;
