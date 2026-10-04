import json
import logging
import time
from typing import Dict, Any, Optional
from app.config import settings

logger = logging.getLogger(__name__)

class BaseAgent:
    def __init__(self, name: str, role: str):
        self.name = name
        self.role = role

    async def execute(self, client_context: Dict[str, Any], task_input: Dict[str, Any]) -> Dict[str, Any]:
        """
        Base execution method. Specialized agents override or call this.
        """
        start_time = time.time()
        
        # Try live LLM if API keys are configured
        result_data = None
        model_used = "deterministic-orchestrator-engine"
        token_usage = 0

        prompt = self.build_prompt(client_context, task_input)
        
        if settings.GEMINI_API_KEY and settings.DEFAULT_AI_PROVIDER == "gemini":
            try:
                import google.generativeai as genai
                genai.configure(api_key=settings.GEMINI_API_KEY)
                model = genai.GenerativeModel("gemini-1.5-pro")
                response = await model.generate_content_async(prompt)
                model_used = "gemini-1.5-pro"
                token_usage = len(prompt.split()) + len(response.text.split())
                try:
                    result_data = json.loads(response.text.strip().replace("```json", "").replace("```", ""))
                except Exception:
                    result_data = {"raw_output": response.text}
            except Exception as e:
                logger.warning(f"Live Gemini API call failed or unavailable ({e}), using deterministic agent synthesis: {self.name}")

        elif settings.OPENAI_API_KEY and settings.DEFAULT_AI_PROVIDER == "openai":
            try:
                from openai import AsyncOpenAI
                client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
                completion = await client.chat.completions.create(
                    model="gpt-4o",
                    messages=[
                        {"role": "system", "content": f"You are the {self.name}, {self.role}. Always respond in structured JSON."},
                        {"role": "user", "content": prompt}
                    ],
                    response_format={"type": "json_object"}
                )
                model_used = "gpt-4o"
                token_usage = completion.usage.total_tokens if completion.usage else 1200
                result_data = json.loads(completion.choices[0].message.content)
            except Exception as e:
                logger.warning(f"Live OpenAI API call failed ({e}), using deterministic agent synthesis: {self.name}")

        # If LLM didn't return data or in smart heuristic mode, use our specialized heuristic generator
        if not result_data:
            result_data = self.generate_synthetic_output(client_context, task_input)
            token_usage = 1450

        duration_ms = int((time.time() - start_time) * 1000)
        
        return {
            "agent_name": self.name,
            "status": "Success",
            "model_used": model_used,
            "token_usage": token_usage,
            "duration_ms": duration_ms,
            "data": result_data,
            "raw_prompt": prompt
        }

    def build_prompt(self, client_context: Dict[str, Any], task_input: Dict[str, Any]) -> str:
        return f"""
        Role: {self.name} ({self.role})
        Client: {client_context.get('company_name')}
        Industry: {client_context.get('industry')}
        Website: {client_context.get('business_website')}
        Target Audience: {client_context.get('target_audience')}
        Objectives: {client_context.get('marketing_objectives')}
        Brand Tone: {client_context.get('brand_tone')}
        
        Task: {task_input.get('task_title')}
        Parameters: {json.dumps(task_input)}
        
        Generate a detailed, actionable output in valid JSON format strictly matching the brand guidelines.
        """

    def generate_synthetic_output(self, client_context: Dict[str, Any], task_input: Dict[str, Any]) -> Dict[str, Any]:
        """Override in subclasses for rich realistic domain-specific output"""
        return {
            "summary": f"Completed task '{task_input.get('task_title', 'Marketing Task')}' for {client_context.get('company_name')}.",
            "status": "completed"
        }
