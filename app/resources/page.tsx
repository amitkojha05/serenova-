import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { 
  BookOpen, 
  Shield, 
  Stethoscope, 
  Heart, 
  ExternalLink, 
  AlertCircle,
  Apple,
  Activity,
  Users,
  Phone,
  Globe,
  FileText
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export const metadata = {
  title: 'Resources | B-Care - Breast Cancer Awareness',
  description: 'Access reliable breast cancer resources, prevention tips, and find healthcare providers.',
}

const aboutSections = [
  {
    title: 'What is Breast Cancer?',
    content: 'Breast cancer is a disease in which cells in the breast grow out of control. There are different kinds of breast cancer, depending on which cells in the breast turn into cancer. Breast cancer can begin in different parts of the breast, including the ducts, lobules, or the tissue in between.',
  },
  {
    title: 'Types of Breast Cancer',
    content: 'The most common types include Ductal Carcinoma In Situ (DCIS), Invasive Ductal Carcinoma (IDC), and Invasive Lobular Carcinoma (ILC). Less common types include Inflammatory Breast Cancer, Paget Disease, and Triple-Negative Breast Cancer.',
  },
  {
    title: 'Risk Factors',
    content: 'Risk factors include age (most breast cancers are found in women 50 or older), genetic mutations (BRCA1 and BRCA2), family history, personal history of breast conditions, radiation exposure, obesity, alcohol consumption, and reproductive history.',
  },
]

const preventionTips = [
  {
    icon: Apple,
    title: 'Maintain a Healthy Diet',
    description: 'Eat a balanced diet rich in fruits, vegetables, and whole grains. Limit processed foods and red meat.',
  },
  {
    icon: Activity,
    title: 'Stay Physically Active',
    description: 'Aim for at least 150 minutes of moderate aerobic activity or 75 minutes of vigorous activity each week.',
  },
  {
    icon: Shield,
    title: 'Limit Alcohol',
    description: 'If you drink alcohol, limit yourself to one drink per day. The more you drink, the greater the risk.',
  },
  {
    icon: Heart,
    title: 'Maintain Healthy Weight',
    description: 'Being overweight or obese increases breast cancer risk, especially after menopause.',
  },
  {
    icon: Stethoscope,
    title: 'Regular Screening',
    description: 'Get regular mammograms and clinical breast exams as recommended by your healthcare provider.',
  },
  {
    icon: Users,
    title: 'Know Your Family History',
    description: 'If you have a family history of breast cancer, talk to your doctor about additional screening options.',
  },
]

const resources = [
  {
    title: 'American Cancer Society',
    description: 'Comprehensive information about breast cancer, treatment options, and support resources.',
    url: 'https://www.cancer.org/cancer/breast-cancer.html',
    icon: Globe,
  },
  {
    title: 'Susan G. Komen',
    description: 'Research, community health, global outreach, and public policy initiatives.',
    url: 'https://www.komen.org/',
    icon: Heart,
  },
  {
    title: 'National Breast Cancer Foundation',
    description: 'Early detection plan, education resources, and support services.',
    url: 'https://www.nationalbreastcancer.org/',
    icon: Shield,
  },
  {
    title: 'Breastcancer.org',
    description: 'Community support, treatment information, and the latest research news.',
    url: 'https://www.breastcancer.org/',
    icon: Users,
  },
  {
    title: 'CDC Breast Cancer',
    description: 'Statistics, prevention strategies, and screening guidelines from the CDC.',
    url: 'https://www.cdc.gov/cancer/breast/',
    icon: FileText,
  },
  {
    title: 'National Cancer Institute',
    description: 'Research-based information on causes, prevention, and treatment.',
    url: 'https://www.cancer.gov/types/breast',
    icon: BookOpen,
  },
]

const screeningGuidelines = [
  { age: '20-39', recommendation: 'Clinical breast exam every 1-3 years, monthly self-exams' },
  { age: '40-44', recommendation: 'Optional annual mammogram, clinical exam yearly' },
  { age: '45-54', recommendation: 'Annual mammogram recommended, clinical exam yearly' },
  { age: '55+', recommendation: 'Mammogram every 1-2 years, clinical exam yearly' },
]

export default function ResourcesPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-6">
              <BookOpen className="w-4 h-4 text-primary" />
              <span className="text-sm text-muted-foreground">Educational Resources</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4 text-balance">
              <span className="gradient-text">Knowledge is Power</span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg text-muted-foreground text-pretty">
              Access reliable information about breast cancer, prevention strategies, and helpful resources 
              to support your health journey.
            </p>
          </div>

          {/* About Breast Cancer */}
          <section id="about" className="mb-20">
            <h2 className="text-2xl font-bold text-foreground mb-8 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              About Breast Cancer
            </h2>
            <div className="grid grid-cols-1 gap-6">
              {aboutSections.map((section, index) => (
                <div key={index} className="glass-card rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-3">{section.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{section.content}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Prevention Tips */}
          <section id="prevention" className="mb-20">
            <h2 className="text-2xl font-bold text-foreground mb-8 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              Prevention Tips
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {preventionTips.map((tip, index) => (
                <div key={index} className="glass-card rounded-2xl p-6 group hover:border-primary/30 transition-all duration-300">
                  <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <tip.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{tip.title}</h3>
                  <p className="text-sm text-muted-foreground">{tip.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Screening Guidelines */}
          <section className="mb-20">
            <h2 className="text-2xl font-bold text-foreground mb-8 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                <Stethoscope className="w-5 h-5 text-primary" />
              </div>
              Screening Guidelines
            </h2>
            <div className="glass-card rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Age Group</th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Recommendation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {screeningGuidelines.map((guideline, index) => (
                      <tr key={index} className="border-b border-border last:border-0 hover:bg-primary/5 transition-colors">
                        <td className="px-6 py-4">
                          <span className="font-semibold text-primary">{guideline.age}</span>
                        </td>
                        <td className="px-6 py-4 text-muted-foreground">{guideline.recommendation}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-4 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              These are general guidelines. Consult your healthcare provider for personalized recommendations.
            </p>
          </section>

          {/* External Resources */}
          <section id="doctors" className="mb-20">
            <h2 className="text-2xl font-bold text-foreground mb-8 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                <Globe className="w-5 h-5 text-primary" />
              </div>
              Helpful Resources
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resources.map((resource, index) => (
                <a
                  key={index}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass-card rounded-2xl p-6 group hover:border-primary/30 transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <resource.icon className="w-6 h-6 text-primary" />
                    </div>
                    <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {resource.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{resource.description}</p>
                </a>
              ))}
            </div>
          </section>

          {/* Emergency Contact */}
          <section className="mb-16">
            <div className="glass-card rounded-2xl p-8 border-primary/20">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center animate-pulse-glow">
                    <Phone className="w-7 h-7 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground">Need Support?</h3>
                    <p className="text-muted-foreground">American Cancer Society 24/7 Helpline</p>
                  </div>
                </div>
                <a href="tel:1-800-227-2345">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25">
                    <Phone className="w-4 h-4 mr-2" />
                    1-800-227-2345
                  </Button>
                </a>
              </div>
            </div>
          </section>

          {/* CTA */}
          <div className="text-center">
            <p className="text-muted-foreground mb-4">Have questions? Our AI assistant is here to help.</p>
            <Link href="/chat">
              <Button className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25">
                Chat with B-Care AI
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
