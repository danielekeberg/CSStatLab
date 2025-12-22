import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import Link from "next/link";

export default function Home() {
    return(
        <div className="relative min-h-screen overflow-hidden bg-[#030914] text-white">
            <div className="absolute inset-0 bg-gradient-to-br from-[#040b1a] via-[#020814] to-[#030914]" />
            <div className="absolute inset-0">
                <div className="absolute -top-40 left-1/2 h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-3xl" />
                <div className="absolute -left-40 top-1/4 h-[500px] w-[500px] rounded-full bg-blue-500/10 blur-3xl" />
                <div className="absolute -right-40 bottom-0 h-[600px] w-[600px] rounded-full bg-sky-500/10 blur-3xl" />
            </div>
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0)_0%,rgba(0,0,0,0.55)_70%,rgba(0,0,0,0.85)_100%)]" />
            <div className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:60px_60px]" />
            <div className="relative">
                <div className="px-5 md:px-[15%]">
                    <Header status={false} />
                    <div className="md:px-[15%] mt-10 mb-50">
                        <h1 className="text-3xl font-bold">Privacy Policy for CSStatLab</h1>
                        <p className="italic text-xs">Last updated: 12.12.2025</p>
                        <div className="my-5 flex flex-col gap-2">
                            <h3 className="text-2xl font-bold">1. Introduction</h3>
                            <div className="pl-5">
                                <div>
                                    <p>CSStatLab (“we”, “us”, or “our”) provides statistical analysis and visual insights based on publicly available gameplay data from platforms such as Steam, Leetify, and FACEIT.</p>
                                    <p>This Privacy Policy explains how we collect, use, store, and protect information when you use our website.</p>
                                </div>
                                <p>By accessing CSStatLab, you agree to the terms described in this Privacy Policy.</p>
                            </div>
                        </div>
                        <div className="my-5 flex flex-col gap-2">
                            <h3 className="text-2xl font-bold">2. Data We Collect</h3>
                            <div className="pl-5">
                                <h3 className="text-xl font-bold">2.1 Public Player Data</h3>
                                <div className="pl-5">
                                    <p>We collect and display <strong>public accessible data</strong> from third-party services, including but not limited to:</p>
                                    <ul className="list-disc pl-10">
                                        <li>Steam profiles (public profile information only)</li>
                                        <li>Leetify gameplay statistics</li>
                                        <li>FACEIT player data</li>
                                        <li>Match history and performance metrics</li>
                                        <li>Derived metrics such as KD, win rate, aim rating, and cheat-risk estimations</li>
                                    </ul>
                                    <p>We <strong>do not</strong> access or store any private date, private match history, hidden Steam data, email addresses, or passwords</p>
                                </div>
                                <h3 className="text-xl font-bold">2.2 Website Analytics</h3>
                                <div className="pl-5">
                                    <p>We may use basic analytics to collect anonymized information such as:</p>
                                    <ul className="list-disc pl-10">
                                        <li>Browser type</li>
                                        <li>Device type</li>
                                        <li>Pages visited</li>
                                    </ul>
                                    <p>Data is strictly used to improve the service.</p>
                                </div>
                            </div>
                            <h3 className="text-2xl font-bold">3. How We Use the Data</h3>
                            <div className="pl-5">
                                <p>We use collected data solely to:</p>
                                <ul className="list-disc pl-10">
                                    <li>Display player statistics and match history</li>
                                    <li>Generate performance insights and cheat-risk estimations</li>
                                    <li>Improve the accuracy and functionality of CSStatLab</li>
                                    <li>Cache recent match data to reduce API load and improve performace</li>
                                </ul>
                                <p>We <strong>never</strong> sell, rent, or share your personal data with advertisers or third parties.</p>
                            </div>
                            <h3 className="text-2xl font-bold">4. How We Store and Protect Data</h3>
                            <div className="pl-5">
                                <ul className="list-disc pl-10">
                                    <li>All stored data (such as match history and aggregated stats) is saved securely using Supabase</li>
                                    <li>We only store public information returned by the APIs</li>
                                    <li>Sensitive private data is never requested or stored</li>
                                    <li>Access to administrative tools is strictly limited and secured</li>
                                </ul>
                            </div>
                            <h3 className="text-2xl font-bold">5. Third-Party Services</h3>
                            <div className="pl-5">
                                <p>CSStatLab interacts with third-party APIs:</p>
                                <ul className="list-disc font-bold pl-10">
                                    <li>Steam API</li>
                                    <li>Leetify Public API</li>
                                    <li>FACEIT API</li>
                                </ul>
                                <p>Each service has its own privacy policy.</p>
                                <p>We recommend reviewing them to understand how they handle your information.</p>
                                <p>CSStatLab is not affiliated with Valve, Steam, Leetify, or FACEIT.</p>
                            </div>
                            <h3 className="text-2xl font-bold">6. Affiliate Links</h3>
                            <div className="pl-5">
                                <p>CSStatLab may contain affiliate links to third-party services related to gaming or Counter-Strike.</p>
                                <p>If you click on an affiliate link and sign up or make a purchase, we may receive a small commission at no additional cost to you.</p>
                                <p>Affiliate partners may use cookies or similar technologies in accordance with their own privacy policies.</p>
                            </div>
                            <h3 className="text-2xl font-bold">7. User Rights (GDPR & CCPA)</h3>
                            <div className="pl-5">
                                <p>Depending on your region, you may have the right to:</p>
                                <ul className="list-disc pl-10">
                                    <li>Request deletion of your stored match data</li>
                                    <li>Request that your profile be excluded from future indexing</li>
                                    <li>Request correction of inaccurate stored information</li>
                                    <li>Request a copy of all stored public data related to your Steam ID</li>
                                </ul>
                                <p>To submit a request, contact us at: <strong className="underline">daneke75160@gmail.com</strong></p>
                                <p>We will respond within 30 days</p>
                            </div>
                            <h3 className="text-2xl font-bold">8. Data Retention</h3>
                            <div className="pl-5">
                                <p>We retain cached match data for performance purposes</p>
                                <p>If a player has no recent matches or their profile is set to private, cached data may remain until manually deleted or automatically purged</p>
                            </div>
                            <h3 className="text-2xl font-bold">9. Children's Privacy</h3>
                            <div className="pl-5">
                                <p>CSStatLab does not knowingly collect data from users under 13</p>
                                <p>If you believe a minor's information has been processed, contact us and we will remove it</p>
                            </div>
                            <h3 className="text-2xl font-bold">10. Changes to This Policy</h3>
                            <div className="pl-5">
                                <p>We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated "Last updated" date.</p>
                            </div>
                            <h3 className="text-2xl font-bold">11. Contact Information</h3>
                            <div className="pl-5">
                                <p>For any questions, complaints, or data requests, please contact:</p>
                                <p><strong>Email:</strong> daneke75160@gmail.com</p>
                                <p><strong>Website:</strong> <Link className="hover:underline" href="https://csstatlab.com">https://csstatlab.com</Link></p>
                            </div>
                        </div>
                    </div>
                    <Footer />
                </div>
            </div>
        </div>
    )
}