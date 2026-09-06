import { Download } from "lucide-react";

export default function ConsistencyHacksDownload() {
  const downloadPDF = () => {
    const content = `TOP 5 CONSISTENCY HACKS - LAUNCH LIFESTYLE

🔥 Transform Your Fitness Journey with Proven Strategies 🔥

HACK #1: START STUPIDLY SMALL
The biggest mistake people make is going from 0 to 100 overnight. Your brain resists massive changes, but it loves tiny wins. Start with 5 push-ups, not 50. Walk for 10 minutes, not an hour. Once the habit sticks, scaling up becomes natural. Remember: 1% better every day compounds into life-changing results over time.

HACK #2: STACK YOUR HABITS
Attach your new workout habit to something you already do religiously. "After I brush my teeth in the morning, I'll do 10 squats." "Before I check my phone at night, I'll do a 2-minute plank." This psychological trick hijacks your existing routine and makes the new habit feel automatic.

HACK #3: THE 2-MINUTE RULE
Any habit should take less than 2 minutes to start. "Exercise for 30 minutes" becomes "Put on my workout clothes." "Do a full workout" becomes "Do one push-up." Once you start, momentum takes over. The hardest part is always beginning – make it ridiculously easy to start.

HACK #4: TRACK YOUR STREAK, NOT RESULTS
Don't obsess over the scale or mirror. Focus on showing up. Mark an X on a calendar every day you exercise, no matter how small. Seeing that chain of X's becomes addictive – you won't want to break it. Consistency beats intensity every single time. A mediocre workout you actually do beats a perfect workout you skip.

HACK #5: DESIGN YOUR ENVIRONMENT
Make good choices easier and bad choices harder. Lay out your workout clothes the night before. Keep your dumbbells visible. Put your phone in another room during workout time. Your environment shapes your behavior more than willpower ever will. Set up your space for success, and success becomes inevitable.

READY TO BUILD UNSTOPPABLE CONSISTENCY?
Join thousands who've transformed their lives with Launch Lifestyle

Download the Launch Lifestyle App:
iOS: https://apps.apple.com/za/app/launch-lifestyle/id6743004197
Android: https://play.google.com/store/apps/details?id=fit.sudor.launch&pcampaignid=web_share

Follow us:
Instagram: @launchlifestyle
Facebook: Launch Lifestyle
TikTok: @launchlifestyle

Contact: keegan.launch@gmail.com

Launch Lifestyle - Transforming lives through intelligent fitness coaching`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Launch-Lifestyle-Top-5-Consistency-Hacks.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-black text-primary uppercase tracking-tight">
            TOP 5 CONSISTENCY HACKS
          </h1>
          <p className="text-xl font-semibold">
            Transform Your Fitness Journey with Proven Strategies
          </p>
          <p className="text-gray-300">
            The exact blueprint that keeps 1000+ Launch members consistent every day
          </p>
        </div>
        
        <button
          onClick={downloadPDF}
          className="inline-flex items-center gap-3 bg-primary text-black px-8 py-4 font-black uppercase tracking-wide hover:bg-yellow-400 transition-colors text-lg"
        >
          <Download className="w-6 h-6" />
          Download Guide
        </button>
        
        <div className="text-sm text-gray-400">
          <p>Launch Lifestyle - Transforming lives through intelligent fitness coaching</p>
          <p>Contact: keegan.launch@gmail.com</p>
        </div>
      </div>
    </div>
  );
}