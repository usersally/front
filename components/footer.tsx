import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative text-white -mt-16 z-20">
      {/* CURVED DARK BACKGROUND */}
      <div className="absolute inset-0 bg-[#1F3745] rounded-t-[20%] z-0"></div>
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-4 gap-10">
          {/* BRAND */}
          <div>
            <h2 className="text-2xl font-bold mb-3">
              Cour<span className="text-[#BACEDA]">Sally</span>
            </h2>
            <p className="text-sm text-[#BACEDA]">
              Connecting students with the best teachers for smarter learning.
            </p>
          </div>

          {/* SUPPORT */}
          <div>
            <h3 className="font-semibold mb-3">Support</h3>
            <ul className="space-y-2 text-sm text-[#BACEDA]">
              <li>
                <Link href="#">Help Center</Link>
              </li>
              <li>
                <Link href="#">Contact Us</Link>
              </li>
              <li>
                <Link href="#">How it Works</Link>
              </li>
            </ul>
          </div>

          {/* EXPLORE */}
          <div>
            <h3 className="font-semibold mb-3">Explore</h3>
            <ul className="space-y-2 text-sm text-[#BACEDA]">
              <li>
                <Link href="/teachers">Find Teachers</Link>
              </li>
              <li>
                <Link href="#">Subjects</Link>
              </li>
              <li>
                <Link href="#">Locations</Link>
              </li>
            </ul>
          </div>

          {/* LEGAL */}
          <div>
            <h3 className="font-semibold mb-3">Legal</h3>
            <ul className="space-y-2 text-sm text-[#BACEDA]">
              <li>
                <Link href="#">Privacy Policy</Link>
              </li>
              <li>
                <Link href="#">Terms of Service</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="mt-12 border-t border-[#BACEDA]/30 pt-6 text-center text-sm text-[#BACEDA]">
          © {new Date().getFullYear()} CourSally. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
