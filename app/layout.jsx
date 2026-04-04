import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';

export const metadata = {
  title: "InterviewAI - Ace Your Next Interview",
  description: "Practice with AI-powered interview platform",
};

export default function RootLayout({ children }) {
  return (
 
  <ClerkProvider>
    
    
    <html lang="en">
      <body className=" bg-gradient-to-br from-black via-[#0f172a] to-blue-900 text-gray-900">{children}</body>
    </html>
  </ClerkProvider>
  )
}
