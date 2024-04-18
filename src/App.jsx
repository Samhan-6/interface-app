import { useState, useEffect, useCallback } from 'react'
import { BiCalendar, BiTrash } from 'react-icons/bi'
import './App.css'
import Search from './components/Search'
import AddAppointment from './components/AddAppointment'
import AppointmentInfo from './components/AppointmentInfo'

function App() {
  const [appontmentList, setAppointmentList] = useState([])
  const [query, setQuery] = useState('')

  // sorting
  const [sortBy, setSortBy] = useState('petName')
  // ascending order
  const [orderBy, setOrderBy] = useState('asc')

  // creating an array
  // this will only shows the effected by query
  const filterdAppointments = appontmentList
    .filter((item) => {
      return (
        item.petName.toLowerCase().includes(query.toLowerCase()) ||
        item.ownerName.toLowerCase().includes(query.toLowerCase()) ||
        item.aptNotes.toLowerCase().includes(query.toLowerCase())
      )
    }) // sorting algorithm
    .sort((a, b) => {
      const order = orderBy === 'asc' ? 1 : -1
      return a[sortBy].toLowerCase() < b[sortBy].toLowerCase()
        ? -1 * order
        : 1 * order
    })

  // getting data from data.json
  const fetchData = useCallback(() => {
    fetch('./data.json')
      .then((response) => response.json())
      .then((data) => {
        setAppointmentList(data)
      })
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return (
    <div className='App container max-auto mt-3 font-thin'>
      <h1 className='text-5xl mb-3'>
        <BiCalendar className='inline-block text-red-400 align-top' />
        Your Appointment
      </h1>
      {/* AddAppointment component */}
      <AddAppointment
        onSendAppointment={(myAppointment) =>
          setAppointmentList([...appontmentList, myAppointment])
        }
        lastId={appontmentList.reduce(
          (max, item) => (Number(item.id) > max ? Number(item.id) : max),
          0,
        )}
      />

      {/* Search component 
        track on the parent component*/}
      <Search
        query={query}
        onQueryChange={(myQuery) => setQuery(myQuery)}
        orderBy={orderBy}
        onOrderByChange={(mySort) => setOrderBy(mySort)}
        sortBy={sortBy}
        onSortByChange={(mySort) => setSortBy(mySort)}
      />

      <ul className='divide-y divide-gray-200'>
        {filterdAppointments.map((appointment) => (
          <AppointmentInfo
            key={appointment.id}
            appointment={appointment}
            onDeleteAppointment={(appointmentId) =>
              setAppointmentList(
                appontmentList.filter(
                  (appointment) => appointment.id !== appointmentId,
                ),
              )
            }
          />
        ))}
      </ul>
    </div>
  )
}

export default App
