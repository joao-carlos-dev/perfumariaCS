import { FaWhatsapp, FaInstagram } from 'react-icons/fa';

export function Footer() {
    return (
        <footer className="bg-purple-900 text-purple-100 py-4 w-full">
            <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="text-center md:text-left">
                    <h2 className="text-xl font-bold text-white">Perfumaria CS</h2>
                    <p className="text-sm mt-1"> © {new Date().getFullYear()} Perfumaria CS. Todos os direitos reservados.</p>
                    <p className="text-sm mt-1 text-purple-300">Imbituaba - SC</p>
                </div>

                <div className="flex gap-4 font-semibold text-lg">
                    <a
                        href="https://wa.me/SEUNUMERO"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-pink-400 transition-colors"
                    >
                        <FaWhatsapp className="text-2xl inline-block" /> WhatsApp 
                    </a>
                    <a
                        href="https://instagram.com/SEUPERFIL"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-pink-400 transition-colors"
                    >
                        <FaInstagram className="text-2xl inline-block" /> Instagram
                    </a>
                </div>
            </div>
        </footer>
    )

}