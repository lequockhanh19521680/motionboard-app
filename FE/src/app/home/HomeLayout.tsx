import React from 'react'
import { Container } from '@mui/material'
import { Categories } from './Categories'
import { MainContent } from './MainContent'
import { motion } from 'framer-motion'
import { Banner } from '../../components/common/media'

const HomeLayout: React.FC = () => {
  return (
    <Container maxWidth="xl" className="py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Banner />
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Categories />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="md:col-span-3"
        >
          <MainContent />
        </motion.div>
      </div>
    </Container>
  )
}

export default HomeLayout
