// app/page.js
import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  // Sample data for campaigns
  const campaigns = [
    {
      id: 1,
      title: "Zam Zam Water Campaign",
      description: "Help provide clean water facilities for students and faculty.",
      image: "/images/cards/ramzan.jpg",
      endDate: "March 30, 2025",
      goal: 15000,
      raised: 8750,
    },
    {
      id: 2,
      title: "Library Expansion",
      description: "Support our efforts to expand the college library with new books and digital resources.",
      image: "/images/library-campaign.jpg",
      endDate: "April 15, 2025",
      goal: 25000,
      raised: 12300,
    },
    {
      id: 3,
      title: "Scholarship Fund",
      description: "Help deserving students achieve their academic goals through scholarships.",
      image: "/images/scholarship-campaign.jpg",
      endDate: "May 1, 2025",
      goal: 50000,
      raised: 27500,
    },
  ]

  // Sample data for sponsorship options
  const sponsorshipOptions = [
    {
      id: 1,
      title: "Student Notebooks",
      description: "Provide notebooks and stationery for 100 students for the entire academic year.",
      image: "/images/cards/notebook.jpg",
      amount: 5000,
    },
    {
      id: 2,
      title: "Computer Lab Equipment",
      description: "Help upgrade the computer lab with new machines and software.",
      image: "/images/computer-lab.jpg",
      amount: 15000,
    },
    {
      id: 3,
      title: "Sports Equipment",
      description: "Support athletics by providing new sports equipment for various teams.",
      image: "/images/sports-equipment.jpg",
      amount: 8000,
    },
  ]

  // Sample data for institution branches
  const institutions = [
    {
      id: 1,
      name: "AIC Main Campus",
      image: "/images/main-campus.jpg",
      location: "Downtown",
    },
    {
      id: 2,
      name: "AIC Engineering Wing",
      image: "/images/engineering-wing.jpg",
      location: "North District",
    },
    {
      id: 3,
      name: "AIC Medical School",
      image: "/images/medical-school.jpg",
      location: "East Campus",
    },
  ]

  // Predefined donation amounts
  const donationAmounts = [10, 300, 1000]

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Banner Section */}
      <section className="relative mb-12 rounded-lg overflow-hidden shadow-lg">
        <div className="absolute inset-0">
          <Image 
            src="/images/banner.jpg" 
            alt="AIC Alumni Donation Banner" 
            fill 
            className="object-cover" 
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-transparent"></div>
        </div>
        <div className="relative z-10 p-8 md:p-12 lg:p-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            Support The Future<br />Through AIC Alumni
          </h1>
          <p className="text-lg md:text-xl text-white mb-8 max-w-2xl">
            Your contributions help build a stronger college community and support the next generation of leaders.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/donate" className="bg-white text-blue-900 px-6 py-3 rounded-lg font-semibold text-lg hover:bg-blue-50 transition">
              Donate Now
            </Link>
            <Link href="/about" className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-semibold text-lg hover:bg-white/10 transition">
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Donation Amount Buttons */}
      <section className="mb-16 text-center">
        <h2 className="text-3xl font-bold mb-8 text-gray-800">Make a Donation</h2>
        <div className="flex justify-center items-center gap-6 flex-wrap">
          {donationAmounts.map((amount) => (
            <button 
              key={amount}
              className="bg-blue-600 text-white text-xl font-bold px-8 py-4 rounded-lg hover:bg-blue-700 transition shadow-md min-w-[180px]"
              // onClick={() => {/* Handle donation */}}
            >
              ${amount}
            </button>
          ))}
          <button className="border-2 border-blue-600 text-blue-600 text-xl font-bold px-8 py-4 rounded-lg hover:bg-blue-50 transition shadow-md min-w-[180px]">
            Custom Amount
          </button>
        </div>
      </section>

      {/* Active Campaigns Section */}
      <section className="mb-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Current Campaigns</h2>
          <Link href="/campaigns" className="text-blue-600 font-semibold hover:underline">
            View All Campaigns
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {campaigns.map((campaign) => (
            <div key={campaign.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
              <div className="relative h-48">
                <Image
                  src={campaign.image}
                  alt={campaign.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 text-gray-800">{campaign.title}</h3>
                <p className="text-gray-600 mb-4">{campaign.description}</p>
                <div className="mb-4">
                  <div className="h-2 bg-gray-200 rounded-full mb-2">
                    <div 
                      className="h-2 bg-green-500 rounded-full" 
                      style={{ width: `${(campaign.raised / campaign.goal) * 100}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>${campaign.raised.toLocaleString()} raised</span>
                    <span>Goal: ${campaign.goal.toLocaleString()}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Ends: {campaign.endDate}</span>
                  <Link 
                    href={`/campaigns/${campaign.id}`}
                    className="bg-blue-600 text-white px-4 py-2 rounded font-medium hover:bg-blue-700 transition"
                  >
                    Donate
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Sponsorship Options Section */}
      <section className="mb-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Sponsorship Opportunities</h2>
          <Link href="/sponsorships" className="text-blue-600 font-semibold hover:underline">
            View All Options
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {sponsorshipOptions.map((option) => (
            <div key={option.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
              <div className="relative h-40">
                <Image
                  src={option.image}
                  alt={option.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 text-gray-800">{option.title}</h3>
                <p className="text-gray-600 mb-4">{option.description}</p>
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-700">${option.amount.toLocaleString()}</span>
                  <Link 
                    href={`/sponsorships/${option.id}`}
                    className="bg-blue-600 text-white px-4 py-2 rounded font-medium hover:bg-blue-700 transition"
                  >
                    Sponsor
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Institution Branches Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-gray-800">Support Our Institutions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {institutions.map((institution) => (
            <div key={institution.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
              <div className="relative h-40">
                <Image
                  src={institution.image}
                  alt={institution.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 text-gray-800">{institution.name}</h3>
                <p className="text-gray-600 mb-4">Location: {institution.location}</p>
                <button className="w-full bg-blue-600 text-white py-2 rounded font-medium hover:bg-blue-700 transition">
                  Donate to This Institution
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Action Buttons */}
      <section className="mb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/volunteer" className="bg-green-600 text-white rounded-lg p-6 text-center hover:bg-green-700 transition shadow-md">
            <h3 className="text-xl font-bold mb-2">Volunteer</h3>
            <p>Join our volunteer program and help make a difference</p>
          </Link>
          <Link href="/transactions" className="bg-purple-600 text-white rounded-lg p-6 text-center hover:bg-purple-700 transition shadow-md">
            <h3 className="text-xl font-bold mb-2">All Transactions</h3>
            <p>View all public donations to our initiatives</p>
          </Link>
          <Link href="/history" className="bg-orange-600 text-white rounded-lg p-6 text-center hover:bg-orange-700 transition shadow-md">
            <h3 className="text-xl font-bold mb-2">My History</h3>
            <p>View your personal donation history and impact</p>
          </Link>
        </div>
      </section>
    </div>
  )
}