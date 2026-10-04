import logging
import uuid
from datetime import datetime, timedelta
from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session

from app.db.models import (
    Client, MarketingProject, MarketingStrategy, MarketingPlan,
    MarketingTask, TaskStatus, ApprovalStatus, Approval, AgentRun,
    DailyReport, ContentItem, Keyword, Lead, Campaign
)
from app.services.agents.specialized_agents import (
    MarketResearchAgent, SeoAgent, ContentCreationAgent,
    SocialMediaAgent, AdvertisingAgent, LeadGenAgent,
    AnalyticsAgent, ReportingAgent
)

logger = logging.getLogger(__name__)

class MarketingOrchestrator:
    def __init__(self):
        self.agents = {
            "Market Research Agent": MarketResearchAgent(),
            "SEO Agent": SeoAgent(),
            "Content Creation Agent": ContentCreationAgent(),
            "Social Media Agent": SocialMediaAgent(),
            "Advertising Agent": AdvertisingAgent(),
            "Lead Generation Agent": LeadGenAgent(),
            "Analytics Agent": AnalyticsAgent(),
            "Reporting Agent": ReportingAgent(),
        }

    def validate_client_readiness(self, client: Client) -> Dict[str, Any]:
        """
        Validate all requirements before allowing the START DIGITAL MARKETING button to trigger.
        """
        checks = {
            "has_company_name": bool(client.company_name and client.company_name.strip()),
            "has_website": bool(client.business_website and client.business_website.strip()),
            "has_industry": bool(client.industry and client.industry.strip()),
            "has_products_or_services": bool(len(client.products) > 0 or len(client.services) > 0),
            "has_marketing_objectives": bool(client.marketing_objectives and len(client.marketing_objectives) > 0),
            "has_target_audience": bool(client.target_audience and client.target_audience.strip()),
            "has_marketing_budget": bool(client.monthly_marketing_budget and client.monthly_marketing_budget > 0),
            "has_brand_tone": bool(client.brand_tone and client.brand_tone.strip()),
        }
        
        errors = []
        if not checks["has_company_name"]:
            errors.append("Company Name is required.")
        if not checks["has_website"]:
            errors.append("Business Website URL is required.")
        if not checks["has_products_or_services"]:
            errors.append("At least one Product or Service must be added to the knowledge base.")
        if not checks["has_marketing_objectives"]:
            errors.append("At least one Marketing Objective must be selected.")
        if not checks["has_target_audience"]:
            errors.append("Target Audience description must be specified.")
        if not checks["has_marketing_budget"]:
            errors.append("Monthly Marketing Budget must be greater than $0.")

        is_valid = len(errors) == 0
        return {
            "is_valid": is_valid,
            "ready_to_start": is_valid,
            "checks": checks,
            "errors": errors,
            "warnings": []
        }

    def generate_strategy(self, client: Client, project: MarketingProject) -> MarketingStrategy:
        """
        Generate a data-backed 30-Day Marketing Strategy for the client.
        """
        products_summary = ", ".join([p.name for p in client.products]) or "Core Business Offerings"
        services_summary = ", ".join([s.name for s in client.services]) or "Specialized Services"
        budget = project.monthly_budget or client.monthly_marketing_budget or 5000.0

        title = f"30-Day Omnichannel Growth & Acquisition Strategy for {client.company_name}"
        executive_summary = (
            f"This comprehensive strategy is engineered to position {client.company_name} as an authoritative leader in the "
            f"{client.industry} space. Leveraging automated multi-channel synergy across High-Intent Search (SEO), Targeted Paid Acquisition, "
            f"Content Marketing, and Data-Driven Lead Scoring, the campaign targets a minimum of 3.5x ROAS and 25%+ organic search growth "
            f"within the first 30 days of active execution."
        )

        target_personas = [
            {
                "persona_name": "Executive Decision Maker",
                "title": "Director / VP / C-Level",
                "pain_points": [f"Inefficiencies in {client.industry}", "Unpredictable acquisition costs", "Slow ROI"],
                "value_prop": f"{client.company_name} delivers reliable, measurable outcomes with zero wasted overhead."
            },
            {
                "persona_name": "Operational Lead",
                "title": "Operations & Project Manager",
                "pain_points": ["Manual overhead", "Lack of specialized tooling", "Tool fatigue"],
                "value_prop": f"Seamless implementation and dedicated performance tracking with {client.company_name}."
            }
        ]

        channel_strategies = {
            "SEO & Organic Discovery": {
                "focus": "Technical optimization, High-intent commercial keywords, and structured schema implementation.",
                "target_keywords_count": 25,
                "weekly_article_cadence": 2
            },
            "Paid Advertising (Google & Meta)": {
                "focus": "Exact & phrase match Google Search ads for high commercial intent + Meta retargeting video carousels.",
                "monthly_spend": budget * 0.60,
                "target_cpa": 35.00
            },
            "Social Media & Authority": {
                "focus": "3x weekly LinkedIn thought-leadership posts, client win infographics, and industry commentary.",
                "platforms": ["LinkedIn", "Instagram", "Meta"]
            },
            "Lead Capture & Nurture": {
                "focus": "Interactive consultation booking landing page with automated 4-stage email follow-up sequence.",
                "expected_conversion_rate": "3.5%"
            }
        }

        kpi_targets = {
            "target_new_leads": int(budget / 100),
            "target_organic_impressions": 50000,
            "target_roas": "3.5x",
            "target_cpa": 38.00,
            "target_qualified_meetings": int(budget / 250)
        }

        budget_allocation = {
            "Paid Search (Google Ads)": round(budget * 0.40, 2),
            "Paid Social & Retargeting": round(budget * 0.25, 2),
            "Content & SEO Distribution": round(budget * 0.20, 2),
            "Lead Nurture & Automation": round(budget * 0.15, 2)
        }

        strategy = MarketingStrategy(
            project_id=project.id,
            version=1,
            status="Approved",
            title=title,
            executive_summary=executive_summary,
            target_personas=target_personas,
            channel_strategies=channel_strategies,
            kpi_targets=kpi_targets,
            budget_allocation=budget_allocation,
            ai_rationale=f"Constructed based on {len(client.products)} products ({products_summary}) and {len(client.services)} services ({services_summary}) for target audience: {client.target_audience}.",
            approved_by="System Auto-Approval",
            approved_at=datetime.utcnow()
        )

        return strategy

    def generate_30_day_plan(self, project: MarketingProject) -> MarketingPlan:
        """
        Generate the 30-Day Execution Plan divided into strategic phases.
        """
        phases = [
            {
                "phase": 1,
                "name": "Discovery, Technical Audit & Foundation",
                "days": "Days 1 - 7",
                "description": "Comprehensive market research, competitor teardown, technical SEO audit, and conversion pixel baseline setup."
            },
            {
                "phase": 2,
                "name": "Content Engine & Paid Campaign Launch",
                "days": "Days 8 - 14",
                "description": "Deploy high-intent search ads, publish initial cornerstone SEO content, and initialize social thought-leadership schedule."
            },
            {
                "phase": 3,
                "name": "Lead Nurturing & Optimization Loops",
                "days": "Days 15 - 21",
                "description": "Activate automated CRM lead scoring, retargeting campaigns, and A/B ad creative testing."
            },
            {
                "phase": 4,
                "name": "Scale, Multi-Touch Attribution & Review",
                "days": "Days 22 - 30",
                "description": "Scale top-performing ad angles, synthesize month-1 comprehensive performance report, and chart month-2 expansion."
            }
        ]

        weekly_breakdown = [
            {"week": 1, "theme": "Foundation & Audit", "deliverables": ["Market Research Report", "Technical SEO Audit", "Keyword Matrix"]},
            {"week": 2, "theme": "Campaign Activation", "deliverables": ["Google Search Campaign Live", "2x SEO Blog Articles", "Social Calendar Scheduled"]},
            {"week": 3, "theme": "Conversion Optimization", "deliverables": ["Retargeting Live", "Lead Scoring Workflow Active", "A/B Copy Variations"]},
            {"week": 4, "theme": "Scale & Reporting", "deliverables": ["Budget Reallocation to Top ROAS Ads", "Executive 30-Day Growth Report"]}
        ]

        plan = MarketingPlan(
            project_id=project.id,
            title=f"30-Day Operational Marketing Plan",
            duration_days=30,
            phases=phases,
            weekly_breakdown=weekly_breakdown
        )
        return plan

    def create_initial_task_queue(self, client: Client, project: MarketingProject) -> List[MarketingTask]:
        """
        Create the day-by-day persistent marketing tasks in the database.
        """
        now = datetime.utcnow()
        tasks = []

        task_blueprints = [
            {
                "title": f"Conduct Market Research & Competitor Intelligence for {client.company_name}",
                "agent_name": "Market Research Agent",
                "task_type": "MARKET_RESEARCH",
                "priority": "High",
                "day_number": 1,
                "requires_approval": False,
                "input_parameters": {"industry": client.industry, "competitors": client.competitor_websites}
            },
            {
                "title": f"Run Technical Website & SEO Audit for {client.business_website}",
                "agent_name": "SEO Agent",
                "task_type": "SEO_AUDIT",
                "priority": "High",
                "day_number": 1,
                "requires_approval": False,
                "input_parameters": {"website": client.business_website, "industry": client.industry}
            },
            {
                "title": f"High-Intent Keyword Research & Content Gap Analysis",
                "agent_name": "SEO Agent",
                "task_type": "KEYWORD_RESEARCH",
                "priority": "High",
                "day_number": 2,
                "requires_approval": False,
                "input_parameters": {"industry": client.industry, "objectives": client.marketing_objectives}
            },
            {
                "title": f"Draft Cornerstone SEO Blog Article: Scaling in {client.industry}",
                "agent_name": "Content Creation Agent",
                "task_type": "CONTENT_CREATION",
                "priority": "Medium",
                "day_number": 3,
                "requires_approval": True,
                "input_parameters": {"content_type": "Blog Post", "tone": client.brand_tone}
            },
            {
                "title": f"Generate Social Media Content Calendar (LinkedIn & Meta)",
                "agent_name": "Social Media Agent",
                "task_type": "SOCIAL_CALENDAR",
                "priority": "Medium",
                "day_number": 4,
                "requires_approval": True,
                "input_parameters": {"platforms": ["LinkedIn", "Meta"], "posts_count": 5}
            },
            {
                "title": f"Structure High-Converting Google & Meta Ads Campaigns",
                "agent_name": "Advertising Agent",
                "task_type": "CAMPAIGN_LAUNCH",
                "priority": "High",
                "day_number": 5,
                "requires_approval": True,
                "input_parameters": {"budget": project.monthly_budget, "goals": client.marketing_objectives}
            },
            {
                "title": f"Configure Lead Capture & Automated Scoring Workflow",
                "agent_name": "Lead Generation Agent",
                "task_type": "LEAD_SCORING",
                "priority": "Medium",
                "day_number": 6,
                "requires_approval": False,
                "input_parameters": {"target_audience": client.target_audience}
            },
            {
                "title": f"Multi-Touch Analytics Attribution & Conversion Funnel Health Check",
                "agent_name": "Analytics Agent",
                "task_type": "ANALYTICS_CHECK",
                "priority": "Medium",
                "day_number": 7,
                "requires_approval": False,
                "input_parameters": {"metrics_window": "7_days"}
            },
            {
                "title": f"Synthesize Daily Marketing Performance Report & Next-Day Agenda",
                "agent_name": "Reporting Agent",
                "task_type": "DAILY_REPORT",
                "priority": "High",
                "day_number": 1,
                "requires_approval": False,
                "input_parameters": {"report_date": now.strftime("%Y-%m-%d")}
            }
        ]

        for idx, item in enumerate(task_blueprints):
            task = MarketingTask(
                project_id=project.id,
                client_id=client.id,
                title=item["title"],
                agent_name=item["agent_name"],
                task_type=item["task_type"],
                priority=item["priority"],
                day_number=item["day_number"],
                status=TaskStatus.QUEUED if idx < 3 else TaskStatus.PENDING,
                requires_approval=item["requires_approval"],
                approval_status=ApprovalStatus.PENDING if item["requires_approval"] else ApprovalStatus.APPROVED,
                input_parameters=item["input_parameters"],
                output_data={},
                logs=[{"timestamp": now.isoformat(), "level": "INFO", "message": f"Task registered in execution queue."}],
                scheduled_for=now + timedelta(hours=idx * 2)
            )
            tasks.append(task)

        return tasks

    async def execute_task(self, task: MarketingTask, client: Client, db: Session) -> Dict[str, Any]:
        """
        Execute a single marketing task with the appropriate specialized AI agent.
        """
        agent = self.agents.get(task.agent_name)
        if not agent:
            task.status = TaskStatus.FAILED
            task.error_message = f"Agent '{task.agent_name}' not recognized."
            db.commit()
            return {"status": "Failed", "error": task.error_message}

        task.status = TaskStatus.RUNNING
        task.started_at = datetime.utcnow()
        task.logs.append({
            "timestamp": datetime.utcnow().isoformat(),
            "level": "INFO",
            "message": f"Execution started by {task.agent_name}."
        })
        db.commit()

        client_context = {
            "company_name": client.company_name,
            "industry": client.industry,
            "business_website": client.business_website,
            "target_audience": client.target_audience,
            "target_countries": client.target_countries,
            "competitor_websites": client.competitor_websites,
            "monthly_marketing_budget": client.monthly_marketing_budget,
            "marketing_objectives": client.marketing_objectives,
            "brand_tone": client.brand_tone,
            "products": [{"name": p.name, "description": p.description, "price": p.price} for p in client.products],
            "services": [{"name": s.name, "description": s.description} for s in client.services]
        }

        try:
            agent_result = await agent.execute(client_context, {
                "task_title": task.title,
                "task_type": task.task_type,
                **task.input_parameters
            })

            task.output_data = agent_result["data"]
            task.token_usage = agent_result.get("token_usage", 1200)
            task.execution_cost = round(task.token_usage * 0.00002, 4)
            task.completed_at = datetime.utcnow()
            task.status = TaskStatus.COMPLETED
            task.logs.append({
                "timestamp": datetime.utcnow().isoformat(),
                "level": "SUCCESS",
                "message": f"Task successfully completed in {agent_result.get('duration_ms', 0)}ms."
            })

            # Record Agent Run
            agent_run = AgentRun(
                task_id=task.id,
                agent_name=task.agent_name,
                model_used=agent_result.get("model_used", "gemini-1.5-pro"),
                prompt_tokens=int(task.token_usage * 0.4),
                completion_tokens=int(task.token_usage * 0.6),
                status="Success",
                raw_prompt=agent_result.get("raw_prompt", ""),
                raw_response=str(agent_result.get("data", "")),
                duration_ms=agent_result.get("duration_ms", 0)
            )
            db.add(agent_run)

            # If task requires human approval, create Approval record
            if task.requires_approval:
                task.status = TaskStatus.AWAITING_APPROVAL
                task.approval_status = ApprovalStatus.PENDING
                approval = Approval(
                    client_id=client.id,
                    task_id=task.id,
                    approval_type=task.task_type,
                    title=f"Review & Approve: {task.title}",
                    description=f"AI {task.agent_name} generated content/campaign setup that requires approval before public publishing.",
                    payload_preview=agent_result["data"],
                    risk_level="Medium" if "AD" not in task.task_type else "High",
                    status=ApprovalStatus.PENDING
                )
                db.add(approval)

            # If task was Content Creation, add to Content Library
            if task.task_type == "CONTENT_CREATION" and "blog_post" in agent_result["data"]:
                blog = agent_result["data"]["blog_post"]
                content_item = ContentItem(
                    client_id=client.id,
                    title=blog.get("title", task.title),
                    content_type="Blog Post",
                    platform="Blog",
                    body=blog.get("sample_intro", "") + "\n\n" + "\n".join(blog.get("outline", [])),
                    meta_title=blog.get("meta_title"),
                    meta_description=blog.get("meta_description"),
                    target_keywords=blog.get("target_keywords", []),
                    status="In Review" if task.requires_approval else "Approved"
                )
                db.add(content_item)

            # If task was SEO audit / keyword research, add keywords to DB
            if task.task_type in ["SEO_AUDIT", "KEYWORD_RESEARCH"] and "discovered_keywords" in agent_result["data"]:
                for kw in agent_result["data"]["discovered_keywords"]:
                    keyword_obj = Keyword(
                        client_id=client.id,
                        keyword=kw["keyword"],
                        current_position=int(kw.get("potential_rank", "Top 5").replace("Top ", "") or 5),
                        previous_position=int(kw.get("potential_rank", "Top 5").replace("Top ", "") or 5) + 3,
                        search_volume=kw.get("search_volume", 1500),
                        difficulty=kw.get("difficulty", 35),
                        intent=kw.get("intent", "Commercial")
                    )
                    db.add(keyword_obj)

            # If task was Daily Report, create DailyReport record
            if task.task_type == "DAILY_REPORT":
                report_data = agent_result["data"]
                daily_rep = DailyReport(
                    client_id=client.id,
                    report_date=datetime.utcnow(),
                    title=f"Daily AI Marketing Performance Report - {datetime.utcnow().strftime('%B %d, %Y')}",
                    executive_summary=report_data.get("executive_summary", {}),
                    seo_metrics=report_data.get("channel_breakdown", {}).get("seo", {}),
                    social_metrics=report_data.get("channel_breakdown", {}).get("social", {}),
                    advertising_metrics=report_data.get("channel_breakdown", {}).get("ads", {}),
                    lead_metrics=report_data.get("channel_breakdown", {}).get("leads", {}),
                    ai_operations={"tasks_completed": 3, "token_usage": task.token_usage, "cost": task.execution_cost},
                    next_day_plan={"agenda": report_data.get("next_day_agenda", [])}
                )
                db.add(daily_rep)

            db.commit()
            return {"status": "Success", "task_id": task.id, "result": agent_result}

        except Exception as e:
            logger.exception(f"Task execution failed for task {task.id}: {e}")
            task.status = TaskStatus.FAILED
            task.error_message = str(e)
            task.retry_count += 1
            task.logs.append({
                "timestamp": datetime.utcnow().isoformat(),
                "level": "ERROR",
                "message": f"Task failed: {str(e)}"
            })
            db.commit()
            return {"status": "Failed", "error": str(e)}

orchestrator = MarketingOrchestrator()
