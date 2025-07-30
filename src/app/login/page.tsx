
'use client'

import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
} from '@mui/material'
import api from '@/lib/api'
import { useRouter } from 'next/navigation'
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';


const schema = yup.object().shape({
  email: yup.string().required('Email is required').email('Enter a valid email address'),
  password: yup.string().required('Password is required').min(8, "Password must be atleast 8 characters")
})

type LoginFormData = yup.InferType<typeof schema>

const LoginPage = () => {


  const { register , handleSubmit , formState:{errors} } = useForm({
     resolver: yupResolver(schema)
    })

  const router = useRouter()

  ///settoken from usecontext code 

  const {setToken} = useAuth()


  const onSubmit = async(data: LoginFormData) => {

   await api.post('/user/login', data,{
    headers:{
      'Content-Type': 'application/json'
    }
   })
    .then(async(res) => {
      // console.log(res.data.data)
      toast.success("Login successfull")

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

      //setting value to useContext

      setToken(res.data.access_token)
      
      router.push('/books/listing')

    })
    .catch((err) => {
       toast.error(err.response?.data?.message || 'Invalid Credentials')
    })
  }

  return (
    <Box className="min-h-screen bg-stone-200 flex items-center justify-center"  >
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
            Unlock Your Bookshelf
          </Typography>

          <Box component="form" noValidate autoComplete="off" mt={4} onSubmit={handleSubmit(onSubmit)}>
            <TextField
              fullWidth
              label="Email"
              variant="outlined"
              margin="normal"
              type="email"
              {...register('email')}
              helperText={errors.email?.message}
              FormHelperTextProps={{
              sx: {
                color: 'red', // or any custom color like '#ff1744'
                fontWeight: 500,
              },
              }}
            />
            <TextField
              fullWidth
              label="Password"
              variant="outlined"
              margin="normal"
              type="password"
              {...register('password')}
              helperText={errors.password?.message}
              FormHelperTextProps={{
              sx: {
                color: 'red', // or any custom color like '#ff1744'
                fontWeight: 500,
              },
              }}
            />

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
              Login
            </Button>
          </Box>

          <Typography variant="body2" align="center" mt={3}>
            Don’t have an account?{' '}
            <a href="/registration" className="text-indigo-600 font-semibold">
              Register
            </a>
          </Typography>
        </Paper>
      </Container>
    </Box>
  )
}

export default LoginPage
