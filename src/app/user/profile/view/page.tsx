'use client'

import {
  Box,
  Typography,
  Container,
  Paper,
  Avatar,
  Divider,
  IconButton,
  Tooltip,
  Button,
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import EditIcon from '@mui/icons-material/Edit'
import LogoutIcon from '@mui/icons-material/Logout'
import { useRouter } from 'next/navigation'
import { RegistrationFormData } from '@/types/register'
import api from '@/lib/api'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useAuth } from '@/context/AuthContext'



const ViewProfilePage = () => {

  const [user, setUser] = useState<RegistrationFormData>()  
  const router = useRouter()

  const {setToken} = useAuth()

  useEffect(() => {

    const token = localStorage.getItem('token')

    api.get('/viewprofile', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then((res) => {
        setUser(res.data.data)
    })
    .catch((err) => {
        alert("Error fetching data")
    })
  },[])

  const handleEditProfile = () => {
    router.push('/user/profile/update')
  }

  const handleLogout = async () => {
    try{
      //cookie remove
      await fetch('/api/auth/clear-cookie',{
        method: 'POST'
      }).then((res)=>{
        //remove from local storage
        localStorage.removeItem('token')
        localStorage.removeItem('user')

        //update context
        setToken(null)

        //redirect to home
        router.replace('/')
      }).catch((err)=>{
        console.warn('Failed to clear cookies', err)
      })
    }catch(err){
      console.warn('Failed to clear cookies', err)
    }
  }


  if (!user) {
  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3, textAlign: 'center' }}>
        <Typography variant="h6" fontFamily="serif">
          Loading Profile...
        </Typography>
      </Paper>
    </Container>
  )
}


  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
        {/* navigate to previous page */}
        <Button
            startIcon={<ArrowBackIcon />}
            variant="text"
            onClick={() => router.push('/books/listing')}
            sx={{ mb: 2, textTransform: 'none', fontSize: 16, color: '#6b4c3b' }}
        >
            Back to Listings
        </Button>


      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <Avatar
            src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${user.image}`}
            alt={user.name}
            sx={{ width: 100, height: 100 }}
          />

          <Typography
            variant="h5"
            sx={{ fontFamily: 'serif', fontWeight: 700, color: '#1f2937' }}
          >
            {user.name}
          </Typography>

          {/* Buttons */}
          <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
            <Tooltip title="Edit Profile">
              <IconButton onClick={handleEditProfile} sx={{ color: '#6b4c3b' }}>
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Logout">
              <IconButton onClick={handleLogout} sx={{ color: '#c53030' }}>
                <LogoutIcon />
              </IconButton>
            </Tooltip>
          </Box>

          <Divider sx={{ width: '100%', my: 2 }} />

          <Box sx={{ width: '100%' }}>
            <Typography
              variant="body1"
              sx={{ fontWeight: 600, fontFamily: 'serif', color: '#374151' }}
            >
              Email:
            </Typography>
            <Typography sx={{ fontFamily: 'serif', mb: 2 }}>{user.email}</Typography>

            <Typography
              variant="body1"
              sx={{ fontWeight: 600, fontFamily: 'serif', color: '#374151' }}
            >
              Role:
            </Typography>
            <Typography sx={{ fontFamily: 'serif' }}>{user.role}</Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  )
}

export default ViewProfilePage
