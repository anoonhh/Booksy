'use client'

import { AppBar, Box, Toolbar, Typography, IconButton, Drawer, List, ListItem, ListItemText, Button } from '@mui/material'
import Link from 'next/link'
import MenuIcon from '@mui/icons-material/Menu'
import React, { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'

const Header = () => {
  const [drawerOpen, setDrawerOpen] = useState(false)

  const toggleDrawer = (open: boolean) => () => {
    setDrawerOpen(open)
  }

  // const token = localStorage.getItem('token')
  const {token} = useAuth()
  const router = useRouter()

  return (
    <Box sx={{ flexGrow: 1, padding: '15px' }} >
      <AppBar
        position="static"
        sx={{
          backgroundColor: 'transparent',
          boxShadow: 'none',
        }}
      >
        <Toolbar
          variant="dense"
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            px: { xs: 4, md: 8},
          }}
        >
          {/* Left: Logo */}
          <Link href="/" >
            <Typography
              variant="h6"
              sx={{
                color: '#1f2937',
                fontSize: { xs: '1.4rem', md: '1.8rem' },
                fontWeight: 700,
                fontFamily: 'serif',
                cursor: 'pointer',
              }}
            >
              Booksy
            </Typography>
          </Link>

          {/* Right: Nav (desktop) */}

            {!token ? (
              
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 4, alignItems: 'center' }}>
            <Link href="/">
              <Typography
                sx={{
                  color: '#374151',
                  fontWeight: 500,
                  fontSize: '1rem',
                  fontFamily:'serif',
                  cursor: 'pointer',
                  '&:hover': {
                    color: '#6b4c3b',
                    textDecoration: 'none',
                  },
                }}
              >
                Home
              </Typography>
            </Link>
            <Link href="/login">
              <Typography
                sx={{
                  color: '#374151',
                  fontWeight: 500,
                  fontSize: '1rem',
                  fontFamily:'serif',
                  cursor: 'pointer',
                  '&:hover': {
                    color: '#6b4c3b',
                    textDecoration: 'none',
                  },
                }}
              >
                Login
              </Typography>
            </Link>

          </Box>
              
            ) : (
              <Box sx={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                <Link href="/books/listing">
                  <Typography
                    sx={{
                      color: '#374151',
                      fontWeight: 500,
                      fontSize: '1rem',
                      cursor: 'pointer',
                      fontFamily: 'serif',
                      '&:hover': {
                        color: '#6b4c3b',
                        textDecoration: 'none',
                      },
                    }}
                  >
                    Browse
                  </Typography>
                </Link>

                <Link href="/user/profile/view">
                  <Typography
                    sx={{
                      color: '#374151',
                      fontWeight: 500,
                      fontSize: '1rem',
                      cursor: 'pointer',
                      fontFamily: 'serif',
                      '&:hover': {
                        color: '#6b4c3b',
                        textDecoration: 'none',
                      },
                    }}
                  >
                    Profile
                  </Typography>
                </Link>
                {/* <Button
                  onClick={() => {
                    setToken(null)
                    router.push('/')
                  }}
                  sx={{
                    color: '#a83232',
                    fontWeight: 600,
                    textTransform: 'none',
                    '&:hover': { color: '#821d1d' }
                  }}
                >
                  Logout
                </Button> */}
              </Box>

            )}

          {/* Hamburger Icon (mobile) */}
          <IconButton
            edge="end"
            sx={{ display: { xs: 'block', md: 'none' }, color: '#374151' }}
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
        <Box sx={{ width: 250, mt: 5 }} role="presentation" onClick={toggleDrawer(false)}>
          <List>
            <Link href="/" passHref>
              <ListItem button>
                <ListItemText primary="Home" />
              </ListItem>
            </Link>
            <Link href="/login" passHref>
              <ListItem button>
                <ListItemText primary="Login" />
              </ListItem>
            </Link>
          </List>
        </Box>
      </Drawer>
    </Box>
  )
}

export default Header
