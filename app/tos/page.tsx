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
                        <h1 className="text-3xl font-bold">Terms of Service (ToS) for CSStatLab</h1>
                        <p className="italic text-xs">Last updated: 12.12.2025</p>
                        <div className="my-5 flex flex-col gap-2">
                            <h3 className="text-2xl font-bold">1. Acceptance of Terms</h3>
                            <div className="pl-5">
                                <p>By accessing or using CSStatLab ("the Service"), you agree to be bound by these Terms of Service.</p>
                                <p>If you do not agree, you may not use the Service.</p>
                                <p>CSStatLab reserves the right to update or change these terms at any time. Continued to use the Service constitutes acceptance of the updated terms.</p>
                            </div>
                            <h3 className="text-2xl font-bold">2. Description of the Service</h3>
                            <div className="pl-5">
                                <p>CSStatLab provides:</p>
                                <ul className="list-disc pl-10">
                                    <li>Player performance statistics based on public data</li>
                                    <li>Match history insights and analytics</li>
                                    <li>Comparison tools and visualizations</li>
                                    <li>Aggregated metrics such as KD, win rate, aim rating, and more</li>
                                </ul>
                                <p>The Service relies on publicly accessible APIs from Steam, Leetify, and FACEIT</p>
                                <p>CSSTatLab is <strong>not affiliated</strong> with Valve, Steam, FACEIT, or Leetify</p>
                            </div>
                            <h3 className="text-2xl font-bold">3. Eligibility</h3>
                            <div className="pl-5">
                                <p>You may use CSStatLab only if:</p>
                                <ul className="list-disc pl-10">
                                    <li>You are at least 13 years old</li>
                                    <li>Your use complies with applicable laws and regulations</li>
                                    <li>You agree to these <u>Terms</u> and the <Link className="underline" href="../privacy">Privacy Policy</Link></li>
                                </ul>
                            </div>
                            <h3 className="text-2xl font-bold">4. User Responsibilities</h3>
                            <div className="pl-5">
                                <p>When using CSStatLab, you agree <strong>not</strong> to:</p>
                                <ul className="list-disc pl-10">
                                    <li>Attempt to access private or hidden data</li>
                                    <li>Use the site for harassment, doxxing, or targeted abuse of players</li>
                                    <li>Reverse-engineer, scrape aggressively, or automate excessive requests</li>
                                    <li>Exploit vulnerabilities or attempt unauthorized access</li>
                                    <p>Use CSStatLab for cheating, boosting, or competitive manipulation</p>
                                </ul>
                                <p>Player statistics displayed are <strong>publicly available</strong> data</p>
                                <p>You are responsible for how you choose to use or interpret this information</p>
                            </div>
                            <h3 className="text-2xl font-bold">5. Data and Accuracy Disclaimer</h3>
                            <div className="pl-5">
                                <p>The Service displays data sourced from third-party APIs</p>
                                <p>Therefore, we <strong>cannot guarantee</strong>:</p>
                                <ul className="list-disc pl-10">
                                    <li>Accuracy</li>
                                    <li>Completeness</li>
                                    <li>Availability</li>
                                    <li>Real-time correctness</li>
                                </ul>
                                <p>Match data and player stats may be incomplete, delayed, or temporarily unavailable due to limitations of external APIs</p>
                                <p>CSStatLab is not respinsible for:</p>
                                <ul className="list-disc pl-10">
                                    <li>Errors in data provided by Steam, Leetify, or FACEIT</li>
                                    <li>Outages from third-party services</li>
                                    <li>Incorrect interpretations of displayed statistics</li>
                                </ul>
                            </div>
                            <h3 className="text-2xl font-bold">6. Intellectual Property</h3>
                            <div className="pl-5">
                                <p>All content on CSStatLab - including UI, graphics, computed metrics, and statistical models - is the property of the Service unless otherwise stated</p>
                                <p>You may not:</p>
                                <ul className="list-disc pl-10">
                                    <li>Copy or reproduce significant portions of the site</li>
                                    <li>Repurpose the analytics commercially without permission</li>
                                    <li>Frame or clone the Service</li>
                                </ul>
                                <p>However, you may share screenshots and links for personal or community use</p>
                            </div>
                            <h3 className="text-2xl font-bold">7. Limitation of Liability</h3>
                            <div className="pl-5">
                                <p>CSStatLab is provided "<strong>as is</strong>" without warranties of any kind</p>
                                <p>We are <strong>not liable</strong> for:</p>
                                <ul className="list-disc pl-10">
                                    <li>Loss of data</li>
                                    <li>Downtime or outages</li>
                                    <li>Damages related to reliance on site information</li>
                                    <li>Any indirect, incidental, or consequantial damanges</li>
                                </ul>
                                <p>Your use of the Service is at your own risk</p>
                            </div>
                            <h3 className="text-2xl font-bold">8. Account Data and Privacy</h3>
                            <div className="pl-5">
                                <p>CSStatLab does <strong>not</strong> require user accounts</p>
                                <p>All information displayed is based on public player data retrived from:</p>
                                <ul className="list-disc pl-10">
                                    <li>Steam Web API</li>
                                    <li>Leetify API</li>
                                    <li>FACEIT API</li>
                                </ul>
                                <p>For details on how we handle data, refer to our <Link className="font-bold hover:underline" href="../privacy/">Privacy Policy</Link></p>
                            </div>
                            <h3 className="text-2xl font-bold">9. External Links</h3>
                            <div className="pl-5">
                                <p>The Service may link to external websites such as Steam, FACEIT, or Leetify</p>
                                <p>We do not control and are not responsible for their content or practices</p>
                            </div>
                            <h3 className="text-2xl font-bold">10. Termination of Access</h3>
                            <div className="pl-5">
                                <p>We reserve the right to restrict or block access to the Service for any user who:</p>
                                <ul className="list-disc pl-10">
                                    <li>Abuses or attacks the platform</li>
                                    <li>Violates these Terms</li>
                                    <li>Attempts to exploit or overload the Service</li>
                                </ul>
                                <p>This may be done without prior notice</p>
                            </div>
                            <h3 className="text-2xl font-bold">11. Governing Law</h3>
                            <div className="pl-5">
                                <p>These Terms are governed by the laws of <strong>Norway</strong></p>
                                <p>Any disputes will be handled under Norwegian legal jurisdiction unless otherwise required by law</p>
                            </div>
                            <h3 className="text-2xl font-bold">12. Contact Information</h3>
                            <div className="pl-5">
                                <p>For questions, concerns, or takedown requests, contact us at:</p>
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