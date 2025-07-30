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
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useParams, useRouter } from 'next/navigation';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form'
import * as yup from 'yup';
import api from '@/lib/api';
import Image from 'next/image';
import toast from 'react-hot-toast';


const schema = yup.object().shape({
  title: yup.string().required('Title is required'),
  author: yup.string().required("Author is required"),
  description: yup.string().required('Description is required').min(10, "Minimum 10 characters"),
  price: yup
    .number()
    .typeError('Price must be a number')
    .required('Price is required')
    .positive('Price must be positive'),

  stock: yup
    .number()
    .typeError('Stock must be a number')
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

  // Image is optional in update
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

type UpdateFormData = yup.InferType<typeof schema>


const UpdateBook = () => {

  const params = useParams()
  const id = params?.id
  const router = useRouter()
  const token = localStorage.getItem('token')
  //preview image
  const [ previewImageUrl, setPreviewImageUrl] =useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors } ,
    setValue,
    reset,
    watch,
   } = useForm({
      resolver: yupResolver(schema),
      defaultValues: {
        title: '',
        author: '',
        description: '',
        price: 0,
        stock: 0,
        category: '',
        rating: 0,
    },
    })


    //function to handle file selection
    const handleImagechange = (e: React.ChangeEvent<HTMLInputElement>) =>{
      const file = e.target.files?.[0]
      if(file && ['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)){
        setPreviewImageUrl(URL.createObjectURL(file))
      }

      register('image').onChange(e)
    }


    useEffect(() => {

      api.get(`/api/book/viewbook/${id}`,{
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then((res) => {

        const data = res.data.data;

        reset({
          title: data.title,
          author: data.author,
          description: data.description,
          price: data.price,
          stock: data.stock,
          category: data.category,
          rating: data.rating,
        })

        if (data.image) {
          // assuming `data.image` is the path or URL
          const imagePath = data.image.replace(/\\/g, '/');
          setPreviewImageUrl(`${process.env.NEXT_PUBLIC_BACKEND_URL}/${imagePath}`);
        }

      })
      .catch(() => {
        toast.error('error fetching data')
      })
     // eslint-disable-next-line react-hooks/exhaustive-deps
    },[id])

    const onSubmit = async(data: UpdateFormData) => {
      try{

        const formData = new FormData()
        formData.append('title', data.title)
        formData.append('author', data.author)
        formData.append('description', data.description)
        formData.append('price', data.price.toString())
        formData.append('stock', data.stock.toString())
        formData.append('category', data.category)
        formData.append('rating', data.rating.toString())


        const imageFile = (data.image as FileList)?.[0]
        if (imageFile) {
          formData.append('image', imageFile)
        }


        await api.patch(`/api/book/updatebook/${id}`, formData,{
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
          })
          .then((res) => { 
            toast.success('Book Updated Successfully!')
            router.push(`/books/view/${id}`)
        })
      }
      catch{
        toast.error('error updating book!')
      }
    }
  

  return (
    <Box className="min-h-screen bg-stone-200 flex items-center justify-center py-10">
      <Container maxWidth="sm">

        {/* navigation to previous page */}
        <Button
            startIcon={<ArrowBackIcon />}
            variant="text"
            onClick={() => router.push(`/books/view/${id}`)}
            sx={{ mb: 2, textTransform: 'none', fontSize: 16, color: '#6b4c3b' }}
          >
            Back to View
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
            Update Book Details
          </Typography>

          <Box component="form" noValidate autoComplete="off" mt={4} onSubmit={handleSubmit(onSubmit)} encType='multipart/form-data'>
           
            <TextField 
              fullWidth 
              label="Title" 
              margin="normal" 
              {...register('title')} 
              value={watch('title') || ''} 
              helperText={errors.title?.message} 
              error={!!errors.title}/>

            <TextField 
              fullWidth 
              label="Author" 
              margin="normal" 
              {...register('author')} 
              value={watch('author') || ''} 
              helperText={errors.author?.message} 
              error={!!errors.author}/>

            <TextField
              fullWidth
              label="Description"
              margin="normal"
              multiline
              rows={3}
              {...register('description')}
              value={watch('description') || ''}
              helperText={errors.description?.message}
              error={!!errors.description}
            />

            <TextField 
              fullWidth 
              label="Price (₹)" 
              margin="normal" 
              type="number" 
              {...register('price')}
              helperText={errors.price?.message} 
              error={!!errors.price}/>

            <TextField 
              fullWidth 
              label="Stock" 
              margin="normal" 
              type="number" 
              {...register('stock')} 
              helperText={errors.stock?.message}
              error={!!errors.stock}/>

            <TextField select fullWidth label="Category" margin="normal" {...register('category')} value={watch('category') || ''} helperText={errors.category?.message} error={!!errors.category}>
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
              helperText={errors.rating?.message}
              error={!!errors.rating}
            />

            <Box mt={2}>
              <Typography variant="subtitle1" fontWeight={600} mb={1}>
                Update Book Cover Image
              </Typography>
              <input type="file" accept="image/*" {...register('image')} onChange={handleImagechange}/>
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
              Save Changes
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  )
}

export default UpdateBook
