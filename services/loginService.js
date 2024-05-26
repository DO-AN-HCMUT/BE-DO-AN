import jwt from "jsonwebtoken"
const privateKey=process.env.PRIVATE_KEY;

export const   createTokenLogin =  (data,privateKey) =>  {
  console.log(data);
  return  new  Promise((resolve, reject) => {
     jwt.sign(
      { email: data.email, password: data.password },
      privateKey,
      { expiresIn: "1h" },
      (err, token) => {
        if (err) {
          reject(err.message)
        }
        resolve(token);
      }
    );
  });
};
export const createLoginAccess= async(req,res)=>{
  
  const encrypt = {email:req.body.email,password: req.body.password };
  
  const token=  await createTokenLogin(encrypt,privateKey);

  return res.json({msg:"Success",accessToken:token});
}