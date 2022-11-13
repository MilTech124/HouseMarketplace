import React from 'react'
import {useEffect, useState} from 'react'
import {useParams} from 'react-router-dom'
import {collection, getDocs, query, where, orderBy, limit,startAfter} from 'firebase/firestore'
import {db} from '../firebase.config'
import {toast} from 'react-toastify'
import Spinner from '../components/Spinner'
import ListingItem from '../components/ListingItem'

function Category() {
    const [listings,setListings] =useState(null)
    const [loading,setLoading] = useState(true)
    const [leastFetchedListing,setLeastFetchListing] = useState(null)
    const params =useParams()

    useEffect(()=>{
        const fetchListings = async () =>{
            try {
                //get ref
                const listingRef=collection(db,'listings')

                //create query
                const q = query(listingRef,
                    where('type','==',params.categoryName),
                    orderBy('timestamp','desc'),limit(4))

                //execute query
               
                const querySnap = await getDocs(q)
                const lastVisible = querySnap.docs[querySnap.docs.length-1]
                setLeastFetchListing(lastVisible)
                const listings =[]
                querySnap.forEach((doc)=>{
                   return listings.push({
                    id:doc.id,
                    data:doc.data()
                   })
                })
                setListings(listings)
                setLoading(false)
            } catch (error) {
                toast.error('could not fetch')
                
            }
        }

        fetchListings()
    },[params.categoryName])

    //Pagination/Load more
    const onFetchMoreListings = async () =>{
        try {
            //get ref
            const listingRef=collection(db,'listings')

            //create query
            const q = query(listingRef,
                where('type','==',params.categoryName),
                orderBy('timestamp','desc'),startAfter(leastFetchedListing),limit(10))

            //execute query
           
            const querySnap = await getDocs(q)
            const lastVisible = querySnap.docs[querySnap.docs.length-1]
            setLeastFetchListing(lastVisible)
            const listings =[]
            querySnap.forEach((doc)=>{
               return listings.push({
                id:doc.id,
                data:doc.data()
               })
            })
            setListings((prevState)=>[...prevState, ...listings])
            setLoading(false)
        } catch (error) {
            console.log(error);
            toast.error('could not fetch')
            
        }
    }
   
    
  return (
    <div className='category'>
        <header>
            <p className="pageHeader">
                {params.categoryName === 'rent' 
                ? 'Place for rent' 
                : 'Places for sale'}
            </p>
        </header>
        { loading ? (<Spinner/>) 
        : listings.length > 0 ? (
        <>
            <main>
                <ul className="categoryListings">
                    {listings.map((listing)=>(
                        <ListingItem listing={listing.data} id={listing.id} key={listing.id} />
                    ))}
                </ul>
            </main>
            <br />
            {leastFetchedListing &&(
                <p className='loadMore' onClick={onFetchMoreListings}>Load More</p>
            )}
        </>) 
        : (<p>No listing for {params.categoryName}</p>) }
    </div>
  )
}

export default Category