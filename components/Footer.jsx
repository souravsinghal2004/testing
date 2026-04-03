import React from 'react'
import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa'

const Footer = () => {
  return (
    <footer className="bg-zinc-900 text-gray-300 py-5 border-t border-zinc-800">
      <div className="container mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4">

        {/* Left */}
        <div className="text-center sm:text-left space-y-0.5">
          <h4 className="text-sm font-semibold">Sourav Singhal</h4>
          <p className="text-xs">© {new Date().getFullYear()} All rights reserved.</p>
        </div>

        {/* Middle */}
        <div className="text-center">
          <p className="text-xs text-gray-400">
            Let’s build something amazing together.
          </p>
          <a
            href="mailto:contactsouravsinghal@gmail.com"
            className="text-blue-400 text-xs hover:underline"
          >
            contactsouravsinghal@gmail.com
          </a>
        </div>

        {/* Right */}
        <div className="flex gap-4 text-xs">
          <a
            href="https://github.com/souravsinghal2004"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center hover:text-blue-400 transition"
          >
            <FaGithub className="text-lg" />
          </a>

          <a
            href="https://www.linkedin.com/in/sourav-singhal-a860b5259/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center hover:text-blue-400 transition"
          >
            <FaLinkedin className="text-lg text-blue-500" />
          </a>

          <a
            href="https://mail.google.com/mail/?view=cm&fs=1&to=contactsouravsinghal@gmail.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center hover:text-blue-400 transition"
          >
            <FaEnvelope className="text-lg text-red-400" />
          </a>
        </div>

      </div>
    </footer>
  )
}

export default Footer