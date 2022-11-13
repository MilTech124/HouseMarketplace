import React,{useState} from 'react'
import {Link,useNavigate} from 'react-router-dom'
import {toast} from 'react-toastify'
import {ReactComponent as ArrowRightIcon} from '../assets/svg/keyboardArrowRightIcon.svg'
import visibilityIcon from '../assets/svg/visibilityIcon.svg'
import {getAuth,signInWithEmailAndPassword} from 'firebase/auth'
import OAuth from '../components/OAuth'



function SignIn() {
  const [showPassword,setShowPassword] = useState(false)
  const [formaData,setFormData] = useState({
    email:'',
    password:'',
  })
  const {email,password} = formaData
  const navigate = useNavigate()

  const onChange= (e) => {
    setFormData((prevState)=>({
      ...prevState,
      [e.target.id] :e.target.value,
    }))    
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    try {
      const auth = getAuth()

    const useCredential = await signInWithEmailAndPassword(auth, email, password)
    if(useCredential.user){
      navigate('/')
    }      
    } catch (error) {
      console.log(error.message);
      toast.error('Bad password or e-mail')
    }
    
  }


  return (
    <>
      <div className="pageContainer">
        <header>
          <p className="pageHeader">
            Welcome Back
          </p>
        </header>
        <form onSubmit={onSubmit}>
          <input type="email" 
            className='emailInput' 
            placeholder='Email' 
            id='email' 
            value={email}
            onChange={onChange} 
          />

          <div className="passwordInputDiv">
            <input className='passwordInput'
              placeholder='Password'
              type={showPassword ? 'text' : 'password'}
              name="password"
              id="password"
              value={password}
              onChange={onChange}
            />

            <img src={visibilityIcon} alt="show password"
              className='showPassword'
             onClick={()=>setShowPassword((prevState)=>!prevState)} />

          </div>
          <Link to={'/forgot-password'} className='forgotPasswordLink'>Forgot Password</Link>
          <div className="signInBar">
            <p className="signInText">Sign In</p>
            <button className='signInButton'>
              <ArrowRightIcon fill='white' width='34px' height='34px' />
            </button>
          </div>
        </form>

        <OAuth/>
        <Link to={'/sign-up'}  className='registerLink'>Sign Up Instead</Link>
      </div>
    </>
  )
}

export default SignIn