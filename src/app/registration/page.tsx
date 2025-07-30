'use client'

import React from 'react'
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useRouter } from 'next/navigation'
// import { RegistrationFormData } from '@/types/product'
import api from '@/lib/api'
import Image from 'next/image'

const schema = yup.object().shape({
  name : yup.string().required("Name is required"),
    email : yup.string().required("Email is required"),
    password : yup.string().required("Password is required").min(8,"Password must be at least 8 characters"),
    role: yup.string().required('Select role').oneOf(["seller" , "buyer"], 'Select valid role'),
     image: yup
    .mixed()
    .required("Image is required")
    .test("fileExist", "Please upload a file", (value) => {
      const files = value as FileList;
      return files && files.length > 0;
    })
    .test("fileType", "Only jpg, jpeg or png files are allowed", (value) => {
      const files = value as FileList;
      return (
        files &&
        files.length > 0 &&
        ["image/jpeg", "image/png", "image/jpg"].includes(files[0].type)
      );
    }),

})

//type defining
 type RegistrationFormData = yup.InferType<typeof schema>


const RegistrationPage = () => {

  const {register , handleSubmit , formState:{ errors} } = useForm<RegistrationFormData> ({
    resolver : yupResolver(schema)
  })

  const [previewImageUrl, setPreviewImageUrl] = React.useState<string | null>(null)
  
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if(file && ['image/jpeg', 'image/png','image/jpg'].includes(file.type)){
        setPreviewImageUrl(URL.createObjectURL(file))
      }
      
      register('image').onChange(e)
    }

  const router = useRouter()

  const onSubmit = async (data: RegistrationFormData) => {

    const formData = new FormData()
    formData.append('name',data.name)
    formData.append('email',data.email)
    formData.append('password',data.password)
    formData.append('role',data.role)
    formData.append('image',(data.image as FileList)[0])

    try{

      const res = await api.post('/user/registration', formData, {
        headers:{
          'Content-Type': 'multipart/form-data',
        }
      })
      alert("Registration Successful!")

      localStorage.setItem('token', res.data.access_token)
      localStorage.setItem('user',JSON.stringify(res.data.data))

      //set cookie value
      const cookie = await fetch('/api/auth/set-cookies',{
        method: 'POST',
        headers:{'Content-Type' : 'application/json'},
        body: JSON.stringify({token: res.data.access_token, role: res.data.data.role })
      })

      if (!cookie.ok) {
        console.warn('Failed to set cookies')
      }

      router.push('/books/listing')
    }
    catch(error){
      alert('Something went wrong during registration')
    }
  }

  return (
    <Box className="min-h-screen bg-stone-200 flex items-center justify-center">
      <Container maxWidth="sm">
        <Paper
          elevation={6}
          sx={{
            padding: 5,
            borderRadius: 4,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
          }}
        >
          <Typography
            variant="h4"
            align="center"
            gutterBottom
            sx={{ fontWeight: 700, fontFamily: 'serif', color: '#3b3b3b' }}
          >
            Join Booksy Today
          </Typography>

          <Box component="form" noValidate autoComplete="off" mt={4} onSubmit={handleSubmit(onSubmit)} >
            {/* Name */}
            <TextField
              fullWidth
              label="Name"
              variant="outlined"
              margin="normal"
              type="text"
              {...register('name')}
              error={!!errors.name}
              helperText={errors.name?.message}
            />

            {/* Email */}
            <TextField
              fullWidth
              label="Email"
              variant="outlined"
              margin="normal"
              type="email"
              {...register('email')}
              error={!!errors.email}
              helperText={errors.email?.message}
            />

            {/* Password */}
            <TextField
              fullWidth
              label="Password"
              variant="outlined"
              margin="normal"
              type="password"
              {...register("password")}
              error={!!errors.password}
              helperText={errors.password?.message}
            />

            {/* Role Selection */}
            <FormControl component="fieldset" sx={{ mt: 2 }}>
              <FormLabel component="legend" sx={{ color: '#3b3b3b' }}>
                Select Role
              </FormLabel>
              <RadioGroup row defaultValue="buyer">
                <FormControlLabel value="seller" control={<Radio />} label="Seller" {...register('role')}/>
                <FormControlLabel value="buyer" control={<Radio />} label="Buyer" {...register('role')}/>
              </RadioGroup>
              {errors.role && (
                <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                  {errors.role.message}
                </Typography>
              )}
            </FormControl>

            {/* Image Upload */}
            <Button
             
              variant="outlined"
              component="label"
              fullWidth
              sx={{ mt: 3, textAlign: 'left' }}
              >
              Upload Profile Image
              <input type="file" accept="image/*" hidden {...register('image')} onChange={handleImageChange}/>
              {errors.image && (
                <Typography variant="body2" color="error" sx={{ mt: 1, ml: 1 }}>
                  {errors.image.message?.toString()}
                </Typography>
              )}
            </Button>
              {previewImageUrl && (
                 <Box mt={2} display="flex" justifyContent="center">
                   <Image
                     src={previewImageUrl}
                     alt="Preview"
                     width={150}
                     height={200}
                     style={{
                       borderRadius: '8px',
                       objectFit: 'cover',
                     }}
                   />
                 </Box>
               )}

            {/* Submit Button */}
            <Button
             type='submit'
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                py: 1.5,
                fontWeight: 600,
                backgroundColor: '#6b4c3b',
                '&:hover': {
                  backgroundColor: '#543a2e',
                },
              }}
            >
              Register
            </Button>
          </Box>

          <Typography variant="body2" align="center" mt={3}>
            Already have an account?{' '}
            <Link href="/login" className="text-indigo-600 font-semibold">
              Login
            </Link>
          </Typography>
        </Paper>
      </Container>
    </Box>
  )
}

export default RegistrationPage
