import React from 'react'

const AdminLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full text-center">
        <h1 className="text-3xl font-bold mb-4 text-blue-700">Welcome to HomePage!</h1>
        <p className="text-gray-600">This is your admin. You have successfully logged in.</p>
      </div>
    </div>
  )
}

export default AdminLayout
