import { useState } from 'react';
import { Heart, HandHeart, Check, Globe, Shield, Mail, Copy, Smartphone, Building2, CreditCard, Wallet, ArrowRight } from 'lucide-react';
import { useSEO } from '@/hooks/useSEO';
import ScrollReveal from '@/components/ScrollReveal';
import LocationFields, { type LocationData } from '@/components/LocationFields';
import { insertDonation } from '@/lib/supabase';

const PRESET_AMOUNTS = [5, 10, 25, 50, 100];

const paymentMethods = [
  {
    id: 'mpesa',
    label: 'M-Pesa',
    desc: 'Safaricom M-Pesa (Kenya)',
    icon: Smartphone,
    color: '#25D366',
    details: [
      { label: 'Paybill', value: '4090330' },
      { label: 'Account', value: 'DONATE' },
    ],
  },
  {
    id: 'bank',
    label: 'Bank Transfer',
    desc: 'Direct bank transfer',
    icon: Building2,
    color: '#3B82F6',
    details: [
      { label: 'Bank', value: 'Equity Bank Kenya' },
      { label: 'Account Name', value: 'Epic True North' },
      { label: 'Account No.', value: '0490293847562' },
      { label: 'Swift Code', value: 'EQBLKENA' },
    ],
  },
  {
    id: 'paypal',
    label: 'PayPal',
    desc: 'Pay with PayPal balance or card',
    icon: Wallet,
    color: '#00457C',
    details: [
      { label: 'PayPal', value: 'hello@inhimdaily.org' },
    ],
    link: 'https://www.paypal.com/paypalme/inhimdaily',
  },
  {
    id: 'card',
    label: 'Credit / Debit Card',
    desc: 'Visa, Mastercard, Amex',
    icon: CreditCard,
    color: '#C9983A',
    details: [
      { label: 'Status', value: 'Available via PayPal link' },
    ],
    link: 'https://www.paypal.com/paypalme/inhimdaily',
  },
];

export default function DonatePage() {
  useSEO({
    title: 'Donate | In Him Daily',
    description: 'Partner with In Him Daily through your generosity. Your donation helps share Jesus with families across generations around the world.',
    canonicalPath: '/donate',
    ogImage: 'https://inhimdaily.org/images/733127106_122096833941384062_9064072413288732878_n.jpg',
  });

  const [name, setName]           = useState('');
  const [email, setEmail]         = useState('');
  const [location, setLocation]   = useState<LocationData>({ country: '', city_region: '' });
  const [amount, setAmount]       = useState<number | ''>('');
  const [customAmount, setCustom] = useState('');
  const [prayerRequest, setPrayer] = useState('');
  const [message, setMessage]     = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState('');
  const [copiedField, setCopiedField] = useState('');

  const inputCls = "w-full px-5 py-3.5 rounded-xl ih-input text-white placeholder-white/35 transition-colors text-sm";

  function handlePreset(val: number) {
    setAmount(val);
    setCustom('');
  }

  function handleCustom(val: string) {
    setCustom(val);
    setAmount(val ? parseFloat(val) : '');
  }

  function copyToClipboard(text: string, fieldId: string) {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    setTimeout(() => setCopiedField(''), 2000);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError('');
    if (!name || !email || !location.country) {
      setFormError('Please fill in your name, email, and country.');
      return;
    }
    if (!amount || amount < 1) {
      setFormError('Please select or enter a donation amount.');
      return;
    }
    try {
      await insertDonation({
        name,
        email,
        country: location.country,
        city_region: location.city_region,
        amount: amount || undefined,
        prayer_request: prayerRequest || undefined,
        message: message || undefined,
      });
      setSubmitted(true);
    } catch {
      setFormError('Something went wrong. Please try again.');
    }
  }

  return (
    <div className="overflow-x-hidden">
      {/* Hero */}
      <section className="relative pt-32 pb-24 bg-navy-700 overflow-hidden" aria-label="Donate hero">
        <div className="absolute inset-0 bg-cover bg-center" aria-hidden="true" style={{ backgroundImage: "url('https://images.pexels.com/photos/261763/pexels-photo-261763.jpeg?auto=compress&cs=tinysrgb&w=1920')", opacity: 0.2 }} />
        <div className="absolute inset-0" aria-hidden="true" style={{ background: 'linear-gradient(180deg, rgba(14,32,53,0.78) 0%, rgba(14,32,53,0.92) 100%)' }} />
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true"
          style={{ background: 'radial-gradient(ellipse 55% 45% at 50% 75%, rgba(201,152,58,0.11) 0%, transparent 70%)' }} />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-14 h-14 mx-auto mb-6 rounded-full bg-gold-400/15 border border-gold-400/30 flex items-center justify-center">
            <HandHeart size={26} className="text-gold-300" aria-hidden="true" />
          </div>
          <p className="text-gold-400 text-[0.72rem] font-semibold tracking-[0.16em] uppercase mb-4">Partner With Us</p>
          <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Support the Mission
          </h1>
          <p className="text-white/65 text-xl max-w-2xl mx-auto leading-relaxed mb-6">
            Your generosity helps share Jesus with families across generations around the world.
          </p>
          <p className="text-white/50 text-base max-w-2xl mx-auto leading-relaxed">
            In Him Daily is a ministry of Epic True North, based in Nairobi, Kenya. Every gift — large or small — helps us
            create Christ-centred devotionals, distribute free samples, and build communities where families encounter Jesus together.
          </p>
          <div className="mt-8">
            <a href="#donate-now"
              onClick={(e) => { e.preventDefault(); document.getElementById('donate-now')?.scrollIntoView({ behavior: 'smooth' }); }}
              className="inline-flex items-center gap-2 px-8 py-4 ih-btn-gold text-[0.9rem]">
              <Heart size={16} aria-hidden="true" />
              Donate Now
            </a>
          </div>
        </div>
      </section>

      {/* How Your Gift Helps */}
      <section className="py-16 ih-section" aria-label="How your gift helps">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="text-center mb-10">
            <p className="ih-eyebrow mb-3">Your Impact</p>
            <h2 className="font-playfair text-2xl md:text-3xl font-bold text-white mb-4">How Your Gift Helps</h2>
          </ScrollReveal>
          <div className="grid sm:grid-cols-3 gap-5">
            {[
              { title: 'Create Devotionals', desc: 'Fund the writing, design, and production of new volumes across all six collections.' },
              { title: 'Reach More Families', desc: 'Help distribute free samples and build WhatsApp communities across the globe.' },
              { title: 'Support the Ministry', desc: 'Sustain the ongoing work of Epic True North in Nairobi and beyond.' },
            ].map((item, i) => (
              <ScrollReveal key={i} delay={i * 80}>
                <div className="p-6 rounded-2xl ih-card h-full">
                  <div className="w-10 h-10 rounded-full bg-gold-400/15 border border-gold-400/25 flex items-center justify-center mb-4">
                    <Heart size={18} className="text-gold-300" aria-hidden="true" />
                  </div>
                  <h3 className="font-playfair text-lg font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-white/55 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Payment Methods */}
      <section className="py-16 ih-section" aria-labelledby="payment-heading">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="text-center mb-10">
            <p className="ih-eyebrow mb-3">Ways to Give</p>
            <h2 id="payment-heading" className="font-playfair text-2xl md:text-3xl font-bold text-white mb-4">Payment Options</h2>
            <p className="text-white/55 text-sm max-w-xl mx-auto">Choose the method that works best for you. All gifts are received with gratitude.</p>
          </ScrollReveal>
          <div className="grid sm:grid-cols-2 gap-5">
            {paymentMethods.map((m, i) => (
              <ScrollReveal key={m.id} delay={i * 80}>
                <div className="p-6 rounded-2xl ih-card h-full">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${m.color}15`, border: `1px solid ${m.color}30` }}>
                      <m.icon size={20} style={{ color: m.color }} aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="font-playfair text-lg font-bold text-white">{m.label}</h3>
                      <p className="text-white/45 text-xs">{m.desc}</p>
                    </div>
                  </div>
                  <div className="space-y-2.5">
                    {m.details.map((d) => (
                      <div key={d.label} className="flex items-center justify-between gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                        <div className="min-w-0">
                          <p className="text-[0.65rem] font-semibold text-white/40 uppercase tracking-wider">{d.label}</p>
                          <p className="text-sm text-white/80 font-mono mt-0.5 truncate">{d.value}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(d.value, `${m.id}-${d.label}`)}
                          className="p-2 rounded-lg text-white/40 hover:text-gold-300 hover:bg-white/5 transition-colors shrink-0"
                          aria-label={`Copy ${d.label}`}
                        >
                          {copiedField === `${m.id}-${d.label}` ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                        </button>
                      </div>
                    ))}
                  </div>
                  {m.link && (
                    <a href={m.link} target="_blank" rel="noopener noreferrer"
                      className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-gold-300 hover:text-gold-200 transition-colors">
                      {m.id === 'paypal' ? 'Pay with PayPal' : 'Pay via PayPal'} <ArrowRight size={14} aria-hidden="true" />
                    </a>
                  )}
                </div>
              </ScrollReveal>
            ))}
          </div>
          <ScrollReveal className="mt-8">
            <div className="p-5 rounded-xl bg-gold-400/8 border border-gold-400/20 text-center">
              <p className="text-sm text-white/70 leading-relaxed">
                After making your donation, please{' '}
                <a href="#donate-now" onClick={(e) => { e.preventDefault(); document.getElementById('donate-now')?.scrollIntoView({ behavior: 'smooth' }); }}
                  className="text-gold-300 font-semibold hover:text-gold-200 transition-colors">
                  fill out the form below
                </a>
                {' '}so we can confirm your gift and pray over any requests you share with us.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Donation Form / Thank You */}
      <section id="donate-now" className="py-20 ih-section scroll-mt-20" aria-label="Donation form">
        <div className="max-w-xl mx-auto px-4 sm:px-6">
          <ScrollReveal>
            {submitted ? (
              <div className="p-8 md:p-10 rounded-2xl ih-card border-gold-400/30 animate-fade-in text-center">
                <div className="w-16 h-16 rounded-full bg-green-500/20 border border-green-400/30 flex items-center justify-center mx-auto mb-6">
                  <Check size={28} className="text-green-400" aria-hidden="true" />
                </div>
                <h2 className="font-playfair text-2xl md:text-3xl font-bold text-white mb-4">Thank You for Partnering With Us</h2>
                <p className="text-white/60 leading-relaxed mb-6">
                  {name ? `${name}, ` : ''}thank you for your generosity{amount ? ` of $${amount}` : ''}. Your gift helps share Jesus
                  with families across generations around the world. A confirmation email is on its way to {email || 'your inbox'}.
                </p>
                <div className="p-5 rounded-xl bg-white/5 border border-white/10 text-left mb-6">
                  <p className="text-[0.68rem] font-bold text-gold-300 uppercase tracking-[0.12em] mb-2">What Happens Next</p>
                  <ul className="space-y-2" role="list">
                    <li className="flex items-start gap-2.5 text-sm text-white/60">
                      <Check size={14} className="text-green-400 mt-0.5 shrink-0" aria-hidden="true" />
                      You will receive a confirmation email with your donation details.
                    </li>
                    <li className="flex items-start gap-2.5 text-sm text-white/60">
                      <Check size={14} className="text-green-400 mt-0.5 shrink-0" aria-hidden="true" />
                      If you included a prayer request, our prayer team will be praying over it this week.
                    </li>
                    <li className="flex items-start gap-2.5 text-sm text-white/60">
                      <Check size={14} className="text-green-400 mt-0.5 shrink-0" aria-hidden="true" />
                      You will receive occasional ministry updates — you can unsubscribe anytime.
                    </li>
                  </ul>
                </div>
                <p className="font-cormorant text-lg text-gold-200 italic">
                  &ldquo;Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver.&rdquo;
                </p>
                <p className="text-gold-400 text-[0.72rem] font-semibold mt-2 tracking-[0.18em] uppercase">2 Corinthians 9:7</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="ih-card p-8 space-y-5" noValidate>
                <div className="text-center mb-2">
                  <h2 className="font-playfair text-2xl font-bold text-white mb-1">Make a Donation</h2>
                  <p className="text-white/55 text-sm">Every gift helps families encounter Jesus daily.</p>
                </div>

                {/* Amount selection */}
                <div>
                  <label className="block text-[0.72rem] font-semibold text-white/50 mb-2 tracking-wider uppercase">Donation Amount</label>
                  <div className="flex flex-wrap gap-2.5 mb-3">
                    {PRESET_AMOUNTS.map(val => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => handlePreset(val)}
                        className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-250 ${
                          amount === val ? 'ih-btn-gold' : 'ih-btn-ghost'
                        }`}
                      >
                        ${val}
                      </button>
                    ))}
                  </div>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 text-sm">$</span>
                    <input
                      type="number"
                      placeholder="Custom amount"
                      value={customAmount}
                      onChange={e => handleCustom(e.target.value)}
                      min={1}
                      className={inputCls + ' pl-7'}
                      aria-label="Custom donation amount"
                    />
                  </div>
                </div>

                {/* Name & Email */}
                <div className="grid sm:grid-cols-2 gap-3.5">
                  <input type="text" placeholder="Full Name *" value={name} onChange={e=>setName(e.target.value)} required aria-label="Full name" className={inputCls} />
                  <input type="email" placeholder="Email Address *" value={email} onChange={e=>setEmail(e.target.value)} required aria-label="Email address" className={inputCls} />
                </div>

                {/* Location */}
                <LocationFields value={location} onChange={setLocation} />

                {/* Prayer Request (optional) */}
                <div>
                  <label className="block text-[0.72rem] font-semibold text-white/50 mb-1.5 tracking-wider uppercase">Prayer Request <span className="text-white/30 normal-case">(optional)</span></label>
                  <textarea
                    placeholder="Share a prayer request with us…"
                    value={prayerRequest}
                    onChange={e=>setPrayer(e.target.value)}
                    rows={3}
                    aria-label="Prayer request (optional)"
                    className={inputCls + ' resize-none'}
                  />
                </div>

                {/* Message (optional) */}
                <div>
                  <label className="block text-[0.72rem] font-semibold text-white/50 mb-1.5 tracking-wider uppercase">Message <span className="text-white/30 normal-case">(optional)</span></label>
                  <textarea
                    placeholder="A note for the team…"
                    value={message}
                    onChange={e=>setMessage(e.target.value)}
                    rows={3}
                    aria-label="Message (optional)"
                    className={inputCls + ' resize-none'}
                  />
                </div>

                <button type="submit" className="w-full py-4 ih-btn-gold text-[0.9rem]">
                  <span className="inline-flex items-center gap-2 justify-center">
                    <Heart size={16} aria-hidden="true" />
                    {amount ? `Donate $${amount} Now` : 'Donate Now'}
                  </span>
                </button>
                {formError && <p className="text-red-400 text-xs text-center">{formError}</p>}
                <p className="text-white/30 text-xs text-center flex items-center justify-center gap-1.5">
                  <Shield size={11} aria-hidden="true" /> Your information is never shared or sold. You will receive a confirmation email.
                </p>
              </form>
            )}
          </ScrollReveal>
        </div>
      </section>

      {/* Trust signals */}
      <section className="py-14 ih-section" aria-label="Trust signals">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="grid sm:grid-cols-3 gap-5">
            {[
              { icon: Shield, title: 'Secure & Private', desc: 'Your information is never shared or sold.' },
              { icon: Globe, title: 'Global Impact', desc: 'Donations reach families in 12+ countries.' },
              { icon: Mail, title: 'Stay Informed', desc: 'Receive updates on how your gift is making a difference.' },
            ].map((item, i) => (
              <ScrollReveal key={i} delay={i * 80}>
                <div className="flex items-start gap-3 p-5 rounded-2xl ih-card-solid">
                  <div className="w-9 h-9 rounded-full bg-gold-400/15 flex items-center justify-center shrink-0">
                    <item.icon size={16} className="text-gold-300" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold mb-0.5">{item.title}</p>
                    <p className="text-white/45 text-xs leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Closing scripture */}
      <section className="py-14 ih-section text-center" aria-label="Closing scripture">
        <div className="max-w-xl mx-auto px-4">
          <ScrollReveal>
            <div className="gold-divider mx-auto mb-7" aria-hidden="true" />
            <p className="font-cormorant text-3xl text-white italic leading-relaxed">
              &ldquo;Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver.&rdquo;
            </p>
            <p className="text-gold-400 text-[0.72rem] font-semibold mt-3 tracking-[0.18em] uppercase">2 Corinthians 9:7</p>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
