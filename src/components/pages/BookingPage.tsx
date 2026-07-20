'use client'

import { useState } from 'react'
import {
  ArrowLeft, CheckCircle2, User, Phone, Mail, MapPin,
  CreditCard, Landmark, Wallet, ChevronRight, Lock, Star,
  Shield, Clock, AlertCircle
} from 'lucide-react'
import { TRIPS } from '@/data/trips'
import { useAppNavigate } from '@/hooks/useAppNavigate'

interface BookingPageProps {
  tripId: number
}

const STEPS = ['Detail Pesanan', 'Info Traveler', 'Pembayaran', 'Konfirmasi']

const PAYMENT_METHODS = [
  { id: 'transfer', label: 'Transfer Bank', icon: Landmark, desc: 'BCA, BNI, Mandiri, BRI' },
  { id: 'va', label: 'Virtual Account', icon: CreditCard, desc: 'Bayar via ATM / m-banking' },
  { id: 'ewallet', label: 'E-Wallet', icon: Wallet, desc: 'GoPay, OVO, Dana, LinkAja' },
  { id: 'cc', label: 'Kartu Kredit', icon: CreditCard, desc: 'Visa, Mastercard, JCB' },
]

const BANKS = ['BCA', 'BNI', 'Mandiri', 'BRI', 'CIMB Niaga']

export default function BookingPage({ tripId }: BookingPageProps) {
  const onNavigate = useAppNavigate()
  const trip = TRIPS.find((t) => t.id === tripId) || TRIPS[0]
  const [step, setStep] = useState(0)
  const [pax, setPax] = useState(2)
  const [selectedDate] = useState('14 Mar 2025')
  const [paymentMethod, setPaymentMethod] = useState('transfer')
  const [selectedBank, setSelectedBank] = useState('BCA')
  const [agreed, setAgreed] = useState(false)

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    emergencyName: '',
    emergencyPhone: '',
    dietaryReq: '',
    specialRequest: '',
  })

  const totalPrice = (trip.price + 50_000) * pax
  const downPayment = Math.round(totalPrice * 0.3)

  const updateForm = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
  }

  const canProceed = step === 0 ? true
    : step === 1 ? (form.firstName && form.email && form.phone)
    : step === 2 ? agreed
    : true

  if (step === 3) {
    return (
      <div className="bg-[#F8FAFF] min-h-screen flex items-center justify-center px-8">
        <div className="max-w-lg w-full text-center">
          <div
            className="bg-white rounded-3xl p-12 border border-[#E5EEFF]"
            style={{ boxShadow: '0 8px 40px rgba(10,31,68,0.10)' }}
          >
            <div className="w-20 h-20 rounded-full bg-[#ECFDF5] flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={40} className="text-[#10B981]" />
            </div>
            <h1 className="font-display text-2xl font-bold text-[#0A1F44] mb-2">Pesanan Berhasil!</h1>
            <p className="text-[#6B7280] mb-1">Nomor Booking:</p>
            <p className="text-xl font-bold text-[#1A56DB] mb-6">OT-2025-{String(Math.floor(Math.random() * 90000 + 10000))}</p>

            <div className="bg-[#F8FAFF] rounded-2xl p-5 border border-[#E5EEFF] text-left mb-6 space-y-2.5">
              <div className="flex justify-between text-sm">
                <span className="text-[#6B7280]">Trip</span>
                <span className="font-medium text-[#0A1F44] text-right max-w-[200px] line-clamp-1">{trip.title}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#6B7280]">Tanggal</span>
                <span className="font-medium text-[#0A1F44]">{selectedDate}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#6B7280]">Peserta</span>
                <span className="font-medium text-[#0A1F44]">{pax} orang</span>
              </div>
              <div className="flex justify-between text-sm border-t border-[#E5EEFF] pt-2.5">
                <span className="font-semibold text-[#0A1F44]">DP yang harus dibayar</span>
                <span className="font-bold text-[#1A56DB]">Rp {downPayment.toLocaleString('id-ID')}</span>
              </div>
            </div>

            <div className="bg-[#EFF6FF] rounded-2xl p-4 border border-[#BFDBFE] mb-6 text-left">
              <div className="flex items-start gap-2.5">
                <Clock size={15} className="text-[#1A56DB] shrink-0 mt-0.5" />
                <p className="text-sm text-[#1A56DB]">
                  Selesaikan pembayaran DP dalam <strong>24 jam</strong> ke nomor rekening BCA{' '}
                  <strong>1234567890</strong> a/n PT OpenTrip Indonesia.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => onNavigate('dashboard')}
                className="w-full py-3.5 bg-[#1A56DB] text-white rounded-2xl font-semibold hover:bg-[#1343B8] transition-colors"
              >
                Lihat Status Booking
              </button>
              <button
                onClick={() => onNavigate('landing')}
                className="w-full py-3.5 bg-white border border-[#E5EEFF] text-[#374151] rounded-2xl font-medium hover:bg-[#F8FAFF] transition-colors"
              >
                Kembali ke Beranda
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#F8FAFF] min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-[#E5EEFF] sticky top-16 z-40">
        <div className="max-w-[1440px] mx-auto px-8 py-4">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => step > 0 ? setStep((s) => s - 1) : onNavigate('detail', tripId)}
              className="flex items-center gap-1.5 text-sm text-[#6B7280] hover:text-[#1A56DB] transition-colors"
            >
              <ArrowLeft size={15} /> Kembali
            </button>
            <h1 className="font-semibold text-[#0A1F44]">Pemesanan Trip</h1>
          </div>

          {/* Step indicator */}
          <div className="flex items-center gap-0">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center">
                <div className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    i < step ? 'bg-[#10B981] text-white'
                    : i === step ? 'bg-[#1A56DB] text-white'
                    : 'bg-[#E5EEFF] text-[#9CA3AF]'
                  }`}>
                    {i < step ? <CheckCircle2 size={14} /> : i + 1}
                  </div>
                  <span className={`text-xs font-medium hidden sm:block ${i === step ? 'text-[#1A56DB]' : i < step ? 'text-[#10B981]' : 'text-[#9CA3AF]'}`}>
                    {s}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`w-12 sm:w-20 h-px mx-2 transition-colors ${i < step ? 'bg-[#10B981]' : 'bg-[#E5EEFF]'}`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
          {/* Left */}
          <div>
            {/* Step 0: Order detail */}
            {step === 0 && (
              <div className="space-y-4">
                <div className="bg-white rounded-2xl p-6 border border-[#E5EEFF]">
                  <h2 className="font-semibold text-[#0A1F44] mb-5">Detail Perjalanan</h2>
                  <div className="flex gap-5">
                    <div className="w-32 h-24 rounded-2xl overflow-hidden bg-[#E0F2FE] shrink-0">
                      <img src={trip.image} alt={trip.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-[#1A56DB] mb-1">{trip.category}</p>
                      <h3 className="font-semibold text-[#0A1F44] mb-2 text-sm">{trip.title}</h3>
                      <div className="flex flex-wrap gap-3 text-xs text-[#6B7280]">
                        <span className="flex items-center gap-1"><MapPin size={11} />{trip.location}</span>
                        <span className="flex items-center gap-1"><Clock size={11} />{trip.duration}</span>
                        <span className="flex items-center gap-1"><Star size={11} className="fill-[#F59E0B] text-[#F59E0B]" />{trip.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-[#E5EEFF]">
                  <h2 className="font-semibold text-[#0A1F44] mb-5">Detail Pemesanan</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide block mb-2">
                        Tanggal Keberangkatan
                      </label>
                      <div className="px-4 py-3 bg-[#EFF6FF] border border-[#BFDBFE] rounded-xl text-sm font-semibold text-[#1A56DB]">
                        {selectedDate}
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide block mb-2">
                        Jumlah Peserta
                      </label>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setPax((p) => Math.max(1, p - 1))}
                          className="w-10 h-10 rounded-xl border border-[#E5EEFF] flex items-center justify-center hover:border-[#1A56DB]/40 font-bold transition-colors"
                        >
                          −
                        </button>
                        <span className="text-base font-semibold text-[#0A1F44] w-8 text-center">{pax}</span>
                        <button
                          onClick={() => setPax((p) => Math.min(12, p + 1))}
                          className="w-10 h-10 rounded-xl border border-[#E5EEFF] flex items-center justify-center hover:border-[#1A56DB]/40 font-bold transition-colors"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 1: Traveler info */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="bg-white rounded-2xl p-6 border border-[#E5EEFF]">
                  <h2 className="font-semibold text-[#0A1F44] mb-5 flex items-center gap-2">
                    <User size={16} className="text-[#1A56DB]" /> Data Pemesan Utama
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { label: 'Nama Depan', field: 'firstName' as const, placeholder: 'Andi', icon: User },
                      { label: 'Nama Belakang', field: 'lastName' as const, placeholder: 'Santoso', icon: User },
                      { label: 'Email', field: 'email' as const, placeholder: 'andi@email.com', icon: Mail },
                      { label: 'Nomor HP / WhatsApp', field: 'phone' as const, placeholder: '081234567890', icon: Phone },
                    ].map((item) => (
                      <div key={item.field}>
                        <label className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide block mb-2">{item.label}</label>
                        <div className="flex items-center gap-3 px-4 py-3 bg-[#F8FAFF] border border-[#E5EEFF] rounded-xl focus-within:border-[#1A56DB] transition-colors">
                          <item.icon size={15} className="text-[#9CA3AF] shrink-0" />
                          <input
                            value={form[item.field]}
                            onChange={updateForm(item.field)}
                            placeholder={item.placeholder}
                            className="flex-1 text-sm text-[#0A1F44] placeholder:text-[#9CA3AF] bg-transparent outline-none"
                          />
                        </div>
                      </div>
                    ))}
                    <div className="md:col-span-2">
                      <label className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide block mb-2">Alamat</label>
                      <div className="flex items-center gap-3 px-4 py-3 bg-[#F8FAFF] border border-[#E5EEFF] rounded-xl focus-within:border-[#1A56DB] transition-colors">
                        <MapPin size={15} className="text-[#9CA3AF] shrink-0" />
                        <input
                          value={form.address}
                          onChange={updateForm('address')}
                          placeholder="Jl. Sudirman No. 1, Jakarta Pusat"
                          className="flex-1 text-sm text-[#0A1F44] placeholder:text-[#9CA3AF] bg-transparent outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-[#E5EEFF]">
                  <h2 className="font-semibold text-[#0A1F44] mb-5 flex items-center gap-2">
                    <Phone size={16} className="text-[#1A56DB]" /> Kontak Darurat
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide block mb-2">Nama Kontak Darurat</label>
                      <input
                        value={form.emergencyName}
                        onChange={updateForm('emergencyName')}
                        placeholder="Nama keluarga/teman"
                        className="w-full px-4 py-3 bg-[#F8FAFF] border border-[#E5EEFF] rounded-xl text-sm text-[#0A1F44] placeholder:text-[#9CA3AF] outline-none focus:border-[#1A56DB] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide block mb-2">Nomor Kontak Darurat</label>
                      <input
                        value={form.emergencyPhone}
                        onChange={updateForm('emergencyPhone')}
                        placeholder="081234567890"
                        className="w-full px-4 py-3 bg-[#F8FAFF] border border-[#E5EEFF] rounded-xl text-sm text-[#0A1F44] placeholder:text-[#9CA3AF] outline-none focus:border-[#1A56DB] transition-colors"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-[#E5EEFF]">
                  <h2 className="font-semibold text-[#0A1F44] mb-5">Informasi Tambahan (Opsional)</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide block mb-2">Kebutuhan Diet Khusus</label>
                      <input
                        value={form.dietaryReq}
                        onChange={updateForm('dietaryReq')}
                        placeholder="Vegetarian, alergi seafood, dll."
                        className="w-full px-4 py-3 bg-[#F8FAFF] border border-[#E5EEFF] rounded-xl text-sm text-[#0A1F44] placeholder:text-[#9CA3AF] outline-none focus:border-[#1A56DB] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide block mb-2">Permintaan Khusus</label>
                      <textarea
                        value={form.specialRequest}
                        onChange={updateForm('specialRequest')}
                        rows={3}
                        placeholder="Ada yang ingin Anda sampaikan kepada kami?"
                        className="w-full px-4 py-3 bg-[#F8FAFF] border border-[#E5EEFF] rounded-xl text-sm text-[#0A1F44] placeholder:text-[#9CA3AF] outline-none focus:border-[#1A56DB] transition-colors resize-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Payment */}
            {step === 2 && (
              <div className="space-y-4">
                <div className="bg-white rounded-2xl p-6 border border-[#E5EEFF]">
                  <h2 className="font-semibold text-[#0A1F44] mb-2">Metode Pembayaran</h2>
                  <p className="text-sm text-[#6B7280] mb-5">
                    Bayar DP 30% sekarang, sisa 70% paling lambat 7 hari sebelum trip.
                  </p>

                  <div className="bg-[#EFF6FF] rounded-2xl p-4 border border-[#BFDBFE] mb-5">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-[#1A56DB] font-medium">Down Payment (30%)</span>
                      <span className="text-xl font-bold text-[#1A56DB]">Rp {downPayment.toLocaleString('id-ID')}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {PAYMENT_METHODS.map((m) => (
                      <button
                        key={m.id}
                        onClick={() => setPaymentMethod(m.id)}
                        className={`p-4 rounded-2xl border text-left transition-all ${
                          paymentMethod === m.id
                            ? 'border-[#1A56DB] bg-[#EFF6FF]'
                            : 'border-[#E5EEFF] hover:border-[#1A56DB]/40'
                        }`}
                      >
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${paymentMethod === m.id ? 'bg-[#1A56DB]' : 'bg-[#F8FAFF]'}`}>
                          <m.icon size={16} className={paymentMethod === m.id ? 'text-white' : 'text-[#6B7280]'} />
                        </div>
                        <p className={`text-sm font-semibold mb-0.5 ${paymentMethod === m.id ? 'text-[#1A56DB]' : 'text-[#0A1F44]'}`}>{m.label}</p>
                        <p className="text-xs text-[#9CA3AF]">{m.desc}</p>
                      </button>
                    ))}
                  </div>

                  {paymentMethod === 'transfer' && (
                    <div className="mt-4 space-y-2">
                      <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide">Pilih Bank</p>
                      <div className="flex flex-wrap gap-2">
                        {BANKS.map((bank) => (
                          <button
                            key={bank}
                            onClick={() => setSelectedBank(bank)}
                            className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                              selectedBank === bank
                                ? 'bg-[#1A56DB] text-white border-[#1A56DB]'
                                : 'bg-white border-[#E5EEFF] text-[#374151] hover:border-[#1A56DB]/40'
                            }`}
                          >
                            {bank}
                          </button>
                        ))}
                      </div>
                      <div className="mt-3 p-4 bg-[#F8FAFF] rounded-2xl border border-[#E5EEFF]">
                        <p className="text-xs text-[#6B7280] mb-1">Nomor Rekening {selectedBank}</p>
                        <p className="text-lg font-bold text-[#0A1F44] font-mono">1234 5678 9012</p>
                        <p className="text-xs text-[#6B7280]">a.n. PT OpenTrip Indonesia</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-white rounded-2xl p-6 border border-[#E5EEFF]">
                  <h2 className="font-semibold text-[#0A1F44] mb-4">Syarat & Ketentuan</h2>
                  <div className="space-y-3 text-sm text-[#374151] mb-5 max-h-40 overflow-y-auto pr-2">
                    {[
                      'Pembayaran DP 30% harus diselesaikan dalam 24 jam setelah pemesanan.',
                      'Sisa pembayaran 70% harus diselesaikan paling lambat 7 hari sebelum tanggal keberangkatan.',
                      'Pembatalan lebih dari 14 hari sebelum trip: refund 80%. 7-14 hari: refund 50%. Kurang dari 7 hari: tidak ada refund.',
                      'OpenTrip berhak membatalkan trip jika jumlah peserta tidak memenuhi minimum trip (4 orang).',
                      'Peserta wajib memiliki kondisi kesehatan yang baik dan mampu mengikuti aktivitas fisik dalam itinerary.',
                      'Setiap peserta disarankan memiliki asuransi perjalanan pribadi.',
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <AlertCircle size={14} className="text-[#F59E0B] shrink-0 mt-0.5" />
                        <p>{item}</p>
                      </div>
                    ))}
                  </div>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreed}
                      onChange={(e) => setAgreed(e.target.checked)}
                      className="w-5 h-5 rounded accent-[#1A56DB] cursor-pointer"
                    />
                    <span className="text-sm text-[#374151]">
                      Saya telah membaca dan menyetujui semua{' '}
                      <span className="text-[#1A56DB] font-semibold">Syarat & Ketentuan</span> pemesanan.
                    </span>
                  </label>
                </div>
              </div>
            )}

            {/* CTA */}
            <div className="mt-6 flex items-center justify-between">
              {step > 0 && (
                <button
                  onClick={() => setStep((s) => s - 1)}
                  className="flex items-center gap-2 px-5 py-3 border border-[#E5EEFF] rounded-xl text-sm font-medium text-[#374151] hover:bg-[#F8FAFF] transition-colors"
                >
                  <ArrowLeft size={15} /> Kembali
                </button>
              )}
              <button
                onClick={() => setStep((s) => s + 1)}
                disabled={!canProceed}
                className={`flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-sm ml-auto transition-all ${
                  canProceed
                    ? 'bg-[#1A56DB] text-white hover:bg-[#1343B8] hover:shadow-lg'
                    : 'bg-[#E5EEFF] text-[#9CA3AF] cursor-not-allowed'
                }`}
              >
                {step === 2 ? (
                  <>
                    <Lock size={15} />
                    Konfirmasi & Bayar DP
                  </>
                ) : (
                  <>
                    Lanjut
                    <ChevronRight size={15} />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right: Order summary */}
          <div>
            <div
              className="bg-white rounded-3xl border border-[#E5EEFF] overflow-hidden sticky top-36"
              style={{ boxShadow: '0 8px 40px rgba(10,31,68,0.08)' }}
            >
              <div className="relative h-36 bg-[#0A1F44] overflow-hidden">
                <img src={trip.image} alt={trip.title} className="w-full h-full object-cover opacity-60" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A1F44]/80 to-transparent" />
              </div>

              <div className="p-5">
                <p className="text-xs font-semibold text-[#1A56DB] mb-1">{trip.category}</p>
                <h3 className="font-semibold text-[#0A1F44] text-sm mb-3 line-clamp-2">{trip.title}</h3>

                <div className="space-y-2 pb-4 border-b border-[#E5EEFF] text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#6B7280]">Tanggal</span>
                    <span className="font-medium text-[#0A1F44]">{selectedDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6B7280]">Peserta</span>
                    <span className="font-medium text-[#0A1F44]">{pax} orang</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6B7280]">Harga/orang</span>
                    <span className="font-medium text-[#0A1F44]">Rp {trip.price.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6B7280]">Biaya layanan</span>
                    <span className="font-medium text-[#0A1F44]">Rp {(50_000 * pax).toLocaleString('id-ID')}</span>
                  </div>
                </div>

                <div className="py-4 border-b border-[#E5EEFF] space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#6B7280]">Total Harga</span>
                    <span className="font-semibold text-[#0A1F44]">Rp {totalPrice.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#6B7280]">Down Payment (30%)</span>
                    <span className="font-bold text-[#1A56DB]">Rp {downPayment.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#6B7280]">Sisa Pelunasan</span>
                    <span className="font-medium text-[#0A1F44]">Rp {(totalPrice - downPayment).toLocaleString('id-ID')}</span>
                  </div>
                </div>

                <div className="pt-4 space-y-2.5">
                  {[
                    { icon: Shield, text: 'Pembayaran 100% aman & terenkripsi' },
                    { icon: CheckCircle2, text: 'Gratis cancel sebelum 14 hari trip' },
                    { icon: Lock, text: 'Data pribadi Anda dilindungi' },
                  ].map((item) => (
                    <div key={item.text} className="flex items-center gap-2 text-xs text-[#6B7280]">
                      <item.icon size={13} className="text-[#10B981]" />
                      {item.text}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
