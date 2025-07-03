import React from 'react'
import { Container } from '@mui/material'
import { Categories } from './Categories'
import { MainContent } from './MainContent'

const HomeLayout: React.FC = () => {
  return (
    <Container maxWidth="xl" className="py-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Categories />
        <MainContent />
      </div>
    </Container>
  )
}

export default HomeLayout
