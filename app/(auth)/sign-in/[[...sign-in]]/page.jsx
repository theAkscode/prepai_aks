import { SignIn } from '@clerk/nextjs'
import Image from 'next/image';
export default function Page() {
  return (
    <section className="bg-white">
      <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
        <aside className="relative block h-16 lg:order-last lg:col-span-5 lg:h-full xl:col-span-6">
          <Image
            alt="An abstract technology background"
            src="/signIn.png"
            className="absolute inset-0 h-full w-full object-cover"
            fill
          />
        </aside>
        <main className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6">
          <div className="max-w-xl lg:max-w-3xl">
            {/* The main heading and logo section */}
            <h1 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl">
              PrepAI: Mastery, Powered by AI. 🚀💡
            </h1>

            {/* The paragraph element for the tagline */}
            <p className="mt-4 leading-relaxed text-gray-500 text-center">
              Sign in to unlock smarter preparation!!
            </p>

            {/* The Clerk SignIn component goes directly below the tagline */}
            <div className="mt-8">
              <SignIn routing="path" path="/sign-in" />
            </div>

          </div>
        </main>
      </div>
    </section>
  );
}