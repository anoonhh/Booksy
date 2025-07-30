

'use client'

import React, { useEffect, useState } from 'react'
import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  Paper,
} from '@mui/material'
import { BookType } from '@/types/book'
import { useParams, useRouter } from 'next/navigation'
import api from '@/lib/api'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import toast from 'react-hot-toast'

const ViewBookPage = () => {
  const [book, setBook] = useState<BookType>()
  const params = useParams()
  const id = params.id
  const token = localStorage.getItem('token')
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const role = user?.role
  const router = useRouter()

 

  useEffect(() => {
    api
      .get(`/api/book/viewbook/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setBook(res.data.data)
      })
      .catch((err) => {
        toast.error('Unable to load book!')
      })
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  if (!book) {
    return (
      <Box className="min-h-screen flex items-center justify-center">
        <Typography variant="h6">Loading...</Typography>
      </Box>
    )
  }

  //Delete function

  const handleDelete = async () => {
    const confirm = window.confirm("Are you sure want to delete?")
    if(!confirm) return 


   await api.patch(`/api/book/delete/${id}`, {},{
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(() => {
      toast.success('Book deleted successfully!')
      router.push('/books/listing')
    })
    .catch(() => {
      toast.error('Unable to delete book!')
    })
  }

  return (
    <Box className="bg-stone-200 min-h-screen py-12">
      <Container maxWidth="md">
        {/* navigate to previous page */}
        <Button
          startIcon={<ArrowBackIcon />}
          variant="text"
          onClick={() => router.push('/books/listing')}
          sx={{ mb: 2, textTransform: 'none', fontSize: 16, color: '#6b4c3b' }}
        >
          Back to Listings
        </Button>

        <Paper elevation={4} sx={{ borderRadius: 4, p: 4 }}>
          <Grid container spacing={4} alignItems="center">
            {/* Book Image */}
            <Grid item xs={12} md={5}>
              <Box
                component="img"
                src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${book.image}`}
                alt={book.title}
                sx={{
                  width: '100%',
                  maxHeight: 400,
                  objectFit: 'contain',
                  borderRadius: 3,
                }}
              />
            </Grid>

            {/* Book Info */}
            <Grid item xs={12} md={7}>
              <Typography
                variant="h4"
                fontWeight={700}
                fontFamily="serif"
                color="text.primary"
              >
                {book.title}
              </Typography>

              <Typography
                variant="subtitle1"
                color="text.secondary"
                sx={{ mt: 1 }}
              >
                by {book.author}
              </Typography>

              {/* Category — styled like author */}
              <Typography
                variant="subtitle2"
                color="text.secondary"
                sx={{ mt: 0.5 }}
              >
                Category: {book.category}
              </Typography>

              <Typography
                variant="body1"
                sx={{ mt: 3, lineHeight: 1.8, color: '#4b4b4b' }}
              >
                {book.description}
              </Typography>

              {/* Stock, Rating, Price */}
              <Box sx={{ mt: 4 }}>
                <Typography
                  variant="body2"
                  sx={{ color: '#4b4b4b', mb: 0.5 }}
                >
                  <strong>Stock:</strong>{' '}
                  {book.stock > 0 ? book.stock : 'Out of Stock'}
                </Typography>

                <Typography
                  variant="body2"
                  sx={{ color: '#4b4b4b', mb: 1 }}
                >
                  <strong>Rating:</strong> {book.rating} / 5
                </Typography>

                <Typography
                  variant="h6"
                  fontWeight={600}
                  sx={{ color: '#6b4c3b' }}
                >
                  Price: ₹{book.price}
                </Typography>
              </Box>

              {/* buy now button */}
              {role === 'buyer' && (
                <Button
                  variant="contained"
                  size="large"
                  sx={{
                    mt: 3,
                    backgroundColor: '#6b4c3b',
                    '&:hover': {
                      backgroundColor: '#543a2e',
                    },
                  }}
                >
                  Buy Now
                </Button>
              )}

              {/* update & delete button */}
              {role === 'seller' && (
                <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                  <Button
                    variant="contained"
                    size="large"
                    sx={{
                      backgroundColor: '#6b4c3b',
                      color: 'white',
                      fontWeight: 600,
                      '&:hover': {
                        backgroundColor: '#543a2e',
                      },
                    }}
                    onClick={() => router.push(`/books/update/${book._id}`)}
                  >
                    Update
                  </Button>

                  <Button
                    variant="contained"
                    size="large"
                    sx={{
                      backgroundColor: '#a83232',
                      color: 'white',
                      fontWeight: 600,
                      '&:hover': {
                        backgroundColor: '#821d1d',
                      },
                    }}
                    onClick={handleDelete}
                  >
                    Delete
                  </Button>
                </Box>
              )}
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  )
}

export default ViewBookPage
