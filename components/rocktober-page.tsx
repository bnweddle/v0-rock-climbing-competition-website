"use client"

import { useMemo, useState } from "react"
import { ChevronDown, Mountain, ArrowRight, Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const faqSections = [
  { title: "What is the Rocktober Challenge?", body: "This completely free challenge runs throughout October. Choose a tier based on your age, gender, and estimated climbing ability, then earn points by logging checkpoints, tops, and completed challenges. Challenges are worth more points, and each completed challenge can only be logged once. Use the QR codes posted by the wall to log your progress." },
  { title: "What is a checkpoint?", body: "The rockwall has nine walls labeled 1 through 9. Each wall has checkpoints at approximately one-third and two-thirds of the way up. Reach and grab a hold at or above the number to reach that checkpoint. When logging a climb, record only the farthest point you reached; if you top a wall, do not also log its checkpoints. A checkpoint challenge can still be logged if you have already topped that wall." },
  { title: "What counts as the top?", body: "On walls 6 and 7 (the autobelays), the top is touching the bottom of the autobelay with one hand in a controlled way. When rainbowing, the top is hitting the number at the top of the wall. When following a route, the top means grabbing the literal top of the wall with two hands, including when a route says “nats off.”" },
  { title: "When can I climb?", body: "Certified climbers, or climbers with a certified belayer, may climb whenever the YMCA is open. Check the Rock Climbing Info Board for class times and open climbs. Open climbs are posted Saturdays from 12–1pm, when staff belay participants for free. If you are not certified, attend an open climb or sign up for the belay class or autobelay-only class." },
  { title: "What do I need to climb?", body: "You must have signed a 2026 waiver, wear close-toed shoes, and have access to a harness. Staff can provide harnesses during open climbs, or you can get one at the front desk by showing your certification card." },
  { title: "What are route cards, nats off, and volumes?", body: "Route cards identify the hold color and difficulty. Difficulty increases as the number rises (for example, 5.8 < 5.9 < 5.10a < 5.10d < 5.11a). “Nats off” means natural wall features cannot be pulled on; “nats off for hands” still allows pushing on the wall. Volumes are the pyramid-shaped holds that other holds can be attached to. They are mainly gray, but there is an orange one on Wall #5. Volumes count only when a route hold is mounted to them or the route card says they count." },
  { title: "How do points and prizes work?", body: "Harder walls, routes, and challenges are worth more points, and getting farther earns more points. In routes categories, after a route is logged as a top five times, future logs are worth half as much. First place earns bragging rights, while specific completed challenges earn prizes available at the front desk a few days after reporting." },
  { title: "Can I join late or complete all my challenges?", body: "Yes. Anyone can join after October 1 and still earn points and prizes. If you complete every challenge in your tier, keep logging tops and checkpoints; more challenges may be added during the month." },
  { title: "Can I sign up for two different tiers/categories?", body: "Yes. If you try a routes category but still have trouble with a lot of routes, you can also sign up for the wall climbs category and see if it has challenges you want to try. However, you will not receive twice the prizes; only one prize for each type will be given." },
  { title: "Can challenges overlap?", body: "Yes. For example, if one challenge is to climb all the green routes and another is to climb all the routes on Wall 6, you only have to climb the green route on Wall 6 once for it to count toward both challenges." },
  { title: "Do I need to keep track of all the challenges myself?", body: "Yes and no. We provide the list of challenges, and once you log one as complete, you do not need to log it again; we will update your point total. However, there isn’t currently a way to see your previous log entries, so you’ll need to keep track of which challenges you have logged and how close you are to completing others." },
  { title: "Can I log a checkpoint challenge if I just climbed to the top?", body: "Yes. Checkpoint challenges are a minimum you must reach. If you climb to the top instead of just the checkpoint, still log the checkpoint challenge as complete." },
  { title: "If I fall while climbing a wall and still reach the top afterwards, can I log it as complete?", body: "It depends. In the wall climb categories, falling or resting completely on the rope is okay; take a break and continue once you’re ready. In the routes categories, you must reach the top “cleanly,” without falling or resting on the rope." },
  { title: "How do I get my prizes?", body: "First, log the challenges that have prizes using the log QR code. Prize challenges are marked on the website and the info board. All prizes are 3D printed, so they take a little time to create and get to the Y. Hopefully within 3 days, your prize will be waiting at the front desk with your name." },
  { title: "How does scoring work? Can I log climbs outside my “range”?", body: "Yes, but walls easier than your range won’t be worth nearly as many points. Remember, though, that some challenges may encourage you to climb walls outside your range (including easier ones), and those can be worth a lot of points." },
]

type Challenge = string | { points: number; text: string; prize?: boolean }
type ChallengeGroup = { tier: string; subtitle: string; items: Challenge[]; routes?: Challenge[] }

const challengeGroups: ChallengeGroup[] = [
  { tier: "4–6 years", subtitle: "Wall Climbs", items: [
    { points: 30, text: "Climb to checkpoint 1 on Walls #9 and #1" },
    { points: 35, text: "Climb to checkpoint 2 on Walls #9 and #1" },
    { points: 35, text: "Climb to checkpoint 1 on Walls #6 and #7", prize: true },
    { points: 40, text: "Climb to the top of #9 without using purple holds" },
    { points: 45, text: "Climb to the top of #9 in under 3 minutes", prize: true },
    { points: 45, text: "Climb to the top of #7 without using unicorn holds", prize: true },
    { points: 50, text: "Climb to the top of #1 without using purple holds", prize: true },
    { points: 55, text: "Climb to the top of #2 without using pink holds" },
    { points: 60, text: "Climb to the top of #6 without using purple holds" },
    { points: 65, text: "Climb to the top of #5 without using yellow holds" },
    { points: 70, text: "Climb to the top of #4 without using black holds", prize: true },
    { points: 75, text: "Climb to the top of #3 without using orange holds" },
    { points: 80, text: "Climb to the top of #8 without using blue holds around the corners" },
  ] },
  { tier: "7–9 years", subtitle: "Wall Climbs", items: [
    { points: 40, text: "Climb to the top of Walls #9 and #1" },
    { points: 40, text: "Climb to checkpoint 2 on Walls #6 and #7", prize: true },
    { points: 45, text: "Climb to checkpoint 1 on Walls #5 and #8" },
    { points: 50, text: "Climb to the top of #9 without using purple holds" },
    { points: 55, text: "Climb to the top of #7 without using unicorn holds", prize: true },
    { points: 55, text: "Climb to the top of #9 in under 2 minutes", prize: true },
    { points: 60, text: "Climb to the top of #1 without using purple holds", prize: true },
    { points: 65, text: "Climb to the top of #1 in under 2 minutes" },
    { points: 65, text: "Climb to the top of #2 without using pink holds" },
    { points: 70, text: "Climb to the top of #6 without using purple holds" },
    { points: 75, text: "Climb to the top of #5 without using yellow holds" },
    { points: 80, text: "Climb to the top of #4 without using black holds", prize: true },
    { points: 85, text: "Climb to the top of #3 without using oranges holds" },
    { points: 90, text: "Climb to the top of #8 without using blue holds around the corners" },
  ] },
  { tier: "10–12 years", subtitle: "Wall Climbs", items: [
    { points: 40, text: "Climb to the top of both auto belays", prize: true },
    { points: 45, text: "Get to checkpoint 1 on walls #3, #4, and #5" },
    { points: 45, text: "Get to checkpoint 2 on walls #2 and #8" },
    { points: 250, text: "Climb to the top of all the walls", prize: true },
    { points: 50, text: "Climb to the top of Wall #1 without purple holds" },
    { points: 55, text: "Climb to the top of Wall #9 without green holds" },
    { points: 60, text: "Climb to the top of Wall #2 without using pink holds", prize: true },
    { points: 70, text: "Climb to the top of Wall #6 without using purple holds" },
    { points: 80, text: "Climb to the top of Wall #7 without using gray holds" },
    { points: 85, text: "Climb to the top of Wall #5 without using yellow holds" },
    { points: 90, text: "Climb to the top of Wall #4 without using black holds" },
    { points: 95, text: "Climb to the top of Wall #3 without using oranges holds" },
    { points: 100, text: "Climb to the top of Wall #8 without using tan/white holds", prize: true },
    { points: 60, text: "Climb to the top of Wall #9 in under 1 minute", prize: true },
  ] },
  { tier: "13–18 years", subtitle: "Wall Climbs", items: [
    { points: 40, text: "Climb to the top of both auto belays (walls 6 and 7)" },
    { points: 40, text: "Climb up and down on an auto belay without falling", prize: true },
    { points: 60, text: "Climb to the top of walls: 9, 1, and 2" },
    { points: 60, text: "Climb to checkpoint 2 on walls 3, 4, and 5" },
    { points: 250, text: "Climb to top of all the walls", prize: true },
    { points: 60, text: "Climb #9 only using blue and gray holds" },
    { points: 65, text: "Climb #1 only using gray/brown and orange" },
    { points: 70, text: "Climb to the top of #2 using only blue and yellow" },
    { points: 75, text: "Climb the autobelay on wall 7 without gray holds", prize: true },
    { points: 80, text: "Climb the autobelay on wall 6 without using gray holds" },
    { points: 85, text: "Climb to the top of #5 without using yellow holds" },
    { points: 90, text: "Climb to the top of #4 without using black holds" },
    { points: 95, text: "Climb to the top of #3 without using oranges holds" },
    { points: 100, text: "Climb to the top of #8 without tan/white holds", prize: true },
    { points: 65, text: "Climb to the top of Wall #9 in under 30 seconds", prize: true },
  ] },
  { tier: "13–18 years", subtitle: "Routes", items: [
    { points: 40, text: "Climb up and down on an auto belay without falling using any route of your choice", prize: true },
    { points: 150, text: "Climb all 5.8s to the top" },
    { points: 150, text: "Climb to checkpoint #2 on all 5.9s" },
    { points: 75, text: "Climb to the top of all the red routes on the wall", prize: true },
    { points: 250, text: "Climb all 5.9s to the top", prize: true },
    { points: 75, text: "Climb to the top of all routes on the wall 6 rated 5.10a and below" },
    { points: 125, text: "Climb to the top of all routes on the wall 7 rated 5.10a and below" },
    { points: 50, text: "Climb to the top of a 5.8 but don’t use every other hold" },
    { points: 135, text: "Climb to checkpoint #2 on all 5.10a’s" },
    { points: 75, text: "Climb to the top of all the white routes under 5.10b", prize: true },
    { points: 100, text: "Climb to the top of all the green routes 5.10a and lower" },
    { points: 75, text: "Climb to the top of a 5.9 but don’t use every other hold" },
    { points: 250, text: "Climb all 5.10a’s to the top" },
    { points: 75, text: "Climb to checkpoint #1 on all 5.10b’s" },
    { points: 150, text: "Climb to the top of all the blue routes (even the 5.10b on #7)" },
    { points: 20, text: "Climb Night Fury (black on #4) to checkpoint 1", prize: true },
    { points: 175, text: "Climb all routes on the wall 6 to the top" },
    { points: 200, text: "Climb all routes on the wall 7 to the top" },
    { points: 30, text: "Climb Smurf and Turf (blue on #9) under 1 minute", prize: true },
    { points: 45, text: "Climb Aquaman (teal on #4) in under 2 minutes" },
    { points: 75, text: "Climb Trick or Yeet (yellow on #8) in under 30 seconds" },
  ] },
  { tier: "19+ years", subtitle: "Wall Climbs", items: [
    { points: 40, text: "Climb to the top of both auto belays", prize: true },
    { points: 40, text: "Climb up and down on an auto belay without falling" },
    { points: 60, text: "Climb to the top of walls 9, 1, and 2" },
    { points: 60, text: "Climb to checkpoint 2 on walls 3, 4, and 5" },
    { points: 250, text: "Climb to top of all the walls", prize: true },
    { points: 60, text: "Climb to the top of #9 only using blue and gray holds" },
    { points: 65, text: "Climb #1 to the top of only using gray/brown and orange" },
    { points: 70, text: "Climb to the top of #2 using only blue and yellow" },
    { points: 75, text: "Climb to the top of wall 7 without unicorn holds", prize: true },
    { points: 80, text: "Climb to the top of wall 6 without using gray holds" },
    { points: 85, text: "Climb to the top of #5 without using yellow holds" },
    { points: 90, text: "Climb to the top of #4 without using black holds" },
    { points: 95, text: "Climb to the top of #3 without using oranges holds" },
    { points: 100, text: "Climb to the top of #8 without tan/white holds", prize: true },
    { points: 65, text: "Climb to the top of Wall #9 in under 30 seconds", prize: true },
  ] },
  { tier: "19+ years", subtitle: "Routes · 5.7–5.10a", items: [
    { points: 50, text: "Climb up and down on an auto belay without falling using any route of your choice", prize: true },
    { points: 175, text: "Climb all 5.8s to the top" },
    { points: 175, text: "Climb to checkpoint #2 on all 5.9s" },
    { points: 90, text: "Climb all the red routes on the wall" },
    { points: 300, text: "Climb all 5.9s to the top", prize: true },
    { points: 75, text: "Climb all routes on the wall 6 rated 5.10a and below" },
    { points: 125, text: "Climb all routes on the wall 7 rated 5.10a and below" },
    { points: 50, text: "Climb a 5.8 but don’t use every other hold" },
    { points: 175, text: "Climb to checkpoint #2 on all 5.10a’s" },
    { points: 75, text: "Climb all the white routes 5.10a and lower", prize: true },
    { points: 135, text: "Climb all the green routes 5.10a and lower", prize: true },
    { points: 75, text: "Climb a 5.9 but don’t use every other hold" },
    { points: 275, text: "Climb all 5.10a’s to the top" },
    { points: 150, text: "Climb all the blue routes (even the 5.10b on #7)" },
    { points: 150, text: "Climb all the yellow routes (even the 5.10b on #5)" },
    { points: 35, text: "Climb Night Fury (black on #4) to checkpoint 1", prize: true },
    { points: 30, text: "Climb Smurf and Turf (blue on #9) under 30 seconds" },
    { points: 50, text: "Climb Aquaman (teal on #4) in under 1 minute", prize: true },
    { points: 100, text: "Climb Trick or Yeet (yellow on #8) in under 30 seconds" },
  ] },
  { tier: "19+ years", subtitle: "Routes · 5.10a+", items: [
    { points: 30, text: "Climb up and down on an auto belay without falling using a route of your choice", prize: true },
    { points: 180, text: "Climb all the 5.9 routes" },
    { points: 25, text: "Climb a 5.8 but don’t use every other hold" },
    { points: 50, text: "Climb a 5.9 but don���t use every other hold", prize: true },
    { points: 150, text: "Climb to the top of all 5.10a’s" },
    { points: 65, text: "Climb a 5.10a using only half the holds (climber’s choice, round down; Note: Nats on regardless of label notes)" },
    { points: 235, text: "Climb all routes on the wall 6" },
    { points: 120, text: "Climb all routes on the wall 7" },
    { points: 75, text: "Climb all blue routes", prize: true },
    { points: 110, text: "Climb to checkpoint 2 to all 5.10b’s" },
    { points: 60, text: "Climb to the top of all black routes", prize: true },
    { points: 100, text: "Climb all the purple routes" },
    { points: 165, text: "Climb to the top of all 5.10b’s" },
    { points: 100, text: "Climb all the orange routes" },
    { points: 100, text: "Climb to checkpoint 2 to all 5.10c’s" },
    { points: 150, text: "Climb to the top of all 5.10c’s" },
    { points: 750, text: "Climb every single route below a 5.10d" },
    { points: 65, text: "Climb to checkpoint 1 on all 5.10d’s or harder" },
    { points: 90, text: "Climb all white routes (this does not include Miracle Whip on #8)", prize: true },
    { points: 150, text: "Climb to the top of two routes rated 5.10d or harder" },
    { points: 100, text: "Climb one wall using only natural features (hint: #1, #7, and #6 are the “easiest”)" },
    { points: 150, text: "Climb all the pink routes" },
    { points: 100, text: "Climb a 5.10a route in under 30 seconds", prize: true },
    { points: 150, text: "Climb a 5.10b route or higher in under 30/45 seconds (men/women)" },
  ] },
]

const general: Challenge[] = [
  { points: 150, text: "Bring someone climbing who has never climbed at the North Y" },
  { points: 50, text: "Submit a picture in a Halloween costume" },
  { points: 100, text: "Traverse the entire wall while keeping your feet below the black line" },
  { points: 100, text: "Climb at NW at least once during October" },
]

const secretReminder = "Keep checking this website for additional challenges and upcoming secret route challenges."

function SecretRouteReminder() {
  return <aside className="mb-6 rounded-2xl border-2 border-dashed border-primary/50 bg-primary/10 p-5"><p className="inline-flex rounded-full bg-primary/15 px-3 py-1.5 text-sm font-bold uppercase tracking-widest text-primary">Important reminder</p><p className="mt-2 rounded-xl px-3 py-1.5 text-sm leading-7 text-muted-foreground">{secretReminder}</p><p className="mt-4 px-3 text-xs text-muted-foreground">A star indicates that a prize will be received when that challenge is completed.</p></aside>
}

function challengeText(item: Challenge) {
  return typeof item === "string" ? item : item.text
}

function ChallengeList({ title, items }: { title: string; items: Challenge[] }) {
  return (
    <div className="flex flex-col gap-3">
      <h4 className="text-sm font-bold uppercase tracking-widest text-primary">{title}</h4>
      <ul className="grid list-none gap-2 sm:grid-cols-2">
        {items.map((item) => {
          const challenge = typeof item === "string" ? { text: item } : item
          const hasPrize = "prize" in challenge && challenge.prize
          const points = "points" in challenge ? challenge.points : null

          return (
            <li key={challengeText(item)} className="flex items-start gap-3 rounded-xl border border-border/70 bg-background/60 px-4 py-3 text-sm leading-relaxed">
              <Mountain aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-primary" />
              <span className="min-w-0 flex-1">{challenge.text}</span>
              {hasPrize && <span className="shrink-0 text-lg leading-none text-yellow-400" title="This challenge includes a prize." aria-label="Prize challenge">★</span>}
              {points !== null && <span className="flex min-w-16 shrink-0 justify-center rounded-full bg-secondary/15 px-2 py-1 text-xs font-bold text-secondary">{points} pts</span>}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export function RocktoberPage() {
  const [activeTier, setActiveTier] = useState("All tiers")
  const [query, setQuery] = useState("")
  const filtered = useMemo(() => challengeGroups.filter((group) => activeTier === "All tiers" || group.tier === activeTier).map((group) => ({ ...group, items: group.items.filter((item) => challengeText(item).toLowerCase().includes(query.toLowerCase())), routes: group.routes?.filter((item) => challengeText(item).toLowerCase().includes(query.toLowerCase())) })), [activeTier, query])
  return <div className="min-h-screen bg-background">
    <header className="sticky top-0 z-10 border-b border-border/70 bg-background/90 backdrop-blur"><div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4"><a href="#top" className="flex items-center gap-3 font-display text-xl tracking-wide"><span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground"><Mountain /></span><span>ROCKTOBER <span className="text-primary">CHALLENGE</span></span></a><nav className="hidden gap-6 text-sm font-medium sm:flex"><a href="#rules" className="hover:text-primary">Rules & FAQ</a><a href="#challenges" className="hover:text-primary">Challenges</a></nav></div></header>
    <main id="top"><section className="relative overflow-hidden border-b border-border/70"><div className="mx-auto grid max-w-6xl gap-10 px-5 py-20 md:grid-cols-[1.1fr_.9fr] md:items-center md:py-28"><div><p className="mb-4 text-sm font-bold uppercase tracking-[0.28em] text-primary">October · North YMCA</p><h1 className="max-w-3xl font-display text-5xl tracking-wide sm:text-7xl">ROCKTOBER <span className="text-primary">CHALLENGE</span></h1><p className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground">Climb more. <span className="font-semibold text-foreground">Challenge yourself.</span> A completely free month-long climbing challenge for every age and ability. Pick your tier, try new climbs, and earn points all October long.</p><div className="mt-8 flex flex-wrap gap-3"><a href="#challenges" className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 font-semibold text-primary-foreground">Explore challenges <ArrowRight /></a><a href="#rules" className="rounded-xl border border-border px-5 py-3 font-semibold">Read the rules</a></div></div><div className="rounded-[2rem] bg-primary p-8 text-primary-foreground shadow-2xl shadow-primary/20"><p className="text-sm font-semibold uppercase tracking-widest opacity-80">How it works</p><ol className="mt-7 flex flex-col gap-6">{["Choose the tier that fits you", "Climb walls, routes, and checkpoints", "Log your progress with the wall QR codes"].map((step, i) => <li key={step} className="flex gap-4"><span className="grid size-8 shrink-0 place-items-center rounded-full bg-primary-foreground font-bold text-primary">{i + 1}</span><span className="pt-1 font-medium">{step}</span></li>)}</ol></div></div></section>
    <section id="rules" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-20"><div className="mb-10 max-w-2xl"><p className="text-sm font-bold uppercase tracking-widest text-primary">Start here</p><h2 className="mt-2 text-4xl font-black tracking-tight">Rules & FAQs</h2><p className="mt-3 text-muted-foreground">Everything you need to know before you step onto the wall.</p></div><div className="grid gap-3 md:grid-cols-2">{faqSections.map((faq) => <details key={faq.title} className="group rounded-2xl border border-border bg-card px-5 py-4"><summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold">{faq.title}<ChevronDown className="transition-transform group-open:rotate-180" /></summary><p className="mt-4 border-t border-border pt-4 text-sm leading-7 text-muted-foreground">{faq.body}</p></details>)}</div></section>
    <section id="challenges" className="scroll-mt-20 bg-muted/40 px-5 py-20"><div className="mx-auto max-w-6xl"><div className="mb-12 flex flex-col items-start gap-4 rounded-2xl border border-border/70 bg-card p-6 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="text-2xl font-black tracking-tight text-card-foreground">Submit your challenges and climbs</h2><p className="mt-1 text-sm leading-6 text-muted-foreground">Completed a challenge? Log it with the submission form so your points count.</p></div><a href="https://forms.gle/usV7v1zcczFwzHYZA" target="_blank" rel="noopener noreferrer" className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:w-auto">Submit challenges<ArrowRight className="size-4" aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span></a></div><div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between"><div><p className="text-sm font-bold uppercase tracking-widest text-primary">Pick your tier</p><h2 className="mt-2 text-4xl font-black tracking-tight">The challenge list</h2></div><div className="relative w-full md:max-w-xs"><Search className="absolute left-3 top-3 text-muted-foreground" /><input aria-label="Search challenges" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search challenges" className="w-full rounded-xl border border-border bg-background py-2.5 pl-10 pr-4 text-sm outline-none ring-primary focus:ring-2" /></div></div><div className="mb-10 flex flex-wrap gap-2">{["All tiers", ...new Set(challengeGroups.map((group) => group.tier))].map((tier) => <button key={tier} onClick={() => setActiveTier(tier)} className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${activeTier === tier ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background hover:border-primary"}`}>{tier}</button>)}</div><div className="flex flex-col gap-8">{filtered.map((group) => <article key={`${group.tier}-${group.subtitle}`} className="rounded-3xl border border-border bg-card p-6 shadow-sm md:p-8"><div className="mb-6 flex flex-wrap items-center gap-3"><h3 className="text-2xl font-black">{group.tier}</h3><Badge variant="secondary">{group.subtitle}</Badge><span className="text-sm text-muted-foreground">{group.items.length} challenges</span></div>{group.items.length > 0 && <ChallengeList title={group.subtitle} items={group.items} />}{group.routes && group.routes.length > 0 && <div className="mt-8"><ChallengeList title="Routes" items={group.routes} /></div>}</article>)}<article className="order-first rounded-[2rem] border-2 border-dashed border-secondary/60 bg-secondary/10 p-6 shadow-sm md:p-8"><SecretRouteReminder /><div className="mb-5 flex flex-wrap items-center gap-3"><h3 className="font-display text-3xl tracking-wide text-secondary">Generic / Other</h3><Badge variant="secondary" className="rounded-full">For everyone</Badge></div><div className="mt-5"><ChallengeList title="Everyone" items={general} /></div></article></div></div></section></main><footer className="border-t border-border px-5 py-8 text-center text-sm text-muted-foreground">North YMCA · Rocktober Challenge · October</footer>
  </div>
}
