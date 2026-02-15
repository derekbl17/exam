const jwt=require('jsonwebtoken')

const generateToken=(res,userId,userRole)=>{
    const token=jwt.sign({userId,userRole},process.env.JWT_SECRET,{expiresIn:'1d'});

    res.cookie('jwt',token,{
        httpOnly:true,
        secure: true,
        sameSite: 'none',
        maxAge: 24 * 60 * 60 * 1000
    })

    console.log('Cookie set:', {
        name: 'jwt',
        value: token,
        options: {
            httpOnly: true,
            secure: true,
            sameSite: 'none'
        }
    });
    res.json({ 
        message: 'Login successful', 
        token: token,
        cookieSet: true 
    });
}

module.exports=generateToken