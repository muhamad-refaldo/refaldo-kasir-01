import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../utils/api'

// Ikon-ikon yang akan kita gunakan
import {
  HiOutlineUser,
  HiOutlineOfficeBuilding,
  HiOutlineMail,
  HiOutlineLockClosed,
} from 'react-icons/hi'
import { FaUserPlus } from 'react-icons/fa'
// --- [TAMBAHAN] Impor ikon mata ---
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai'

// Komponen latar belakang bintang yang sama dengan halaman login
const AnimatedStars = () => (
  <div className="stars">
    <div className="stars-bg"></div>
  </div>
)

// Komponen efek kilau yang sama
const FormShine = () => (
  <div className="absolute top-0 left-0 w-full h-full overflow-hidden rounded-2xl">
    <div className="absolute top-0 -left-1/2 w-full h-full bg-white/20 transform -skew-x-12 mix-blend-overlay animate-[shine_5s_ease-in-out_infinite]"></div>
    <style>{`
            @keyframes shine {
                0% { transform: translateX(-100%) skewX(-12deg); }
                30%, 100% { transform: translateX(250%) skewX(-12deg); }
            }
        `}</style>
  </div>
)

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    storeName: '',
    email: '',
    password: '',
    password2: '',
  })
  // --- [TAMBAHAN] State terpisah untuk setiap input password ---
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const { name, storeName, email, password, password2 } = formData
  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value })

  const onSubmit = async (e) => {
    e.preventDefault()
    if (password !== password2) {
      setError('Password konfirmasi tidak cocok.')
      // Hapus pesan error setelah 3 detik
      setTimeout(() => setError(''), 3000)
      return
    }
    setLoading(true)
    setError('')
    try {
      // Simulasi loading agar efeknya terlihat lebih jelas
      await new Promise((resolve) => setTimeout(resolve, 1500))
      const res = await api.post('/auth/register', {
        name,
        storeName,
        email,
        password,
      })
      navigate('/verify-otp', { state: { email: res.data.email } })
    } catch (err) {
      setError(err.response?.data?.msg || 'Pendaftaran gagal, coba lagi.')
      setLoading(false)
    }
  }

  return (
    <div className="relative flex items-center justify-center min-h-screen w-full overflow-hidden bg-[#02041a] p-4">
      <AnimatedStars />

      <div className="relative z-10 w-full max-w-md">
        <div className="relative border border-cyan-400/20 bg-slate-900/50 backdrop-blur-md rounded-2xl shadow-2xl shadow-cyan-500/10">
          <FormShine />

          <form
            className="relative p-6 sm:p-10"
            onSubmit={onSubmit}
            noValidate
          >
            {/* Header Form */}
            <div className="mb-8 text-center">
              <FaUserPlus className="mx-auto mb-4 text-5xl text-cyan-400" />
              <h1 className="font-mono text-3xl font-bold tracking-wider text-white">
                Daftar
              </h1>
              <p className="mt-2 text-sm text-slate-400">
                Daftar untuk melanjutkan ke refaldo kasir
              </p>
            </div>

            {/* Tampilan Error */}
            {error && (
              <div
                role="alert"
                className="px-4 py-2 mb-4 text-sm text-center text-red-300 border border-red-500 rounded-lg bg-red-900/50"
              >
                {error}
              </div>
            )}

            {/* Grup Input */}
            <div className="space-y-4">
              <div className="relative">
                <HiOutlineUser className="absolute text-xl pointer-events-none top-1/2 left-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  name="name"
                  placeholder="nama anda (aldo)"
                  required
                  onChange={onChange}
                  className="input-field-style"
                />
              </div>

              <div className="relative">
                <HiOutlineOfficeBuilding className="absolute text-xl pointer-events-none top-1/2 left-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  name="storeName"
                  placeholder="Nama toko (martabak)"
                  required
                  onChange={onChange}
                  className="input-field-style"
                />
              </div>

              <div className="relative">
                <HiOutlineMail className="absolute text-xl pointer-events-none top-1/2 left-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  name="email"
                  placeholder="Email (aldo@gmail.com)"
                  required
                  onChange={onChange}
                  className="input-field-style"
                />
              </div>

              {/* --- [PERUBAHAN] Input Password 1 dengan Ikon Mata --- */}
              <div className="relative">
                <HiOutlineLockClosed className="absolute text-xl pointer-events-none top-1/2 left-4 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Password (!aldo969)"
                  required
                  minLength="6"
                  onChange={onChange}
                  className="pr-12 input-field-style"
                />
                <div
                  className="absolute cursor-pointer top-1/2 right-4 -translate-y-1/2 text-slate-400 hover:text-cyan-400"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <AiFillEyeInvisible size={22} />
                  ) : (
                    <AiFillEye size={22} />
                  )}
                </div>
              </div>

              {/* --- [PERUBAHAN] Input Password 2 dengan Ikon Mata --- */}
              <div className="relative">
                <HiOutlineLockClosed className="absolute text-xl pointer-events-none top-1/2 left-4 -translate-y-1/2 text-slate-400" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="password2"
                  placeholder="Konfirmasi password"
                  required
                  minLength="6"
                  onChange={onChange}
                  className="pr-12 input-field-style"
                />
                <div
                  className="absolute cursor-pointer top-1/2 right-4 -translate-y-1/2 text-slate-400 hover:text-cyan-400"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <AiFillEyeInvisible size={22} />
                  ) : (
                    <AiFillEye size={22} />
                  )}
                </div>
              </div>
            </div>

            {/* Tombol Daftar */}
            <div className="mt-8 form-control">
              <button
                type="submit"
                className="flex items-center justify-center w-full px-4 py-3 font-bold text-white transition-all duration-300 transform rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-700 disabled:cursor-not-allowed disabled:text-slate-400 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-cyan-500/50"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <svg
                      className="w-5 h-5 mr-3 -ml-1 text-white animate-spin"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <span>Sedang Di Proses</span>
                  </>
                ) : (
                  'Daftar'
                )}
              </button>
            </div>

            {/* Link ke Login */}
            <p className="mt-8 text-sm text-center text-slate-400">
              Sudah mempunyai akun?{' '}
              <Link
                to="/login"
                className="font-semibold text-cyan-400 transition-colors hover:text-cyan-300 hover:underline"
              >
                Silahkan Login
              </Link>
            </p>
          </form>
        </div>
      </div>
      {/* Menambahkan class umum untuk input agar tidak berulang */}
      <style>{`
                .input-field-style {
                    width: 100%;
                    background-color: rgba(30, 41, 59, 0.5); /* bg-slate-800/50 */
                    border: 1px solid #475569; /* border-slate-700 */
                    border-radius: 0.5rem; /* rounded-lg */
                    padding-top: 0.75rem; /* py-3 */
                    padding-bottom: 0.75rem; /* py-3 */
                    padding-left: 3rem; /* pl-12 */
                    padding-right: 1rem; /* pr-4 */
                    color: white;
                    transition: all 0.3s;
                }
                .input-field-style::placeholder {
                    color: #64748b; /* placeholder-slate-500 */
                }
                .input-field-style:focus {
                    outline: none;
                    --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
                    --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);
                    box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
                    --tw-ring-color: #06b6d4; /* ring-cyan-500 */
                    border-color: #06b6d4; /* border-cyan-500 */
                }
            `}</style>
    </div>
  )
}

export default Register
