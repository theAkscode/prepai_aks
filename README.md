# AI Mock Interview Platform 🎯

An intelligent AI-powered mock interview platform built with Next.js that helps users practice and prepare for job interviews with personalized questions and instant feedback.

## 🚀 Features

- **AI-Generated Questions**: Custom interview questions tailored to your job role, tech stack, and experience level
- **Real-time Interview Practice**: Practice with webcam and microphone recording
- **Instant AI Feedback**: Detailed feedback on your answers with ratings and improvement suggestions
- **Interview History**: Track all your previous mock interviews and review feedback
- **Multiple Pricing Tiers**: Free, Pro, and Enterprise plans with Stripe integration
- **Secure Authentication**: User authentication powered by Clerk
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) with App Router
- **Language**: JavaScript/React 19
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Database**: [Neon PostgreSQL](https://neon.tech/) with [Drizzle ORM](https://orm.drizzle.team/)
- **Authentication**: [Clerk](https://clerk.com/)
- **AI**: [Google Gemini API](https://ai.google.dev/)
- **Payments**: [Stripe](https://stripe.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Icons**: [Lucide Icons](https://lucide.dev/)
- **Deployment**: [Vercel](https://vercel.com/)

## 📋 Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- A Clerk account (free tier available)
- A Neon database account (free tier available)
- A Google AI API key for Gemini
- (Optional) A Stripe account for payment processing

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/ai-mock-interview.git
   cd ai-mock-interview
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key

   # Database (Neon PostgreSQL)
   DRIZZLE_DB_URL=your_neon_database_url
   NEXT_PUBLIC_DRIZZLE_DB_URL=your_neon_database_url

   # Google Gemini AI
   NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key

   # Stripe (Optional - for payments)
   STRIPE_SECRET_KEY=your_stripe_secret_key
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   STRIPE_PRO_PRICE_ID=your_pro_price_id
   STRIPE_ENTERPRISE_PRICE_ID=your_enterprise_price_id

   # App Configuration
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Push database schema**
   ```bash
   npm run db:push
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
prepai/
├── app/
│   ├── (auth)/              # Authentication pages
│   ├── api/                 # API routes
│   ├── dashboard/           # Main dashboard pages
│   │   ├── _components/     # Reusable dashboard components
│   │   ├── how/            # How It Works page
│   │   ├── interview/      # Interview flow pages
│   │   ├── questions/      # FAQ page
│   │   └── upgrade/        # Pricing/upgrade page
│   └── layout.js           # Root layout
├── components/ui/          # Reusable UI components
├── utils/
│   ├── db.js               # Database configuration
│   ├── GeminiAiModel.js    # AI integration
│   └── schema.js           # Database schema
└── public/                 # Static assets
```

## 🎯 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:push` - Push database schema to Neon
- `npm run db:studio` - Open Drizzle Studio

## 🚀 Deployment

Deploy to Vercel in minutes! See `DEPLOYMENT_GUIDE.md` for detailed instructions.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

## 📖 Usage

1. **Sign Up/Login**: Create an account using Clerk authentication
2. **Create Interview**: Click "+ Add New" and fill in job details
3. **Start Interview**: Enable webcam/microphone and answer AI-generated questions
4. **Get Feedback**: Review detailed feedback and ratings
5. **Track Progress**: View all previous interviews in your dashboard

## 📚 Documentation

- `DEPLOYMENT_GUIDE.md` - Complete Vercel deployment guide
- `STRIPE_SETUP.md` - Stripe integration setup
- `STRIPE_QUICKSTART.md` - Quick Stripe configuration
- `ENV_VARIABLES_CHECKLIST.md` - Environment variables reference

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [Vercel](https://vercel.com/)
- [Clerk](https://clerk.com/)
- [Neon](https://neon.tech/)
- [Google AI](https://ai.google.dev/)
- [shadcn/ui](https://ui.shadcn.com/)

---

**Made with ❤️ using Next.js and AI**
