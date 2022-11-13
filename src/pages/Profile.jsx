import {getAuth,updateProfile} from 'firebase/auth'
import {useState, useEffect} from 'react'
import {useNavigate, Link} from 'react-router-dom'
import {updateDoc,doc,collection,getDocs,query,where,orderBy,deleteDoc} from 'firebase/firestore'
import {db} from '../firebase.config'
import {toast} from 'react-toastify'
import arrowRight from '../assets/svg/keyboardArrowRightIcon.svg'
import homeIcon from '../assets/svg/homeIcon.svg'
import ListingItem from '../components/ListingItem'

function Profile() {
  const auth = getAuth()
  const [changeDetails,setChangeDetails] =useState (false)
  const [listing, setListing] = useState(null)
  const [loading,setLoading] = useState(true)
  const navigate = useNavigate()
  useEffect(()=>{
    const fetchUserListings = async() =>{
      const listingsRef = collection(db,'listings')

      const q = query(listingsRef,where('userRef','==',auth.currentUser.uid),
      orderBy('timestamp','desc'))

      const querySnap = await getDocs(q)
      let listings = []

      querySnap.forEach(doc=>{
        return listings.push({
          id:doc.id,
          data:doc.data()
        })
      })
      setListing(listings)
      setLoading(false)
    }
    fetchUserListings()
  },[auth.currentUser.uid])
  const [formData, setFormData] = useState({
    name : auth.currentUser.displayName,
    email : auth.currentUser.email,
  })
  const {email,name} =formData


  const onLogout = () => {
    auth.signOut()
    navigate('/')
  }

  const onSubmit = async() =>{
    try {
      //UPDATE DISPLAY NAME IN FB
      if(auth.currentUser.displayName!==name){
        await updateProfile(auth.currentUser,{
          displayName:name
        })

        //UPDATE IN FIRESTORE
        const userRef = doc(db,'users', auth.currentUser.uid)
        await updateDoc(userRef,{
          name
        })
      }
      
    } catch (error) {
      console.log(error);
        toast.error('cant update')
    }
  }

  const onChange =(e)=>{
    setFormData((prevState)=>({
      ...prevState,
      [e.target.id] :e.target.value

    }))
  }

  const onDelete = async(listingId) => {
   if(window.confirm('Are you sure want to dalete ?')){
    await deleteDoc(doc(db,'listings',listingId))
    const updatedListings = listing.filter((listing)=>listing.id!==listingId)
    setListing(updatedListings)
    toast.success('Succesfuly deleted listing')
   }
  }
  const onEdit = (listingId) => {navigate(`/edit-listing/${listingId}`)

  }



  return (
  <div className="profile">
    <header className="profileHeader">
      <p className="pageHeader">My Profile</p>
      <button type='button' className="logOut" onClick={onLogout}>Logout</button>
    </header>
    <main>
      <div className="profileDetailsHeader">
        <p className="profileDetailsText">Personal Details</p>
        <p className="changePersonalDetails" onClick={()=>{
          changeDetails && onSubmit()
           setChangeDetails((prevState)=>!prevState)
        }} > {changeDetails ? 'done' :'change' }</p>
      </div>
      <div className="profileCard">
        <form>
          <input type="text" id='name' 
            className={!changeDetails ? 'profileName' : 'profileNameActive'}
            disabled={!changeDetails}
            value={name}
            onChange={onChange}
            />
          <input type="text"
            id='email' 
            className={!changeDetails ? 'profileEmail' : 'profileEmailActive'}
            disabled={!changeDetails}
            value={email}
            onChange={onChange}
            />
        </form>
      </div>
      <Link to={'/create-listing'} className='createListing'>
        <img src={ homeIcon} alt="home" />
        <p>Sell or rent your home</p>
        <img src={arrowRight} alt="arrow right" />
      </Link>
      {!loading && listing?.length > 0 && (
        <>
        <p className="listingText">
          Your Listings
        </p>
        <ul className="listingsList">
          {listing.map((listing)=>(
            <ListingItem 
            key={listing.id} 
            listing={listing.data} 
            id={listing.id}
            onDelete={()=>onDelete(listing.id)}
            onEdit={()=>onEdit(listing.id)}
            />
          ))}
        </ul>
      </>
      )}
    </main>
  </div>
  )
}

export default Profile