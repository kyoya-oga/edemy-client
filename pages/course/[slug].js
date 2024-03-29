import { useState, useContext, useEffect } from 'react'
import axios from 'axios'
import PreviewModal from '../../components/modal/PreviewModal'
import SingleCourseJumbotron from '../../components/cards/SingleCourseJumbotron'
import SingleCourseLessons from '../../components/cards/SingleCourseLessons'
import { Context } from '../../context'
import { toast } from 'react-toastify'
import { useRouter } from 'next/router'
import { loadStripe } from '@stripe/stripe-js'

const SingleCourse = ({ course }) => {
  // state
  const [showModal, setShowModal] = useState(false)
  const [preview, setPreview] = useState('')
  const [loading, setLoading] = useState(false)
  const [enrolled, setEnrolled] = useState({})

  // context
  const {
    state: { user },
  } = useContext(Context)

  useEffect(() => {
    if (user && course) checkEnrollment()
  }, [user, course])

  const router = useRouter()

  const checkEnrollment = async () => {
    const { data } = await axios.get(`/api/check-enrollment/${course._id}`)
    // console.log(data)
    setEnrolled(data)
  }

  const handlePaidEnrollment = async () => {
    try {
      setLoading(true)
      // check if user is logged in
      if (!user) router.push('/login')
      // check if already enrolled
      if (enrolled.status) router.push(`/user/course/${enrolled.course.slug}`)

      const { data } = await axios.post(`/api/paid-enrollment/${course._id}`)
      const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY)
      stripe.redirectToCheckout({ sessionId: data })
    } catch (err) {
      toast('Enrollment failed. Try again...')
      console.log(err)
      setLoading(false)
    }
  }
  const handleFreeEnrollment = async (e) => {
    e.preventDefault()
    try {
      // check if user is logged in
      if (!user) router.push('/login')
      // check if already enrolled
      if (enrolled.status) router.push(`/user/course/${enrolled.course.slug}`)

      setLoading(true)
      const { data } = await axios.post(`/api/free-enrollment/${course._id}`)
      // console.log(data)
      toast(data.message)
      setLoading(false)
      router.push(`/user/course/${data.course.slug}`)
    } catch (err) {
      toast('登録に失敗しました。もう一度お試しください')
      setLoading(false)
    }
  }

  return (
    <article className="container-fluid">
      <SingleCourseJumbotron
        course={course}
        showModal={showModal}
        setShowModal={setShowModal}
        preview={preview}
        setPreview={setPreview}
        user={user}
        loading={loading}
        handlePaidEnrollment={handlePaidEnrollment}
        handleFreeEnrollment={handleFreeEnrollment}
        enrolled={enrolled}
        setEnrolled={setEnrolled}
      />
      <PreviewModal
        showModal={showModal}
        setShowModal={setShowModal}
        preview={preview}
      />

      {course.lessons && (
        <SingleCourseLessons
          lessons={course.lessons}
          setPreview={setPreview}
          showModal={showModal}
          setShowModal={setShowModal}
        />
      )}
    </article>
  )
}

export const getServerSideProps = async ({ query }) => {
  const { data } = await axios.get(`${process.env.API}/course/${query.slug}`)

  return {
    props: { course: data },
  }
}

export default SingleCourse
