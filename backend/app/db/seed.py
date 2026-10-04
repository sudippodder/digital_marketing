import logging
from datetime import datetime, timedelta
from app.db.session import SessionLocal, Base, engine
from app.db.models import (
    Organization, User, UserRole, Client, ClientStatus,
    Product, Service, MarketingProject, MarketingStrategy,
    MarketingPlan, MarketingTask, TaskStatus, ContentItem,
    Keyword, SeoAudit, Lead, DailyReport, Integration,
    Campaign, Approval, ApprovalStatus
)
from app.core.security import get_password_hash

logger = logging.getLogger(__name__)

def seed_database():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        # Check if already seeded
        if db.query(User).filter(User.email == "admin@omniflow.ai").first():
            print("Database already seeded with demo records.")
            return

        print("Seeding database with production-grade demo data...")

        # 1. Organization
        org = Organization(
            name="OmniFlow Global Growth Partners",
            slug="omniflow-global",
            plan="Enterprise"
        )
        db.add(org)
        db.flush()

        # 2. Super Admin & Marketing Manager
        admin_user = User(
            organization_id=org.id,
            email="admin@omniflow.ai",
            hashed_password=get_password_hash("password123"),
            full_name="Alexander Vance (Super Admin)",
            role=UserRole.SUPER_ADMIN,
            is_active=True
        )
        manager_user = User(
            organization_id=org.id,
            email="manager@omniflow.ai",
            hashed_password=get_password_hash("password123"),
            full_name="Sophia Sterling (Marketing Director)",
            role=UserRole.MARKETING_MANAGER,
            is_active=True
        )
        db.add_all([admin_user, manager_user])
        db.flush()

        # 3. Client 1: Apex Health SaaS
        client1 = Client(
            organization_id=org.id,
            assigned_manager_id=manager_user.id,
            company_name="Apex Health SaaS",
            contact_person="Dr. Marcus Thorne",
            email="marcus@apexhealth.io",
            phone="+1 (555) 349-8200",
            business_website="https://apexhealth.io",
            industry="Healthcare SaaS & Telemedicine",
            business_description="Enterprise-grade cloud EHR and AI clinical workflow automation software for medical clinics and healthcare networks.",
            business_location="San Francisco, CA, USA",
            target_countries=["United States", "Canada", "United Kingdom"],
            target_cities=["New York", "San Francisco", "Austin", "Toronto", "London"],
            preferred_languages=["English"],
            target_audience="Clinic Directors, Healthcare Administrators, Chief Medical Officers, and Private Practice Owners.",
            competitor_websites=["https://athenahealth.com", "https://epic.com", "https://kareo.com"],
            monthly_marketing_budget=8500.0,
            marketing_objectives=["Increase qualified B2B demo requests", "Dominate high-intent EHR keywords", "Scale Meta & Google search ROAS past 4.0x"],
            brand_tone="Authoritative, Clinical, Innovative & Trustworthy",
            brand_guidelines="Adhere strictly to HIPAA-compliant terminology. Emphasize security, SOC2 compliance, and 40% clinical time savings.",
            logo="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=150&auto=format&fit=crop&q=80",
            account_status=ClientStatus.ACTIVE
        )
        db.add(client1)
        db.flush()

        # Client 1 Portal User
        client1_user = User(
            organization_id=org.id,
            client_id=client1.id,
            email="client@apexhealth.io",
            hashed_password=get_password_hash("password123"),
            full_name="Dr. Marcus Thorne (Client Admin)",
            role=UserRole.CLIENT,
            is_active=True
        )
        db.add(client1_user)

        # Client 1 Products
        p1 = Product(
            client_id=client1.id,
            name="Apex Cloud EHR Platform",
            sku="APX-EHR-01",
            category="Enterprise Healthcare SaaS",
            description="All-in-one HIPAA compliant electronic health records system with automated billing and patient portal.",
            features=["AI Voice Charting", "Instant Telehealth Integration", "Automated Insurance Verification", "SOC-2 Type II Certified"],
            benefits=["Reduces documentation time by 45%", "Accelerates insurance claim approvals", "Improves patient retention"],
            price=499.0,
            discount=10.0,
            product_url="https://apexhealth.io/ehr",
            target_keywords=["cloud EHR software", "hipaa compliant medical software", "telehealth platform"],
            target_audience="Medical practice managers and clinic owners"
        )
        p2 = Product(
            client_id=client1.id,
            name="HealthAI Clinical Assistant",
            sku="APX-AI-02",
            category="AI Healthcare Tools",
            description="Ambient AI clinical intelligence tool that listens to doctor-patient consultations and writes structured clinical notes.",
            features=["Real-time Transcription", "ICD-10 Code Suggestions", "EHR Direct Sync"],
            benefits=["Eliminates after-hours charting", "Prevents physician burnout"],
            price=199.0,
            product_url="https://apexhealth.io/healthai",
            target_keywords=["ai medical scribe", "clinical ai assistant", "ambient charting software"]
        )
        db.add_all([p1, p2])

        # Client 1 Services
        s1 = Service(
            client_id=client1.id,
            name="Custom EHR Data Migration & Integration",
            description="White-glove data extraction, sanitization, and seamless migration from legacy systems to Apex EHR with zero downtime.",
            pricing="$2,500 one-time onboarding fee",
            benefits=["Zero patient data loss guarantee", "Dedicated healthcare integration engineer", "Completed in under 7 business days"],
            conversion_goal="Book EHR Migration Discovery Call",
            keywords=["ehr migration service", "medical data transfer"]
        )
        db.add(s1)

        # Client 1 Marketing Project
        proj1 = MarketingProject(
            client_id=client1.id,
            title="Apex Health Q4 Inbound Patient Flow & Demo Scaler",
            description="Multi-channel AI automated campaign targeting 100+ qualified demo requests per month.",
            status="Active",
            auto_pilot=True,
            monthly_budget=8500.0,
            current_campaign_execution_id="EXEC-APEX-20261001-A9F821",
            start_date=datetime.utcnow() - timedelta(days=12)
        )
        db.add(proj1)
        db.flush()

        # Strategy for Project 1
        strat1 = MarketingStrategy(
            project_id=proj1.id,
            version=1,
            status="Approved",
            title="30-Day Clinical Authority & B2B Acquisition Plan",
            executive_summary="Targeted search capture across high-intent EHR purchase keywords combined with Meta retargeting to clinic decision makers.",
            target_personas=[
                {"title": "Clinic Medical Director", "pain": "Clinician burnout from EHR documentation", "solution": "Ambient AI charting & frictionless EHR"},
                {"title": "Healthcare IT Lead", "pain": "Security vulnerabilities & complex setup", "solution": "SOC-2 Type II cloud architecture"}
            ],
            channel_strategies={
                "Google Search Ads": {"budget": 4200, "focus": "Exact match high-intent queries [best cloud ehr for clinics]"},
                "SEO Content Engine": {"cadence": "2x weekly technical articles", "focus": "HIPAA compliance and clinical workflows"},
                "Meta & LinkedIn Ads": {"budget": 2800, "focus": "Video testimonial case studies with 40% time savings hook"}
            },
            kpi_targets={"target_demos": 65, "target_cpa": 130.0, "target_roas": "4.2x"},
            budget_allocation={"Google Ads": 4200, "Meta/LinkedIn": 2800, "SEO & Content": 1500},
            approved_by="Alexander Vance",
            approved_at=datetime.utcnow() - timedelta(days=12)
        )
        db.add(strat1)

        # Plan for Project 1
        plan1 = MarketingPlan(
            project_id=proj1.id,
            title="30-Day Omnichannel Execution Roadmap",
            duration_days=30,
            phases=[
                {"phase": 1, "name": "Technical SEO & Conversion Funnel Baseline", "days": "Days 1-7"},
                {"phase": 2, "name": "Google Ads Search Launch & Content Blitz", "days": "Days 8-14"},
                {"phase": 3, "name": "Retargeting & Automated Lead Scoring", "days": "Days 15-21"},
                {"phase": 4, "name": "Scale Winning Angles & Comprehensive Attribution", "days": "Days 22-30"}
            ],
            weekly_breakdown=[
                {"week": 1, "deliverables": ["Site audit complete", "Google Analytics 4 setup", "Keyword gap analysis"]},
                {"week": 2, "deliverables": ["3 Ad groups live", "2 Cornerstone blog articles", "LinkedIn outreach campaign"]},
                {"week": 3, "deliverables": ["Email nurture activated", "A/B landing page test"]},
                {"week": 4, "deliverables": ["Budget optimization", "Executive monthly growth report"]}
            ]
        )
        db.add(plan1)

        # Tasks for Project 1
        t1 = MarketingTask(
            project_id=proj1.id,
            client_id=client1.id,
            title="Execute Comprehensive Healthcare SEO & Core Web Vitals Audit",
            agent_name="SEO Agent",
            task_type="SEO_AUDIT",
            priority="High",
            day_number=1,
            status=TaskStatus.COMPLETED,
            requires_approval=False,
            approval_status=ApprovalStatus.APPROVED,
            token_usage=1420,
            execution_cost=0.0284,
            completed_at=datetime.utcnow() - timedelta(days=11),
            output_data={"health_score": 92, "issues_fixed": ["Added schema FAQ markup", "Optimized mobile hero image load times"]}
        )
        t2 = MarketingTask(
            project_id=proj1.id,
            client_id=client1.id,
            title="High-Intent Medical Keyword Discovery & Content Gap Analysis",
            agent_name="SEO Agent",
            task_type="KEYWORD_RESEARCH",
            priority="High",
            day_number=2,
            status=TaskStatus.COMPLETED,
            requires_approval=False,
            approval_status=ApprovalStatus.APPROVED,
            token_usage=1890,
            execution_cost=0.0378,
            completed_at=datetime.utcnow() - timedelta(days=10),
            output_data={"keywords_added": 18, "top_opportunity": "ambient ai medical charting software"}
        )
        t3 = MarketingTask(
            project_id=proj1.id,
            client_id=client1.id,
            title="Draft Long-Form Cornerstone Guide: How Ambient AI Slashes Charting Hours",
            agent_name="Content Creation Agent",
            task_type="CONTENT_CREATION",
            priority="Medium",
            day_number=4,
            status=TaskStatus.COMPLETED,
            requires_approval=True,
            approval_status=ApprovalStatus.APPROVED,
            token_usage=2400,
            execution_cost=0.0480,
            completed_at=datetime.utcnow() - timedelta(days=8),
            output_data={"word_count": 1850, "target_kw": "ambient ai clinical charting", "status": "Published"}
        )
        t4 = MarketingTask(
            project_id=proj1.id,
            client_id=client1.id,
            title="Deploy High-Intent Google Search Ads targeting 'Best EHR for Medical Clinics'",
            agent_name="Advertising Agent",
            task_type="CAMPAIGN_LAUNCH",
            priority="High",
            day_number=6,
            status=TaskStatus.COMPLETED,
            requires_approval=True,
            approval_status=ApprovalStatus.APPROVED,
            token_usage=1650,
            execution_cost=0.0330,
            completed_at=datetime.utcnow() - timedelta(days=6),
            output_data={"campaign_id": "GA-99201", "impressions": 14200, "clicks": 580, "cpa": 42.50}
        )
        t5 = MarketingTask(
            project_id=proj1.id,
            client_id=client1.id,
            title="Automated Inbound Lead Qualification & CRM Sync",
            agent_name="Lead Generation Agent",
            task_type="LEAD_SCORING",
            priority="Medium",
            day_number=8,
            status=TaskStatus.COMPLETED,
            requires_approval=False,
            approval_status=ApprovalStatus.APPROVED,
            token_usage=1100,
            execution_cost=0.0220,
            completed_at=datetime.utcnow() - timedelta(days=4),
            output_data={"mqls_processed": 14, "average_score": 88}
        )
        t6 = MarketingTask(
            project_id=proj1.id,
            client_id=client1.id,
            title="Synthesize 24-Hour Multi-Channel Growth Report",
            agent_name="Reporting Agent",
            task_type="DAILY_REPORT",
            priority="High",
            day_number=12,
            status=TaskStatus.COMPLETED,
            requires_approval=False,
            approval_status=ApprovalStatus.APPROVED,
            token_usage=1550,
            execution_cost=0.0310,
            completed_at=datetime.utcnow() - timedelta(hours=2),
            output_data={"report_generated": True}
        )
        db.add_all([t1, t2, t3, t4, t5, t6])

        # Content for Client 1
        c_item1 = ContentItem(
            client_id=client1.id,
            title="The Future of Clinical Documentation: How Ambient AI Slashes 45% of Charting Overhead",
            content_type="Blog Post",
            platform="Blog",
            body="Clinical documentation has long been one of the primary drivers of physician burnout. With ambient clinical intelligence, doctors can focus entirely on patients while structured notes generate in real-time...",
            meta_title="Ambient AI Clinical Documentation Guide (2026) | Apex Health",
            meta_description="Learn how modern medical clinics eliminate after-hours charting and save 45% documentation time with Apex Health AI.",
            target_keywords=["ambient clinical ai", "medical charting automation", "ehr documentation"],
            status="Published",
            published_date=datetime.utcnow() - timedelta(days=5),
            published_url="https://apexhealth.io/blog/ambient-ai-clinical-documentation",
            performance_metrics={"views": 1840, "engagements": 312, "shares": 48}
        )
        c_item2 = ContentItem(
            client_id=client1.id,
            title="Why Modern Medical Directors Are Switching from Legacy EHRs",
            content_type="Social Post",
            platform="LinkedIn",
            body="🚀 In healthcare IT, slow software isn't just an inconvenience—it impacts patient outcomes.\n\nHere is why 40+ medical groups upgraded to Apex Health this quarter...",
            status="Published",
            published_date=datetime.utcnow() - timedelta(days=2),
            performance_metrics={"views": 4200, "engagements": 285, "shares": 34}
        )
        db.add_all([c_item1, c_item2])

        # Keywords for Client 1
        k1 = Keyword(client_id=client1.id, keyword="cloud ehr software", current_position=3, previous_position=7, search_volume=8100, difficulty=52, intent="Commercial")
        k2 = Keyword(client_id=client1.id, keyword="ambient ai medical scribe", current_position=2, previous_position=5, search_volume=4600, difficulty=38, intent="Transactional")
        k3 = Keyword(client_id=client1.id, keyword="hipaa compliant telehealth platform", current_position=4, previous_position=9, search_volume=5200, difficulty=44, intent="Commercial")
        k4 = Keyword(client_id=client1.id, keyword="best medical clinic ehr 2026", current_position=1, previous_position=3, search_volume=2900, difficulty=35, intent="Transactional")
        db.add_all([k1, k2, k3, k4])

        # SEO Audit
        audit1 = SeoAudit(
            client_id=client1.id,
            overall_health_score=94,
            crawl_depth=340,
            passed_checks=82,
            warnings=6,
            critical_errors=0,
            speed_score_mobile=89,
            speed_score_desktop=98,
            recommendations=["Keep updating internal links between ambient AI blog posts and EHR demo pages.", "Expand schema FAQ coverage on pricing page."]
        )
        db.add(audit1)

        # Leads for Client 1
        l1 = Lead(
            client_id=client1.id,
            full_name="Dr. Elena Rostova",
            email="e.rostova@metrohealthpartners.org",
            phone="+1 (555) 892-1144",
            company="Metro Health Multi-Specialty Clinic",
            source="Google Search Ads",
            status="Proposal Sent",
            lead_score=95,
            estimated_value=12500.0,
            notes="14-provider cardiology practice looking to migrate from on-premise server by end of quarter.",
            ai_summary="High-intent decision maker. Urgent EHR migration timeline. High deal value."
        )
        l2 = Lead(
            client_id=client1.id,
            full_name="Thomas Sterling",
            email="thomas@sterlingpediatrics.com",
            phone="+1 (555) 714-3891",
            company="Sterling Pediatric Group",
            source="LinkedIn Inbound",
            status="Qualified",
            lead_score=88,
            estimated_value=6800.0,
            notes="Interested in Ambient AI Scribe for 6 pediatricians.",
            ai_summary="Strong product-fit for Ambient AI assistant. Follow-up demo set for Tuesday."
        )
        db.add_all([l1, l2])

        # Daily Report for Client 1
        rep1 = DailyReport(
            client_id=client1.id,
            report_date=datetime.utcnow(),
            title=f"Daily AI Marketing Performance Report - {datetime.utcnow().strftime('%B %d, %Y')}",
            executive_summary={
                "status": "Exceptional Performance",
                "headline": "Apex Health campaigns captured 2 high-value MQLs today with an overall Google Ads ROAS of 4.4x.",
                "key_highlights": [
                    "Keyword 'ambient ai medical scribe' moved up to #2 position in Google Search.",
                    "Published LinkedIn thought-leadership post achieved 4,200 organic impressions.",
                    "PPC CPA reduced to $34.80 (22% below target cap of $45.00).",
                    "EHR Data Migration consultation funnel generated 1 qualified booking."
                ]
            },
            seo_metrics={"clicks": 482, "impressions": 14200, "average_position": 2.5, "top_keyword": "ambient ai medical scribe"},
            social_metrics={"posts_published": 1, "reach": 4200, "engagements": 285, "new_followers": 42},
            advertising_metrics={"ad_spend": 280.0, "clicks": 142, "conversions": 8, "cpa": 35.00, "roas": "4.4x"},
            lead_metrics={"new_leads": 3, "qualified_leads": 2, "pipeline_value": "$19,300"},
            ai_operations={"tasks_completed": 6, "approvals_pending": 0, "token_usage": 9850, "system_health": "100%"},
            next_day_plan={"agenda": ["Deploy 2 new ad copy variations for Telehealth feature", "Initiate keyword tracking for 'pediatric ehr software'", "Deliver monthly performance executive synthesis"]}
        )
        db.add(rep1)

        # Integrations for Client 1
        integrations_data = [
            ("google_search_console", "Google Search Console", "SEO & Analytics", True, True),
            ("google_analytics", "Google Analytics 4 (GA4)", "SEO & Analytics", True, True),
            ("google_ads", "Google Ads", "Advertising", True, True),
            ("meta_marketing", "Meta (Facebook & Instagram)", "Social & Ads", True, True),
            ("linkedin_marketing", "LinkedIn Marketing", "Social & Ads", True, True),
            ("wordpress", "WordPress CMS", "Website & CMS", True, True),
            ("hubspot", "HubSpot CRM", "CRM & Leads", True, True)
        ]
        for p_name, d_name, cat, conn, mock in integrations_data:
            integ = Integration(
                client_id=client1.id,
                provider_name=p_name,
                display_name=d_name,
                category=cat,
                is_connected=conn,
                is_mock=mock,
                account_id=f"acc_{p_name}_apex",
                account_name=f"Apex Health {d_name}",
                last_synced_at=datetime.utcnow()
            )
            db.add(integ)

        # 4. Client 2: LuxeAura Cosmetics
        client2 = Client(
            organization_id=org.id,
            assigned_manager_id=manager_user.id,
            company_name="LuxeAura Clean Beauty",
            contact_person="Isabella Fontaine",
            email="isabella@luxeaura.com",
            phone="+1 (555) 782-9011",
            business_website="https://luxeaura.com",
            industry="D2C Clean Cosmetics & Skincare",
            business_description="Luxury botanical skincare formulated with clinically backed peptides and 100% sustainable ingredients.",
            business_location="New York, NY, USA",
            target_countries=["United States", "United Kingdom", "France", "Germany"],
            target_cities=["New York", "Los Angeles", "Miami", "Paris", "London"],
            preferred_languages=["English", "French"],
            target_audience="Women & men (ages 24-55) seeking premium, non-toxic, anti-aging skincare solutions.",
            competitor_websites=["https://drunkelephant.com", "https://tatcha.com", "https://sundayriley.com"],
            monthly_marketing_budget=6000.0,
            marketing_objectives=["Scale D2C e-commerce revenue past $50k/mo", "Achieve 4.5x ROAS on Meta Instagram reels", "Rank top 3 for clean peptide skincare"],
            brand_tone="Sophisticated, Elegant, Eco-Conscious & Scientific",
            brand_guidelines="Use warm neutral tones, gold accents, and clean minimalist typography. Focus on botanical science and cruelty-free claims.",
            logo="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=150&auto=format&fit=crop&q=80",
            account_status=ClientStatus.ACTIVE
        )
        db.add(client2)
        db.flush()

        client2_user = User(
            organization_id=org.id,
            client_id=client2.id,
            email="client@luxeaura.com",
            hashed_password=get_password_hash("password123"),
            full_name="Isabella Fontaine (LuxeAura Founder)",
            role=UserRole.CLIENT,
            is_active=True
        )
        db.add(client2_user)

        # LuxeAura Products
        lp1 = Product(
            client_id=client2.id,
            name="Lumière Multi-Peptide Radiance Serum",
            sku="LXA-SRM-01",
            category="Facial Serums",
            description="Ultra-concentrated peptide serum with hyaluronic acid and niacinamide for immediate glow and skin firming.",
            features=["Triple Peptide Matrix", "100% Vegan & Cruelty-Free", "Fragrance-Free", "Dermatologist Tested"],
            benefits=["Restores skin barrier in 7 days", "Visibly reduces fine lines", "Deep 48-hour hydration"],
            price=88.0,
            discount=15.0,
            product_url="https://luxeaura.com/products/lumiere-serum",
            target_keywords=["clean peptide serum", "best anti aging serum 2026", "vegan skin glow serum"]
        )
        db.add(lp1)

        # LuxeAura Marketing Project
        proj2 = MarketingProject(
            client_id=client2.id,
            title="LuxeAura Autumn Radiance D2C Growth Campaign",
            description="Viral Instagram & TikTok ad campaign backed by SEO collection page rankings.",
            status="Active",
            auto_pilot=True,
            monthly_budget=6000.0,
            current_campaign_execution_id="EXEC-LUXE-20261002-B83144",
            start_date=datetime.utcnow() - timedelta(days=8)
        )
        db.add(proj2)
        db.flush()

        # LuxeAura Strategy
        strat2 = MarketingStrategy(
            project_id=proj2.id,
            version=1,
            status="Approved",
            title="D2C Omni-Channel Viral Creative & Search Scaler",
            executive_summary="Instagram Reels and TikTok UGC creator partnerships combined with high-converting Meta retargeting and Google Shopping feeds.",
            target_personas=[
                {"title": "The Clean Beauty Connoisseur", "pain": "Harsh chemicals and ineffective organic products", "solution": "Botanical science backed by clinical trial data"}
            ],
            channel_strategies={
                "Meta & Instagram Ads": {"budget": 3500, "focus": "Before/After UGC reels with glowing skin testimonials"},
                "Google Shopping & Search": {"budget": 1500, "focus": "Brand defense + non-toxic peptide skincare keywords"},
                "Email & SMS Klaviyo": {"budget": 1000, "focus": "3-tier VIP customer loyalty rewards sequence"}
            },
            kpi_targets={"target_orders": 380, "target_roas": "4.6x", "target_cpa": 15.80},
            budget_allocation={"Meta/Instagram Ads": 3500, "Google Shopping": 1500, "Email/SMS Marketing": 1000},
            approved_by="Alexander Vance",
            approved_at=datetime.utcnow() - timedelta(days=8)
        )
        db.add(strat2)

        # LuxeAura Report
        rep2 = DailyReport(
            client_id=client2.id,
            report_date=datetime.utcnow(),
            title=f"Daily AI Marketing Performance Report - {datetime.utcnow().strftime('%B %d, %Y')}",
            executive_summary={
                "status": "High Growth",
                "headline": "LuxeAura generated 38 orders today ($3,344 revenue) at a record 4.8x Meta ad ROAS.",
                "key_highlights": [
                    "Instagram UGC Reel video ad reached 24,000 beauty enthusiasts.",
                    "Lumière Peptide Serum conversion rate surged to 4.2% on product landing page.",
                    "Zero cart abandonment email flow recovered $640 in sales."
                ]
            },
            seo_metrics={"clicks": 310, "impressions": 8900, "average_position": 4.1, "top_keyword": "clean peptide serum"},
            social_metrics={"posts_published": 3, "reach": 24000, "engagements": 1840, "new_followers": 182},
            advertising_metrics={"ad_spend": 210.0, "clicks": 340, "conversions": 38, "cpa": 14.80, "roas": "4.8x"},
            lead_metrics={"new_leads": 42, "qualified_leads": 38, "pipeline_value": "$3,344"},
            ai_operations={"tasks_completed": 4, "approvals_pending": 0, "token_usage": 6400},
            next_day_plan={"agenda": ["Scale budget on winning UGC Reel Ad by 15%", "Schedule weekend Flash Sale email to VIP subscribers"]}
        )
        db.add(rep2)

        # LuxeAura Keywords
        lk1 = Keyword(client_id=client2.id, keyword="clean peptide serum", current_position=2, previous_position=4, search_volume=6400, difficulty=34, intent="Transactional")
        lk2 = Keyword(client_id=client2.id, keyword="organic anti aging skincare", current_position=5, previous_position=8, search_volume=12000, difficulty=48, intent="Commercial")
        db.add_all([lk1, lk2])

        db.commit()
        print("Database seed completed successfully with Admin, Manager, Apex Health SaaS, and LuxeAura Cosmetics demo environments!")

    except Exception as e:
        db.rollback()
        logger.exception(f"Error during database seeding: {e}")
        raise
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
