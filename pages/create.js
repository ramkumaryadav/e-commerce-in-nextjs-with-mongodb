import Link from 'next/link';
import { useState } from 'react';
import baseUrl from '../helper/baseUrl';
import {parseCookies} from 'nookies'



const create = () => {
  // here get the value from the form
  const [name,setName] = useState("");
  const [price,setPrice] = useState("");
  const [media,setMedia] = useState("");
  const [discription,setDescription] = useState("");
  const handleSubmit = async (e)=>{
    e.preventDefault()
    // uplaod image function
    try{
      const mediaUrl = await imageUpload()
      //console.log(name,price,media,description)
     const res = await fetch(`${baseUrl}/api/products`, {
        method:"POST",
        headers:{
          'Content-Type':'application/json'
        },
        body:JSON.stringify({
          name,
          price,
          mediaUrl,
          discription
        })
      })
     const res2 = await res.json()
     if(res2.error){
      M.toast({html: res2.error, classes:"red"})
     }else{
      M.toast({html: "Product Uploaded Successfully", classes:"green"})
     }
    }catch(err){
      console.log(err)
    }
 
  }
  const imageUpload = async () => {
  const data = new FormData()
  data.append('file', media)
  data.append('upload_preset', "mystore")
  data.append('cloud_name', "ramapi")
  const res = await fetch("https://api.cloudinary.com/v1_1/ramapi/image/upload", {
  method:"POST",
  body:data
} )
const res2 = await res.json()
//console.log(res2)
return res2.url
  }
    return (
      <>
       <div className="container cart celter-align">
       <h1>Upload Products</h1>
        <form  onSubmit={(e)=>handleSubmit(e)} >
        <input type="text" name="name" placeholder="name" value={name} onChange={(e)=>{setName(e.target.value)}} />
        <input type="text" name="price" placeholder="price" value={price} onChange={(e)=>{setPrice(e.target.value)}} />
        <div className="file-field input-field">
      <div className="btn #ef6c00 orange darken-3">
        <span>File</span>
        <input type="file" accept="image/*" onChange={(e)=>setMedia(e.target.files[0])}/>
      </div>
      <div className="file-path-wrapper">
        <input className="file-path validate" type="text" />
      </div>
    </div>
    <textarea name="discription" placeholder="discription"  className="materialize-textarea"  value={discription} onChange={(e)=>{setDescription(e.target.value)}}></textarea>
    <button className="btn waves-effect waves-light #ef6c00 orange darken-3" type="submit" >Submit
    <i className="material-icons right">send</i>
  </button>
  <img className="responsive-img" src={media?URL.createObjectURL(media):""} />
  
        </form><br></br>
        </div>
      </>
    )
  }

  // when we are using (getServerSideProps) then we have not use router - we use location for redirevtion 
 // when we are using (getServerSideProps) then we have not use router - we use location for redirevtion 
 export async function getServerSideProps(ctx){
  const cookiework = parseCookies(ctx)
  //const cookie = JSON.stringify(ctx)
   const user =  cookiework.user ? JSON.parse(JSON.stringify(cookiework.user)) : "" //JSON.parse
  if(user.role != 'admin'){
      const {res} = ctx
      res.writeHead(302,{Location:"/"})
      res.end()
  }
  return {
      props:{}
  }
}
  
  export default create;
  