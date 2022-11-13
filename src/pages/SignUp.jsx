
import {useState} from 'react'
import {Link,useNavigate} from 'react-router-dom'
import {ReactComponent as ArrowRightIcon} from '../assets/svg/keyboardArrowRightIcon.svg'
import visibilityIcon from '../assets/svg/visibilityIcon.svg'
import {getAuth, createUserWithEmailAndPassword, updateProfile} from 'firebase/auth'
import {db} from '../firebase.config'
import {toast} from 'react-toastify'
import {setDoc ,doc , serverTimestamp} from 'firebase/firestore'
import OAuth from '../components/OAuth'

function SignUp() {
  const [showPassword,setShowPassword] = useState(false)
  const [formaData,setFormData] = useState({
    name: '',
    email:'',
    password:'',
  })
  const {name, email, password} = formaData
  const navigate = useNavigate()

  const onChange= (e) => {
    setFormData((prevState)=>({
      ...prevState,
      [e.target.id]: e.target.value,
    }))
    
  }

  const onSubmit = async (e)=>{
    e.preventDefault()
    try {
      const auth = getAuth()   
      const userCredential = await createUserWithEmailAndPassword(auth,email ,password)

      const user = userCredential.user
      updateProfile(auth.currentUser,{
        displayName:name
      })
      const formDataCopy ={...formaData}
      delete formDataCopy.password
      formDataCopy.serverTimestamp = serverTimestamp()

      await setDoc(doc(db,'users',user.uid),formDataCopy)

      navigate('/')

    } catch (error) {
      toast.error('Something went wrong with regis')
      console.log(error);      
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
        <input type="text" 
            className='nameInput' 
            placeholder='Email' 
            id='name' 
            value={name}
            onChange={onChange} 
          />
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
          <div className="signUpBar">
            <p className="signUpText">Sign Up</p>
            <button className='signUPButton'>
              <ArrowRightIcon fill='white' width='34px' height='34px' />
            </button>
          </div>
        </form>

        <OAuth/>
        <Link to={'/sign-in'}  className='registerLink'>Sign In Instead</Link>
      </div>
    </>
  )
}

export default SignUp