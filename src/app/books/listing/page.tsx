'use client'

import React, { useEffect, useState } from 'react'
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Container,
  Grid,
  Typography,
  Button,
  Paper,
} from '@mui/material'
import Link from 'next/link'
import api from '@/lib/api'
import { BookType } from '@/types/book'


const BookListingPage = () => {

  const[book , setBook] = useState<BookType[]>([])
  //token  & user from local storage
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null)

  // const token = localStorage.getItem('token')
  // const user = JSON.parse(localStorage.getItem('user') || '{}')
  // const userRole = user?.role

  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)

  const limit = 6
  const skip = (page -1) * limit
  const totalPages = Math.ceil(total/limit)


  useEffect(() => {
    // ✅ This code runs only in the browser (not on server)
    if (typeof window !== 'undefined') {
      // Get token from localStorage
      const storedToken = localStorage.getItem('token');

      // Get user info (like role) from localStorage
      const storedUser = localStorage.getItem('user');
      const user = storedUser ? JSON.parse(storedUser) : null;

      // Save values to state
      setToken(storedToken);
      setRole(user?.role || null); // role might be "seller", "admin", etc.
    }
  }, []);

  useEffect(() => {

    if (!token) return; // ⛔ don't call API if token not ready

    api.get(`/api/book?limit=${limit}&skip=${skip}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    })
    .then((res) => {
      setBook(res.data.data)
      setTotal(res.data.total);
    })
    .catch((err) => {
      alert('Error fetching books')
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[page,token])

  return (
    <Box className="bg-stone-200 min-h-screen py-10">
      <Container maxWidth="lg">
        {/* Title + Add Product */}
        <Box
          display="flex"
          justifyContent={{ xs: 'center', sm: 'space-between' }}
          alignItems="center"
          flexWrap="wrap"
          mb={4}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              fontFamily: 'serif',
              color: '#4b2e2e',
              mb: { xs: 2, sm: 0 },
            }}
          >
            Explore Our Collection
          </Typography>

        {role === 'seller' && (

          <Link href="/books/add">
            <Button
              variant="contained"
              sx={{
                backgroundColor: '#6b4c3b',
                margin: '30px',
                color: 'white',
                fontWeight: 600,
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: '#543a2e',
                },
              }}
            >
              + Add Product
            </Button>
          </Link>
        )}
        </Box>

        {/* Book Grid */}
        <Grid container spacing={4}>
          {book.map((b: BookType) => (
            <Grid item xs={12} sm={6} md={4} key={b._id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 3,
                  boxShadow: 3,
                }}
              >
                <CardMedia
                  component="img"
                  image={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${b.image}`}
                  alt={b.title}
                  sx={{ height: 240, objectFit: 'contain', p: 2 }}
                />
                <CardContent sx={{height: '100%'}} >
                  <Typography variant="h6" fontWeight={600}>
                    {b.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    by {b.author}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {b.description.slice(0, 70)}...
                  </Typography>
                </CardContent>
                <Box textAlign="center" mb={2}>
                  <Link href={`/books/view/${b._id}`}>
                    <Button variant="outlined" size="small">
                      View More
                    </Button>
                  </Link>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>

       {/* Pagination */}
        <Box display="flex" justifyContent="center" alignItems="center" gap={2} mt={6}>
          <Button
            variant="outlined"
            disabled={page === 1}
            onClick={() => setPage((prev) => prev - 1)}
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              px: 3,
              color: '#4b2e2e',
              borderColor: '#4b2e2e',
              '&:hover': {
                backgroundColor: '#f1e5d1',
                borderColor: '#4b2e2e',
              },
            }}
          >
            Previous
          </Button>

          <Typography variant="body1" fontWeight={600}>
            Page {page} of {totalPages || 1}
          </Typography>

          <Button
            variant="outlined"
            disabled={page === totalPages || totalPages === 0}
            onClick={() => setPage((prev) => prev + 1)}
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              px: 3,
              color: '#4b2e2e',
              borderColor: '#4b2e2e',
              '&:hover': {
                backgroundColor: '#f1e5d1',
                borderColor: '#4b2e2e',
              },
            }}
          >
            Next
          </Button>
        </Box>

      </Container>
    </Box>
  )
}

export default BookListingPage
