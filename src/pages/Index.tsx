import { useState, useEffect } from "react";
import { ArrowRight, Shield, TrendingUp, Users, BarChart3, CheckCircle, Menu, X, Star, Phone, Mail, MapPin, Award, Target, Zap, Globe, ChevronDown, Plus, Minus, Building } from "lucide-react";
import "../styles/css/homepage.css";
import Logo from "../../public/logo_transparent_color.png";
import LogoWhite from "../../public/logoWhite.png";
import HeroImg from "../../public/hero.jpg";

const Index = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentTypeText, setCurrentTypeText] = useState("");
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [activeService, setActiveService] = useState(0);
  const [openFAQ, setOpenFAQ] = useState(null);

  const typeWords = [
    "Financial Future",
    "Investment Strategy",
    "Wealth Portfolio",
    "Business Growth",
    "Market Position"
  ];

  // Typing effect
  useEffect(() => {
    let timeout;
    const currentWord = typeWords[currentWordIndex];

    if (isTyping) {
      if (currentTypeText.length < currentWord.length) {
        timeout = setTimeout(() => {
          setCurrentTypeText(currentWord.slice(0, currentTypeText.length + 1));
        }, 100);
      } else {
        timeout = setTimeout(() => {
          setIsTyping(false);
        }, 2000);
      }
    } else {
      if (currentTypeText.length > 0) {
        timeout = setTimeout(() => {
          setCurrentTypeText(currentTypeText.slice(0, -1));
        }, 50);
      } else {
        setCurrentWordIndex((prev) => (prev + 1) % typeWords.length);
        setIsTyping(true);
      }
    }

    return () => clearTimeout(timeout);
  }, [currentTypeText, currentWordIndex, isTyping, typeWords]);

  const services = [
    {
      title: "Wealth Management",
      description: "Comprehensive wealth building strategies tailored to your financial goals and risk tolerance.",
      icon: <TrendingUp className="h-8 w-8" />,
      features: ["Portfolio Diversification", "Risk Assessment", "Performance Tracking"]
    },
    {
      title: "Investment Planning",
      description: "Strategic investment solutions to maximize returns while minimizing risks for sustainable growth.",
      icon: <BarChart3 className="h-8 w-8" />,
      features: ["Market Analysis", "Asset Allocation", "Return Optimization"]
    },
    {
      title: "Risk Management",
      description: "Advanced risk assessment and mitigation strategies to protect your financial interests.",
      icon: <Shield className="h-8 w-8" />,
      features: ["Risk Analysis", "Insurance Planning", "Emergency Funds"]
    },
    {
      title: "Tax Optimization",
      description: "Strategic tax planning to minimize liabilities and maximize after-tax returns.",
      icon: <Target className="h-8 w-8" />,
      features: ["Tax Strategies", "Deduction Planning", "Compliance Management"]
    },
    {
      title: "Retirement Planning",
      description: "Comprehensive retirement strategies to ensure financial security in your golden years.",
      icon: <Award className="h-8 w-8" />,
      features: ["Pension Planning", "401k Optimization", "Income Strategies"]
    },
    {
      title: "Business Advisory",
      description: "Expert business financial guidance for sustainable growth and profitability.",
      icon: <Globe className="h-8 w-8" />,
      features: ["Cash Flow Management", "Growth Planning", "Exit Strategies"]
    }
  ];

  const faqs = [
    {
      question: "How secure is the OUR CEO platform?",
      answer: "We use bank-level security with 256-bit SSL encryption, multi-factor authentication, and comply with all major financial regulations including SOC 2 Type II certification."
    },
    {
      question: "What makes OUR CEO different from other financial platforms?",
      answer: "Our platform is specifically designed for executives and business leaders, offering advanced analytics, personalized insights, and dedicated support from experienced financial advisors."
    },
    {
      question: "How quickly can I get started?",
      answer: "You can start using our platform immediately after signup. Our onboarding process takes just 10 minutes, and you'll have access to all features right away."
    },
    {
      question: "Do you offer personalized financial advice?",
      answer: "Yes, all our clients get access to certified financial advisors who provide personalized strategies based on your specific goals, risk tolerance, and financial situation."
    },
    {
      question: "What is the minimum investment required?",
      answer: "There's no minimum investment required to use our platform. However, for personalized advisory services, we recommend a minimum portfolio value of $100,000."
    },
    {
      question: "Can I integrate OUR CEO with my existing financial accounts?",
      answer: "Absolutely! Our platform integrates with over 10,000 financial institutions, allowing you to see all your accounts in one unified dashboard."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 homepage-wrapper">
      {/* Navigation */}
      <nav className="w-full bg-white/30 backdrop-blur-lg border-b border-white/20 shadow-md fixed top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 lg:h-20">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <img src={Logo} alt="logo" className="max-w-[200px]" />
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              <a href="#features" className="text-gray-700 hover:text-[#002cb1] transition-colors font-medium text-sm xl:text-base">
                Features
              </a>
              <a href="#services" className="text-gray-700 hover:text-[#002cb1] transition-colors font-medium text-sm xl:text-base">
                Services
              </a>
              <a href="#about" className="text-gray-700 hover:text-[#002cb1] transition-colors font-medium text-sm xl:text-base">
                About
              </a>
              <a href="#faq" className="text-gray-700 hover:text-[#002cb1] transition-colors font-medium text-sm xl:text-base">
                FAQ
              </a>
              <a href="#contact" className="text-gray-700 hover:text-[#002cb1] transition-colors font-medium text-sm xl:text-base">
                Contact
              </a>
              <a
                href="/login"
                className="bg-orange text-white px-6 py-2.5 rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200 font-semibold text-sm xl:text-base"
              >
                Login
              </a>
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-md text-gray-700 hover:text-[#002cb1]"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="lg:hidden bg-white border-t border-gray-200 py-4">
              <div className="flex flex-col space-y-3">
                <a href="#features" className="text-gray-700 hover:text-[#002cb1] px-4 py-2 font-medium">
                  Features
                </a>
                <a href="#services" className="text-gray-700 hover:text-[#002cb1] px-4 py-2 font-medium">
                  Services
                </a>
                <a href="#about" className="text-gray-700 hover:text-[#002cb1] px-4 py-2 font-medium">
                  About
                </a>
                <a href="#faq" className="text-gray-700 hover:text-[#002cb1] px-4 py-2 font-medium">
                  FAQ
                </a>
                <a href="#contact" className="text-gray-700 hover:text-[#002cb1] px-4 py-2 font-medium">
                  Contact
                </a>
                <a
                  href="/login"
                  className="mx-4 bg-primary text-white px-6 py-2.5 rounded-lg text-center font-semibold"
                >
                  Login
                </a>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#002cb1]/10 to-blue-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24 xl:py-32">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-6 lg:space-y-8">
              <div className="space-y-4 lg:space-y-6">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 leading-tight">
                  Transform Your
                  <span className="block bg-gradient-to-br from-primary to-[#80C0DCFF] bg-clip-text text-transparent min-h-[1.2em]">
                    {currentTypeText}
                    <span className="animate-pulse">|</span>
                  </span>
                </h1>
                <p className="text-lg sm:text-xl lg:text-xl text-gray-600 leading-relaxed max-w-2xl">
                  Comprehensive financial advisory management system designed for modern CEOs and business leaders.
                  Make data-driven decisions with our advanced analytics and personalized insights.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="/login"
                  className="group bg-orange text-white px-6 lg:px-8 py-3 lg:py-4 rounded-xl hover:shadow-xl transform hover:scale-105 transition-all duration-200 font-semibold text-base lg:text-lg flex items-center justify-center"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </a>
                <button className="border-2 border-gray-300 text-gray-700 px-6 lg:px-8 py-3 lg:py-4 rounded-xl hover:border-orange hover:text-orange transition-all duration-200 font-semibold text-base lg:text-lg">
                  Watch Demo
                </button>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-8 space-y-4 sm:space-y-0">
                <div className="flex items-center space-x-2">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white">
                      <img
                        src="https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg"
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white">
                      <img
                        src="https://images.pexels.com/photos/1462980/pexels-photo-1462980.jpeg"
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white">
                      <img
                        src="https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg"
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <span className="text-sm text-gray-600 font-medium">2000+ Happy Clients</span>
                </div>
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-orange fill-current" />
                  ))}
                  <span className="text-sm text-gray-600 ml-2 font-medium">4.9/5 Rating</span>
                </div>
              </div>
            </div>

            {/* Right Image/Dashboard */}
            <div className="relative lg:order-last">
              {/* Main Dashboard Image */}
              <div className="relative rounded-2xl lg:rounded-3xl shadow-2xl overflow-hidden">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl lg:rounded-2xl">
                  <img src={HeroImg} alt="" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-12 lg:mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">Powerful Features</h2>
            <p className="text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to manage your financial advisory business efficiently and effectively
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {[
              {
                icon: <BarChart3 className="h-8 w-8" />,
                title: "Advanced Analytics",
                description: "Real-time insights and comprehensive reporting to track your financial performance with precision"
              },
              {
                icon: <Users className="h-8 w-8" />,
                title: "Client Management",
                description: "Streamlined client onboarding, profile management, and communication tools for better relationships"
              },
              {
                icon: <Shield className="h-8 w-8" />,
                title: "Bank-Level Security",
                description: "Enterprise-grade security with end-to-end encryption and full compliance with industry standards"
              },
              {
                icon: <TrendingUp className="h-8 w-8" />,
                title: "Portfolio Tracking",
                description: "Monitor investments, track performance, and optimize asset allocation strategies in real-time"
              },
              {
                icon: <CheckCircle className="h-8 w-8" />,
                title: "Compliance Tools",
                description: "Built-in compliance monitoring and automated regulatory reporting capabilities"
              },
              {
                icon: <Zap className="h-8 w-8" />,
                title: "24/7 Support",
                description: "Round-the-clock customer support with dedicated account managers for enterprise clients"
              }
            ].map((feature, index) => (
              <div key={index} className="group p-6 lg:p-8 rounded-xl border border-gray-200 hover:border-[#002cb1]/30 hover:shadow-xl transition-all duration-300 bg-white">
                <div className="bg-gradient-to-br from-primary to-[#80C0DCFF] text-white p-3 lg:p-4 rounded-lg w-fit mb-4 lg:mb-6 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl lg:text-2xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Services Section */}
      <section id="services" className="py-16 lg:py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-12 lg:mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">Our Services</h2>
            <p className="text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive financial advisory services tailored for your business success
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            {/* Service Navigation */}
            <div className="space-y-4">
              {services.map((service, index) => (
                <div
                  key={index}
                  className={`group cursor-pointer p-4 lg:p-6 rounded-xl transition-all duration-300 ${activeService === index
                    ? 'bg-[#ffffff] text-black shadow-xl'
                    : 'bg-white hover:bg-gray-50 hover:shadow-lg'
                    }`}
                  onClick={() => setActiveService(index)}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-lg bg-gradient-to-br from-primary to-[#80C0DCFF] text-white`}>
                      {service.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className={`text-lg lg:text-xl font-semibold mb-2 ${activeService === index ? 'text-black' : 'text-gray-900'
                        }`}>
                        {service.title}
                      </h3>
                      <p className={`text-sm lg:text-base ${activeService === index ? 'text-gray-700' : 'text-gray-600'
                        }`}>
                        {service.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Service Details */}
            <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-xl sticky top-[100px]">
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-primary text-white p-4 rounded-xl">
                    {services[activeService].icon}
                  </div>
                  <div>
                    <h3 className="text-2xl lg:text-3xl font-bold text-gray-900">
                      {services[activeService].title}
                    </h3>
                    <p className="text-gray-600">Detailed Overview</p>
                  </div>
                </div>

                <p className="text-lg text-gray-700 leading-relaxed">
                  {services[activeService].description}
                </p>

                <div className="space-y-3">
                  <h4 className="text-lg font-semibold text-gray-900">Key Features:</h4>
                  {services[activeService].features.map((feature, idx) => (
                    <div key={idx} className="flex items-center space-x-3">
                      <div className="bg-primary p-1 rounded-full">
                        <CheckCircle className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-gray-700 font-medium">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4">
                  <a
                    href="/login"
                    className="inline-flex items-center bg-orange text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200"
                  >
                    Learn More
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced About Section */}
      <section id="about" className="py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <div className="space-y-6 lg:space-y-8">
              <div>
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 lg:mb-6">About OUR CEO</h2>
                <p className="text-lg text-gray-600 mb-4 lg:mb-6 leading-relaxed">
                  We are a leading financial advisory management platform designed specifically for modern business leaders.
                  Our comprehensive suite of tools empowers CEOs and executives to make informed financial decisions with confidence.
                </p>
                <p className="text-lg text-gray-600 leading-relaxed">
                  With over a decade of experience in financial technology, we understand the unique challenges faced by today's
                  business leaders. Our platform combines cutting-edge technology with proven financial strategies.
                </p>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                <div className="text-center lg:text-left">
                  <div className="text-3xl lg:text-4xl font-bold text-primary mb-2">2000+</div>
                  <div className="text-gray-600 font-medium">Happy Clients</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-3xl lg:text-4xl font-bold text-primary mb-2">$5B+</div>
                  <div className="text-gray-600 font-medium">Assets Managed</div>
                </div>
                <div className="text-center lg:text-left col-span-2 lg:col-span-1">
                  <div className="text-3xl lg:text-4xl font-bold text-primary mb-2">99.9%</div>
                  <div className="text-gray-600 font-medium">Uptime</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="/login"
                  className="inline-flex items-center justify-center bg-orange text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200"
                >
                  Start Your Journey
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
                <button className="inline-flex items-center justify-center border-2 border-primary text-primary px-6 py-3 rounded-lg font-semibold hover:border-orange hover:text-orange transition-all duration-200">
                  Learn More
                </button>
              </div>
            </div>

            <div className="relative">
              <div className="grid grid-cols-1 gap-6">
                <div className="bg-gradient-to-br from-[#002cb1]/10 to-blue-100 rounded-2xl p-6 lg:p-8">
                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="bg-primary p-2 rounded-lg">
                        <Target className="h-6 w-6 text-white" />
                      </div>
                      <h4 className="font-semibold text-gray-900 text-lg">Our Mission</h4>
                    </div>
                    <p className="text-gray-600 leading-relaxed">
                      To empower business leaders with the financial insights and tools they need to drive sustainable growth and make confident decisions.
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl p-6 lg:p-8">
                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="bg-primary p-2 rounded-lg">
                        <Award className="h-6 w-6 text-white" />
                      </div>
                      <h4 className="font-semibold text-gray-900 text-lg">Our Vision</h4>
                    </div>
                    <p className="text-gray-600 leading-relaxed">
                      To be the world's most trusted financial advisory platform for executives and business leaders worldwide.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 lg:py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-12 lg:mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">Frequently Asked Questions</h2>
            <p className="text-lg lg:text-xl text-gray-600">
              Get answers to the most common questions about our platform
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <button
                  className="w-full px-6 lg:px-8 py-4 lg:py-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                  onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                >
                  <h3 className="text-lg lg:text-xl font-semibold text-gray-900 pr-4">
                    {faq.question}
                  </h3>
                  <div className={`transition-transform duration-200 ${openFAQ === index ? 'rotate-180' : ''}`}>
                    {openFAQ === index ? (
                      <Minus className="h-5 w-5 text-primary" />
                    ) : (
                      <Plus className="h-5 w-5 text-primary" />
                    )}
                  </div>
                </button>
                {openFAQ === index && (
                  <div className="px-6 lg:px-8 pb-4 lg:pb-6">
                    <div className="pt-4 border-t border-gray-100">
                      <p className="text-gray-600 leading-relaxed text-base lg:text-lg">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">Still have questions?</p>
            <a
              href="#contact"
              className="inline-flex items-center bg-orange text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200"
            >
              Contact Our Team
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Enhanced Contact Section */}
      <section id="contact" className="py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-12 lg:mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">Get In Touch</h2>
            <p className="text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto">
              Ready to transform your financial management? Our team is here to help you succeed
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-start">
            {/* Contact Information */}
            <div className="space-y-8">
              <div className="grid gap-6">
                <div className="flex items-start space-x-4 p-6 bg-gradient-to-br from-[#002cb1]/5 to-blue-50 rounded-xl">
                  <div className="bg-gradient-to-br from-primary to-[#80C0DCFF] p-3 rounded-lg">
                    <Phone className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Call Us</h3>
                    <p className="text-gray-600 mb-1">+1 (555) 123-4567</p>
                    <p className="text-sm text-gray-500">24 hours service</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-6 bg-gradient-to-br from-[#002cb1]/5 to-blue-50 rounded-xl">
                  <div className="bg-gradient-to-br from-primary to-[#80C0DCFF] p-3 rounded-lg">
                    <Mail className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Email Us</h3>
                    <p className="text-gray-600 mb-1">info@ourceo.com</p>
                    <p className="text-sm text-gray-500">We'll respond within 24 hours</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-6 bg-gradient-to-br from-[#002cb1]/5 to-blue-50 rounded-xl">
                  <div className="bg-gradient-to-br from-primary to-[#80C0DCFF] p-3 rounded-lg">
                    <MapPin className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Visit Us</h3>
                    <p className="text-gray-600 mb-1">123 street Hillway</p>
                    <p className="text-gray-600">Australia</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-primary to-[#80C0DCFF] rounded-2xl p-6 lg:p-8 text-white">
                <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
                <p className="text-blue-100 mb-6 leading-relaxed">
                  Join thousands of successful business leaders who trust OUR CEO for their financial advisory needs.
                  Start your journey today with a free consultation.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a
                    href="/login"
                    className="inline-flex items-center justify-center bg-orange text-white px-6 py-3 rounded-lg font-semibold border-2 border-orange hover:bg-transparent hover:border-white hover:text-white transition-colors"
                  >
                    Start Free Trial
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                  <button className="inline-flex items-center justify-center border-2 border-white/30 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors">
                    Schedule Demo
                  </button>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-6 lg:p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h3>
              <form className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#002cb1] focus:border-transparent transition-colors"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#002cb1] focus:border-transparent transition-colors"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#002cb1] focus:border-transparent transition-colors"
                    placeholder="john@company.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#002cb1] focus:border-transparent transition-colors"
                    placeholder="Your Company Name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#002cb1] focus:border-transparent transition-colors resize-none"
                    placeholder="Tell us about your financial advisory needs..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-br from-primary to-[#80C0DCFF] text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="bg-[#202326] text-white py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            <div className="space-y-4 lg:space-y-6">
              <div className="flex items-center space-x-3">
                <img src={LogoWhite} alt="logo" />
              </div>
              <p className="text-gray-400 text-sm lg:text-base leading-relaxed">
                Empowering business leaders with comprehensive financial advisory management solutions for sustainable growth.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center cursor-pointer hover:bg-[#80C0DCFF] transition-colors">
                  <span className="text-white font-bold text-sm">f</span>
                </div>
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center cursor-pointer hover:bg-[#80C0DCFF] transition-colors">
                  <span className="text-white font-bold text-sm">in</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4 lg:mb-6">Services</h4>
              <div className="space-y-2 lg:space-y-3">
                <a href="#" className="block text-gray-400 hover:text-white transition-colors text-sm lg:text-base">Wealth Management</a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors text-sm lg:text-base">Investment Planning</a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors text-sm lg:text-base">Risk Assessment</a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors text-sm lg:text-base">Tax Planning</a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors text-sm lg:text-base">Retirement Planning</a>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4 lg:mb-6">Company</h4>
              <div className="space-y-2 lg:space-y-3">
                <a href="#about" className="block text-gray-400 hover:text-white transition-colors text-sm lg:text-base">About Us</a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors text-sm lg:text-base">Careers</a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors text-sm lg:text-base">News & Media</a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors text-sm lg:text-base">Privacy Policy</a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors text-sm lg:text-base">Terms of Service</a>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4 lg:mb-6">Support</h4>
              <div className="space-y-2 lg:space-y-3">
                <a href="#contact" className="block text-gray-400 hover:text-white transition-colors text-sm lg:text-base">Contact Us</a>
                <a href="#faq" className="block text-gray-400 hover:text-white transition-colors text-sm lg:text-base">FAQ</a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors text-sm lg:text-base">Help Center</a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors text-sm lg:text-base">Documentation</a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors text-sm lg:text-base">Community</a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 lg:mt-12 pt-6 lg:pt-8">
            <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
              <p className="text-gray-400 text-sm lg:text-base text-center lg:text-left">
                &copy; 2025 OUR CEO. All rights reserved.
              </p>
              <div className="flex items-center space-x-6 text-sm text-gray-400">
                <a href="/legal" className="hover:text-white transition-colors">Legal</a>
                <a href="/sitemap" className="hover:text-white transition-colors">Sitemap</a>
                <a href="/accessibility" className="hover:text-white transition-colors">Accessibility</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;