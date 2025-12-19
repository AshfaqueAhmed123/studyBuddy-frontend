// import React, { useEffect, useState } from 'react'
// import flashcardService from "../../services/flashcardService"
// import pageHeader from "../../components/common/PageHeader"
// import Spinner from "../../components/common/Spinner"
// import EmptyState from "../../components/common/EmptyState"
// import flashcardSet from "../../components/flashcards/FlashCardSetCard"
// import toast from "react-hot-toast"
// import FlashCardSetCard from '../../components/flashcards/FlashCardSetCard'
// import PageHeader from '../../components/common/PageHeader'
// import axiosInstance from '../../utils/axiosinstance'


// const FlashcardListPage = () => {

//   const [flashcardSets, setFlashcardSets] = useState([])
//   const [loading, setLoading] = useState(false)

//   useEffect(()=>{
//       const fetchFlashcardSets = async () => {
//     setLoading(true)
//     try {
//       const response = await flashcardService.getAllFlashcardSets()
//       console.log(response)
//       setFlashcardSets(response.data[0])
//     } catch (error) {
//       toast.error("Failed to fetch flashcard sets.")
//       console.error(error)
//     } finally {
//       setLoading(false)
//     }
//   }
//   fetchFlashcardSets()
//   },[])



//   const renderContent = () => {
//     if(loading){
//       return <Spinner/>
//     }

//     if(flashcardSets?.length === 0){
//       return <EmptyState 
//       title={"No flashcardSets found."}
//       description={"you have not generated any flashcards yet, go to document to create your first set."}
//       />
//     }

//     return (
//       <div className="gird grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//         {flashcardSets?.map((set)=>{
//           return (
//             <FlashCardSetCard key={set._id} flashcardSet={set} />
//           )
//         })}
//       </div>
//     )

//   }

//   return (
//     <div>
//       <PageHeader title={"All flashcard sets"}/>
//       {renderContent()}
//     </div>
//   )
// }

// export default FlashcardListPage

import React, { useEffect, useState } from 'react'
import flashcardService from "../../services/flashcardService"
import PageHeader from "../../components/common/PageHeader" // Fixed casing
import Spinner from "../../components/common/Spinner"
import EmptyState from "../../components/common/EmptyState"
import FlashCardSetCard from '../../components/flashcards/FlashCardSetCard' // Removed duplicate
import toast from "react-hot-toast"

const FlashcardListPage = () => {
  const [flashcardSets, setFlashcardSets] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchFlashcardSets = async () => {
      setLoading(true)
      try {
        const response = await flashcardService.getAllFlashcardSets()
        
        // FIX: Ensure you are setting an ARRAY. 
        // If your API returns { success, data: [...] }, use response.data
        if (response.success && Array.isArray(response.data)) {
            setFlashcardSets(response.data)
        } else {
            setFlashcardSets([])
        }
      } catch (error) {
        toast.error("Failed to fetch flashcard sets.")
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchFlashcardSets()
  }, [])

  const renderContent = () => {
    if (loading) return <Spinner />

    // Safety check: if flashcardSets isn't an array yet
    if (!flashcardSets || flashcardSets.length === 0) {
      return (
        <EmptyState 
          title="No flashcard sets found."
          description="You have not generated any flashcards yet. Go to documents to create your first set."
        />
      )
    }

    return (
      // FIX: Changed "gird" to "grid"
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4">
        {flashcardSets.map((set) => (
          <FlashCardSetCard key={set._id} flashcardSet={set} />
        ))}
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <PageHeader title="All flashcard sets" />
      <div className="mt-6">
        {renderContent()}
      </div>
    </div>
  )
}

export default FlashcardListPage