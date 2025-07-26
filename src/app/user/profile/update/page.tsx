'use client'

import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
  Avatar,
} from '@mui/material'
import React, { useEffect } from 'react'
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form'
import * as yup from 'yup';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';


const schema = yup.object().shape({

  name: yup
    .string()
    .required('Name is required')
    .min(3, 'Name must be at least 3 characters'),
    
  email: yup
    .string()
    .email('Enter a valid email')
    .required('Email is required'),

   image: yup
      .mixed()
      .test("fileType", "Only jpg, jpeg or png files are allowed", function (value) {
        // Allow no file — especially during updates
        if (!value || (value as FileList).length === 0) return true;
  
        const file = (value as FileList)[0];
        if (!file || typeof file.type !== 'string') return false;
  
        return ["image/jpeg", "image/png", "image/jpg"].includes(file.type);
      }),

})


type UpdateProfileData = yup.InferType<typeof schema>


const UpdateProfilePage = () => {
  const [profileImageUrl, setProfileImageUrl] = React.useState<string | null>(null)

  const token = localStorage.getItem('token')
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm({
    resolver: yupResolver(schema)
  })
  

  useEffect (() => {

    api.get('/viewprofile',{
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then((res) => {
      const resData = res.data.data

      setValue('name', resData.name)
      setValue('email',resData.email)
      setProfileImageUrl(resData.image)
    })
    .catch((err) => {
      alert('Error fetching Data!')
    })
  },[])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if(file && ['image/jpeg','image/png', 'image/jpg'].includes(file.type)){
      setProfileImageUrl(URL.createObjectURL(file))
    }

    // 👇 IMPORTANT: inform react-hook-form about the change
    register('image').onChange(e);
  }

  const onSubmit =async (data: UpdateProfileData) => {
    
    const formData = new FormData()
    formData.append('name',data.name)
    formData.append('email',data.email)

    const imageFile = (data.image as FileList)?.[0]
    if(imageFile){
      formData.append('image',imageFile)
    }

    await api.patch('/editprofile', formData, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then((res) => {
      alert('Book updated successfully')
      router.push('/user/profile/view')
    })
    .catch(() => {
      alert('Error updating book')
    })
    
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Button
      startIcon={<ArrowBackIcon />}
      variant='text'
      onClick={(() => router.push('/user/profile/view'))}
      sx={{ mb: 2 , textTransform: 'none', fontSize: 16 , color: '#6b4c3b'}}
      >Back to Profile</Button>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Typography
          variant="h5"
          sx={{
            fontFamily: 'serif',
            fontWeight: 700,
            color: '#1f2937',
            textAlign: 'center',
            mb: 3,
          }}
        >
          Update Profile
        </Typography>

        <Box
          onSubmit={handleSubmit(onSubmit)}
          component="form"
          noValidate
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
            alignItems: 'center',
          }}
        >
          {/* Static Avatar */}
          <Avatar  src={
              profileImageUrl
                ? profileImageUrl.startsWith('blob:')
                  ? profileImageUrl
                  : `${process.env.NEXT_PUBLIC_BACKEND_URL}/${profileImageUrl}`
                : ''
            } 
            sx={{ width: 100, height: 100 }} />

          {/* Name Input */}
          <TextField
            fullWidth
            label="Name"
            variant="outlined"
            sx={{ fontFamily: 'serif' }}
            {...register('name')}
            value={watch('name') || ''}
            helperText={errors.name?.message}
            error={!!errors.name}
          />

          {/* Email Input */}
          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            type="email"
            sx={{ fontFamily: 'serif' }}
            {...register('email')}
            value={watch('email') || ''}
            helperText={errors.email?.message}
            error={!!errors.email}
          />

          {/* Image Upload Button */}
          <Button
            variant="outlined"
            component="label"
            sx={{
              color: '#6b4c3b',
              borderColor: '#6b4c3b',
              '&:hover': {
                backgroundColor: '#f3e8e2',
                borderColor: '#6b4c3b',
              },
            }}
          >
            Upload Image
            <input
              hidden
              accept="image/*"
              type="file"
              {...register('image')}
              onChange={handleImageChange}
            />
          </Button>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="contained"
            sx={{
              backgroundColor: '#6b4c3b',
              '&:hover': {
                backgroundColor: '#543728',
              },
              mt: 2,
            }}
          >
            Save Changes
          </Button>
        </Box>
      </Paper>
    </Container>
  )
}

export default UpdateProfilePage
