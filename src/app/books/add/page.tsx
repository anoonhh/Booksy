'use client'

import React, { useEffect, useState } from 'react'
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  MenuItem,
} from '@mui/material'
import { useRouter } from 'next/navigation'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import api from '@/lib/api';
import Image from 'next/image';



const schema = yup.object().shape({
  title : yup.string().required('Title is required'),
  author: yup.string().required("Author is required"),
  description: yup.string().required('Description is required').min(10,"Description must be atleast 10 characters long"),
  price: yup.number().required('Price is required').positive().typeError('Price must be a positive value'),
  stock: yup
  .number()
  .typeError('Stock must be a number') // handles if user enters letters
  .required('Stock is required')
  .integer('Stock must be an integer')
  .min(0, 'Stock cannot be negative'),

  category: yup.string().required('Category is required'),
  rating: yup
  .number()
  .typeError('Rating must be a number')
  .required('Rating is required')
  .min(0, 'Rating cannot be less than 0')
  .max(5, 'Rating cannot be more than 5'),
  
  image: yup
  .mixed()
  .required("Image is required")
  .test("fileExist", "Please upload a file", (value) => {
      const files = value as File[];
      return files && files.length > 0;
    })
    .test("fileType", "Only jpg, jpeg or png files are allowed", (value) => {
      const files = value as File[];
      return (
        files &&
        files.length > 0 &&
        ["image/jpeg", "image/png", "image/jpg"].includes(files[0]?.type)
      );
    }),
})

//infer type
type AddFormData = yup.InferType<typeof schema>



const AddBook = () => {
  
  // const token = localStorage.getItem('token')
  const router = useRouter()
  const [token, setToken] = useState<string | null>(null);

  // ✅ Correct way to access localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('token');
      setToken(storedToken);
    }
  }, []);
  
  //image preview
  const [previewImageUrl, setPreviewImageUrl] = React.useState<string | null>(null)
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  }) 
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if(file && ['image/jpeg', 'image/png','image/jpg'].includes(file.type)){
      setPreviewImageUrl(URL.createObjectURL(file))
    }
    
    register('image').onChange(e)
  }
  
  const onSubmit = async (data: AddFormData) => {
    
    const formData = new FormData()
    formData.append('title', data.title)
    formData.append('author', data.author)
    formData.append('category', data.category)
    formData.append('rating', data.rating.toString())
    formData.append('description', data.description)
    formData.append('stock', data.stock.toString())
    formData.append('price', data.price.toString())
    formData.append('image', (data.image as FileList)[0])

    
    await api.post('/api/book/addbook', formData ,{
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    })
    
    .then((res) => {
      alert("Book added successfully")
      router.push('/books/listing')
    })
    .catch(() => {
      alert("Error adding book")
    })
    
    
  }
  
  
  return (
    <Box className="min-h-screen bg-stone-200 flex items-center justify-center py-10">
      <Container maxWidth="sm">
      {/* navigate to previous page */}
        <Button
          startIcon={<ArrowBackIcon />}
          variant="text"
          onClick={() => router.push('/books/listing')}
          sx={{ mb: 2, textTransform: 'none', fontSize: 16, color: '#6b4c3b' }}
        >
          Back to Listings
        </Button>

        <Paper
          elevation={6}
          sx={{
            padding: 5,
            borderRadius: 4,
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
          }}
        >
          <Typography
            variant="h4"
            align="center"
            gutterBottom
            sx={{ fontWeight: 700, fontFamily: 'serif', color: '#3b3b3b' }}
          >
            Add New Book
          </Typography>

          <Box component="form" noValidate autoComplete="off" mt={4} onSubmit={handleSubmit(onSubmit)}>
            <TextField fullWidth label="Title" margin="normal" {...register('title')} error={!!errors.title} helperText = {errors.title?.message}/>
            <TextField fullWidth label="Author" margin="normal" {...register('author')} error={!!errors.author}  helperText = {errors.author?.message}/>
            <TextField
              fullWidth
              label="Description"
              margin="normal"
              multiline
              rows={3}
              {...register('description')} 
              error={!!errors.description}
              helperText = {errors.description?.message}
            />
            <TextField fullWidth label="Price (₹)" margin="normal" type="number" {...register('price')} error={!!errors.price} helperText = {errors.price?.message}/>
            <TextField fullWidth label="Stock" margin="normal" type="number" {...register('stock')} error={!!errors.stock} helperText = {errors.stock?.message}/>

            <TextField select fullWidth label="Category" margin="normal" defaultValue="" {...register('category')} error={!!errors.category} helperText = {errors.category?.message}>
              {[
                'Fiction',
                'Non Fiction',
                'Romance',
                'Mystery & Thriller',
                'Sci-fi',
                'Biography',
                'Children',
                'Fantasy',
                'Comic & Graphics Novels',
                'Business & Economics',
                'Poetry',
                'Others',
              ].map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              fullWidth
              label="Rating (0-5)"
              margin="normal"
              type="number"
              inputProps={{ step: 0.1, min: 0, max: 5 }}
              {...register('rating')} 
              error={!!errors.rating}
              helperText = {errors.rating?.message}
            />

            <Box mt={2}>
              <Typography variant="subtitle1" fontWeight={600} mb={1}>
                Book Cover Image
              </Typography>
              <input type="file" accept="image/*" {...register('image')} onChange={handleImageChange}/>
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
              {errors.image && (
                <Typography variant="body2" color="error" sx={{ mt: 1, ml: 1 }}>
                  {errors.image.message?.toString()}
                </Typography>
              )}
            </Box>

            <Button
              type='submit'
              fullWidth
              variant="contained"
              sx={{
                mt: 4,
                py: 1.5,
                fontWeight: 600,
                backgroundColor: '#6b4c3b',
                '&:hover': {
                  backgroundColor: '#543a2e',
                },
              }}
            >
              Add Book
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  )
}

export default AddBook
