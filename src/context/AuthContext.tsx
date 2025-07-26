'use client'

import React, { createContext, useEffect, useState , ReactNode, useContext} from 'react'

interface AuthContextType {
    token: string | null
    setToken: (token: string | null ) => void
}

const AuthContext = createContext<AuthContextType>({
    token: null, 
    setToken : () => {}
})


export const AuthProvider = ({children}: {children: ReactNode}) => {

    const[token , setToken] = useState<string | null>(null) 

    useEffect(() => {
        const storedToken = localStorage.getItem('token')
        setToken(storedToken)
    },[])

    // const setToken = (newToken: string | null) => {
    //     if(newToken){
    //         localStorage.setItem('token', newToken)
    //     }else{
    //         localStorage.removeItem('token')
    //     }
    //     setTokenState(newToken)
    // }

    return (
            
    <AuthContext.Provider value={{token , setToken}}>
        {children}
    </AuthContext.Provider>
  )
}


export const useAuth = () => useContext(AuthContext)