import pptx
from pptx.util import Inches, Pt, Emu
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN

def create_perfect_presentation():
    prs = pptx.Presentation('templates/Eva 1.pptx')
    
    # Fonts and Colors
    FONT_HEAD = "Libre Baskerville"
    FONT_BODY = "Libre Baskerville"
    FONT_TITLE = "IBM Plex Mono"
    
    COLOR_PRIMARY = RGBColor(17, 24, 39)    # Deep charcoal
    COLOR_MUTED = RGBColor(55, 65, 81)      # Text gray
    COLOR_ACCENT = RGBColor(30, 58, 138)    # Deep navy accent
    COLOR_BULLET = RGBColor(220, 38, 38)    # Clean red/crimson accent
    
    # ----------------------------------------------------
    # SLIDE 1: Title Slide - UNTOUCHED (As requested by user)
    # ----------------------------------------------------
    print("Slide 1 preserved untouched.")
    
    # ----------------------------------------------------
    # SLIDE 2: PROPOSED SOLUTION
    # ----------------------------------------------------
    slide2 = prs.slides[1]
    
    # Left box: Problem & Our Solution
    shape_s2_left = slide2.shapes[0] # Google Shape;107;p14
    tf2_l = shape_s2_left.text_frame
    tf2_l.word_wrap = True
    tf2_l.clear()
    shape_s2_left.height = Emu(7150000)
    
    p = tf2_l.paragraphs[0]
    p.text = "Problem"
    p.font.name = FONT_HEAD
    p.font.size = Pt(22)
    p.font.bold = True
    p.font.color.rgb = COLOR_PRIMARY
    p.space_after = Pt(6)
    
    prob_bullets = [
        ("Fragmented Daily Routine: ", "Academics, timetables, ride-sharing, club events, and peer help are scattered across unorganized WhatsApp groups, physical notice boards, and word-of-mouth."),
        ("Who Faces This: ", "600+ first-year engineering students across 12 divisions transitioning into college without a unified platform."),
        ("Why Difficult Currently: ", "Existing tools are disconnected silos—calculators only work after marks arrive, event pages lack live states, and finding verified peer tutors is ad-hoc.")
    ]
    
    for bold_txt, norm_txt in prob_bullets:
        p = tf2_l.add_paragraph()
        p.level = 1
        p.space_after = Pt(4)
        r1 = p.add_run()
        r1.text = bold_txt
        r1.font.name = FONT_BODY
        r1.font.size = Pt(14)
        r1.font.bold = True
        r1.font.color.rgb = COLOR_PRIMARY
        r2 = p.add_run()
        r2.text = norm_txt
        r2.font.name = FONT_BODY
        r2.font.size = Pt(13)
        r2.font.bold = False
        r2.font.color.rgb = COLOR_MUTED

    p = tf2_l.add_paragraph()
    p.text = "Our Solution"
    p.font.name = FONT_HEAD
    p.font.size = Pt(22)
    p.font.bold = True
    p.font.color.rgb = COLOR_PRIMARY
    p.space_before = Pt(14)
    p.space_after = Pt(6)

    sol_bullets = [
        ("Unified Campus Companion (Campus360): ", "A single responsive platform solving academic tracking, daily commute, peer-learning, and campus help in one flow."),
        ("User Inputs: ", "Branch & Division (D1ADA to D5C), target SGPA, skills offered/needed, and ride source/destination."),
        ("Processing & Outputs: ", "Generates live Mon–Fri division timetables, what-if SGPA needed-marks tables, verified Leaflet carpools, and peer time-bank exchanges.")
    ]

    for bold_txt, norm_txt in sol_bullets:
        p = tf2_l.add_paragraph()
        p.level = 1
        p.space_after = Pt(4)
        r1 = p.add_run()
        r1.text = bold_txt
        r1.font.name = FONT_BODY
        r1.font.size = Pt(14)
        r1.font.bold = True
        r1.font.color.rgb = COLOR_PRIMARY
        r2 = p.add_run()
        r2.text = norm_txt
        r2.font.name = FONT_BODY
        r2.font.size = Pt(13)
        r2.font.bold = False
        r2.font.color.rgb = COLOR_MUTED

    # Right box: Key Features & What Makes It Different
    shape_s2_right = slide2.shapes[4] # Google Shape;117;p14
    shape_s2_right.height = Emu(7150000)
    tf2_r = shape_s2_right.text_frame
    tf2_r.word_wrap = True
    tf2_r.clear()

    p = tf2_r.paragraphs[0]
    p.text = "Key Features"
    p.font.name = FONT_HEAD
    p.font.size = Pt(22)
    p.font.bold = True
    p.font.color.rgb = COLOR_PRIMARY
    p.space_after = Pt(6)

    kf_bullets = [
        ("Division-Bound Smart Timetable: ", "Live schedule bound to official VESIT divisions (D1ADA–D5C) with faculty abbreviations & room info."),
        ("What-If SGPA Academic Planner: ", "Dynamic grade lockout engine calculating exact end-sem marks needed to reach target SGPA."),
        ("Leaflet Student Carpooling: ", "Interactive campus map with seat booking state machine (Available, Requested, Confirmed)."),
        ("1:1 Time-Bank Peer Learning: ", "Fair credit economy (Teach 1 hr = +1 credit, Learn 1 hr = -1 credit) fostering active collaboration."),
        ("Inter-Class Quest Leaderboard: ", "Gamified challenge board driving friendly competition across college divisions.")
    ]

    for bold_txt, norm_txt in kf_bullets:
        p = tf2_r.add_paragraph()
        p.level = 1
        p.space_after = Pt(4)
        r1 = p.add_run()
        r1.text = bold_txt
        r1.font.name = FONT_BODY
        r1.font.size = Pt(14)
        r1.font.bold = True
        r1.font.color.rgb = COLOR_PRIMARY
        r2 = p.add_run()
        r2.text = norm_txt
        r2.font.name = FONT_BODY
        r2.font.size = Pt(13)
        r2.font.bold = False
        r2.font.color.rgb = COLOR_MUTED

    p = tf2_r.add_paragraph()
    p.text = "What Makes It Different from existing solution?"
    p.font.name = FONT_HEAD
    p.font.size = Pt(20)
    p.font.bold = True
    p.font.color.rgb = COLOR_PRIMARY
    p.space_before = Pt(14)
    p.space_after = Pt(6)

    diff_bullets = [
        ("All-in-One Interconnected Ecosystem: ", "Modules feed into each other (timetable alerts prompt peer study; planner drives skill requests)."),
        ("Zero Learning Curve & High Utility: ", "Tailored to Mumbai University / VESIT autonomous rules, passing minimums, and division codes."),
        ("Fosters Real Community: ", "Replaces passive broadcast groups with reciprocal ride-sharing, time-banking, and class challenges.")
    ]

    for bold_txt, norm_txt in diff_bullets:
        p = tf2_r.add_paragraph()
        p.level = 1
        p.space_after = Pt(4)
        r1 = p.add_run()
        r1.text = bold_txt
        r1.font.name = FONT_BODY
        r1.font.size = Pt(14)
        r1.font.bold = True
        r1.font.color.rgb = COLOR_PRIMARY
        r2 = p.add_run()
        r2.text = norm_txt
        r2.font.name = FONT_BODY
        r2.font.size = Pt(13)
        r2.font.bold = False
        r2.font.color.rgb = COLOR_MUTED

    # ----------------------------------------------------
    # SLIDE 3: TECHNICAL APPROACH & WORKFLOW
    # ----------------------------------------------------
    slide3 = prs.slides[2]

    # Left box: Step 1 to 5 + Demo
    shape_s3_left = slide3.shapes[3] # Google Shape;133;p15
    shape_s3_left.width = Emu(10500000)
    shape_s3_left.height = Emu(7800000)
    tf3_l = shape_s3_left.text_frame
    tf3_l.word_wrap = True
    tf3_l.clear()

    steps = [
        ("Step 1 — User Input", "Student authenticates via Phone OTP (MiniMoth) & selects Branch, Division (e.g. D4B EXTC), and Academic Goals."),
        ("Step 2 — Data Collection", "System aggregates division timetable feeds, autonomous credit matrix, active carpool routes & peer listings."),
        ("Step 3 — Processing", "Grade engine computes passing thresholds and SGPA = Σ(Credits × GP) / Total Credits; geospatial filter indexes routes."),
        ("Step 4 — Decision / Prediction", "Algorithm locks unreachable grades, verifies minimum pass cutoffs, and balances time-credit ledger."),
        ("Step 5 — Final Output", "Interactive dashboard renders live lecture cards, what-if marks needed table, Leaflet map, and leaderboard.")
    ]

    for i, (title_txt, desc_txt) in enumerate(steps):
        p = tf3_l.paragraphs[0] if i == 0 else tf3_l.add_paragraph()
        p.space_after = Pt(1)
        r1 = p.add_run()
        r1.text = title_txt + ": "
        r1.font.name = FONT_BODY
        r1.font.size = Pt(14)
        r1.font.bold = True
        r1.font.color.rgb = COLOR_PRIMARY
        r2 = p.add_run()
        r2.text = desc_txt
        r2.font.name = FONT_BODY
        r2.font.size = Pt(13)
        r2.font.bold = False
        r2.font.color.rgb = COLOR_MUTED

        if i < len(steps) - 1:
            p_arrow = tf3_l.add_paragraph()
            p_arrow.text = "      ↓"
            p_arrow.font.name = FONT_BODY
            p_arrow.font.size = Pt(12)
            p_arrow.font.bold = True
            p_arrow.font.color.rgb = COLOR_ACCENT
            p_arrow.space_after = Pt(1)

    p_demo_title = tf3_l.add_paragraph()
    p_demo_title.text = "Demo (Optional):"
    p_demo_title.font.name = FONT_HEAD
    p_demo_title.font.size = Pt(16)
    p_demo_title.font.bold = True
    p_demo_title.font.color.rgb = COLOR_PRIMARY
    p_demo_title.space_before = Pt(8)
    p_demo_title.space_after = Pt(2)

    p_demo_desc = tf3_l.add_paragraph()
    p_demo_desc.space_after = Pt(2)
    r_demo1 = p_demo_desc.add_run()
    r_demo1.text = "• Working Prototype: "
    r_demo1.font.name = FONT_BODY
    r_demo1.font.size = Pt(13)
    r_demo1.font.bold = True
    r_demo1.font.color.rgb = COLOR_PRIMARY
    r_demo2 = p_demo_desc.add_run()
    r_demo2.text = "Production build verified (0 errors); hosted live via Vercel / Netlify & local dev server."
    r_demo2.font.name = FONT_BODY
    r_demo2.font.size = Pt(13)
    r_demo2.font.bold = False
    r_demo2.font.color.rgb = COLOR_MUTED

    p_demo_sub = tf3_l.add_paragraph()
    r_sub1 = p_demo_sub.add_run()
    r_sub1.text = "• Live Interaction: "
    r_sub1.font.name = FONT_BODY
    r_sub1.font.size = Pt(13)
    r_sub1.font.bold = True
    r_sub1.font.color.rgb = COLOR_PRIMARY
    r_sub2 = p_demo_sub.add_run()
    r_sub2.text = "Fully responsive on mobile & desktop, instant division switching, real-time what-if SGPA calculations."
    r_sub2.font.name = FONT_BODY
    r_sub2.font.size = Pt(13)
    r_sub2.font.bold = False
    r_sub2.font.color.rgb = COLOR_MUTED

    # Right box: Technology & Why we used it
    shape_s3_right = slide3.shapes[5] # Google Shape;135;p15
    shape_s3_right.left = Emu(11200000)
    shape_s3_right.width = Emu(6500000)
    shape_s3_right.height = Emu(7500000)
    tf3_r = shape_s3_right.text_frame
    tf3_r.word_wrap = True
    tf3_r.clear()

    p = tf3_r.paragraphs[0]
    p.text = "Technology & Why we used it"
    p.font.name = FONT_HEAD
    p.font.size = Pt(20)
    p.font.bold = True
    p.font.color.rgb = COLOR_PRIMARY
    p.space_after = Pt(8)

    techs = [
        ("Frontend: React 19 + TypeScript", "Provides component modularity, instantaneous rendering, and strict end-to-end type safety."),
        ("Bundler: Vite", "Ultra-fast Hot Module Replacement and highly optimized production builds (< 1.5s)."),
        ("Styling: Tailwind CSS", "Utility-first design enabling rapid, mobile-responsive layouts and instant Dark/Light mode toggle."),
        ("State & Storage: Reactive State + LocalStorage", "Ensures zero-latency offline performance and persistence without requiring backend servers for prototype demo."),
        ("Mapping: Leaflet & OpenStreetMap", "Lightweight, zero-cost interactive geospatial map rendering for ride origins and campus landmarks."),
        ("Auth API: MiniMoth Service", "Secure phone-based OTP verification with token refresh and seamless session management.")
    ]

    for title_txt, why_txt in techs:
        p = tf3_r.add_paragraph()
        p.level = 1
        p.space_after = Pt(5)
        r1 = p.add_run()
        r1.text = title_txt + " — "
        r1.font.name = FONT_BODY
        r1.font.size = Pt(13)
        r1.font.bold = True
        r1.font.color.rgb = COLOR_PRIMARY
        r2 = p.add_run()
        r2.text = why_txt
        r2.font.name = FONT_BODY
        r2.font.size = Pt(12)
        r2.font.bold = False
        r2.font.color.rgb = COLOR_MUTED

    # ----------------------------------------------------
    # SLIDE 4: FUTURE SCOPE & REFERENCES
    # ----------------------------------------------------
    slide4 = prs.slides[3]

    # Left box: Future Scope
    shape_s4_left = slide4.shapes[2] # Google Shape;146;p16
    shape_s4_left.top = Emu(2000000)
    shape_s4_left.height = Emu(6800000)
    tf4_l = shape_s4_left.text_frame
    tf4_l.word_wrap = True
    tf4_l.clear()

    p = tf4_l.paragraphs[0]
    p.text = "Future Scope"
    p.font.name = FONT_HEAD
    p.font.size = Pt(22)
    p.font.bold = True
    p.font.color.rgb = COLOR_PRIMARY
    p.space_after = Pt(8)

    future_bullets = [
        ("Mobile App Support: ", "Develop native iOS and Android apps (React Native) with offline push notifications for class alerts and carpools."),
        ("College ERP & Moodle Sync: ", "Bi-directional integration with college attendance systems to auto-sync internal marks and attendance percentages."),
        ("Live GPS Commute Telemetry: ", "Real-time live vehicle tracking for ride-sharing and official college bus arrival estimates."),
        ("AI Academic Diagnostic Advisor: ", "Lightweight machine-learning model forecasting borderline grades and recommending targeted peer tutors."),
        ("Smart Campus IoT Integrations: ", "Connect with library RFID turnstiles for real-time seat availability and canteen queue monitoring."),
        ("Enterprise Scalability: ", "Deploy scalable PostgreSQL / Supabase backend with role-based access control for faculty and student coordinators.")
    ]

    for bold_txt, norm_txt in future_bullets:
        p = tf4_l.add_paragraph()
        p.level = 1
        p.space_after = Pt(6)
        r1 = p.add_run()
        r1.text = bold_txt
        r1.font.name = FONT_BODY
        r1.font.size = Pt(14)
        r1.font.bold = True
        r1.font.color.rgb = COLOR_PRIMARY
        r2 = p.add_run()
        r2.text = norm_txt
        r2.font.name = FONT_BODY
        r2.font.size = Pt(13)
        r2.font.bold = False
        r2.font.color.rgb = COLOR_MUTED

    # Right box: References
    shape_s4_right = slide4.shapes[4] # Google Shape;152;p16
    shape_s4_right.top = Emu(2000000)
    shape_s4_right.height = Emu(6800000)
    tf4_r = shape_s4_right.text_frame
    tf4_r.word_wrap = True
    tf4_r.clear()

    p = tf4_r.paragraphs[0]
    p.text = "References"
    p.font.name = FONT_HEAD
    p.font.size = Pt(22)
    p.font.bold = True
    p.font.color.rgb = COLOR_PRIMARY
    p.space_after = Pt(8)

    ref_bullets = [
        ("Datasets: ", "VESIT First-Year Engineering Autonomous Curriculum (Sem 1), Official Division & Roll Allotment Sheet, and Master Timetable."),
        ("Research: ", "IEEE Education Society: 'Student-Centered Digital Campuses & Academic Retention Systems' (2023); Mumbai University Choice Based Credit System (CBCS) Guidelines."),
        ("Technologies: ", "React 19 Official Documentation (react.dev), Vite 8 Frontend Tooling, Tailwind CSS Design System, Lucide React Icons."),
        ("APIs & Services: ", "MiniMoth Phone Authentication Protocol (minimoth.dev), OpenStreetMap Foundation & Leaflet.js Geocoding APIs."),
        ("Other Resources: ", "Vivekanand Education Society's Institute of Technology (Autonomous) Portal (ves.ac.in).")
    ]

    for bold_txt, norm_txt in ref_bullets:
        p = tf4_r.add_paragraph()
        p.level = 1
        p.space_after = Pt(6)
        r1 = p.add_run()
        r1.text = bold_txt
        r1.font.name = FONT_BODY
        r1.font.size = Pt(14)
        r1.font.bold = True
        r1.font.color.rgb = COLOR_PRIMARY
        r2 = p.add_run()
        r2.text = norm_txt
        r2.font.name = FONT_BODY
        r2.font.size = Pt(13)
        r2.font.bold = False
        r2.font.color.rgb = COLOR_MUTED

    # ----------------------------------------------------
    # SLIDE 5: IMPORTANT INSTRUCTIONS - PRESERVED AS IS
    # ----------------------------------------------------
    print("Slide 5 (Important Instructions) preserved as is.")

    # Save output presentations
    output_path1 = "Campus360_Genesis2.0_FE.pptx"
    output_path2 = "TeamName_Genesis2.0_FE.pptx"
    
    prs.save(output_path1)
    prs.save(output_path2)
    print(f"Presentations successfully saved to:\n  - {output_path1}\n  - {output_path2}")

if __name__ == "__main__":
    create_perfect_presentation()
